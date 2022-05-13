import { CloudWatchLogsDecodedData, S3Event, S3EventRecord } from "aws-lambda";
import { ConfigFile, NotificationRule, NotificationType } from "../configFile.class";
import { SlackService } from "./slackService";
import { SNSService } from "./snsService";
export interface MessageInfoType {
    decodedLog: CloudWatchLogsDecodedData, 
    configFile: ConfigFile
}
export abstract class NotificationServiceClass {
    abstract sendMessage(messageInfo: MessageInfoType): Promise<void>
    abstract setUpRecipient(recipientInfo: RecipientInfoType): Promise<void>
    abstract removeRecipient(recipientInfo: RecipientInfoType): Promise<void>
}

export interface NotificationClientConfig {
    type?: NotificationType,
    awsRegion: string
}

export interface RecipientInfoType {
    s3Event: S3EventRecord
    notificationRule: NotificationRule,
}
export class NotificationService implements NotificationServiceClass{

    // store of the notification class
    client: NotificationServiceClass
    
    constructor(notificationConfig?: NotificationClientConfig) {
        this.client = this.instanceNotificationClassFromType(notificationConfig)
    }

    // mapping to handle automatic switching depending on an initialization type
    instanceNotificationClassFromType(notificationConfig?: NotificationClientConfig){

        const notificationClass = {
            slack: SlackService,
            sns: SNSService
        }

        const classType = notificationConfig?.type ?? 'sns'
        return new notificationClass[classType](notificationConfig)
    }
    async sendMessage(messageInfo: MessageInfoType){
        await this.client.sendMessage(messageInfo)
    }

    async setUpRecipient(recipientInfo: RecipientInfoType) {
        await this.client.setUpRecipient(recipientInfo)

    }

    async removeRecipient(recipientInfo: RecipientInfoType) {
        await this.client.removeRecipient(recipientInfo)
    }
}