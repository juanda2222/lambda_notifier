import Joi from "joi"

// new notification systems should be included here:
export enum NotificationType { 'sns', 'slack' }
export type NotificationData<T=SlackNotificationData, B=SNSNotificationData> = T | B


export interface SlackNotificationData {}
export interface SNSNotificationData <
    T=string, 
    B=string, 
    D=string, 
>{
    subject: T
    snsArn: B
    email: D
}
export interface NotificationRule <
    T=string, 
    B=string, 
    D=NotificationType, 
    C=NotificationData
> {
    ruleName: T
    filterPattern: B
    notificationType: D
    notificationData: C
}

export interface ConfigFile<T=NotificationRule[]> {
    rules: T;
}

interface SlackNotificationDataJoi extends Joi.ObjectSchema {}
interface SNSNotificationDataJoi extends SNSNotificationData<Joi.StringSchema, Joi.StringSchema, Joi.StringSchema> {}
type NotificationDataJoi = NotificationData<SlackNotificationDataJoi, SNSNotificationDataJoi>
interface NotificationRuleJoi extends NotificationRule<Joi.StringSchema, Joi.StringSchema, Joi.StringSchema, NotificationDataJoi> {}
interface ConfigFileJoi extends ConfigFile<Joi.ArraySchema| NotificationRuleJoi[]>{}

const NotificationDataSchema = [
    // slack
    Joi.object({
        // not supported
    }),
    // ssn
    Joi.object({
        snsArn: Joi.string(),
        subject: Joi.string().optional(),
        email: Joi.string(),
    })
        .or('snsArn', 'email'),
]
export const ConfigFileSchema: ConfigFileJoi = {
    rules: Joi.array().items(Joi.object({
        ruleName: Joi.string().required(),
        filterPattern: Joi.string().required(),
        notificationType: Joi.string().valid( ...Object.values(NotificationType)).required(),
        notificationData: Joi.alternatives(...NotificationDataSchema)
    }).required())
}

export const ConfigFileSchemaJoi = Joi.object(ConfigFileSchema)

// const a: ConfigFile = {}