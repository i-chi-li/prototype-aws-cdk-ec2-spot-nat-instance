# Welcome to your CDK TypeScript project!

このプロジェクトは、EC2 のスポットインスタンスを利用する CDK で実装したサンプルとなる。
AMI イメージは、AWS 公式の NAT インスタンス用

This is a blank project for TypeScript development with CDK.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template

## デプロイ
VPC、Public Subnet、S3 Bucket は、作成済みとする。
npx cdk deploy -c bucket=S3bucketName -c key=EC2KeyPairName -c vpc=vpc-xxxxxxxxxxxxxxxx -c subnet1=subnet-xxxxxxxxxxxxxxxxx -c subnet2=subnet-xxxxxxxxxxxxxxxxx

S3bucketName は、ロール設定のサンプルであり、
ソースには実装されていないが、UserData 中のシェルで、
以下のような S3 から初期化用ファイルを取得するなど可能。
aws s3 cp s3://${DeploymentArtifactsS3Bucket}/gameoflife-web/target/gameoflife.war /usr/share/tomcat8/webapps/gameoflife.war

## 参考
CODE SNIPPET: THE TEST ENVIRONMENT CLOUDFORMATION TEMPLATE
https://ec2spotworkshops.com/amazon-ec2-spot-cicd-workshop/lab2/clfn.html
