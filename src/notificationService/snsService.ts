import { SNS } from "aws-sdk";
import { MessageInfoType, NotificationClientConfig, NotificationServiceClass, RecipientInfoType } from ".";
import { CONFIG } from "../config";
import {  NotificationRule, SNSNotificationData } from "../configFile.class";
import { getDefaultSubject } from "./helpers";

export class SNSService implements NotificationServiceClass{
    sns: SNS
    constructor(notificationConfig?: NotificationClientConfig) {
        const { awsRegion } = notificationConfig ?? {}
        this.sns = new SNS({region: awsRegion});
    }

    async setUpRecipient(recipientInfo: RecipientInfoType) {

        const { notificationRule } = recipientInfo
        const { notificationData } = notificationRule
        const { email, snsArn} = notificationData as SNSNotificationData
        const TopicArn = snsArn ?? CONFIG.DEFAULT_SNS_ARN
    
        const params = {
            Protocol: 'Email',
            TopicArn,
            Endpoint: email
        };
        
        await this.sns.subscribe(params).promise();
        console.log(`Email ${email} SUBSCRIBED to topic ${TopicArn}`)
    }

    async removeRecipient(recipientInfo: RecipientInfoType) {
        const { notificationRule } = recipientInfo
        const { notificationData } = notificationRule
        const { email, snsArn} = notificationData as SNSNotificationData
        const TopicArn = snsArn ?? CONFIG.DEFAULT_SNS_ARN

        // TODO: 'NextToken' property should be used to fetch remaining subscriptions on further requests
        const { Subscriptions } = await this.sns.listSubscriptionsByTopic({ TopicArn }).promise();

        const { SubscriptionArn } = Subscriptions.find(subscription => subscription.Endpoint == email)
        await this.sns.unsubscribe({ SubscriptionArn }).promise()
        console.log(`Email ${email} UNSUBSCRIBED to topic ${TopicArn}`)
    }

    async sendMessage({ decodedLog, configFile }: MessageInfoType){
        const { logEvents, logGroup } = decodedLog


        // TODO: properly parse this as a list
        const rule = configFile.rules.find(rule => {
            return logEvents[0].message.includes(rule.filterPattern)
        })
          
        const { ruleName, notificationData } = rule as unknown as NotificationRule<string, string, 'sns', SNSNotificationData>

        
        const params = {
            Message: JSON.stringify(logEvents, null, 2), 
            Subject: notificationData.subject ?? getDefaultSubject(logGroup, ruleName),
            TopicArn:  notificationData.snsArn ?? CONFIG.DEFAULT_SNS_ARN
        }

        await this.sns.publish(params).promise()
    }
}