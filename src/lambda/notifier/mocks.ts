export const mockCLoudWatchEvent = {
    awslogs: {
        data: "H4sIAAAAAAAAADWQvY7CMBCEXyVyTWHHfzFdpMtRUYXuhCxzWYKl2I5iA0KId79NpCv3m9Hszr5JgJzdCKfXDGRPvtpTa49d37eHjuxIekZYEDPOpaFK0kZwxFMaD0u6z6gUyMXibMcNbFpfFnABxZXnbbBPX242JusHcOjK90v+XfxcfIrffiqwZLL/IeFlJxcug7PXDZLzFtg9IJbV8CZ+wFyuGl5TY5RiTNa1oIprqoUxXNaacaVrhoIwmqmGUdGgjTdGCFxcPBYuLuDtTEmmsJGmTOvd/yMwPqZqPbNysSo3iFVOASofr4l8zp8/Yz9SYjIBAAA="
    }
}
export const mockConfigFile = { Body: {toString: () => JSON.stringify({ snsTopicArn: 'arn:somessn:234sed:test' })}}
export const mockSNSResponse = {
    ResponseMetadata: { RequestId: 'a848e404-66f1-544b-8017-beea6a1a5524' },
    MessageId: 'eb4bf0ff-c0b9-53d6-96a2-aa11822232b9'
}