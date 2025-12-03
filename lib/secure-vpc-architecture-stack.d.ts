/**
 * Project: Secure VPC Network Architecture
 * File: secure-vpc-architecture-stack.ts
 * Author: Nicolas Gloss
 * Description:
 *   Defines a secure AWS VPC with public/private subnets, a cost-aware NAT Gateway,
 *   and a Bastion Host restricted by user-provided SSH CIDR. Includes helpful outputs
 *   for easy access during deployments.
 *
 * Notes:
 *   - AWS CDK (TypeScript)
 *   - Demonstrates subnet segmentation, controlled SSH access, and bastion setup
 *   - Designed as a foundational AWS networking project for portfolio use
 */
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
export declare class SecureVpcArchitectureStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps);
}
