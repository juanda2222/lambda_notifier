import LambdaUpdater from '../src/lambda/updater'
import { Context } from 'aws-lambda/handler'
import { mockS3FileCreatedEvent, mockS3FileDeletedEvent } from '../src/lambda/updater/mocks'

const main = async () => {

    // Use a file creation
    // await LambdaUpdater(mockS3FileCreatedEvent, {} as Context, () => {}) // beware, context use is not safe

    // Use a file deletion
    await LambdaUpdater(mockS3FileDeletedEvent, {} as Context, () => {}) // beware, context use is not safe
}

main().catch(err => {
    console.error(err)
})


