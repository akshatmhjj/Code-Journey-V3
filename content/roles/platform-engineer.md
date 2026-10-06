---
title: Platform Engineer
aliases: [Developer Platform Engineer, Infrastructure Engineer, Internal Tools Engineer, DevEx Engineer]
summary: Platform engineers build the internal platform other engineers ship on - golden paths for creating, deploying and running services - so product teams move fast without each reinventing infrastructure.
whereTheyWork: Mid-size and large tech companies with many engineering teams, SaaS providers, banks modernising their engineering, and developer-tool companies.
dayInLife:
  - Build a template that creates a new service with CI, monitoring and deploys already wired up.
  - Run a survey to find what slows developers down most.
  - Upgrade the shared Kubernetes platform without disrupting a hundred services.
  - Write a CLI tool that replaces a ten-step manual process.
  - Document a golden path and help a team adopt it.
stages:
  - name: Foundations
    summary: Linux, networking and a systems language.
    skills: [linux, networking, command-line, git, go]
    project: Write a small CLI tool in Go that automates something you do often, with tests and a release build.
    doneWhen: You can write and ship a reliable command-line tool, and debug systems from the terminal.
    weeks: 12–16
  - name: Core
    summary: Containers, orchestration and infrastructure as code.
    skills: [docker, kubernetes, terraform, ci-cd, aws]
    project: A Kubernetes cluster provisioned with Terraform, with a CI/CD pipeline that deploys a sample service on every merge.
    doneWhen: You can provision, deploy and upgrade a containerised platform from code alone.
    weeks: 12–16
  - name: Job-ready
    summary: Building a product for developers.
    skills: [internal-developer-platforms, observability, cloud-security, technical-writing, ai-coding-tools]
    project: A self-service golden path - one command creates a new service with CI, deploys, dashboards and docs.
    doneWhen: Someone else can create and deploy a production-ready service using only your docs.
    weeks: 12–16
  - name: Senior
    summary: Platform strategy, reliability and adoption.
    skills: [system-design, incident-response, message-queues]
    project: Write a platform roadmap based on developer feedback, with adoption and reliability metrics.
    doneWhen: Teams choose your platform because it's genuinely the easiest way to ship.
skills:
  must: [kubernetes, terraform, ci-cd, docker, linux, go]
  should: [internal-developer-platforms, observability, aws, networking, cloud-security]
  nice: [system-design, incident-response, technical-writing, python]
tools: [Kubernetes, Terraform, Go, GitHub Actions or Argo CD, Backstage, Helm, Prometheus and Grafana, a cloud provider, an AI coding assistant]
interview:
  rounds:
    - Recruiter screen
    - Coding - often in Go or Python
    - Kubernetes, infrastructure and troubleshooting questions
    - Platform design - e.g. design a self-service deployment system
    - Behavioural round on working with internal "customers"
  practice:
    - { title: Platform Engineering resources, url: "https://platformengineering.org/blog", provider: PlatformEngineering.org, type: community, cost: free }
    - { title: Killercoda (interactive labs), url: "https://killercoda.com/", provider: Killercoda, type: interactive, cost: free }
    - { title: DevOps Exercises, url: "https://github.com/bregman-arie/devops-exercises", provider: Arie Bregman, type: practice, cost: free }
aiImpact: AI coding assistants change what developers need from a platform - fast, safe environments to run and verify generated code, and guardrails on what can reach production. Platform teams increasingly provide AI tooling, model access and evaluation infrastructure as part of the internal platform.
market:
  - text: Platform engineering grew out of DevOps as companies scaled; many DevOps roles have been renamed or reorganised into platform teams.
  - text: Kubernetes, Terraform, a CI/CD system and a programming language (often Go or Python) are the most common requirements.
adjacent: [devops-engineer, site-reliability-engineer, cloud-engineer, backend-engineer]
updated: 2026-10-06
---

## Is this role for you?

Platform engineering suits people who like building tools for other engineers and thinking about developer experience. Your users are your colleagues - listening to them is as important as the infrastructure.

## Platform vs DevOps vs SRE

[DevOps Engineers](/roles/devops-engineer) automate delivery, [SREs](/roles/site-reliability-engineer) own reliability, and platform engineers turn both into a self-service product for every team. In practice, the roles overlap a lot.
