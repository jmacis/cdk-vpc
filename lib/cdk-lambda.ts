import * as cdk from '@aws-cdk/core';
import { Config } from '../bin/config';
import * as sam from '@aws-cdk/aws-sam';
import { IVpc, SubnetType, SecurityGroup } from '@aws-cdk/aws-ec2'

export interface lambdaProps {
    vpc: IVpc;
    // rdsInstanceSecurityGroup: SecurityGroup;
    secretsLambdaSecurityGroup: SecurityGroup;
}

export class LambdaStack extends cdk.Construct {
    public readonly samApp: sam.CfnApplication;
    constructor(scope: cdk.Construct, id: string, props: lambdaProps, config: Config) {
        super(scope, id);

        this.samApp = new sam.CfnApplication(this, 'CfnApplication', {
            location: {
                applicationId: config.sam.applicationId,
                semanticVersion: config.sam.semanticVersion
            },
            parameters: {
                endpoint: `https://secretsmanager.${cdk.Aws.REGION}.amazonaws.com`,
                functionName: config.sam.functionName,
                vpcSubnetIds: props.vpc.selectSubnets({ subnetType: SubnetType.PUBLIC }).subnetIds.toString(),
                vpcSecurityGroupIds: props.secretsLambdaSecurityGroup.securityGroupId,
            }
        });

        // create cfn output lambda function
        new cdk.CfnOutput(this, 'FunctionIdentifier', {
            description: 'CDK VPC Lambda Function',
            value: `${config.awsConsole}/lambda/home?region=${cdk.Aws.REGION}#/functions/${config.sam.functionName}`
        });

        // create cfn output sam application
        new cdk.CfnOutput(this, 'SamAppIdentifier', {
            description: 'CDK VPC SAM Application',
            value: `${config.awsConsole}/lambda/home?region=${cdk.Aws.REGION}#/applications/${this.samApp.stack.stackName}`
        });
    }
}