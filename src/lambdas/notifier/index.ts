
import { CloudWatchLogsDecodedData, CloudWatchLogsHandler } from 'aws-lambda';
import * as zlib from 'zlib';
import { S3 } from "aws-sdk";
import { CONFIG } from '../../config';
import { NotificationService } from '../../notificationService';
import { ConfigFile, ConfigFileSchemaJoi } from '../../configFile.class';

const getConfigPathFromLogGroup = (logGroupName: string) => {
    return `${logGroupName}.json`
}

const LambdaNotifier: CloudWatchLogsHandler = async (event) => {
    
    // parse the receiving message
    console.log("SENDING NOTIFICATION")
    const decodedLog: CloudWatchLogsDecodedData = JSON.parse(zlib.unzipSync(Buffer.from(event.awslogs.data, 'base64')).toString())
    const logGroupName = decodedLog.logGroup

    let s3 = new S3();
    let notificationService = new NotificationService({awsRegion: CONFIG.AWS_REGION});
    
    // read from s3 the current config
    let configResponse
    let s3Params = {Bucket: CONFIG.NOTIFICATION_CONFIG_BUCKET_NAME, Key: getConfigPathFromLogGroup(logGroupName)}
    try {
        configResponse = await s3.getObject(s3Params).promise()
    } catch (error) {
        throw new Error(`Could not read configFile. Wrong bucketName '${CONFIG.NOTIFICATION_CONFIG_BUCKET_NAME}' or logGroupNameName '${logGroupName}'. Error: ${error}`)
    }
    const configContent: ConfigFile = JSON.parse(configResponse.Body.toString('utf-8'));
    
    // validate the structure of the file
    await ConfigFileSchemaJoi.validateAsync(configContent)

    // send message using the notification wrapper
    try {
        await notificationService.sendMessages({decodedLog, configFile: configContent})
        console.log(`${decodedLog.logEvents.length} Messages SENT to ${logGroupName} team`)
    } catch (error) {
        throw new Error(`Could not send messages. Wrong notification config on file ${s3Params.Key}. Error: ${error}`)
    }
    
    return;
};

export default LambdaNotifier