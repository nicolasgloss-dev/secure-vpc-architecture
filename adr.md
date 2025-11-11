# Architecture Decision Record – Project 1: Secure VPC Network Architecture with Bastion Host

## 🧭 Context

Networking is foundational for all projects in this portfolio.  
This VPC needed to balance **high availability**, **security**, and **cost-efficiency**.

Key requirements:
- Support both **public-facing** and **private internal workloads**
- Allow **controlled SSH access** to private resources
- Provide a realistic, production-style network environment

---

## ✅ Decision

- **VPC across 2 Availability Zones** with both **public** and **private** subnets  
- Use a **single NAT Gateway** to enable secure outbound internet from private subnets  
- Deploy a **Bastion Host in a public subnet** to allow SSH access  
- Restrict SSH to **only my IP**, passed via context at deploy time  
- Output key values (e.g., EC2 ID, VPC ID) and a ready-to-use **SSH command**

---

## 🔁 Alternatives Considered

| Option | Reason Not Chosen |
|--------|--------------------|
| **Two NAT Gateways** | Improves HA, but too expensive for this portfolio |
| **Wide-open SSH (0.0.0.0/0)** | Easier for testing, but insecure and unrealistic |
| **AWS Systems Manager (SSM)** | More secure, keyless access — left as a **future enhancement** |
| **No Bastion Host** | Would block access to private instances for testing |

---

## 🎯 Consequences

- Demonstrates a **realistic, segmented VPC** design with secure access patterns  
- Shows **cost-aware tradeoffs** (single NAT Gateway vs. full HA)  
- Lays a foundation for future projects with **reusable network outputs**  
- Leaves room to evolve towards more secure options like **SSM Session Manager** and **VPC Endpoints**

---

## 📌 Status

**✅ Accepted** — Implemented during Days 1–3 of the Secure VPC project
