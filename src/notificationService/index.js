import { CloudWatchLogsDecodedData } from "aws-lambda";
import { ConfigFile } from "../configFile.class";
import { SlackService } from "./slackService";
import { SNSService } from "./snsService";

export class NotificationServiceClass {
    sendMessage(messageInfo)
}

export class NotificationService {

    // store of the notification class
    client
    
    constructor(notificationConfig) {
        this.client = this.instanceNotificationClassFromType(notificationConfig)
    }

    // mapping to handle automatic switching depending on an initialization type
    instanceNotificationClassFromType(notificationConfig){

        const notificationClass = {
            slack: SlackService,
            sns: SNSService
        }

        const classType = notificationConfig?.type ?? 'sns'
        return new notificationClass[classType](notificationConfig)
    }
    async sendMessage(messageInfo){
        await this.client.sendMessage(messageInfo)
    }
}