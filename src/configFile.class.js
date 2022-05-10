import { IsIn, IsString, ValidateNested } from "class-validator"

export class SlackNotificationData {}
export class SNSNotificationData {
    snsArn
}

export class NotificationRule {
    ruleName
    filterPattern
    notificationType
    notificationData
}

export class ConfigFile {
    rules;
}