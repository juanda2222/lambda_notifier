import { Context } from 'aws-lambda/handler'
import { mockCwlDescribeSubscriptionFiltersResponse, mockListSubscriptionsByTopic, mockS3FileCreatedEvent, mockS3FileDeletedEvent } from './mocks';
import { mockBadS3ConfigFileResponse, mockConfigFile, mockEmailForDefaultSubscription, mockS3ConfigFileResponse, mockS3ConfigFileWithEmailResponse } from '../notifier/mocks';
import LambdaUpdater, { formatFilterNameFromConfigRuleName } from '.';
import { CONFIG } from '../../config';


let mockS3getObjectPromiseResult = jest.fn().mockImplementation(() => ({promise: () => mockS3ConfigFileResponse })) 
const mockS3putObjectPromiseResult = jest.fn().mockImplementation(() => ({promise: jest.fn()}))
const mockS3deleteObjectPromiseResult = jest.fn().mockImplementation(() => ({promise: jest.fn()}))
const mockCwlDescribeFiltersPromiseResult = jest.fn().mockImplementation(() => ({promise: () => mockCwlDescribeSubscriptionFiltersResponse }))
const mockCwlDeleteFilterPromiseResult = jest.fn().mockImplementation(() => ({promise: jest.fn()}))
const mockCwlPutFilterPromiseResult = jest.fn().mockImplementation(() => ({promise: jest.fn()}))
const mockSnsSubscribePromiseResult = jest.fn().mockImplementation(() => ({promise: jest.fn()}))
const mockSnsUnsubscribePromiseResult = jest.fn().mockImplementation(() => ({promise: jest.fn()}))
const mockListSubscriptionsPromiseResult = jest.fn().mockImplementation(() => ({promise: () => mockListSubscriptionsByTopic}))

jest.mock('aws-sdk', () => ({
    S3: jest.fn().mockImplementation(() => ({
        getObject: mockS3getObjectPromiseResult,
        putObject: mockS3putObjectPromiseResult,
        deleteObject: mockS3deleteObjectPromiseResult,
    })),
    CloudWatchLogs: jest.fn().mockImplementation(() => ({
        describeSubscriptionFilters: mockCwlDescribeFiltersPromiseResult,
        deleteSubscriptionFilter: mockCwlDeleteFilterPromiseResult,
        putSubscriptionFilter: mockCwlPutFilterPromiseResult,
    })),
    SNS: jest.fn().mockImplementation(() => ({
        subscribe: mockSnsSubscribePromiseResult,
        unsubscribe: mockSnsUnsubscribePromiseResult,
        listSubscriptionsByTopic: mockListSubscriptionsPromiseResult,
    })),
}));  

describe('LambdaUpdater', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })
    test('Correct configuration is fetch from s3, filters are fetched and created', async () => {
        
        // beware, context use is not type safe
        await LambdaUpdater(mockS3FileCreatedEvent, {} as Context, () => {})

        expect(mockS3getObjectPromiseResult).toBeCalled()
        expect(mockCwlPutFilterPromiseResult).toBeCalled()
        expect(mockSnsSubscribePromiseResult).not.toBeCalled() // do not notify if the notification contains an arn topic
        expect(mockS3putObjectPromiseResult).toBeCalled() // create the backup file
    })

    test('Correct filters are fetched and deleted', async () => {
        
        // beware, context use is not type safe
        await LambdaUpdater(mockS3FileDeletedEvent, {} as Context, () => {})

        expect(mockCwlDescribeFiltersPromiseResult).toBeCalled()
        expect(mockCwlDeleteFilterPromiseResult).toBeCalled()
        expect(mockSnsUnsubscribePromiseResult).not.toBeCalled() // do not notify if the notification contains an arn topic
        expect(mockS3deleteObjectPromiseResult).toBeCalled()

    })

    test('Properly fails if the file has the wrong extension', async () => {
        
        const badFileExtensionS3FileDeletedEvent = JSON.parse(JSON.stringify({ ...mockS3FileDeletedEvent }))
        badFileExtensionS3FileDeletedEvent.Records[0].s3.object.key = 'badKeyExtension.bad'

        // beware, context use is not type safe
        await expect(LambdaUpdater(badFileExtensionS3FileDeletedEvent, {} as Context, () => {})).rejects.toThrow()
    })

    test('Properly updates based on the key name (without the extension)', async () => {
        
        // beware, context use is not type safe
        await LambdaUpdater(mockS3FileCreatedEvent, {} as Context, () => {})
        const expectedKey = mockS3FileCreatedEvent.Records[0].s3.object.key
        const expectedGroupLogName = expectedKey.substring(0, expectedKey.lastIndexOf('.'))

        const ExpectedResult = {
            destinationArn: CONFIG.NOTIFICATION_LAMBDA_ARN,
            filterName: formatFilterNameFromConfigRuleName(mockConfigFile.rules[0].ruleName),
            filterPattern: mockConfigFile.rules[0].filterPattern,
            logGroupName: expectedGroupLogName,
        }
        expect(mockCwlPutFilterPromiseResult).toBeCalledWith(ExpectedResult)
    })

    test('Properly fails if the file does not have the proper fields', async () => {
        
        mockS3getObjectPromiseResult = jest.fn().mockImplementation(() => ({promise: () => mockBadS3ConfigFileResponse }))

        // beware, context use is not type safe
        await expect(LambdaUpdater(mockS3FileCreatedEvent, {} as Context, () => {})).rejects.toThrow()

    })

    test('Properly subscribes emails as default sns notification type', async () => {
        
        mockS3getObjectPromiseResult = jest.fn().mockImplementation(() => ({promise: () => mockS3ConfigFileWithEmailResponse }))

        // beware, context use is not type safe
        await LambdaUpdater(mockS3FileCreatedEvent, {} as Context, () => {})

        expect(mockSnsSubscribePromiseResult).toBeCalledWith({
            Endpoint: "some-email@email.com",
            Protocol: "Email",
            TopicArn: "arn:aws:sns:us-east-1:133590650843:default-email-topic",
        })
    })

    test('Properly unsubscribes emails if the file includes rules without snsArn', async () => {
        
        mockS3getObjectPromiseResult = jest.fn().mockImplementation(() => ({promise: () => mockS3ConfigFileWithEmailResponse }))

        // beware, context use is not type safe
        await LambdaUpdater(mockS3FileDeletedEvent, {} as Context, () => {})


        // only call the ones with email
        const rulesWithEmail = mockListSubscriptionsByTopic.Subscriptions.find(subscription => subscription.Endpoint == mockEmailForDefaultSubscription)
        
        expect(mockSnsUnsubscribePromiseResult).toBeCalledWith({ SubscriptionArn: rulesWithEmail.SubscriptionArn })
    })
     
});