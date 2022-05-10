#!/usr/bin/env bash

__usage="
Usage: ./deploy.sh --stack <STACK_NAME>

Options:
 --profile <AWS_PROFILE>     AWS Profile to perform deploy. Default: Default profile
 --region <AWS_REGION>       AWS Region to perform deploy. Default: us-west-2 region
"

# profile=${profile:-default}
region=${region:-us-east-1}
stack=""

# get_airflow_url() {
#   if [[ $stack == *"test"* ]];
#   then
#     echo "--parameter-overrides AirflowUrl=https://airflow.test.instride.com"
#   elif [[ $stack == *"env"* ]];
#   then 
#     echo "--parameter-overrides AirflowUrl=https://airflow.corp.instride.com"
#   else
#     echo ""
#   fi
# }

# parse the arguments
while [ $# -gt 0 ]; do

   if [[ $1 == *"--"* ]]; then
        param="${1/--/}"
        declare $param="$2"
   fi

  shift
done

# validate mandatory parameters
if [[ -z "${stack}" ]];
then
  echo "$__usage";
  exit 1;
fi

# format parameters into ready to use arguments for aws cli
get_profile() {
  if [ -n "${profile}" ];
  then
    echo "--profile ${profile}"
  else
    echo ""
  fi
}

# create a bucket to upload the build files for the CloudFormation job
if ! aws s3api wait bucket-exists --bucket $stack --region $region $(get_profile); then
  echo "creating s3 bucket for deploy"
  aws s3 mb s3://$stack --region $region $(get_profile)
fi

echo "Packaging stack on ${stack}"
aws cloudformation package --region $region $(get_profile) --template-file ./aws_resources.yml --s3-bucket $stack --output-template-file out.yml

echo "Deploying stack ${stack}"
aws cloudformation deploy --region $region $(get_profile) --template-file out.yml --stack-name $stack --capabilities CAPABILITY_IAM

echo "Deploy Completed"
