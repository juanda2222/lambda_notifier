export const mockS3FileCreatedEvent = {
    "Records": [
        {
            "eventVersion": "2.0",
            "eventSource": "aws:s3",
            "awsRegion": "us-west-2",
            "eventTime": "1970-01-01T00:00:00.000Z",
            "eventName": "ObjectCreated:Put",
            "userIdentity": {
            "principalId": "EXAMPLE"
            },
            "requestParameters": {
            "sourceIPAddress": "127.0.0.1"
            },
            "responseElements": {
            "x-amz-request-id": "EXAMPLE123456789",
            "x-amz-id-2": "EXAMPLE123/5678abcdefghijklambdaisawesome/mnopqrstuvwxyzABCDEFGH"
            },
            "s3": {
                "s3SchemaVersion": "1.0",
                "configurationId": "testConfigRule",
                "bucket": {
                    "name": "my-s3-bucket",
                    "ownerIdentity": {
                    "principalId": "EXAMPLE"
                    },
                    "arn": "arn:aws:s3:::example-bucket"
                },
                "object": {
                    "key": "HappyFace.jpg",
                    "size": 1024,
                    "eTag": "0123456789abcdef0123456789abcdef",
                    "sequencer": "0A1B2C3D4E5F678901"
                }
            }
        }
    ]
}

export const mockS3FileDeletedEvent = {
  "Records": [
      {
          "eventVersion": "2.0",
          "eventSource": "aws:s3",
          "awsRegion": "us-west-2",
          "eventTime": "1970-01-01T00:00:00.000Z",
          "eventName": "ObjectRemoved:Delete",
          "userIdentity": {
          "principalId": "EXAMPLE"
          },
          "requestParameters": {
          "sourceIPAddress": "127.0.0.1"
          },
          "responseElements": {
          "x-amz-request-id": "EXAMPLE123456789",
          "x-amz-id-2": "EXAMPLE123/5678abcdefghijklambdaisawesome/mnopqrstuvwxyzABCDEFGH"
          },
          "s3": {
              "s3SchemaVersion": "1.0",
              "configurationId": "testConfigRule",
              "bucket": {
                  "name": "my-s3-bucket",
                  "ownerIdentity": {
                  "principalId": "EXAMPLE"
                  },
                  "arn": "arn:aws:s3:::example-bucket"
              },
              "object": {
                  "key": "HappyFace.jpg",
                  "size": 1024,
                  "eTag": "0123456789abcdef0123456789abcdef",
                  "sequencer": "0A1B2C3D4E5F678901"
              }
          }
      }
  ]
}

export const mockCwlDescribeSubscriptionFiltersResponse = {
    subscriptionFilters: [
      {
        filterName: 'auto-notification--testingFile',
        logGroupName: 'test_log_group',
        filterPattern: 'FILTER THIS',
        destinationArn: 'arn:aws:lambda:us-east-1:1390650843:function:test_function_from_log',
        distribution: 'ByLogStream',
        creationTime: 1651968642639
      },
      {
        filterName: 'my_lambda_filter',
        logGroupName: 'test_log_group',
        filterPattern: 'no idea',
        destinationArn: 'arn:aws:lambda:us-east-1:1330650843:function:test_function_from_log',
        distribution: 'ByLogStream',
        creationTime: 1651603151760
      }
    ]
  }