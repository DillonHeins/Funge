#!/bin/sh

echo "--- CUSTOM DEPLOYMENT SCRIPT RUNNING ---"

aws s3 cp a-world-of-plants-1.6.3-SNAPSHOT.jar s3://a-world-of-plants-user-management
aws lambda update-function-code --function-name user-management --s3-bucket a-world-of-plants-user-management --s3-key a-world-of-plants-1.6.3-SNAPSHOT.jar

cd ../../../FrontEnd/AWorldOfPlantsApp/
# npm install # uncomment to ensure bower_components are uploaded
aws s3 cp app s3://funge.cf --recursive --exclude "*.log"
