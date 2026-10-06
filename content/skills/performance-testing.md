---
title: Performance Testing
domain: quality
level: intermediate
hours: 15–25
brief: Load and stress testing - simulating many users to find how much traffic a system handles, where it slows down and how it fails.
prereqs:
  - api-testing
learn:
  - topic: Types of tests
    detail: Load, stress, spike and soak tests - and what each answers.
  - topic: Realistic scenarios
    detail: Model real user journeys and traffic patterns.
  - topic: Metrics
    detail: Throughput, latency percentiles (p95, p99) and error rate.
  - topic: Thresholds
    detail: Pass/fail criteria tied to real requirements.
  - topic: Finding bottlenecks
    detail: Correlate load with CPU, memory, database and logs.
  - topic: Tools
    detail: k6, JMeter and Locust.
  - topic: Testing safely
    detail: Never load-test production without permission and a plan.
resources:
  - title: Grafana k6 documentation
    url: https://grafana.com/docs/k6/latest/
    provider: Grafana Labs
    type: docs
    cost: free
    official: true
  - title: Apache JMeter user manual
    url: https://jmeter.apache.org/usermanual/index.html
    provider: Apache
    type: docs
    cost: free
    official: true
  - title: Locust documentation
    url: https://docs.locust.io/en/stable/
    provider: Locust
    type: docs
    cost: free
    official: true
checked: 2026-10-06
---

## In plain English

An app that's fast for one tester might collapse when 10,000 people arrive after a marketing email. Performance testing finds that breaking point - in a test environment, before your customers do.
