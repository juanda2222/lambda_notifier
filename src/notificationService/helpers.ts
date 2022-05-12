import { ConfigFile, SNSNotificationData } from "../configFile.class"

export const getDefaultSubject = (logGroup: string, ruleName: string) => {
    return `${logGroup}-${ruleName}` 
}

export const getTopicArnFromConfigFile = (configFile: ConfigFile) => {
    return configFile.rules.map(ruleData => (ruleData.notificationData as SNSNotificationData).snsArn)
}
