import { MessageInfoType, NotificationServiceClass } from ".";

export class SlackService implements NotificationServiceClass{
    constructor() {
        throw new Error('Class not implemented.')
    }
    async sendMessage({}: MessageInfoType){
        throw new Error('Method not implemented.')
    }
}