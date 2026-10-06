---
title: Web Security Basics
domain: web
level: intermediate
hours: 20–30
brief: The common ways web apps get attacked - injection, cross-site scripting, broken access control and more - and the habits that prevent them.
prereqs:
  - rest-apis
learn:
  - topic: The OWASP Top 10
    detail: The industry's list of the most critical web application risks.
  - topic: Injection
    detail: SQL and command injection - always use parameterised queries.
  - topic: Cross-site scripting (XSS)
    detail: Escape output and use a Content Security Policy.
  - topic: Broken access control
    detail: Check permissions server-side on every request.
  - topic: CSRF and cookies
    detail: SameSite cookies and CSRF tokens for state-changing requests.
  - topic: Secrets management
    detail: Keep keys out of code and out of the browser bundle.
  - topic: Dependencies
    detail: Keep packages updated and watch for known vulnerabilities.
  - topic: HTTPS and security headers
    detail: HSTS, CSP, X-Content-Type-Options and friends.
resources:
  - title: OWASP Top 10
    url: https://owasp.org/www-project-top-ten/
    provider: OWASP
    type: docs
    cost: free
    official: true
  - title: OWASP Cheat Sheet Series
    url: https://cheatsheetseries.owasp.org/
    provider: OWASP
    type: docs
    cost: free
    official: true
  - title: "MDN: Web security"
    url: https://developer.mozilla.org/en-US/docs/Web/Security
    provider: MDN
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

Attackers look for places where your app trusts input it shouldn't - a search box that runs SQL, a comment that runs JavaScript, an API that forgets to check who's asking. Web security is the habit of treating every input as hostile and every secret as precious.

## Why it matters

Security mistakes are among the most expensive bugs a team can ship. Knowing the OWASP Top 10 is expected for backend and full-stack roles, and it's a fast way to stand out in reviews.
