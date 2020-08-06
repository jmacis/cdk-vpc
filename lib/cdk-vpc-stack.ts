import * as cdk from '@aws-cdk/core';
import { Config } from '../bin/config';
import { VpcStack } from './cdk-vpc';

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
  }
}
