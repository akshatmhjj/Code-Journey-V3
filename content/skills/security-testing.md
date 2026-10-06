---
title: Security Testing (SAST, DAST, Pentesting)
domain: security
level: intermediate
hours: 30–50
brief: Finding vulnerabilities before attackers do — with automated scanners in the pipeline and hands-on testing of running applications.
prereqs:
  - web-security
learn:
  - topic: SAST
    detail: Static analysis scans source code for risky patterns (Semgrep, CodeQL).
  - topic: Dependency and secret scanning
    detail: Catch vulnerable packages and leaked keys automatically.
  - topic: DAST
    detail: Dynamic scanning probes a running app from the outside (OWASP ZAP).
  - topic: Manual testing with a proxy
    detail: Intercept and modify requests with Burp Suite to test logic flaws.
  - topic: Triage
    detail: Separate real, exploitable issues from false positives.
  - topic: Reporting
    detail: Clear reproduction steps, impact and a recommended fix.
  - topic: Rules of engagement
    detail: Only test with written permission; respect scope.
resources:
  - title: OWASP Web Security Testing Guide
    url: https://owasp.org/www-project-web-security-testing-guide/
    provider: OWASP
    type: docs
    cost: free
    official: true
  - title: OWASP ZAP
    url: https://www.zaproxy.org/docs/
    provider: ZAP
    type: docs
    cost: free
    official: true
  - title: Semgrep documentation
    url: https://semgrep.dev/docs/
    provider: Semgrep
    type: docs
    cost: free
    official: true
  - title: CodeQL documentation
    url: https://codeql.github.com/docs/
    provider: GitHub
    type: docs
    cost: free
    official: true
  - title: PortSwigger Web Security Academy
    url: https://portswigger.net/web-security
    provider: PortSwigger
    type: interactive
    cost: free
checked: 2026-10-06
---

## In plain English

Automated scanners catch common mistakes on every commit; human testers catch the clever ones — a checkout that lets you set your own price, an API that shows other people's orders. Good security testing combines both.

## Stay legal

Only test applications you own or have explicit written permission to test. Practise on deliberately vulnerable apps and in bug bounty programmes.
