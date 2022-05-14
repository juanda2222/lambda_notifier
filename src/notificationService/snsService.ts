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

        if (!!snsArn) {
            return // do not setup anything if the rule has the topic
        }
    
        const params = {
            Protocol: 'Email',
            TopicArn: CONFIG.DEFAULT_SNS_ARN,
            Endpoint: email
        };
        
        await this.sns.subscribe(params).promise();
        console.log(`Email ${email} SUBSCRIBED to topic default topic`)
    }

    async removeRecipient(recipientInfo: RecipientInfoType) {
        const { notificationRule } = recipientInfo
        const { notificationData } = notificationRule
        const { email, snsArn} = notificationData as SNSNotificationData
        
        if (!!snsArn) {
            return // do not remove anything if the rule has the topic
        }

        // TODO: 'NextToken' property should be used to fetch remaining subscriptions on further requests
        const { Subscriptions } = await this.sns.listSubscriptionsByTopic({ TopicArn: CONFIG.DEFAULT_SNS_ARN }).promise();
        const { SubscriptionArn } = Subscriptions.find(subscription => subscription.Endpoint == email)

        await this.sns.unsubscribe({ SubscriptionArn }).promise()
        console.log(`Email ${email} UNSUBSCRIBED to topic ${CONFIG.DEFAULT_SNS_ARN}`)
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