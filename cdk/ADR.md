\# Architecture Decision Record – Project 1: Secure VPC Network Architecture with Bastion Host



\## Context

Networking is a foundation for all later projects in this portfolio.  

The design needed to balance high availability, security, and cost-awareness.  

The VPC had to support both internet-facing resources (public subnets) and  

internal workloads (private subnets) while providing a secure way to access them.



---



\## Decision

\- Create a \*\*VPC across 2 Availability Zones\*\* with both public and private subnets.  

\- Use a \*\*single NAT Gateway\*\* to allow private subnets to reach the internet, while keeping cost low.  

\- Add a \*\*Bastion Host\*\* in a public subnet to provide controlled SSH access into the VPC.  

\- Restrict SSH access to \*\*only my IP\*\*, passed in at deploy time.  

\- Provide \*\*CloudFormation outputs\*\* for IDs and a ready-to-run SSH command for verification.



---



\## Alternatives Considered

\- \*\*Two NAT Gateways\*\* – more highly available, but too expensive for a portfolio project.  

\- \*\*Wide-open SSH (0.0.0.0/0)\*\* – easier to demo but insecure and not realistic.  

\- \*\*AWS Systems Manager Session Manager (SSM)\*\* – modern, keyless access with no inbound ports.  

&nbsp; - Decided to leave as a future enhancement for realism and simplicity.  

\- \*\*No bastion host\*\* – cheaper, but no way to access private subnets for testing or workloads.



---



\## Consequences

\- Demonstrates real-world \*\*VPC segmentation\*\* and secure access patterns.  

\- Shows cost-conscious design with a \*\*single NAT Gateway\*\*.  

\- Provides reusable outputs for future projects in this portfolio.  

\- Leaves a clear path to improve security with \*\*SSM\*\* and \*\*VPC Endpoints\*\* later.



---



\## Status

\*\*Accepted\*\* – Implemented in Day 1–3 of Project 1.



