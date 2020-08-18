import * as cdk from '@aws-cdk/core';
import { Config } from '../bin/config';
import * as ec2 from '@aws-cdk/aws-ec2';
// import { Vpc, SubnetType, SecurityGroup, ISubnet } from "@aws-cdk/aws-ec2";
import * as sam from '@aws-cdk/aws-sam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as iam from '@aws-cdk/aws-iam';

export interface VpcProps {
    name: string;
    maxAzs: number;
}

export class VpcStack extends cdk.Construct {
    public readonly vpc: ec2.IVpc;
    public readonly privateSubnetConfiguration: ec2.SubnetConfiguration;
    public readonly publicSubnetConfiguration: ec2.SubnetConfiguration;
    public readonly rdsInstanceSecurityGroup: ec2.SecurityGroup;
    public readonly readReplicaSecurityGroup: ec2.SecurityGroup;
    public readonly ec2BastionSecurityGroup: ec2.SecurityGroup;
    public readonly secretsLambdaSecurityGroup: ec2.SecurityGroup;

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
            this.vpc.publicSubnets.forEach((subnet, index) =>
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

        // create rds instance security group resource
        this.rdsInstanceSecurityGroup = new ec2.SecurityGroup(this, 'RdsInstanceSecurityGroup', {
            vpc: this.vpc,
            allowAllOutbound: true,
            description: 'Security Group for RdsInstance database',
            // securityGroupName: 'cdk-vpc-rds-masterdatabase',
        });

        // create readreplica security group resource
        this.readReplicaSecurityGroup = new ec2.SecurityGroup(this, 'ReadReplicaSecurityGroup', {
            vpc: this.vpc,
            allowAllOutbound: true,
            description: 'Security Group for ReadReplica database',
            // securityGroupName: 'cdk-vpc-rds-readreplica',
        });

        // create ec2 bastion security group resource
        this.ec2BastionSecurityGroup = new ec2.SecurityGroup(this, 'Ec2BastionSecurityGroup', {
            vpc: this.vpc,
            allowAllOutbound: true,
            description: 'Security Group for EC2 Bastion database'
        });

        // create secrets manager lambda security group resource
        this.secretsLambdaSecurityGroup = new ec2.SecurityGroup(this, 'SecretsLambdaSecurityGroup', {
            vpc: this.vpc,
            allowAllOutbound: true,
            description: 'Security Group for Secrets Lambda database'
        });

        // // create secrets manager vpc end point
        // const secretsManagerVpcEndpoint = new ec2.CfnVPCEndpoint(this, 'VpcEndpoint', {
        //     serviceName: 'com.amazonaws.us-east-1.secretsmanager',
        //     vpcId: this.vpc.vpcId,
        //     vpcEndpointType: 'Interface',
        //     privateDnsEnabled: true,
        //     subnetIds: ['subnet-0d869ec91ded8d4be', 'subnet-0bbb2ac214f7ca33e'],
        //     securityGroupIds: [this.rdsInstanceSecurityGroup.securityGroupId]
        // });

        // create secrets manager vpc end point
        const vpcEndpoint = this.vpc.addInterfaceEndpoint('SecretsManagerVpcEndpoint', {
            service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
            securityGroups: [this.secretsLambdaSecurityGroup],
            subnets: this.vpc.selectSubnets({ subnetType: ec2.SubnetType.PUBLIC }),
            privateDnsEnabled: true
        });

        // @TODO moved to vpc
        // const samApp = new sam.CfnApplication(this, 'CfnApplication', {
        //     location: {
        //         applicationId: "arn:aws:serverlessrepo:us-east-1:297356227824:applications/SecretsManagerRDSPostgreSQLRotationSingleUser",
        //         semanticVersion: '1.1.58'
        //     },
        //     parameters: {
        //         endpoint: `https://secretsmanager.${this.vpc.stack.region}.amazonaws.com`,
        //         functionName: 'MyLambdaRotationFunctionTest',
        //         vpcSubnetIds: this.vpc.selectSubnets({ subnetType: ec2.SubnetType.PUBLIC }).subnetIds.toString(),
        //         vpcSecurityGroupIds: this.rdsInstanceSecurityGroup.securityGroupId
        //     }
        // });

        // // get rotate lambda function arn
        // const func = lambda.Function.fromFunctionArn(this, 'MyLambdaRotationFunctionTest',
        //     `arn:aws:lambda:${this.vpc.stack.region}:${this.vpc.stack.account}:function:MyLambdaRotationFunctionTest`);

        // func.addPermission('RotateLambdaPermission', {
        //     principal: new iam.ServicePrincipal('secretsmanager.amazonaws.com'),
        //     action: 'lambda:InvokeFunction'
        // });
    }
}