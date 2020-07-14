import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import { VpcStack } from './cdkVpcStack';
import { appendFile } from 'fs';

export class CdkVpcStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const environment = scope.node.tryGetContext('env');
    const vpcProps = {
      name: `VPC-${environment}`,
      environment: environment,
      cidr: '10.1.0.0/16',
      maxAzs: 2
    };

    // create vpc resource
    const vpc = new VpcStack(this, 'VPC-STACK', vpcProps);
  }
}
