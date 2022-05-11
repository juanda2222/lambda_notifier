import { formatFilterNameFromConfigRuleName } from '.'
import { Context } from 'aws-lambda/handler'
import { mockCwlDescribeSubscriptionFiltersResponse, mockS3FileCreatedEvent, mockS3FileDeletedEvent } from './mocks';
import { mockBadS3ConfigFileResponse, mockConfigFile, mockS3ConfigFileResponse } from '../notifier/mocks';
import { CONFIG } from '../../config';
import LambdaUpdater from '.';


let mockS3getObjectPromiseResult = jest.fn().mockImplementation(() => ({promise: () => mockS3ConfigFileResponse }))
const mockCwlDescribeFiltersPromiseResult = jest.fn().mockImplementation(() => ({promise: () => mockCwlDescribeSubscriptionFiltersResponse }))
const mockCwlDeleteFilterPromiseResult = jest.fn().mockImplementation(() => ({promise: jest.fn()}))
const mockCwlPutFilterPromiseResult = jest.fn().mockImplementation(() => ({promise: jest.fn()}))

jest.mock('aws-sdk', () => ({
    S3: jest.fn().mockImplementation(() => ({
        getObject: mockS3getObjectPromiseResult,
    })),
    CloudWatchLogs: jest.fn().mockImplementation(() => ({
        describeSubscriptionFilters: mockCwlDescribeFiltersPromiseResult,
        deleteSubscriptionFilter: mockCwlDeleteFilterPromiseResult,
        putSubscriptionFilter: mockCwlPutFilterPromiseResult,
    })),
}));  

describe('LambdaUpdater', () => {
    afterAll(() => {
        jest.clearAllMocks()
    })
    test('Correct configuration is fetch from s3, filters are fetched and created', async () => {
        
        // beware, context use is not type safe
        await LambdaUpdater(mockS3FileCreatedEvent, {} as Context, () => {})

        expect(mockS3getObjectPromiseResult).toBeCalled()
        expect(mockCwlPutFilterPromiseResult).toBeCalled()

    })

    // test('Correct filters are fetched and deleted', async () => {
        
    //     // beware, context use is not type safe
    //     await LambdaUpdater(mockS3FileDeletedEvent, {} as Context, () => {})

    //     expect(mockCwlDescribeFiltersPromiseResult).toBeCalled()
    //     expect(mockCwlDeleteFilterPromiseResult).toBeCalled()

    // })

    // test('Properly fails if the file has the wrong extension', async () => {
        
    //     const badFileExtensionS3FileDeletedEvent = JSON.parse(JSON.stringify({ ...mockS3FileDeletedEvent }))
    //     badFileExtensionS3FileDeletedEvent.Records[0].s3.object.key = 'badKeyExtension.bad'

    //     // beware, context use is not type safe
    //     await expect(LambdaUpdater(badFileExtensionS3FileDeletedEvent, {} as Context, () => {})).rejects.toThrow()
    // })

    // test('Properly updates based on the key name (without the extension)', async () => {
        
    //     // beware, context use is not type safe
    //     await LambdaUpdater(mockS3FileCreatedEvent, {} as Context, () => {})
    //     const expectedKey = mockS3FileCreatedEvent.Records[0].s3.object.key
    //     const expectedGroupLogName = expectedKey.substring(0, expectedKey.lastIndexOf('.'))

    //     const ExpectedResult = {
    //         destinationArn: CONFIG.NOTIFICATION_LAMBDA_ARN,
    //         filterName: formatFilterNameFromConfigRuleName(mockConfigFile.rules[0].ruleName),
    //         filterPattern: mockConfigFile.rules[0].filterPattern,
    //         logGroupName: expectedGroupLogName,
    //     }
    //     expect(mockCwlPutFilterPromiseResult).toBeCalledWith(ExpectedResult)
    // })

    // test('Properly fails if the file does not have the proper fields', async () => {
        
    //     mockS3getObjectPromiseResult = jest.fn().mockImplementation(() => ({promise: () => mockBadS3ConfigFileResponse }))

    //     // beware, context use is not type safe
    //     await expect(LambdaUpdater(mockS3FileCreatedEvent, {} as Context, () => {})).rejects.toThrow()

    // })
});