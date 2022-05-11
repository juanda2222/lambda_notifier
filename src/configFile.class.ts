import Joi from "joi"

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
    notificationData: NotificationData
}

export interface ConfigFile {
    rules: NotificationRule[];
}

const NotificationDataSchema = [
    // slack
    Joi.object({
        // not supported
    }),
    // ssn
    Joi.object({
        snsArn: Joi.string().required()
    })
]
export const ConfigFileSchema = Joi.object({
    rules: Joi.array().items(Joi.object({
        ruleName: Joi.string().required(),
        filterPattern: Joi.string().required(),
        notificationType: Joi.string().valid('sns','slack').required(),
        notificationData: Joi.string().valid(...NotificationDataSchema).required()
    }).required())
})