import LambdaNotifier from '.'
import { Context } from 'aws-lambda/handler'
import { mockCLoudWatchEvent, mockLogEvents, mockMultipleCloudWatchEvents, mockS3ConfigFileResponse, mockSNSResponse } from './mocks';


const mockS3getObjectPromiseResult = jest.fn().mockImplementation(() => ({promise: () => mockS3ConfigFileResponse}))
const mockSnsPublishPromiseResult = jest.fn().mockImplementation(() => ({promise: () => mockSNSResponse}))

jest.mock('aws-sdk', () => ({
    S3: jest.fn().mockImplementation(() => ({
        getObject: mockS3getObjectPromiseResult,
    })),
    SNS: jest.fn().mockImplementation(() => ({
        publish: mockSnsPublishPromiseResult,
    })),
}));  

describe('LambdaNotifier', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })
    test('Correct configuration is fetch from s3 and sns message is published', async () => {
        
        // beware, context use is not type safe
        await LambdaNotifier(mockCLoudWatchEvent, {} as Context, () => {})

        expect(mockS3getObjectPromiseResult).toBeCalled()
        expect(mockSnsPublishPromiseResult).toBeCalledTimes(1)
    })

    test('Multiple logs are correctly configured and the message is published', async () => {
        
        // beware, context use is not type safe
        await LambdaNotifier(mockMultipleCloudWatchEvents, {} as Context, () => {})

        expect(mockS3getObjectPromiseResult).toBeCalled()
        expect(mockSnsPublishPromiseResult).toBeCalledTimes(mockLogEvents.length)
    })
});