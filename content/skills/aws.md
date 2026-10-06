---
title: AWS
domain: cloud-devops
level: intermediate
hours: 40–70
brief: Amazon Web Services is the largest cloud platform. Learn the core building blocks - compute, storage, databases, networking and identity - and how to run apps on them safely and affordably.
prereqs:
  - linux
  - networking
learn:
  - topic: Accounts, regions and IAM
    detail: Users, roles and policies - least privilege from day one.
  - topic: Compute
    detail: EC2 virtual machines, Lambda functions and container services (ECS, EKS).
  - topic: Storage
    detail: S3 for files, EBS for disks, and lifecycle rules to control cost.
  - topic: Databases
    detail: RDS for PostgreSQL/MySQL and DynamoDB for key-value data.
  - topic: Networking
    detail: VPCs, subnets, security groups, load balancers and Route 53.
  - topic: Monitoring
    detail: CloudWatch metrics, logs and alarms.
  - topic: Cost control
    detail: Budgets, alerts and turning things off.
  - topic: Well-Architected
    detail: AWS's own checklist for reliable, secure, efficient systems.
resources:
  - title: AWS Skill Builder
    url: https://skillbuilder.aws/
    provider: Amazon Web Services
    type: course
    cost: free
    official: true
  - title: Getting started with AWS
    url: https://aws.amazon.com/getting-started/
    provider: Amazon Web Services
    type: docs
    cost: free
    official: true
  - title: AWS Well-Architected Framework
    url: https://aws.amazon.com/architecture/well-architected/
    provider: Amazon Web Services
    type: docs
    cost: free
    official: true
  - title: The Open Guide to AWS
    url: https://github.com/open-guides/og-aws
    provider: Open Guides
    type: docs
    cost: free
checked: 2026-10-06
---

## In plain English

Instead of buying servers, companies rent them from cloud providers by the hour. AWS offers hundreds of services, but most apps use the same dozen: virtual machines, storage, a database, a network and permissions.

## Which cloud?

AWS has the largest market share; Azure is strong in enterprises and GCP in data and AI. Concepts transfer well - learn one properly, then the others are mostly new names.

## Watch your bill

Set a budget alert on day one. Forgotten resources are the most common surprise for learners.
