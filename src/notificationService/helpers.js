import { CloudWatchLogsDecodedData } from "aws-lambda"
import { ConfigFile, SNSNotificationData } from "../configFile.class"

export const getTopicArnFromConfigFile = (configFile) => {
    return configFile.rules.map(ruleData => ruleData.notificationData.snsArn)
}

export const getSubjectFromCloudWatchLog = (decodedLog) => {
    return `${decodedLog.logGroup}-${decodedLog.logStream}` 
}