#!/usr/bin/env bash

__usage="
Usage: ./deploy.sh --stack <STACK_NAME>

Options:
 --profile <AWS_PROFILE>     AWS Profile to perform deploy. Default: Default profile
 --region <AWS_REGION>       AWS Region to perform deploy. Default: us-west-2 region
"

profile=${profile:-default}
region=${region:-us-west-2}
stack=""

get_profile() {
  if [ -n "${profile}" ];
  then
    echo "--profile ${profile}"
  else
    echo ""
  fi
}

get_airflow_url() {
  if [[ $stack == *"test"* ]];
  then
    echo "--parameter-overrides AirflowUrl=https://airflow.test.instride.com"
  elif [[ $stack == *"env"* ]];
  then 
    echo "--parameter-overrides AirflowUrl=https://airflow.corp.instride.com"
  else
    echo ""
  fi
}

while [ $# -gt 0 ]; do

   if [[ $1 == *"--"* ]]; then
        param="${1/--/}"
        declare $param="$2"
   fi

  shift
done

if [[ -z "${stack}" ]];
then
  echo "$__usage";
  exit 1;
fi

if ! aws s3api wait bucket-exists --bucket $stack --region $region $(get_profile); then
  echo "creating s3 bucket for deploy"
  aws s3 mb s3://$stack --region $region $(get_profile)
fi

if ! aws s3api wait bucket-exists --bucket $stack-delta-etl-scripts --region $region $(get_profile); then
  echo "creating s3 bucket for etl scripts"
  aws s3 mb s3://$stack-delta-etl-scripts --region $region $(get_profile)
fi

aws s3 cp s3-jars/delta-core_2.12-1.0.0.jar s3://$stack-delta-etl-scripts
aws s3 cp glue-scripts/ingestion/batch_ingestion_etl.py s3://$stack-delta-etl-scripts/ingestion/batch_ingestion_etl.py
ingestionDB="${stack//[-]/_}"

echo "Packaging stack on ${stack}"
aws cloudformation package --region $region $(get_profile) --template-file glue-resources.yml --s3-bucket $stack --output-template-file out.yml

echo "Deploying stack ${stack}"
echo "Deploying DB ${ingestionDB}"
aws cloudformation deploy --region $region $(get_profile) $(get_airflow_url) --template-file out.yml --stack-name $stack --capabilities "CAPABILITY_IAM" --parameter-overrides IngestionDB=$ingestionDB

echo "Deploy Completed"
