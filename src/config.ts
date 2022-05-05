import { EnvVariables } from "./environmentVariables.enum";

require('dotenv').config();

export const CONFIG = {
    KMS_KEY_ID_TS: process.env[EnvVariables.KMS_KEY_ID_TS],
    NOTIFICATION_CONFIG_BUCKET_NAME: process.env[EnvVariables.NOTIFICATION_CONFIG_BUCKET_NAME] ?? 'notificationConfig'
}