import { CloudWatchLogsDecodedData } from "aws-lambda"
import { ConfigFile, NotificationData, SlackNotificationData, SNSNotificationData } from "../configFile.class"

export const getTopicArnFromConfigFile = (configFile: ConfigFile) => {
    return configFile.rules.map(ruleData => (ruleData.notificationData as SNSNotificationData).snsArn)
}

export const getSubjectFromCloudWatchLog = (decodedLog: CloudWatchLogsDecodedData) => {
    return `${decodedLog.logGroup}-${decodedLog.logStream}` 
}