import LambdaNotifier from '.'
import { Context } from 'aws-lambda/handler'
import { mockCwlDescribeSubscriptionFiltersResponse, mockS3FileCreatedEvent, mockS3FileDeletedEvent } from './mocks';
import { mockS3ConfigFileResponse } from '../notifier/mocks';


const mockS3getObjectPromiseResult = jest.fn().mockReturnValue(mockS3ConfigFileResponse)
const mockCwlDescribeFiltersPromiseResult = jest.fn().mockReturnValue(mockCwlDescribeSubscriptionFiltersResponse)
const mockCwlDeleteFilterPromiseResult = jest.fn()
const mockCwlPutFilterPromiseResult = jest.fn()

jest.mock('aws-sdk', () => ({
    S3: jest.fn().mockImplementation(() => ({
        getObject: jest.fn().mockImplementation(() => ({promise: mockS3getObjectPromiseResult})),
    })),
    CloudWatchLogs: jest.fn().mockImplementation(() => ({
        describeSubscriptionFilters: jest.fn().mockImplementation(() => ({promise: mockCwlDescribeFiltersPromiseResult})),
        deleteSubscriptionFilter: jest.fn().mockImplementation(() => ({promise: mockCwlDeleteFilterPromiseResult})),
        putSubscriptionFilter: jest.fn().mockImplementation(() => ({promise: mockCwlPutFilterPromiseResult})),
    })),
}));  

describe('LambdaUpdater', () => {
    afterAll(() => {
        jest.clearAllMocks()
    })
    test('Correct configuration is fetch from s3, filters are fetched and created', async () => {
        
        // beware, context use is not type safe
        await LambdaNotifier(mockS3FileCreatedEvent, {} as Context, (error, result) => {
            if (error) console.error(error)
            console.log(result)
        })

        expect(mockS3getObjectPromiseResult).toBeCalled()
        expect(mockCwlPutFilterPromiseResult).toBeCalled()

    })

    test('Correct filters are fetched and deleted', async () => {
        
        // beware, context use is not type safe
        await LambdaNotifier(mockS3FileDeletedEvent, {} as Context, (error, result) => {
            if (error) console.error(error)
            console.log(result)
        })

        expect(mockCwlDescribeFiltersPromiseResult).toBeCalled()
        expect(mockCwlDeleteFilterPromiseResult).toBeCalled()

    })
});