import LambdaNotifier from '..'
import { Context } from 'aws-lambda/handler'

const main = async () => {
    const syntheticCLoudWatchEvent = {
        awslogs: {
            data: "H4sIAAAAAAAAADWQvY7CMBCEXyVyTWHHfzFdpMtRUYXuhCxzWYKl2I5iA0KId79NpCv3m9Hszr5JgJzdCKfXDGRPvtpTa49d37eHjuxIekZYEDPOpaFK0kZwxFMaD0u6z6gUyMXibMcNbFpfFnABxZXnbbBPX242JusHcOjK90v+XfxcfIrffiqwZLL/IeFlJxcug7PXDZLzFtg9IJbV8CZ+wFyuGl5TY5RiTNa1oIprqoUxXNaacaVrhoIwmqmGUdGgjTdGCFxcPBYuLuDtTEmmsJGmTOvd/yMwPqZqPbNysSo3iFVOASofr4l8zp8/Yz9SYjIBAAA="
        }
    }
    await LambdaNotifier(syntheticCLoudWatchEvent, {} as Context, () => {}) // beware, context use is not safe
}

main().catch(err => {
    console.error(err)
})


