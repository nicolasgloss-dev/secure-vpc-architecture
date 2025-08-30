# Project 1 – Secure VPC Network Architecture with Bastion Host

## Overview
This project builds a secure, multi-AZ Virtual Private Cloud (VPC) in AWS.  
It demonstrates core networking patterns for public and private workloads,  
secure access using a bastion host, and cost-conscious design choices.

The VPC forms the foundation for later portfolio projects,  
which will deploy applications, CI/CD pipelines, and monitoring solutions into this network.

---

## Architecture Highlights
- **VPC across 2 Availability Zones** for high availability  
- **Public subnets** for internet-facing resources (e.g. bastion)  
- **Private subnets** for internal workloads (e.g. app servers, databases)  
- **Single NAT Gateway** for private subnet egress (reduced cost)  
- **Bastion Host** (t3.micro) in the public subnet:  
  - SSH access restricted to my IP (provided at deploy time)  
  - Stack outputs a ready-to-run SSH command  
- CloudFormation outputs for VPC ID, subnet IDs, and bastion details  

---

## Diagram
![Architecture Diagram](screenshots/diagram.png)

---

## AWS Services Used
- **VPC** – isolated network across 2 AZs  
- **EC2** – bastion host (public), private subnets reserved for workloads  
- **Internet Gateway & NAT Gateway** – outbound access for private instances  
- **Security Groups** – restricted SSH ingress  
- **CloudFormation / CDK** – Infrastructure as Code  

---

## Outputs
- VpcId
- PublicSubnetIds
- PrivateSubnetIds
- BastionInstanceId
- BastionPublicIp
- BastionSshCommand

---

## Verification
Key screenshots confirming deployment success:

### VPC and Subnets
![VPC Screenshot](screenshots/vpc.png)

### Bastion Host
![EC2 Bastion Screenshot](screenshots/bastion.png)

### CDK / CloudFormation Outputs
![CDK Outputs Screenshot](screenshots/outputs.png)

### Optional: SSH Access
![SSH Screenshot](screenshots/ssh.png)

---

## Possible Enhancements
- Replace SSH Bastion with **AWS Systems Manager Session Manager** (no inbound ports, no keys)  
- Add workloads in private subnets (EC2, RDS) to demonstrate bastion → private hop  
- Add **VPC Endpoints** (SSM, EC2Messages, S3) to reduce NAT traffic  

---
