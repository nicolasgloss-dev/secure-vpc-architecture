#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { Project1VpcArchitectureStack } from '../lib/project1-vpc-architecture-stack';

const app = new cdk.App();
new Project1VpcArchitectureStack(app, 'Project1VpcArchitectureStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'ap-southeast-2',
  },
});
