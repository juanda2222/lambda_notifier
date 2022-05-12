import { CloudWatchLogsDecodedData } from "aws-lambda"
import { ConfigFile, NotificationData, SlackNotificationData, SNSNotificationData } from "../configFile.class"


export const getSubjectFromCloudWatchLog = (decodedLog: CloudWatchLogsDecodedData) => {
    return `${decodedLog.logGroup}-${decodedLog.logStream}` 
}