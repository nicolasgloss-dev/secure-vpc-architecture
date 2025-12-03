# Architecture Decision Record – Secure VPC Network Architecture

## 🧭 Context

Networking is the foundation of all cloud architectures, and this project required a Virtual Private Cloud (VPC) that was:

- **Secure** — protecting private workloads from the public internet  
- **Realistic** — aligned with production AWS networking design  
- **Cost-efficient** — practical for small environments and portfolio use  
- **Clear and instructional** — easy to follow from an entry-level cloud engineer perspective  

The design needed to support both public-facing components (Bastion Host) and private-only workloads, while providing controlled administrative access and room for future improvements.

---

## ✅ Decision

- Deploy a **VPC across two Availability Zones** to improve resilience  
- Create **public and private subnets** for workload segmentation  
- Use a **single NAT Gateway** to allow private subnets outbound internet access while managing cost  
- Deploy an **EC2 Bastion Host** in a public subnet for controlled SSH access  
- Restrict SSH access using a **user-provided CIDR** passed at deploy time  
- Provide clear **CDK Outputs** (subnets, EC2 ID, SSH command) to simplify validation, testing, and learning  

This approach delivers a secure, cost-aware, and production-aligned baseline network suitable for demonstrations and real workloads.

---

## 🔁 Alternatives Considered

| Option | Analysis |
|--------|----------|
| **Multi-AZ NAT Gateways (2 NATs)** | Improves high availability for private outbound traffic but significantly increases cost (~2×). Not required for a small-scale or portfolio environment. |
| **Wide-open SSH (0.0.0.0/0)** | Simplifies access but is insecure and unrealistic for production. Rejected to model proper security posture. |
| **Session Manager (SSM) instead of Bastion Host** | More secure and keyless; removes need for SSH completely. Deferred as a future enhancement to keep this project focused on foundational networking concepts. |
| **No Bastion Host** | Would prevent interactive access to private subnets, reducing learning value and practical utility. |

---

## 🎯 Consequences

### **Positive**
- Clear, production-style VPC structure with public/private segmentation  
- Private workloads remain protected from direct exposure  
- SSH access is controlled, auditable, and tied to a trusted CIDR  
- Entire environment is repeatable via AWS CDK (Infrastructure as Code)  
- Provides a strong baseline foundation for future projects using this VPC  

### **Trade-offs / Limitations**
- A **single NAT Gateway** introduces a single point of failure  
- EC2 Bastion Host requires SSH key management and ongoing patching  
- Session Manager would be more secure but is intentionally deferred  
- No VPC Endpoints included (could reduce NAT costs and improve security)  

---

## 📌 Status

**✅ Accepted — Implemented**

This ADR represents the finalised design for the **Secure VPC Network Architecture** project.  
It provides a strong, secure, and cost-effective foundation for subsequent portfolio projects and real-world cloud workloads.
