import * as cdk from '@aws-cdk/core';
import { Config } from '../bin/config';
import { VpcStack } from './cdk-vpc';
import { LambdaStack } from './cdk-lambda';

export class CdkVpcStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: cdk.StackProps, config: Config) {
    super(scope, id, props);

    // cmdline arg env
    const env = scope.node.tryGetContext('env');

    const vpcProps = {
      name: 'Vpc',
      maxAzs: 2
    };

    // create vpc resource
    const vpcStackEntity = new VpcStack(this, 'VpcStack', vpcProps, config);

    const lambdaProps = {
      vpc: vpcStackEntity.vpc,
      secretsLambdaSecurityGroup: vpcStackEntity.secretsLambdaSecurityGroup
    };

    // create sam lambda function rotate SecretsManager
    const lambdaStackEntity = new LambdaStack(this, 'LambdaStack', lambdaProps, config);
  }
}
