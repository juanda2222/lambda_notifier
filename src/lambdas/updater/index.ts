
import { S3Handler } from 'aws-lambda';
import { ConfigFile, ConfigFileSchemaJoi, NotificationRule } from '../../configFile.class';
import  { S3, CloudWatchLogs } from 'aws-sdk';
import { CONFIG } from '../../config';
import { SubscriptionFilters } from 'aws-sdk/clients/cloudwatchlogs';
import { NotificationService } from '../../notificationService';

const FILTER_NAME_PREFIX = "auto-notification--"
export const formatFilterNameFromConfigRuleName = (configRuleName: string) => {
    return `${FILTER_NAME_PREFIX}${configRuleName}`
}

const isANotificationFilter = (filterName: string) => {
    return (new RegExp(`^${FILTER_NAME_PREFIX}`)).test(filterName)
}

const validateFileKeyAsLogGroup = (fileKey: string) => {
    // TODO: do some format validations because the rules for a groupLogName are different from the rules of an s3 file
    
    // check if the file is json
    if (!((new RegExp(".json$", "i")).test(fileKey))){
        throw new Error("File is not json. Check the extension")
    }

    // remove the json file
    let logGroup = fileKey.substring(0, fileKey.lastIndexOf('.'))

    return logGroup
}


const LambdaUpdater: S3Handler = async (event) => {

    // get the important information from the event
    console.log(`PROCESSING '${event.Records[0].eventName}' EVENT `)
    const fileKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    const bucket = event.Records[0].s3.bucket.name;
    const validatedLogGroupName = validateFileKeyAsLogGroup(fileKey)

    // instance apis
    let cwl = new CloudWatchLogs({apiVersion: '2014-03-28', region: CONFIG.AWS_REGION});
    let s3 = new S3({ apiVersion: '2006-03-01' });
    let notificationService = new NotificationService({awsRegion: CONFIG.AWS_REGION});

    // ----------- DELETE TRIGGERS ROUTINE -----------------
    // use the object key to delete the trigger if the file was deleted
    if (event.Records[0].eventName == "ObjectRemoved:Delete") {
        console.log("DELETING TRIGGERS")

        // Fetch config all logs configs 
        const fetchParams = {
            logGroupName: validatedLogGroupName,
        }
        let subscriptionFilters: SubscriptionFilters 
        try {
            subscriptionFilters = (await cwl.describeSubscriptionFilters(fetchParams).promise()).subscriptionFilters
        } catch (error) {
            throw new Error(`Could not read filters for log group '${validatedLogGroupName}'. Error: ${error}`)
        }

        // discard the filters that not follow the patters
        const automaticNotificationFilters = subscriptionFilters.filter(filter => isANotificationFilter(filter.filterName)) 

        // delete result filters
        try {
            const filtersDeleted = await Promise.all(automaticNotificationFilters.map( async ({filterName, logGroupName}) => {
                await cwl.deleteSubscriptionFilter({ filterName, logGroupName }).promise()
                console.log(`Filter '${filterName}' DELETED`)
                return filterName
            }))
            console.log(`${filtersDeleted.length} triggers deleted. SUMMARY: ${filtersDeleted}`)
        } catch (error) {
            throw new Error(`Could not delete filters '${automaticNotificationFilters.map(filterDescription => filterDescription.filterName)}'. Error: ${error}`)
        }

        // unsubscribe recipients
        try {
            // get the recipients associated to the file
            const backupConfigContentResponse = await s3.getObject({ Bucket: CONFIG.BACKUP_CONFIG_NAME, Key: fileKey }).promise()
            const backupConfigContent: ConfigFile = JSON.parse(backupConfigContentResponse.Body.toString('utf-8'))

            // remove recipient
            await Promise.all(Object.values(backupConfigContent.rules).map(async rule => {
                await notificationService.removeRecipient({ s3Event:  event.Records[0], notificationRule: rule })
            }))

            // remove file
            await s3.deleteObject({ Bucket: CONFIG.BACKUP_CONFIG_NAME, Key: fileKey }).promise()
        } catch (error) {
            throw new Error(`Could not remove recipients for '${validatedLogGroupName}'. Error: ${error}`)
        }
        return
    }

    // Get the object from the event and show its content type
    const fileRequestParams = {
        Bucket: bucket,
        Key: fileKey,
    }; 
    let configResponse
    try {
        configResponse = await s3.getObject(fileRequestParams).promise()
    } catch (error) {
        throw new Error(`Could not read configFile. Wrong bucketName or teamName. Error: ${error}`)
    }
        
    
    // validate the structure of the file
    const configContent: ConfigFile = JSON.parse(configResponse.Body.toString('utf-8'))
    await ConfigFileSchemaJoi.validateAsync(configContent)

    // ----------- ADD TRIGGERS ROUTINE -----------------
    // process all filters inside the file
    console.log("CREATING TRIGGERS")
    try {
        const filtersCreated = await Promise.all(configContent.rules.map(async rule => {

            // Create the CloudWatchLogs service object
            const { filterPattern, ruleName } = rule
            const filterName = formatFilterNameFromConfigRuleName(ruleName)
            let params = {
                destinationArn: CONFIG.NOTIFICATION_LAMBDA_ARN,
                filterName,
                filterPattern,
                logGroupName: validatedLogGroupName,
            }
            await cwl.putSubscriptionFilter(params).promise();
            console.log(`Filter '${filterName}' CREATED`)
            return ruleName
        }))
        console.log(`${filtersCreated.length} triggers created. filter names SUMMARY: [ ${filtersCreated} ]`)
    
    } catch (error) {
        throw new Error(`Could not create filters based on file '${fileKey}'. Error: ${error}`)
    }

    // subscribe recipients
    try {

        // add the recipients associated to the file
        await s3.putObject({ 
            Bucket: CONFIG.BACKUP_CONFIG_NAME, 
            Key: fileKey, 
            Body: Buffer.from(JSON.stringify(configContent))
        }).promise()

        // add the recipients
        await Promise.all(Object.values(configContent.rules).map(async rule => {
            await notificationService.setUpRecipient({ s3Event:  event.Records[0], notificationRule: rule })
        }));

    } catch (error) {
        throw new Error(`Could not add the recipients info for logGroup '${validatedLogGroupName}'. Error: ${error}`)
    }
};

export default LambdaUpdater
