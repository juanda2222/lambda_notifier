import { SNS } from "aws-sdk";
import { MessageInfoType, NotificationClientConfig, NotificationServiceClass } from ".";
import { getSubjectFromCloudWatchLog, getTopicArnFromConfigFile } from "./helpers";

export class SNSService {
    sns
    constructor(notificationConfig) {
        const { awsRegion } = notificationConfig ?? {}
        this.sns = new SNS({region: awsRegion});
    }
    async sendMessage({ decodedLog, configFile }){
        const { logEvents } = decodedLog
        let params = {
            Message: JSON.stringify(logEvents), 
            Subject: getSubjectFromCloudWatchLog(decodedLog),
            TopicArn: getTopicArnFromConfigFile(configFile)[0] // TODO: properly parse this as a list
        };

        const result = await this.sns.publish(params).promise()
        console.log('result from publish', result)
    }
}