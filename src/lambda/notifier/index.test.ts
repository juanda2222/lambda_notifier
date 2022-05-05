import LambdaNotifier from '.'
import { Context } from 'aws-lambda/handler'

// mock data
const mockCLoudWatchEvent = {
    awslogs: {
        data: "H4sIAAAAAAAAADWQvY7CMBCEXyVyTWHHfzFdpMtRUYXuhCxzWYKl2I5iA0KId79NpCv3m9Hszr5JgJzdCKfXDGRPvtpTa49d37eHjuxIekZYEDPOpaFK0kZwxFMaD0u6z6gUyMXibMcNbFpfFnABxZXnbbBPX242JusHcOjK90v+XfxcfIrffiqwZLL/IeFlJxcug7PXDZLzFtg9IJbV8CZ+wFyuGl5TY5RiTNa1oIprqoUxXNaacaVrhoIwmqmGUdGgjTdGCFxcPBYuLuDtTEmmsJGmTOvd/yMwPqZqPbNysSo3iFVOASofr4l8zp8/Yz9SYjIBAAA="
    }
}
const mockConfigFile = { Body: {toString: () => JSON.stringify({ snsTopicArn: 'arn:somessn:234sed:test' })}}
const mockSNSResponse = {
    ResponseMetadata: { RequestId: 'a848e404-66f1-544b-8017-beea6a1a5524' },
    MessageId: 'eb4bf0ff-c0b9-53d6-96a2-aa11822232b9'
}

const mockS3getObjectPromiseResult = jest.fn().mockReturnValue(mockConfigFile)
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
    test('Correct configuration is fetch from s3', async () => {
        
        // beware, context use is not type safe
        await LambdaNotifier(mockCLoudWatchEvent, {} as Context, (error, result) => {
            if (error) console.error(error)
            console.log(result)
        })

        expect(mockS3getObjectPromiseResult).toBeCalled()
        expect(mockSnsPublishPromiseResult).toBeCalled()
    })
});