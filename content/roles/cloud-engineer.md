---
title: Cloud Engineer
aliases: [Cloud Infrastructure Engineer, AWS Engineer, Azure Engineer, Cloud Architect (junior)]
summary: Cloud engineers design, build and run infrastructure on AWS, Azure or Google Cloud - networks, compute, storage, identity and cost - so applications are secure, reliable and affordable.
whereTheyWork: Companies moving to or running in the cloud, consultancies and managed-service providers, banks and enterprises, and cloud providers themselves.
dayInLife:
  - Set up a new environment - network, database and permissions - with infrastructure as code.
  - Help a team move an application from on-premise servers to the cloud.
  - Track down why last month's cloud bill jumped 30%.
  - Tighten permissions after a security review.
  - Plan for a region outage and test the recovery steps.
stages:
  - name: Foundations
    summary: Linux, networking and scripting.
    skills: [linux, networking, command-line, shell-scripting, git, python]
    project: Build a small network of two Linux VMs, host a website behind a reverse proxy with HTTPS, and automate setup with a script.
    doneWhen: You can explain subnets, DNS and firewalls, and debug connectivity from the terminal.
    weeks: 10–14
  - name: Core
    summary: One cloud provider, properly.
    skills: [aws, cloud-security, deployment]
    project: Deploy a three-tier app on AWS (load balancer, app servers, managed database) with least-privilege IAM and a budget alert.
    doneWhen: You can design a secure, highly available setup for a typical web app and estimate its monthly cost.
    weeks: 12–16
  - name: Job-ready
    summary: Infrastructure as code, containers and automation.
    skills: [terraform, docker, kubernetes, ci-cd, observability, ai-coding-tools]
    project: Recreate your setup entirely in Terraform, deployed through a CI pipeline, with monitoring and alerts.
    doneWhen: You can tear down and rebuild your environment with one command.
    weeks: 10–14
  - name: Senior
    summary: Architecture, cost and governance at scale.
    skills: [system-design, incident-response, technical-writing]
    project: Write a migration plan for a legacy app - target architecture, cost estimate, risks and rollback plan.
    doneWhen: You can design multi-account, multi-region setups and defend their cost.
skills:
  must: [aws, linux, networking, terraform, cloud-security, git]
  should: [docker, kubernetes, ci-cd, python, shell-scripting, observability]
  nice: [system-design, incident-response, deployment]
tools: [AWS, Azure or Google Cloud consoles and CLIs, Terraform, Docker, Kubernetes, GitHub Actions, CloudWatch or Azure Monitor, a cost explorer, an AI coding assistant]
interview:
  rounds:
    - Recruiter screen
    - Cloud fundamentals - networking, IAM, storage and compute choices
    - Scenario questions - design or troubleshoot an architecture
    - Hands-on task - Terraform, scripting or a broken environment
    - Behavioural round
  practice:
    - { title: AWS Skill Builder, url: "https://skillbuilder.aws/", provider: Amazon Web Services, type: course, cost: freemium, official: true }
    - { title: Microsoft Learn for Azure, url: "https://learn.microsoft.com/en-us/training/azure/", provider: Microsoft, type: course, cost: free, official: true }
    - { title: Google Cloud Skills Boost, url: "https://www.cloudskillsboost.google/", provider: Google, type: course, cost: freemium, official: true }
    - { title: DevOps Exercises, url: "https://github.com/bregman-arie/devops-exercises", provider: Arie Bregman, type: practice, cost: free }
aiImpact: AI assistants now draft Terraform, IAM policies and architecture diagrams quickly, but mistakes in cloud configuration are expensive and sometimes public. The value is in reviewing that output - security, cost and failure modes - and in designing architectures that fit the business, which AI can't decide on its own.
market:
  - text: AWS, Azure and Google Cloud together host most cloud workloads; AWS appears most often in job posts, with Azure strong in large enterprises.
  - text: Cloud certifications (such as AWS Solutions Architect Associate) are widely requested for these roles and help career changers get interviews.
adjacent: [devops-engineer, site-reliability-engineer, cloud-security-engineer, platform-engineer]
updated: 2026-10-06
---

## Is this role for you?

Cloud engineering suits people who like designing systems and understanding how everything connects - networks, permissions, storage - and who care about doing it securely and affordably.

## Cloud Engineer or DevOps Engineer?

They overlap heavily. Cloud engineers focus more on infrastructure design, security and cost; [DevOps Engineers](/roles/devops-engineer) focus more on pipelines and developer workflows. Many people move between the two.

## Certifications

Unlike most tech roles, cloud certifications carry real weight here. An associate-level certification in your chosen cloud is a sensible goal at the end of the Core stage.
