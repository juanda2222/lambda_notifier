import { CloudWatchLogsDecodedData } from "aws-lambda"
import { ConfigFile } from "../configFile.interface"

export const getTopicArnFromConfigFile = (configFile: ConfigFile) => {
    return configFile.topicArn
}

export const getSubjectFromCloudWatchLog = (decodedLog: CloudWatchLogsDecodedData) => {
    return `${decodedLog.logGroup}-${decodedLog.logStream}` 
}