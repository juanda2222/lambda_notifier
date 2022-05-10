import { Context } from 'aws-lambda/handler'
import LambdaHandler from '.';
import { mockCLoudWatchEvent, mockS3ConfigFileResponse, mockSNSResponse } from './mocks';


const mockS3getObjectPromiseResult = jest.fn().mockReturnValue(mockS3ConfigFileResponse)
const mockSnsPublishPromiseResult = jest.fn().mockReturnValue(mockSNSResponse)

jest.mock('aws-sdk', () => ({
    S3: jest.fn().mockImplementation(() => ({
        getObject: jest.fn().mockImplementation(() => ({promise: mockS3getObjectPromiseResult})),
    })),
    SNS: jest.fn().mockImplementation(() => ({
        publish: jest.fn().mockImplementation(() => ({promise: mockSnsPublishPromiseResult})),
    })),
}));  

describe('LambdaNotifier', () => {
    afterAll(() => {
        jest.clearAllMocks()
    })
    test('Correct configuration is fetch from s3 and sns message is published', async () => {
        
        // beware, context use is not type safe
        await LambdaHandler(mockCLoudWatchEvent, {}, (error, result) => {
            if (error) console.error(error)
            console.log(result)
        })

        expect(mockS3getObjectPromiseResult).toBeCalled()
        expect(mockSnsPublishPromiseResult).toBeCalled()
    })
});