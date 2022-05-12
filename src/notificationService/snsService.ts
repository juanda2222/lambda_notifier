import { SNS } from "aws-sdk";
import { MessageInfoType, NotificationClientConfig, NotificationServiceClass } from ".";
import { CONFIG } from "../config";
import {  NotificationRule, SNSNotificationData } from "../configFile.class";
import { getDefaultSubject } from "./helpers";

export class SNSService implements NotificationServiceClass{
    sns: SNS
    constructor(notificationConfig?: NotificationClientConfig) {
        const { awsRegion } = notificationConfig ?? {}
        this.sns = new SNS({region: awsRegion});
    }
    async sendMessage({ decodedLog, configFile }: MessageInfoType){
        const { logEvents, logGroup } = decodedLog


        // TODO: properly parse this as a list
        const rule = configFile.rules.find(rule => {
            return logEvents[0].message.includes(rule.filterPattern)
        })
          
        const { ruleName, notificationData } = rule as unknown as NotificationRule<string, string, 'sns', SNSNotificationData>

        
        const params = {
            Message: JSON.stringify(logEvents), 
            Subject: notificationData.subject ?? getDefaultSubject(logGroup, ruleName),
            TopicArn:  notificationData.snsArn ?? CONFIG.DEFAULT_SNS_ARN
        }

        const result = await this.sns.publish(params).promise()
        console.log('result from publish', result)
    }
}