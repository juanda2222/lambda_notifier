import { CloudWatchLogsEvent } from "aws-lambda"
import { ConfigFile } from "../../configFile.class"

export const mockCLoudWatchEvent: CloudWatchLogsEvent = {
    awslogs: {
        data: "H4sIAAAAAAAAADWQvY7CMBCEXyVyTWHHfzFdpMtRUYXuhCxzWYKl2I5iA0KId79NpCv3m9Hszr5JgJzdCKfXDGRPvtpTa49d37eHjuxIekZYEDPOpaFK0kZwxFMaD0u6z6gUyMXibMcNbFpfFnABxZXnbbBPX242JusHcOjK90v+XfxcfIrffiqwZLL/IeFlJxcug7PXDZLzFtg9IJbV8CZ+wFyuGl5TY5RiTNa1oIprqoUxXNaacaVrhoIwmqmGUdGgjTdGCFxcPBYuLuDtTEmmsJGmTOvd/yMwPqZqPbNysSo3iFVOASofr4l8zp8/Yz9SYjIBAAA="
    }
}

export const mockConfigFile: ConfigFile = {
    rules: [
        {
            filterPattern: "CP ERROR ERROR: ",
            ruleName: "error",
            notificationType: 'sns',
            notificationData: {
                snsArn: 'arn:somessn:234sed:test'
            }
        }

    ]
}

export const mockBadConfigFile = {
    bad: [
        {
            badBad: "CP ERROR ERROR: ",
            MoreBad: "error",
        }

    ]
}
export const mockEmailForDefaultSubscription = 'some-email@email.com'
export const mockConfigFileWithEmail: ConfigFile = {
    rules: [
        {
            filterPattern: "CP ERROR ERROR: ",
            ruleName: "error",
            notificationType: 'sns',
            notificationData: {
                email: mockEmailForDefaultSubscription
            }
        }

    ]
}

export const mockS3ConfigFileResponse = { Body: {toString: () => JSON.stringify(mockConfigFile)}}
export const mockBadS3ConfigFileResponse = { Body: {toString: () => JSON.stringify(mockBadConfigFile)}}
export const mockS3ConfigFileWithEmailResponse = { Body: {toString: () => JSON.stringify(mockConfigFileWithEmail)}}

export const mockSNSResponse = {
    ResponseMetadata: { RequestId: 'a848e404-66f1-544b-8017-beea6a1a5524' },
    MessageId: 'eb4bf0ff-c0b9-53d6-96a2-aa11822232b9'
}