// import LambdaNotifier from '.'
// import { Context } from 'aws-lambda/handler'
// import { mockCLoudWatchEvent, mockConfigFile, mockSNSResponse } from './mocks';


// const mockS3getObjectPromiseResult = jest.fn().mockReturnValue(mockConfigFile)
// const mockSnsPublishPromiseResult = jest.fn().mockReturnValue(mockSNSResponse)

// jest.mock('aws-sdk', () => ({
//     S3: jest.fn().mockImplementation(() => ({
//         getObject: jest.fn().mockImplementation(() => ({promise: mockS3getObjectPromiseResult})),
//     })),
//     SNS: jest.fn().mockImplementation(() => ({
//         publish: jest.fn().mockImplementation(() => ({promise: mockSnsPublishPromiseResult})),
//     })),
// }));  

// describe('LambdaUpdater', () => {
//     afterAll(() => {
//         jest.clearAllMocks()
//     })
//     test('Correct configuration is fetch from s3', async () => {
        
//         // beware, context use is not type safe
//         await LambdaNotifier(mockCLoudWatchEvent, {} as Context, (error, result) => {
//             if (error) console.error(error)
//             console.log(result)
//         })

//         expect(mockS3getObjectPromiseResult).toBeCalled()
//         expect(mockSnsPublishPromiseResult).toBeCalled()
//     })
});