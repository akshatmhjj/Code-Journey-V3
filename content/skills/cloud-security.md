---
title: Cloud Security
domain: security
level: advanced
hours: 30–50
brief: Keeping cloud accounts, identities, networks and data secure - least-privilege access, encryption, logging and catching misconfigurations before attackers do.
prereqs:
  - aws
learn:
  - topic: Shared responsibility
    detail: What the cloud provider secures, and what's on you.
  - topic: Identity and access
    detail: Least privilege, roles over long-lived keys, MFA everywhere.
  - topic: Network security
    detail: Private subnets, security groups and no unintended public exposure.
  - topic: Data protection
    detail: Encryption at rest and in transit; public bucket checks.
  - topic: Secrets management
    detail: Secret managers instead of keys in code or environment files.
  - topic: Logging and detection
    detail: CloudTrail, GuardDuty-style alerts and who-did-what audit trails.
  - topic: Posture management
    detail: Benchmarks (like CIS) and automated misconfiguration scanning.
resources:
  - title: "AWS Well-Architected: Security pillar"
    url: https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html
    provider: Amazon Web Services
    type: docs
    cost: free
    official: true
  - title: CIS Benchmarks
    url: https://www.cisecurity.org/cis-benchmarks
    provider: Center for Internet Security
    type: docs
    cost: free
  - title: flAWS challenge
    url: http://flaws.cloud/
    provider: Scott Piper
    type: practice
    cost: free
checked: 2026-10-06
---

## In plain English

Most cloud breaches aren't clever hacks - they're a storage bucket left public, a key committed to GitHub, or a user with far more access than needed. Cloud security is about making those mistakes hard to make and quick to detect.
