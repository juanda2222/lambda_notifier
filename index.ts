
import { CloudWatchLogsDecodedData, CloudWatchLogsHandler } from 'aws-lambda';
import * as zlib from 'zlib';
import { SNS, S3 } from "aws-sdk";
import { CONFIG } from './src/config';
import { ConfigFile } from './src/configFile.interface';
import { NotificationService } from './src/notificationService';

const getConfigPathFromTeamName = (teamName: string) => {
    return `${teamName}`
}

const lambdaNotifier: CloudWatchLogsHandler = async (event) => {
    
    // parse the receiving message
    const payload = Buffer.from(event.awslogs.data, 'base64');
    const decodedLog: CloudWatchLogsDecodedData = JSON.parse(zlib.unzipSync(payload).toString())
    const teamName = decodedLog.logGroup

    // read from s3 the current config
    let s3 = new S3();
    let s3Params = {Bucket: CONFIG.NOTIFICATION_CONFIG_BUCKET_NAME, Key: getConfigPathFromTeamName(teamName)}
    let configResponse = await s3.getObject(s3Params).promise()
    const configContent: ConfigFile = JSON.parse(configResponse.Body.toString('utf-8'));

    // send message using the notification wrapper
    let notificationService = new NotificationService();
    await notificationService.sendMessage({decodedLog, configFile: configContent})
    console.log(`Message sent to ${teamName} team`)
    
    return;
};
exports.handler = lambdaNotifier

