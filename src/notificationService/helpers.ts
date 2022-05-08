import { CloudWatchLogsDecodedData } from "aws-lambda"
import { ConfigFile } from "../configFile.interface"

export const getTopicArnFromConfigFile = (configFile: ConfigFile) => {
    return configFile.filters.map(filterData => filterData.notificationData.snsArn)
}

export const getSubjectFromCloudWatchLog = (decodedLog: CloudWatchLogsDecodedData) => {
    return `${decodedLog.logGroup}-${decodedLog.logStream}` 
}