
import { S3Handler } from 'aws-lambda';
import { ConfigFile } from '../../configFile.interface';
import  { S3, CloudWatchLogs } from 'aws-sdk';
import { CONFIG } from '../../config';

const formatFilterNameFromFileName = (fileKey: string) => {
    return `auto-notification--${fileKey}`
}

const lambdaUpdater: S3Handler = async (event) => {

    // console.log('>> EVENT CONTENT:', event);
    // console.log('>> EVENT RECORD S3:', event.Records[0]);

    const fileKey = 'testingFile'
    const configContent: ConfigFile = { snsTopicArn: '', filterPattern: 'FILTER THIS', logGroupName: 'test_log_group'};

    // use the object key to delete the trigger if the file was deleted
    // const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    const filterName = formatFilterNameFromFileName(fileKey)
    let cwl = new CloudWatchLogs({apiVersion: '2014-03-28', region: CONFIG.AWS_REGION});
    if (event.Records[0].eventName == "ObjectRemoved:Delete") {
        console.log("REMOVE TRIGGER")

        // use the key (object name) to delete the trigger (they will have the same name)
        let params = {
            filterName: filterName,
            logGroupName: 'LOG_GROUP'
          };
          
        const result = await cwl.deleteSubscriptionFilter(params).promise()
        console.log(`Trigger ${fileKey}`)
        return
    }
    

    // // Get the object from the event and show its content type
    // const bucket = event.Records[0].s3.bucket.name;
    // const fileRequestParams = {
    //     Bucket: bucket,
    //     Key: key,
    // }; 
    // let configContent: ConfigFile;
    // const s3 = new S3({ apiVersion: '2006-03-01' });
    // const configResponse = await s3.getObject(fileRequestParams).promise();
    // console.log('Config response:', configResponse);
    // configContent = JSON.parse(configResponse.Body.toString('utf-8'))
    // console.log(configContent)


    // TODO: validate the structure of the file
    

    // Create the CloudWatchLogs service object
    let params = {
        destinationArn: CONFIG.NOTIFICATION_LAMBDA_ARN,
        filterName: filterName,
        filterPattern: configContent.filterPattern,
        logGroupName: configContent.logGroupName,
    };

    const data = await cwl.putSubscriptionFilter(params).promise();
    console.log("Success", data);
    
    return;
};
exports.handler = lambdaUpdater
export default lambdaUpdater
