
import { CloudWatchLogsDecodedData, CloudWatchLogsHandler } from 'aws-lambda';
import * as zlib from 'zlib';
import { SNS, S3 } from "aws-sdk";
import { CONFIG } from './src/config';
import { ConfigFile } from './src/configFile.interface';

const getConfigPathFromTeamName = (teamName: string) => {
    return `${teamName}`
}

const getTopicArnFromConfigFile = (configFile: ConfigFile) => {
    return configFile.topicArn
}

const getSubjectFromCloudWatchLog = (decodedLog: CloudWatchLogsDecodedData) => {
    return `${decodedLog.logGroup}-${decodedLog.logStream}` 
}

const lambdaNotifier: CloudWatchLogsHandler = async (event, context) => {
    
    // parse the receiving message
    const payload = Buffer.from(event.awslogs.data, 'base64');
    const decodedLog: CloudWatchLogsDecodedData = JSON.parse(zlib.unzipSync(payload).toString())
    const logEventList = decodedLog.logEvents;
    const teamName = decodedLog.logGroup

    // read from s3 the current config
    let s3 = new S3();
    let s3Params = {Bucket: CONFIG.NOTIFICATION_CONFIG_BUCKET_NAME, Key: getConfigPathFromTeamName(teamName)}
    let configResponse = await s3.getObject(s3Params).promise()
    const configContent: ConfigFile = JSON.parse(configResponse.Body.toString('utf-8'));


    // send message using the notification wrapper
    let sns = new SNS();
    let params = {
        Message: JSON.stringify(logEventList), 
        Subject: getSubjectFromCloudWatchLog(decodedLog),
        TopicArn: getTopicArnFromConfigFile(configContent)
    };
    sns.publish(params, context.done);
    console.log(`Message sent to ${teamName} team`)
    
    return;
};
exports.handler = lambdaNotifier

