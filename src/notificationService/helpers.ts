import { CloudWatchLogsDecodedData } from "aws-lambda"
import { ConfigFile } from "../configFile.class"

export const getTopicArnFromConfigFile = (configFile: ConfigFile) => {
    return configFile.rules.map(ruleData => ruleData.notificationData.snsArn)
}

export const getSubjectFromCloudWatchLog = (decodedLog: CloudWatchLogsDecodedData) => {
    return `${decodedLog.logGroup}-${decodedLog.logStream}` 
}