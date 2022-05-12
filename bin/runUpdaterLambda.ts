import LambdaUpdater from '../src/lambdas/updater'
import { Context } from 'aws-lambda/handler'
import { mockS3FileCreatedEvent, mockS3FileDeletedEvent } from '../src/lambdas/updater/mocks'

const main = async () => {

    // // Use a file creation
    // await LambdaUpdater(mockS3FileCreatedEvent, {} as Context, () => {}) // beware, context use is not safe

    // // Use a file deletion
    // await LambdaUpdater(mockS3FileDeletedEvent, {} as Context, () => {}) // beware, context use is not safe
    
    
    const event = mockS3FileCreatedEvent
    await LambdaUpdater(event, {} as Context, () => {}) // beware, context use is not safe
}

main().catch(err => {
    console.error(err)
})


