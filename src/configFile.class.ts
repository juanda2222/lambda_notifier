export type NotificationType = 'sns' | 'slack'
export type NotificationData = SlackNotificationData | SNSNotificationData

export interface SlackNotificationData {}

export interface SNSNotificationData {
    snsArn: string
}

export interface NotificationRule {
    ruleName: string
    filterPattern: string
    notificationType: NotificationType
    notificationData: SNSNotificationData
}

export interface ConfigFile {
    rules: NotificationRule[],
}