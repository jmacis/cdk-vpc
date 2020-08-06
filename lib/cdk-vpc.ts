import * as cdk from '@aws-cdk/core';
import { Config } from '../bin/config';
import * as ec2 from '@aws-cdk/aws-ec2';
// import { Vpc, SubnetType, SecurityGroup, ISubnet } from "@aws-cdk/aws-ec2";

export interface VpcProps {
    name: string;
    maxAzs: number;
}

export class VpcStack extends cdk.Construct {
    public readonly vpc: ec2.IVpc;
    public readonly privateSubnetConfiguration: ec2.SubnetConfiguration;
    public readonly publicSubnetConfiguration: ec2.SubnetConfiguration;

    constructor(scope: cdk.Construct, id: string, props: VpcProps, config: Config) {
        super(scope, id);

        // cmdline arg vpcid
        const vpcId: string | undefined = this.node.tryGetContext('vpcid');

        // create vpc resource
        this.privateSubnetConfiguration = {
            cidrMask: config.vpc.subnetPrivateCidrMask,
            name: config.vpc.subnetPrivateName,
            subnetType: ec2.SubnetType.ISOLATED,
        };

        this.publicSubnetConfiguration = {
            cidrMask: config.vpc.subnetPublicCidrMask,
            name: config.vpc.subnetPublicName,
            subnetType: ec2.SubnetType.PUBLIC,
        };

        // create vpc or use existing vpc
        if (!vpcId) {
            console.log("create new vpc");
            this.vpc = new ec2.Vpc(this, props.name, {
                cidr: config.vpc.cidr,
                maxAzs: props.maxAzs,
                subnetConfiguration: [
                    this.privateSubnetConfiguration,
                    this.publicSubnetConfiguration
                ],
                natGateways: config.vpc.natGateways
            });

            // create cfn output vpc id
            new cdk.CfnOutput(this, 'VpcIdOutput', {
                description: 'CDK Vpc Id',
                value: `${config.awsConsole}/vpc/home?region=${this.vpc.stack.region}#vpcs:search=${this.vpc.vpcId}`,
                exportName: 'VpcIdOutput'
            });

            // create cfn output isolated subnets
            this.vpc.isolatedSubnets.forEach((subnet, index) =>
                new cdk.CfnOutput(this, `IsolatedSubnet${++index}Output`, {
                    description: `CDK Isolated Subnet${index} Id`,
                    value: `${config.awsConsole}/vpc/home?region=${this.vpc.stack.region}#subnets:filter=${subnet.subnetId}`
                })
            );

            // create cfn output public subnets
            this.vpc.isolatedSubnets.forEach((subnet, index) =>
                new cdk.CfnOutput(this, `PublicSubnet${++index}Output`, {
                    description: `CDK Public Subnet${index} Id`,
                    value: `${config.awsConsole}/vpc/home?region=${this.vpc.stack.region}#subnets:filter=${subnet.subnetId}`
                })
            );
        } else {
            console.log("use existing vpcId");
            this.vpc = ec2.Vpc.fromLookup(this, props.name, {
                vpcId: vpcId
            });
        }
    }
}