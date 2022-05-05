import { MessageInfoType, NotificationClientConfig, NotificationServiceClass } from ".";

export class SlackService implements NotificationServiceClass{
    constructor(notificationConfig?: NotificationClientConfig) {}
    async sendMessage({}: MessageInfoType){
        throw new Error('Method not implemented.')
    }
}