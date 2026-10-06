---
title: Web Performance
domain: web
level: intermediate
hours: 20–30
brief: Making pages load fast and respond instantly - especially on mid-range phones and slow networks - measured with Core Web Vitals.
prereqs:
  - javascript
learn:
  - topic: Core Web Vitals
    detail: LCP (loading), INP (responsiveness) and CLS (visual stability) - what they measure and good targets.
  - topic: Measuring
    detail: Lighthouse, Chrome DevTools Performance panel and real-user data.
  - topic: JavaScript cost
    detail: "Ship less JS: code splitting, lazy loading and server rendering."
  - topic: Images and fonts
    detail: Modern formats, correct sizes, lazy loading and font-display.
  - topic: Caching and CDNs
    detail: Cache headers and serving from near the user.
  - topic: Rendering
    detail: Avoid layout thrashing and long tasks that block input.
  - topic: Budgets
    detail: Set a performance budget and check it in CI.
resources:
  - title: Learn Performance
    url: https://web.dev/learn/performance
    provider: web.dev
    type: course
    cost: free
    official: true
  - title: Web Vitals
    url: https://web.dev/articles/vitals
    provider: web.dev
    type: docs
    cost: free
    official: true
  - title: Lighthouse overview
    url: https://developer.chrome.com/docs/lighthouse/overview
    provider: Chrome
    type: docs
    cost: free
    official: true
  - title: "MDN: Web performance"
    url: https://developer.mozilla.org/en-US/docs/Web/Performance
    provider: MDN
    type: docs
    cost: free
    official: true
checked: 2026-10-06
---

## In plain English

Every extra second of loading loses users. Web performance is about sending less, sending it sooner and doing less work in the browser - so pages feel instant even on a cheap phone on a train.

## Why it matters

Speed affects conversion and search ranking, and "the page is slow" is one of the most common problems frontend engineers are asked to fix.
