import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as CdkVpc from '../lib/cdk-vpc-stack';
import { getConfig } from '../bin/config';

test('Empty Stack', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new CdkVpc.CdkVpcStack(app, 'MyTestStack', {}, getConfig());
  // THEN
  expectCDK(stack).to(matchTemplate({
    "Resources": {}
  }, MatchStyle.EXACT))
});
