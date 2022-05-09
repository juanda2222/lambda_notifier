import { CloudWatchLogsDecodedData } from "aws-lambda";
import { ConfigFile } from "../configFile.class";
import { SlackService } from "./slackService";
import { SNSService } from "./snsService";
export interface MessageInfoType {
    decodedLog: CloudWatchLogsDecodedData, 
    configFile: ConfigFile
}
export abstract class NotificationServiceClass {
    abstract sendMessage(messageInfo: MessageInfoType): Promise<void>
}

export interface NotificationClientConfig {
    type?: 'sns' | 'slack',
    awsRegion: string

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
}