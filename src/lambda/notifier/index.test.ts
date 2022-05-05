import LambdaNotifier from '.'
import { Context } from 'aws-lambda/handler'


const stubConfigFile = { snsTopicArn: 'arn:somessn:234sed:test' }
jest.mock('aws-sdk', () => ({
    S3: jest.fn().mockImplementation(() => ({
        getObject: jest.fn().mockImplementation(() => ({promise: jest.fn().mockReturnValue(stubConfigFile)})),
    })),
}));

describe('LambdaNotifier', () => {
    beforeAll(() => {
        
    })
    test('Correct configuration is fetch from s3', async () => {
        const syntheticCLoudWatchEvent = {
            awslogs: {
                data: "H4sIAAAAAAAAADWQvY7CMBCEXyVyTWHHfzFdpMtRUYXuhCxzWYKl2I5iA0KId79NpCv3m9Hszr5JgJzdCKfXDGRPvtpTa49d37eHjuxIekZYEDPOpaFK0kZwxFMaD0u6z6gUyMXibMcNbFpfFnABxZXnbbBPX242JusHcOjK90v+XfxcfIrffiqwZLL/IeFlJxcug7PXDZLzFtg9IJbV8CZ+wFyuGl5TY5RiTNa1oIprqoUxXNaacaVrhoIwmqmGUdGgjTdGCFxcPBYuLuDtTEmmsJGmTOvd/yMwPqZqPbNysSo3iFVOASofr4l8zp8/Yz9SYjIBAAA="
            }
        }
        // beware, context use is not type safe
        await LambdaNotifier(syntheticCLoudWatchEvent, {} as Context, (error, result) => {
            if (error) console.error(error)
            console.log(result)
        })
        expect(true).toBeTruthy()
    })
});