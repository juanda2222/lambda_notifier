import { IsIn, IsString, ValidateNested } from "class-validator"

export type NotificationType = 'sns' | 'slack'
export type NotificationData = SlackNotificationData | SNSNotificationData


export class SlackNotificationData {}
export class SNSNotificationData {
    @IsString()
    snsArn: string
}
export class NotificationRule {
    @IsString()
    ruleName: string

    @IsString()
    filterPattern: string

    @IsIn(["'sns'", " 'slack'"])
    notificationType: NotificationType

    @ValidateNested()
    notificationData: NotificationData
}

export class ConfigFile {
    @ValidateNested()
    rules: NotificationRule[];
}