import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_ec2 as ec2 } from 'aws-cdk-lib';

export class Project1VpcArchitectureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Deploy-time configuration
    // Restrict SSH access to my current IP, passed at deploy time
    // Example: cdk deploy -c sshIp=203.194.12.198/32
    // (Optional) pass EC2 Key Pair name:
    //   cdk deploy -c sshIp=... -c keyName=MyKeyPair
    // Can also set SSH_CIDR / KEY_NAME env vars
    const sshCidr =
      this.node.tryGetContext('sshIp') ||
      process.env.SSH_CIDR ||
      '0.0.0.0/0'; // Fallback keeps project working
    const keyName =
      this.node.tryGetContext('keyName') ||
      process.env.KEY_NAME ||
      undefined; // If undefined, no key-based SSH (use SSM later as enhancement)

    // VPC: 2 AZs, public+private
    const vpc = new ec2.Vpc(this, 'AppVpc', {
      vpcName: 'proj1-vpc-architecture',
      maxAzs: 2,
      natGateways: 1, // cost-aware (~$1/day if left running)
      subnetConfiguration: [
        { name: 'public',  subnetType: ec2.SubnetType.PUBLIC,              cidrMask: 24 },
        { name: 'private', subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS, cidrMask: 24 },
      ],
    });

    // Bastion host (EC2) in public subnet
    // Security Group: allow SSH only from the provided CIDR
    const bastionSg = new ec2.SecurityGroup(this, 'BastionSg', {
      vpc,
      description: 'Bastion SG: SSH allowed only from provided CIDR',
      allowAllOutbound: true,
    });
    bastionSg.addIngressRule(ec2.Peer.ipv4(sshCidr), ec2.Port.tcp(22), 'SSH from my IP');

    // Latest Amazon Linux 2023 AMI (includes SSM agent)
    const ami = ec2.MachineImage.latestAmazonLinux2023({ cachedInContext: true });

    const bastion = new ec2.Instance(this, 'BastionHost', {
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC }, // assigns a public IP
      instanceType: new ec2.InstanceType('t3.micro'),
      machineImage: ami,
      securityGroup: bastionSg,
      keyName, // required for SSH. omit/pass later if using SSM
    });

    cdk.Tags.of(bastion).add('Name', 'proj1-bastion');

    // Helpful Outputs
    new cdk.CfnOutput(this, 'VpcId', { value: vpc.vpcId });
    new cdk.CfnOutput(this, 'PublicSubnetIds', {
      value: vpc.publicSubnets.map(s => s.subnetId).join(','),
    });
    new cdk.CfnOutput(this, 'PrivateSubnetIds', {
      value: vpc.privateSubnets.map(s => s.subnetId).join(','),
    });
    new cdk.CfnOutput(this, 'BastionInstanceId', { value: bastion.instanceId });
    new cdk.CfnOutput(this, 'BastionPublicIp', { value: bastion.instancePublicIp });
    new cdk.CfnOutput(this, 'BastionSecurityGroupId', { value: bastionSg.securityGroupId });
    new cdk.CfnOutput(this, 'SshAllowedCidr', { value: sshCidr });
    new cdk.CfnOutput(this, 'KeyPairName', { value: keyName ?? '(none provided)' });
    // Ready-to-run SSH command (uses key if provided, otherwise plain ssh)
    const sshCommand = keyName
      ? cdk.Fn.join('', [
          'ssh -i ~/.ssh/', keyName, '.pem ',
          'ec2-user@', bastion.instancePublicIp,
        ])
      : cdk.Fn.join('', [
          'ssh ec2-user@', bastion.instancePublicIp,
        ]);
    new cdk.CfnOutput(this, 'BastionSshCommand', { value: sshCommand });
  }
}
