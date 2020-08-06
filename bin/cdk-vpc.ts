#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { Tag } from '@aws-cdk/core';
import { CdkVpcStack } from '../lib/cdk-vpc-stack';
import { stackTags } from './cdk-config';
import { getConfig } from './config';

const app = new cdk.App();

const env = app.node.tryGetContext('env') || process.env.NODE_ENV || 'development';
if (env === undefined) {
    throw new Error('Environment must be passed command argument');
}

if (process.env.CDK_DEPLOY_ACCOUNT === undefined) {
    throw new Error('CDK_DEPLOY_ACCOUNT must be set environment');
}

if (process.env.CDK_DEPLOY_REGION === undefined) {
    throw new Error('CDK_DEPLOY_REGION must be set environment');
}

const config = getConfig();
const stack = new CdkVpcStack(app, 'CdkVpcStack', {
    env: {
        account: process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION
    },
    description: "CDK VPC Stack"
}, config);

// apply tags to stack
stackTags[`${env}`].forEach(tag => Tag.add(stack, tag.name, tag.value));