#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { Tag } from '@aws-cdk/core';
import { CdkVpcStack } from '../lib/cdk-vpc-stack';
import { stackTags as stackTagsDev } from './cdk-config-dev';
import { stackTags as stackTagsProd } from './cdk-config-prod';

const app = new cdk.App();

const env = app.node.tryGetContext('env');
if (env === undefined) {
    throw new Error('Environment must be given');
}

const stack = new CdkVpcStack(app, 'CdkVpcStack', {
    env: {
        account: process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION
    },
    description: "CDK VPC Stack"
});

// apply tags to stack
const stackTags = env === 'dev' ? stackTagsDev : stackTagsProd;
stackTags.forEach(tag => Tag.add(stack, tag.name, tag.value));