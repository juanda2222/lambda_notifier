import { EnvVariables } from "./environmentVariables.enum";

require('dotenv').config();

const AWS_REGION = process.env[EnvVariables.AWS_REGION] ?? 'us-east-1'
const AWS_ACCOUNT_ID = process.env[EnvVariables.AWS_ACCOUNT_ID] ?? '133590650843'
const LAMBDA_NOTIFIER_NAME = process.env[EnvVariables.LAMBDA_NOTIFIER_NAME] ?? 'notification-from-log'

export const CONFIG = {
    NOTIFICATION_CONFIG_BUCKET_NAME: process.env[EnvVariables.NOTIFICATION_CONFIG_BUCKET_NAME] ?? 'notification-config',
    AWS_REGION,
    AWS_ACCOUNT_ID,
    LAMBDA_NOTIFIER_NAME,
    NOTIFICATION_LAMBDA_ARN: process.env[EnvVariables.NOTIFICATION_LAMBDA_ARN] ?? `arn:aws:lambda:${AWS_REGION}:${AWS_ACCOUNT_ID}:function:${LAMBDA_NOTIFIER_NAME}`
}