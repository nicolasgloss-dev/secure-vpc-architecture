#!/usr/bin/env node
/**
 * Project: Secure VPC Network Architecture
 * File: secure-vpc-architecture.ts
 * Author: Nicolas Gloss
 * Description:
 *   Entry point for the CDK application. Synthesises the SecureVpcArchitectureStack.
 *
 * Notes:
 *   - AWS CDK (TypeScript)
 *   - Implements subnet segmentation, NAT Gateway, and Bastion Host
 */

import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { SecureVpcArchitectureStack } from '../lib/secure-vpc-architecture-stack';

const app = new cdk.App();

new SecureVpcArchitectureStack(app, 'SecureVpcArchitectureStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'ap-southeast-2',
  },
});
