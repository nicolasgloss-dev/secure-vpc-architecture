/**
 * Project: Secure VPC Network Architecture
 * File: secure-vpc-architecture-stack.ts
 * Author: Nicolas Gloss
 * Description:
 *   Defines a production-style AWS VPC with public/private subnets, a cost-aware NAT
 *   Gateway, and a Bastion Host for controlled administrative access. Deploy-time
 *   configuration (SSH CIDR, key pair) allows secure and flexible connectivity options.
 *
 * Notes:
 *   - AWS CDK (TypeScript)
 *   - Demonstrates subnet segmentation, controlled SSH access, and bastion design
 *   - Provides clear outputs to support debugging and validation
 *   - Designed as a foundational networking project for an AWS Cloud Engineer portfolio
 */

import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_ec2 as ec2 } from 'aws-cdk-lib';

export class SecureVpcArchitectureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /**
     * -------------------------------------------------------------------------
     * Deploy-Time Configuration
     * -------------------------------------------------------------------------
     * These values can be supplied using CDK context or environment variables.
     *
     * Examples:
     *   cdk deploy -c sshIp=203.0.113.10/32 -c keyName=MyKeyPair
     *
     * sshCidr:
     *   Controls who can SSH into the Bastion Host. Defaults to "0.0.0.0/0"
     *   to allow easy testing, but real-world deployments should use a strict
     *   /32 IP range (your home or office).
     *
     * keyName:
     *   Name of an existing EC2 Key Pair. If omitted, SSH is still allowed
     *   but without a key pair, requiring SSM Session Manager instead.
     *   (A future project enhancement will replace SSH entirely with SSM.)
     */
    const sshCidr =
      this.node.tryGetContext('sshIp') ||
      process.env.SSH_CIDR ||
      '0.0.0.0/0'; // Default allows all — convenient for demos, not for production.

    const keyName =
      this.node.tryGetContext('keyName') ||
      process.env.KEY_NAME ||
      undefined;

    /**
     * -------------------------------------------------------------------------
     * VPC
     * -------------------------------------------------------------------------
     * Creates a VPC across two Availability Zones, with public and private
     * subnets. A single NAT Gateway is used to reduce cost (~$1/day).
     *
     * Public subnets:
     *   - Contain the Bastion Host
     *   - Have internet access via the Internet Gateway
     *
     * Private subnets:
     *   - Intended for application workloads or databases
     *   - Reach the internet only through the NAT Gateway
     */
    const vpc = new ec2.Vpc(this, 'SecureVpc', {
      vpcName: 'secure-vpc-architecture',
      maxAzs: 2,
      natGateways: 1, // Cost-efficient trade-off for portfolio purposes
      subnetConfiguration: [
        {
          name: 'public',
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24,
        },
        {
          name: 'private',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
          cidrMask: 24,
        },
      ],
    });

    // Optional VPC tag for clarity in the AWS Console
    cdk.Tags.of(vpc).add('Name', 'secure-vpc-architecture');

    /**
     * -------------------------------------------------------------------------
     * Bastion Host
     * -------------------------------------------------------------------------
     * Provides controlled administrative access into the private subnets.
     *
     * Security Group:
     *   SSH allowed only from the configured CIDR.
     *
     * Key Pair:
     *   Uses the modern CDK `keyPair` API to reference an existing EC2 Key Pair.
     *   (When undefined, EC2 will deploy without a key, encouraging Session Manager.)
     */
    const bastionSg = new ec2.SecurityGroup(this, 'BastionSg', {
      vpc,
      description: 'Bastion SG: SSH allowed only from provided CIDR',
      allowAllOutbound: true,
    });

    bastionSg.addIngressRule(
      ec2.Peer.ipv4(sshCidr),
      ec2.Port.tcp(22),
      'SSH from provided CIDR'
    );

    const ami = ec2.MachineImage.latestAmazonLinux2023({
      cachedInContext: true,
    });

    const bastionKeyPair = keyName
      ? ec2.KeyPair.fromKeyPairName(this, 'BastionKeyPair', keyName)
      : undefined;

    const bastion = new ec2.Instance(this, 'BastionHost', {
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      instanceType: new ec2.InstanceType('t3.micro'),
      machineImage: ami,
      securityGroup: bastionSg,
      keyPair: bastionKeyPair, // Modern CDK keyPair API
    });

    cdk.Tags.of(bastion).add('Name', 'secure-vpc-bastion');

    /**
     * -------------------------------------------------------------------------
     * Outputs
     * -------------------------------------------------------------------------
     * These outputs make the environment easy to inspect, test, and verify.
     * Extremely helpful for both learning and debugging.
     */
    new cdk.CfnOutput(this, 'VpcId', {
      value: vpc.vpcId,
    });

    new cdk.CfnOutput(this, 'PublicSubnetIds', {
      value: vpc.publicSubnets.map((s) => s.subnetId).join(','),
    });

    new cdk.CfnOutput(this, 'PrivateSubnetIds', {
      value: vpc.privateSubnets.map((s) => s.subnetId).join(','),
    });

    new cdk.CfnOutput(this, 'BastionInstanceId', {
      value: bastion.instanceId,
    });

    new cdk.CfnOutput(this, 'BastionPublicIp', {
      value: bastion.instancePublicIp,
    });

    new cdk.CfnOutput(this, 'BastionSecurityGroupId', {
      value: bastionSg.securityGroupId,
    });

    new cdk.CfnOutput(this, 'SshAllowedCidr', { value: sshCidr });

    new cdk.CfnOutput(this, 'KeyPairName', {
      value: keyName ?? '(none provided)',
    });

    // Generate a helpful SSH command based on whether a key pair was provided.
    const sshCommand = keyName
      ? `ssh -i ~/.ssh/${keyName}.pem ec2-user@${bastion.instancePublicIp}`
      : `ssh ec2-user@${bastion.instancePublicIp}`;

    new cdk.CfnOutput(this, 'BastionSshCommand', {
      value: sshCommand,
    });
  }
}
