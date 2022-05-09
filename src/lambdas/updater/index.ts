
import { S3Handler } from 'aws-lambda';
import { ConfigFile } from '../../configFile.class';
import  { S3, CloudWatchLogs } from 'aws-sdk';
import { CONFIG } from '../../config';
import { validateOrReject } from 'class-validator';
import { SubscriptionFilters } from 'aws-sdk/clients/cloudwatchlogs';

const FILTER_NAME_PREFIX = "auto-notification--"
const formatFilterNameFromConfigRuleName = (configRuleName: string) => {
    return `${FILTER_NAME_PREFIX}${configRuleName}`
}

const isANotificationFilter = (filterName: string) => {
    return (new RegExp(`^${FILTER_NAME_PREFIX}`)).test(filterName)
}

const validateFileKeyAsLogGroup = (fileKey: string) => {
    // TODO: do some format validations because the rules for a groupLogName are different from the rules of an s3 file
    return fileKey
}


const lambdaUpdater: S3Handler = async (event) => {

    // get the important information from the event
    const fileKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    const validatedLogGroupName = validateFileKeyAsLogGroup(fileKey)

    // instance apis
    let cwl = new CloudWatchLogs({apiVersion: '2014-03-28', region: CONFIG.AWS_REGION});
    let s3 = new S3({ apiVersion: '2006-03-01' });

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
                return filterName
            }))
            console.log(`${filtersDeleted.length} triggers DELETED. Result: ${filtersDeleted}`)
            return
        } catch (error) {
            throw new Error(`Could not delete filters '${automaticNotificationFilters.map(filterDescription => filterDescription.filterName)}'. Error: ${error}`)
        }
    }

    // Get the object from the event and show its content type
    const bucket = event.Records[0].s3.bucket.name;
    const fileRequestParams = {
        Bucket: bucket,
        Key: fileKey,
    }; 
    let configContent: ConfigFile;
    const configResponse = await s3.getObject(fileRequestParams).promise();
    configContent = JSON.parse(configResponse.Body.toString('utf-8'))


    // validate the structure of the file
    validateOrReject(configContent)

    // ----------- ADD TRIGGERS ROUTINE -----------------
    // process all filters inside the file
    console.log("CREATING TRIGGERS")
    try {
        const filtersCreated = await Promise.all(configContent.rules.map(async rule => {

            // Create the CloudWatchLogs service object
            const { filterPattern, ruleName } = rule
            let params = {
                destinationArn: CONFIG.NOTIFICATION_LAMBDA_ARN,
                filterName: formatFilterNameFromConfigRuleName(ruleName),
                filterPattern,
                logGroupName: validatedLogGroupName,
            }
    
            await cwl.putSubscriptionFilter(params).promise();
            return ruleName
        }))
        console.log(`${filtersCreated.length} triggers CREATED. Result: ${filtersCreated}`)
        return;
    
    } catch (error) {
        throw new Error(`Could not create filters based on file '${fileKey}'. Error: ${error}`)
    }
};

exports.handler = lambdaUpdater
export default lambdaUpdater
