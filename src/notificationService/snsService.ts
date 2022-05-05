import { SNS } from "aws-sdk";
import { MessageInfoType, NotificationClientConfig, NotificationServiceClass } from ".";
import { getSubjectFromCloudWatchLog, getTopicArnFromConfigFile } from "./helpers";

export class SNSService implements NotificationServiceClass{
    sns: SNS
    constructor(notificationConfig?: NotificationClientConfig) {
        const { awsRegion } = notificationConfig ?? {}
        this.sns = new SNS({region: awsRegion});
    }
    async sendMessage({ decodedLog, configFile }: MessageInfoType){
        const { logEvents } = decodedLog
        let params = {
            Message: JSON.stringify(logEvents), 
            Subject: getSubjectFromCloudWatchLog(decodedLog),
            TopicArn: getTopicArnFromConfigFile(configFile)
        };

        const result = await this.sns.publish(params).promise()
        console.log('result from publish', result)
    }
}