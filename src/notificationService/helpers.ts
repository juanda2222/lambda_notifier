import { CloudWatchLogsDecodedData } from "aws-lambda"
import { ConfigFile } from "../configFile.interface"

export const getTopicArnFromConfigFile = (configFile: ConfigFile) => {
    return configFile.snsTopicArn
}

export const getSubjectFromCloudWatchLog = (decodedLog: CloudWatchLogsDecodedData) => {
    return `${decodedLog.logGroup}-${decodedLog.logStream}` 
}