# Welcome to your CDK TypeScript project!

This is a blank project for TypeScript development with CDK.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template

## Examples
npm run synth:development --vpcid=optional --profile=my-profile <br />
npm run diff:development --vpcid=optional --profile=my-profile <br />
npm run deploy:development --vpcid=optional --profile=my-profile <br />
npm run destroy:development --vpcid=optional --profile=my-profile <br />

cdk synth -c env=development --profile my-profile <br />
cdk diff -c env=development --profile my-profile <br />
cdk deploy -c env=development --profile my-profile <br />
cdk destroy -c env=development --profile my-profile <br />
