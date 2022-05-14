import { MessageInfoType, NotificationClientConfig, NotificationServiceClass, RecipientInfoType } from ".";

export class SlackService implements NotificationServiceClass{
    constructor(notificationConfig?: NotificationClientConfig) {}
    async setUpRecipient(recipientInfo: RecipientInfoType): Promise<void> {}
    async removeRecipient(recipientInfo: RecipientInfoType): Promise<void> {}
    async sendMessages({}: MessageInfoType){
        throw new Error('Method not implemented.')
    }
}