---
title: Incident Response & On-call
domain: cloud-devops
level: intermediate
hours: 15–25
brief: What to do when production breaks - detecting it, coordinating a calm response, restoring service fast, and learning from it with blameless post-mortems.
prereqs:
  - observability
learn:
  - topic: Detection
    detail: Alerts on user-facing symptoms, so you hear about problems before customers do.
  - topic: Severity levels
    detail: Agree in advance what counts as SEV1 vs SEV3 and who gets paged.
  - topic: Roles
    detail: Incident commander, communications lead and responders.
  - topic: Mitigate first
    detail: Roll back, fail over or switch off a feature - find the root cause later.
  - topic: Communication
    detail: Status updates for users and stakeholders on a regular rhythm.
  - topic: Runbooks
    detail: Step-by-step guides for known failures.
  - topic: Blameless post-mortems
    detail: Timeline, contributing factors and action items - without blaming people.
  - topic: Sustainable on-call
    detail: Rotations, handovers and reducing noisy alerts.
resources:
  - title: "Google SRE book: Managing Incidents"
    url: https://sre.google/sre-book/managing-incidents/
    provider: Google
    type: book
    cost: free
    official: true
  - title: "Google SRE book: Postmortem Culture"
    url: https://sre.google/sre-book/postmortem-culture/
    provider: Google
    type: book
    cost: free
    official: true
  - title: PagerDuty Incident Response guide
    url: https://response.pagerduty.com/
    provider: PagerDuty
    type: docs
    cost: free
  - title: Atlassian Incident Management handbook
    url: https://www.atlassian.com/incident-management
    provider: Atlassian
    type: docs
    cost: free
checked: 2026-10-06
---

## In plain English

Every system eventually breaks. Teams that handle it well aren't the ones that never fail - they're the ones with a calm, practised routine: one person in charge, clear updates, fix the bleeding first, then learn from it without blame.
