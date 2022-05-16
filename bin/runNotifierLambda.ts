import LambdaNotifier from '../src/lambdas/notifier'
import { Context } from 'aws-lambda/handler'
import { mockCLoudWatchEvent } from '../src/lambdas/notifier/mocks'

const main = async () => {
    await LambdaNotifier(mockCLoudWatchEvent, {} as Context, () => {}) // beware, context use is not safe
}

main().catch(err => {
    console.error(err)
})


