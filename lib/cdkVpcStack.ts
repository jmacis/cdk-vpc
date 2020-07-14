import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';

export interface VpcStackProps {
    name: string,
    environment: string
    cidr: string,
    maxAzs: number
}

export class VpcStack extends cdk.Construct {
    public readonly vpc: ec2.Vpc;

    constructor(scope: cdk.Construct, id: string, props: VpcStackProps) {
        super(scope, id);

        // create vpc resource
        this.vpc = new ec2.Vpc(this, props.name, {
            cidr: props.cidr,
            maxAzs: props.maxAzs,
            subnetConfiguration: [
                {
                    name: 'public',
                    subnetType: ec2.SubnetType.PUBLIC,
                    cidrMask: 28,
                },
                {
                    name: 'private',
                    subnetType: ec2.SubnetType.PRIVATE,
                    cidrMask: 24,
                }
            ]
        })
    }
}