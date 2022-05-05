
import { CloudWatchLogsDecodedData, CloudWatchLogsHandler } from 'aws-lambda';
import * as zlib from 'zlib';
import { S3 } from "aws-sdk";
import { CONFIG } from '../../config';
import { NotificationService } from '../../notificationService';
import { ConfigFile } from '../../configFile.interface';

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
    let configResponse
    try {
        configResponse = await s3.getObject(s3Params).promise()
    } catch (error) {
        throw new Error(`Could not read configFile. Wrong bucketName or teamName. Error: ${error}`)
    }
    const configContent: ConfigFile = JSON.parse(configResponse.Body.toString('utf-8'));

    // send message using the notification wrapper
    let notificationService = new NotificationService({awsRegion: CONFIG.AWS_REGION});
    await notificationService.sendMessage({decodedLog, configFile: {snsTopicArn: 'arn:aws:sns:us-east-1:133590650843:test_topic_for_notification'}})
    console.log(`Message sent to ${teamName} team`)
    
    return;
};
exports.handler = lambdaNotifier
export default lambdaNotifier


// {"message":jskdsd, "sdsdasa", forTheMessage:"data"}