---
title: Site Reliability Engineer
aliases: [SRE, Production Engineer, Reliability Engineer, Infrastructure Engineer]
summary: Site reliability engineers keep production systems fast and available — measuring reliability with SLOs, automating away toil, leading incident response and engineering systems so failures are rare and boring.
whereTheyWork: Large-scale tech companies, SaaS providers, fintech and payments, gaming, streaming, and any company where downtime costs real money.
dayInLife:
  - Review the error budget and decide whether a risky launch can go ahead.
  - Lead the response to an outage, then write a blameless post-mortem.
  - Automate a manual task the on-call team does every week.
  - Load-test a service before a big marketing event.
  - Work with developers to make a service fail gracefully when a dependency is down.
stages:
  - name: Foundations
    summary: Linux, networking, programming and scripting.
    skills: [linux, networking, python, shell-scripting, git, data-structures-algorithms]
    project: Write a Python tool that checks a list of websites, measures response times and alerts you when one is slow or down.
    doneWhen: You can debug a slow or failing service from the command line and write solid automation in Python.
    weeks: 12–16
  - name: Core
    summary: Running services — containers, cloud and observability.
    skills: [docker, kubernetes, aws, observability, ci-cd]
    project: Run a small service on Kubernetes with metrics, logs, traces, a dashboard and SLO-based alerts.
    doneWhen: You can tell from your dashboards whether users are having a good experience — and get alerted when they aren't.
    weeks: 12–16
  - name: Job-ready
    summary: Incidents, capacity and automation.
    skills: [incident-response, terraform, performance-testing, caching, ai-coding-tools]
    project: Break your service on purpose (chaos test), respond using a runbook, and write a blameless post-mortem with action items.
    doneWhen: You've been on call for something real and improved it afterwards.
    weeks: 10–14
  - name: Senior
    summary: Reliability by design across many systems.
    skills: [system-design, message-queues, technical-writing]
    project: Write a reliability review of a system — failure modes, SLOs, capacity plan and the three highest-value fixes.
    doneWhen: Teams design for reliability from the start because of the practices you set.
skills:
  must: [linux, networking, python, observability, kubernetes, incident-response]
  should: [docker, aws, terraform, ci-cd, shell-scripting, data-structures-algorithms]
  nice: [system-design, performance-testing, caching, message-queues]
tools: [Linux, Python or Go, Kubernetes, Prometheus and Grafana, OpenTelemetry, a paging tool (PagerDuty or Opsgenie), Terraform, a cloud provider, an AI coding assistant]
interview:
  rounds:
    - Recruiter screen
    - Coding — practical scripting and some algorithms
    - Linux and networking troubleshooting
    - Non-abstract large system design — design for reliability and scale with real numbers
    - Incident scenario and behavioural round
  practice:
    - { title: Google SRE books (free online), url: "https://sre.google/books/", provider: Google, type: book, cost: free, official: true }
    - { title: DevOps Exercises, url: "https://github.com/bregman-arie/devops-exercises", provider: Arie Bregman, type: practice, cost: free }
    - { title: Killercoda (interactive labs), url: "https://killercoda.com/", provider: Killercoda, type: interactive, cost: free }
    - { title: System Design Primer, url: "https://github.com/donnemartin/system-design-primer", provider: Donne Martin, type: docs, cost: free }
aiImpact: AI is starting to help with incident triage — summarising alerts, searching logs and suggesting likely causes. That speeds up response but doesn't replace judgement under pressure, deep systems knowledge or the engineering work that prevents incidents. SREs are also increasingly responsible for the reliability and cost of AI services themselves.
market:
  - text: SRE practices from Google's SRE books — SLOs, error budgets and blameless post-mortems — are now widely adopted beyond Google.
    source: { title: Google SRE books, url: "https://sre.google/books/" }
  - text: Most SRE roles expect strong Linux, Kubernetes and a programming language, with on-call experience valued highly.
adjacent: [devops-engineer, cloud-engineer, platform-engineer, backend-engineer]
updated: 2026-10-06
---

## Is this role for you?

SRE suits people who stay calm when things break, love understanding *why* systems fail, and prefer fixing the cause over patching the symptom. It's a software engineering role applied to operations — you'll write real code.

## Getting in

SRE is rarely a first job. Common routes are from [DevOps](/roles/devops-engineer), [Backend](/roles/backend-engineer) or systems administration. Expect to be on call; good teams make that sustainable.
