---
title: CI/CD
domain: cloud-devops
level: intermediate
hours: 15–25
brief: "Continuous integration and delivery: every change is automatically built, tested and deployed through a pipeline, so releases are frequent, small and boring."
prereqs:
  - git
learn:
  - topic: Continuous integration
    detail: Every push runs lint, type checks and tests automatically.
  - topic: Pipelines as code
    detail: YAML workflows in GitHub Actions or GitLab CI, versioned with the app.
  - topic: Build artefacts
    detail: Build once, deploy the same artefact everywhere.
  - topic: Environments
    detail: Preview, staging and production — and promotion between them.
  - topic: Secrets in CI
    detail: Store credentials safely; never echo them in logs.
  - topic: Speed
    detail: Caching dependencies and running jobs in parallel.
  - topic: Deployment strategies
    detail: Rolling, blue-green and canary releases, plus rollbacks.
resources:
  - title: GitHub Actions documentation
    url: https://docs.github.com/en/actions
    provider: GitHub
    type: docs
    cost: free
    official: true
  - title: GitLab CI/CD
    url: https://docs.gitlab.com/ci/
    provider: GitLab
    type: docs
    cost: free
    official: true
  - title: Continuous Integration
    url: https://martinfowler.com/articles/continuousIntegration.html
    provider: Martin Fowler
    type: article
    cost: free
checked: 2026-10-06
---

## In plain English

Instead of someone manually running tests and copying files to a server, a pipeline does it on every change. If a test fails, the change doesn't ship. Teams with good CI/CD deploy many times a day with less stress, not more.

## A first look

```yaml
# .github/workflows/ci.yml
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci && npm test
```
