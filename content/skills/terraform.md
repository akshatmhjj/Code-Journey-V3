---
title: Infrastructure as Code (Terraform)
domain: cloud-devops
level: intermediate
hours: 25–40
brief: Describing servers, networks and databases in code instead of clicking in a console — so infrastructure is reviewable, repeatable and recoverable. Terraform (and OpenTofu) is the most widely used tool.
prereqs:
  - aws
learn:
  - topic: Why infrastructure as code
    detail: Review changes like code, recreate environments, and avoid configuration drift.
  - topic: Providers and resources
    detail: Describe AWS, GCP, Azure or Cloudflare resources in HCL.
  - topic: Plan and apply
    detail: See exactly what will change before it changes.
  - topic: State
    detail: What Terraform remembers, remote state and locking.
  - topic: Variables and outputs
    detail: Reuse code across dev, staging and production.
  - topic: Modules
    detail: Package common patterns (a VPC, a service) for reuse.
  - topic: Workflow
    detail: Running plans in CI and applying through reviewed pull requests.
resources:
  - title: Terraform tutorials
    url: https://developer.hashicorp.com/terraform/tutorials
    provider: HashiCorp
    type: course
    cost: free
    official: true
  - title: Terraform documentation
    url: https://developer.hashicorp.com/terraform/docs
    provider: HashiCorp
    type: docs
    cost: free
    official: true
  - title: OpenTofu documentation
    url: https://opentofu.org/docs/
    provider: OpenTofu
    type: docs
    cost: free
    official: true
  - title: Terraform Best Practices (free book)
    url: https://www.terraform-best-practices.com/
    provider: Anton Babenko
    type: book
    cost: free
checked: 2026-10-06
---

## In plain English

Clicking through a cloud console works once. Six months later, nobody remembers which boxes were ticked. Infrastructure as code writes it all down in files you can review, version and re-run — rebuilding an entire environment becomes one command.
