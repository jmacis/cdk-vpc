import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import { VpcStack } from './cdkVpcStack';

export class CdkVpcStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // create vpc resource
    const environment = 'dev';
    const vpcProps = {
      name: 'VPC',
      environment: environment,
      cidr: '10.1.0.0/16',
      maxAzs: 2
    };

    const vpc = new VpcStack(this, 'VPC-STACK', vpcProps);

    // const vpc = new ec2.Vpc(this, "VPC", {
    //   maxAzs: 2
    // });
  }
}
