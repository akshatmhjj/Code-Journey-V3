---
title: Observability
domain: cloud-devops
level: intermediate
hours: 20–30
brief: Logs, metrics and traces that let you understand what a system is doing in production - so you notice problems before users do and find the cause quickly.
prereqs:
  - rest-apis
learn:
  - topic: The three signals
    detail: Logs (events), metrics (numbers over time) and traces (a request's journey).
  - topic: Structured logging
    detail: JSON logs with request IDs you can search and correlate.
  - topic: Metrics that matter
    detail: Latency, traffic, errors and saturation - the four golden signals.
  - topic: Distributed tracing
    detail: Follow one request across services with OpenTelemetry.
  - topic: Dashboards
    detail: Grafana or a hosted tool showing health at a glance.
  - topic: Alerting
    detail: Alert on user-facing symptoms, not every blip; avoid alert fatigue.
  - topic: SLOs and error budgets
    detail: Define 'reliable enough' and measure against it.
  - topic: Error tracking
    detail: Tools like Sentry for exceptions with full context.
resources:
  - title: OpenTelemetry documentation
    url: https://opentelemetry.io/docs/
    provider: OpenTelemetry
    type: docs
    cost: free
    official: true
  - title: Prometheus overview
    url: https://prometheus.io/docs/introduction/overview/
    provider: Prometheus
    type: docs
    cost: free
    official: true
  - title: Grafana documentation
    url: https://grafana.com/docs/grafana/latest/
    provider: Grafana Labs
    type: docs
    cost: free
    official: true
  - title: "Google SRE book: Monitoring Distributed Systems"
    url: https://sre.google/sre-book/monitoring-distributed-systems/
    provider: Google
    type: book
    cost: free
checked: 2026-10-06
---

## In plain English

Once software is live, you can't attach a debugger to it. Observability is the set of instruments - logs, graphs and traces - that tell you what's happening inside, the way a dashboard tells a pilot about an engine.
