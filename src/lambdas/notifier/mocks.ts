import { CloudWatchLogsEvent } from "aws-lambda"
import { ConfigFile } from "../../configFile.class"
import * as zlib from 'zlib';

export const mockLogEvents = [
    {
        id: '36832099661152240637074993527136721115497168104861138944',
        timestamp: 1651608470177,
        message: 'CP ERROR ERROR: then some info'
    },
    {
        id: '02394023040293094023974993527136721115497168104861138944',
        timestamp: 1652335470174,
        message: 'CP ERROR ERROR: this is other message'
    }
]


const mockSingleCloudWatchEvent = {
    messageType: 'DATA_MESSAGE',
    owner: '133590650843',
    logGroup: 'test_log_group',
    logStream: 'log_stream_with_no_idea',
    subscriptionFilters: [ 'my_lambda_filter' ],
    logEvents: [ mockLogEvents[0] ]
}

export const mockCLoudWatchEvent: CloudWatchLogsEvent = {
    awslogs: {
        data: zlib.gzipSync(JSON.stringify(mockSingleCloudWatchEvent)).toString('base64')
    }
}

export const mockMultipleCloudWatchEvents: CloudWatchLogsEvent = {
    awslogs: {
        data: zlib.gzipSync(JSON.stringify({...mockSingleCloudWatchEvent, logEvents: mockLogEvents})).toString('base64')
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