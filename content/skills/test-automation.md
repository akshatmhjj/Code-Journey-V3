---
title: Test Automation
domain: quality
level: intermediate
hours: 25–40
brief: Building and maintaining automated test suites that run on every change - choosing tools, keeping tests fast and stable, and making failures easy to understand.
prereqs:
  - test-design
  - playwright
learn:
  - topic: What to automate
    detail: Repetitive, high-value, stable checks - not everything.
  - topic: The test pyramid in practice
    detail: Balance unit, API and end-to-end tests.
  - topic: Frameworks
    detail: Playwright, Cypress and Selenium - strengths and trade-offs.
  - topic: Flaky tests
    detail: "Find and fix the root causes: timing, shared data, order dependence."
  - topic: Test data and environments
    detail: Seed data, isolated environments and cleanup.
  - topic: CI integration
    detail: Run on pull requests, shard for speed, publish reports.
  - topic: Maintainability
    detail: Readable tests, shared helpers and code review for test code.
resources:
  - title: Selenium documentation
    url: https://www.selenium.dev/documentation/
    provider: Selenium
    type: docs
    cost: free
    official: true
  - title: Cypress documentation
    url: https://docs.cypress.io/
    provider: Cypress
    type: docs
    cost: free
    official: true
  - title: Test Automation University
    url: https://testautomationu.applitools.com/
    provider: Applitools
    type: course
    cost: free
  - title: The Practical Test Pyramid
    url: https://martinfowler.com/articles/practical-test-pyramid.html
    provider: Ham Vocke / martinfowler.com
    type: article
    cost: free
checked: 2026-10-06
---

## In plain English

Automated tests are only useful if people trust them. A suite that's slow or fails randomly gets ignored. Test automation as a skill is about building suites that are fast, stable and clear - so a red build always means something real.
