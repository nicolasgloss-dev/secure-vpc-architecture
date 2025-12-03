"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecureVpcArchitectureStack = void 0;
const cdk = __importStar(require("aws-cdk-lib"));
const aws_cdk_lib_1 = require("aws-cdk-lib");
class SecureVpcArchitectureStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        /**
         * Deploy-time config
         * -------------------
         * SSH CIDR can be passed using:
         *   cdk deploy -c sshIp=203.0.113.10/32
         *
         * KeyPair name (optional):
         *   cdk deploy -c keyName=MyKeyPair
         *
         * Fallbacks ensure the project still runs even without context.
         */
        const sshCidr = this.node.tryGetContext('sshIp') ||
            process.env.SSH_CIDR ||
            '0.0.0.0/0'; // (Optional fallback for demo purposes)
        const keyName = this.node.tryGetContext('keyName') ||
            process.env.KEY_NAME ||
            undefined;
        /**
         * VPC
         * ---
         * 2 AZs, segmented public + private subnets.
         * Single NAT Gateway for cost awareness.
         */
        const vpc = new aws_cdk_lib_1.aws_ec2.Vpc(this, 'SecureVpc', {
            vpcName: 'secure-vpc-architecture',
            maxAzs: 2,
            natGateways: 1,
            subnetConfiguration: [
                {
                    name: 'public',
                    subnetType: aws_cdk_lib_1.aws_ec2.SubnetType.PUBLIC,
                    cidrMask: 24,
                },
                {
                    name: 'private',
                    subnetType: aws_cdk_lib_1.aws_ec2.SubnetType.PRIVATE_WITH_EGRESS,
                    cidrMask: 24,
                },
            ],
        });
        /**
         * Bastion Host
         * ------------
         * EC2 instance in public subnet with SSH restricted to provided CIDR.
         */
        const bastionSg = new aws_cdk_lib_1.aws_ec2.SecurityGroup(this, 'BastionSg', {
            vpc,
            description: 'Bastion SG: SSH allowed only from provided CIDR',
            allowAllOutbound: true,
        });
        bastionSg.addIngressRule(aws_cdk_lib_1.aws_ec2.Peer.ipv4(sshCidr), aws_cdk_lib_1.aws_ec2.Port.tcp(22), 'SSH from provided CIDR');
        const ami = aws_cdk_lib_1.aws_ec2.MachineImage.latestAmazonLinux2023({
            cachedInContext: true,
        });
        const bastion = new aws_cdk_lib_1.aws_ec2.Instance(this, 'BastionHost', {
            vpc,
            vpcSubnets: { subnetType: aws_cdk_lib_1.aws_ec2.SubnetType.PUBLIC },
            instanceType: new aws_cdk_lib_1.aws_ec2.InstanceType('t3.micro'),
            machineImage: ami,
            securityGroup: bastionSg,
            keyName,
        });
        cdk.Tags.of(bastion).add('Name', 'secure-vpc-bastion');
        /**
         * Outputs
         * -------
         * Helpful values for debugging and connecting via SSH.
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
        // Pre-built SSH command
        const sshCommand = keyName
            ? `ssh -i ~/.ssh/${keyName}.pem ec2-user@${bastion.instancePublicIp}`
            : `ssh ec2-user@${bastion.instancePublicIp}`;
        new cdk.CfnOutput(this, 'BastionSshCommand', {
            value: sshCommand,
        });
    }
}
exports.SecureVpcArchitectureStack = SecureVpcArchitectureStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjdXJlLXZwYy1hcmNoaXRlY3R1cmUtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzZWN1cmUtdnBjLWFyY2hpdGVjdHVyZS1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7Ozs7R0FhRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFSCxpREFBbUM7QUFFbkMsNkNBQTZDO0FBRTdDLE1BQWEsMEJBQTJCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDdkQsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUM5RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4Qjs7Ozs7Ozs7OztXQVVHO1FBQ0gsTUFBTSxPQUFPLEdBQ1gsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDO1lBQ2hDLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUTtZQUNwQixXQUFXLENBQUMsQ0FBQyx3Q0FBd0M7UUFFdkQsTUFBTSxPQUFPLEdBQ1gsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDO1lBQ2xDLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUTtZQUNwQixTQUFTLENBQUM7UUFFWjs7Ozs7V0FLRztRQUNILE1BQU0sR0FBRyxHQUFHLElBQUkscUJBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRTtZQUN6QyxPQUFPLEVBQUUseUJBQXlCO1lBQ2xDLE1BQU0sRUFBRSxDQUFDO1lBQ1QsV0FBVyxFQUFFLENBQUM7WUFDZCxtQkFBbUIsRUFBRTtnQkFDbkI7b0JBQ0UsSUFBSSxFQUFFLFFBQVE7b0JBQ2QsVUFBVSxFQUFFLHFCQUFHLENBQUMsVUFBVSxDQUFDLE1BQU07b0JBQ2pDLFFBQVEsRUFBRSxFQUFFO2lCQUNiO2dCQUNEO29CQUNFLElBQUksRUFBRSxTQUFTO29CQUNmLFVBQVUsRUFBRSxxQkFBRyxDQUFD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QUFDLENBQUMsaUJBQWlCLE9BQU8saUJBQWlCLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRTtZQUNyRSxDQUFDLENBQUMsZ0JBQWdCLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBRS9DLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsbUJBQW1CLEVBQUU7WUFDM0MsS0FBSyxFQUFFLFVBQVU7U0FDbEIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBNUhELGdFQTRIQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBQcm9qZWN0OiBTZWN1cmUgVlBDIE5ldHdvcmsgQXJjaGl0ZWN0dXJlXHJcbiAqIEZpbGU6IHNlY3VyZS12cGMtYXJjaGl0ZWN0dXJlLXN0YWNrLnRzXHJcbiAqIEF1dGhvcjogTmljb2xhcyBHbG9zc1xyXG4gKiBEZXNjcmlwdGlvbjpcclxuICogICBEZWZpbmVzIGEgc2VjdXJlIEFXUyBWUEMgd2l0aCBwdWJsaWMvcHJpdmF0ZSBzdWJuZXRzLCBhIGNvc3QtYXdhcmUgTkFUIEdhdGV3YXksXHJcbiAqICAgYW5kIGEgQmFzdGlvbiBIb3N0IHJlc3RyaWN0ZWQgYnkgdXNlci1wcm92aWRlZCBTU0ggQ0lEUi4gSW5jbHVkZXMgaGVscGZ1bCBvdXRwdXRzXHJcbiAqICAgZm9yIGVhc3kgYWNjZXNzIGR1cmluZyBkZXBsb3ltZW50cy5cclxuICpcclxuICogTm90ZXM6XHJcbiAqICAgLSBBV1MgQ0RLIChUeXBlU2NyaXB0KVxyXG4gKiAgIC0gRGVtb25zdHJhdGVzIHN1Ym5ldCBzZWdtZW50YXRpb24sIGNvbnRyb2xsZWQgU1NIIGFjY2VzcywgYW5kIGJhc3Rpb24gc2V0dXBcclxuICogICAtIERlc2lnbmVkIGFzIGEgZm91bmRhdGlvbmFsIEFXUyBuZXR3b3JraW5nIHByb2plY3QgZm9yIHBvcnRmb2xpbyB1c2VcclxuICovXHJcblxyXG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xyXG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcclxuaW1wb3J0IHsgYXdzX2VjMiBhcyBlYzIgfSBmcm9tICdhd3MtY2RrLWxpYic7XHJcblxyXG5leHBvcnQgY2xhc3MgU2VjdXJlVnBjQXJjaGl0ZWN0dXJlU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xyXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcclxuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGVwbG95LXRpbWUgY29uZmlnXHJcbiAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgKiBTU0ggQ0lEUiBjYW4gYmUgcGFzc2VkIHVzaW5nOlxyXG4gICAgICogICBjZGsgZGVwbG95IC1jIHNzaElwPTIwMy4wLjExMy4xMC8zMlxyXG4gICAgICpcclxuICAgICAqIEtleVBhaXIgbmFtZSAob3B0aW9uYWwpOlxyXG4gICAgICogICBjZGsgZGVwbG95IC1jIGtleU5hbWU9TXlLZXlQYWlyXHJcbiAgICAgKlxyXG4gICAgICogRmFsbGJhY2tzIGVuc3VyZSB0aGUgcHJvamVjdCBzdGlsbCBydW5zIGV2ZW4gd2l0aG91dCBjb250ZXh0LlxyXG4gICAgICovXHJcbiAgICBjb25zdCBzc2hDaWRyID1cclxuICAgICAgdGhpcy5ub2RlLnRyeUdldENvbnRleHQoJ3NzaElwJykgfHxcclxuICAgICAgcHJvY2Vzcy5lbnYuU1NIX0NJRFIgfHxcclxuICAgICAgJzAuMC4wLjAvMCc7IC8vIChPcHRpb25hbCBmYWxsYmFjayBmb3IgZGVtbyBwdXJwb3NlcylcclxuXHJcbiAgICBjb25zdCBrZXlOYW1lID1cclxuICAgICAgdGhpcy5ub2RlLnRyeUdldENvbnRleHQoJ2tleU5hbWUnKSB8fFxyXG4gICAgICBwcm9jZXNzLmVudi5LRVlfTkFNRSB8fFxyXG4gICAgICB1bmRlZmluZWQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBWUENcclxuICAgICAqIC0tLVxyXG4gICAgICogMiBBWnMsIHNlZ21lbnRlZCBwdWJsaWMgKyBwcml2YXRlIHN1Ym5ldHMuXHJcbiAgICAgKiBTaW5nbGUgTkFUIEdhdGV3YXkgZm9yIGNvc3QgYXdhcmVuZXNzLlxyXG4gICAgICovXHJcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyh0aGlzLCAnU2VjdXJlVnBjJywge1xyXG4gICAgICB2cGNOYW1lOiAnc2VjdXJlLXZwYy1hcmNoaXRlY3R1cmUnLFxyXG4gICAgICBtYXhBenM6IDIsXHJcbiAgICAgIG5hdEdhdGV3YXlzOiAxLFxyXG4gICAgICBzdWJuZXRDb25maWd1cmF0aW9uOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbmFtZTogJ3B1YmxpYycsXHJcbiAgICAgICAgICBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5QVUJMSUMsXHJcbiAgICAgICAgICBjaWRyTWFzazogMjQsXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBuYW1lOiAncHJpdmF0ZScsXHJcbiAgICAgICAgICBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5QUklWQVRFX1dJVEhfRUdSRVNTLFxyXG4gICAgICAgICAgY2lkck1hc2s6IDI0LFxyXG4gICAgICAgIH0sXHJcbiAgICAgIF0sXHJcbiAgICB9KTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEJhc3Rpb24gSG9zdFxyXG4gICAgICogLS0tLS0tLS0tLS0tXHJcbiAgICAgKiBFQzIgaW5zdGFuY2UgaW4gcHVibGljIHN1Ym5ldCB3aXRoIFNTSCByZXN0cmljdGVkIHRvIHByb3ZpZGVkIENJRFIuXHJcbiAgICAgKi9cclxuICAgIGNvbnN0IGJhc3Rpb25TZyA9IG5ldyBlYzIuU2VjdXJpdHlHcm91cCh0aGlzLCAnQmFzdGlvblNnJywge1xyXG4gICAgICB2cGMsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnQmFzdGlvbiBTRzogU1NIIGFsbG93ZWQgb25seSBmcm9tIHByb3ZpZGVkIENJRFInLFxyXG4gICAgICBhbGxvd0FsbE91dGJvdW5kOiB0cnVlLFxyXG4gICAgfSk7XHJcbiAgICBiYXN0aW9uU2cuYWRkSW5ncmVzc1J1bGUoXHJcbiAgICAgIGVjMi5QZWVyLmlwdjQoc3NoQ2lkciksXHJcbiAgICAgIGVjMi5Qb3J0LnRjcCgyMiksXHJcbiAgICAgICdTU0ggZnJvbSBwcm92aWRlZCBDSURSJ1xyXG4gICAgKTtcclxuXHJcbiAgICBjb25zdCBhbWkgPSBlYzIuTWFjaGluZUltYWdlLmxhdGVzdEFtYXpvbkxpbnV4MjAyMyh7XHJcbiAgICAgIGNhY2hlZEluQ29udGV4dDogdHJ1ZSxcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IGJhc3Rpb24gPSBuZXcgZWMyLkluc3RhbmNlKHRoaXMsICdCYXN0aW9uSG9zdCcsIHtcclxuICAgICAgdnBjLFxyXG4gICAgICB2cGNTdWJuZXRzOiB7IHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLlBVQkxJQyB9LFxyXG4gICAgICBpbnN0YW5jZVR5cGU6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCd0My5taWNybycpLFxyXG4gICAgICBtYWNoaW5lSW1hZ2U6IGFtaSxcclxuICAgICAgc2VjdXJpdHlHcm91cDogYmFzdGlvblNnLFxyXG4gICAgICBrZXlOYW1lLFxyXG4gICAgfSk7XHJcblxyXG4gICAgY2RrLlRhZ3Mub2YoYmFzdGlvbikuYWRkKCdOYW1lJywgJ3NlY3VyZS12cGMtYmFzdGlvbicpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogT3V0cHV0c1xyXG4gICAgICogLS0tLS0tLVxyXG4gICAgICogSGVscGZ1bCB2YWx1ZXMgZm9yIGRlYnVnZ2luZyBhbmQgY29ubmVjdGluZyB2aWEgU1NILlxyXG4gICAgICovXHJcbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnVnBjSWQnLCB7XHJcbiAgICAgIHZhbHVlOiB2cGMudnBjSWQsXHJcbiAgICB9KTtcclxuXHJcbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnUHVibGljU3VibmV0SWRzJywge1xyXG4gICAgICB2YWx1ZTogdnBjLnB1YmxpY1N1Ym5ldHMubWFwKChzKSA9PiBzLnN1Ym5ldElkKS5qb2luKCcsJyksXHJcbiAgICB9KTtcclxuXHJcbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnUHJpdmF0ZVN1Ym5ldElkcycsIHtcclxuICAgICAgdmFsdWU6IHZwYy5wcml2YXRlU3VibmV0cy5tYXAoKHMpID0+IHMuc3VibmV0SWQpLmpvaW4oJywnKSxcclxuICAgIH0pO1xyXG5cclxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdCYXN0aW9uSW5zdGFuY2VJZCcsIHtcclxuICAgICAgdmFsdWU6IGJhc3Rpb24uaW5zdGFuY2VJZCxcclxuICAgIH0pO1xyXG5cclxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdCYXN0aW9uUHVibGljSXAnLCB7XHJcbiAgICAgIHZhbHVlOiBiYXN0aW9uLmluc3RhbmNlUHVibGljSXAsXHJcbiAgICB9KTtcclxuXHJcbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnQmFzdGlvblNlY3VyaXR5R3JvdXBJZCcsIHtcclxuICAgICAgdmFsdWU6IGJhc3Rpb25TZy5zZWN1cml0eUdyb3VwSWQsXHJcbiAgICB9KTtcclxuXHJcbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnU3NoQWxsb3dlZENpZHInLCB7IHZhbHVlOiBzc2hDaWRyIH0pO1xyXG5cclxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdLZXlQYWlyTmFtZScsIHtcclxuICAgICAgdmFsdWU6IGtleU5hbWUgPz8gJyhub25lIHByb3ZpZGVkKScsXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBQcmUtYnVpbHQgU1NIIGNvbW1hbmRcclxuICAgIGNvbnN0IHNzaENvbW1hbmQgPSBrZXlOYW1lXHJcbiAgICAgID8gYHNzaCAtaSB+Ly5zc2gvJHtrZXlOYW1lfS5wZW0gZWMyLXVzZXJAJHtiYXN0aW9uLmluc3RhbmNlUHVibGljSXB9YFxyXG4gICAgICA6IGBzc2ggZWMyLXVzZXJAJHtiYXN0aW9uLmluc3RhbmNlUHVibGljSXB9YDtcclxuXHJcbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnQmFzdGlvblNzaENvbW1hbmQnLCB7XHJcbiAgICAgIHZhbHVlOiBzc2hDb21tYW5kLFxyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==