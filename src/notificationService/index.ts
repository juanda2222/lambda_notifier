import { CloudWatchLogsDecodedData } from "aws-lambda";
import { ConfigFile } from "../configFile.interface";
import { SlackService } from "./slackService";
import { SNSService } from "./snsService";
export interface MessageInfoType {
    decodedLog: CloudWatchLogsDecodedData, 
    configFile: ConfigFile
}
export abstract class NotificationServiceClass {
    abstract sendMessage(messageInfo: MessageInfoType): Promise<void>
}
export class NotificationService implements NotificationServiceClass{

    // map to handle automatic switching depending on an initialization type
    notificationClassMap: Map<string, NotificationServiceClass> = new Map([
        ['slack', new SlackService()],
        ['sns', new SNSService()]
    ])

    // store of the notification class
    client: NotificationServiceClass
    
    constructor(notificationType?: string) {
        this.client = notificationType ? this.notificationClassMap.get(notificationType) : this.notificationClassMap.get('sns')
    }

    async sendMessage({}: MessageInfoType){
        console.log('Notification sent')
    }
}