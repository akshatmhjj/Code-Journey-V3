---
title: System Design
domain: foundations
level: advanced
hours: 60–120
brief: How to design software that serves many users reliably - splitting work across services, databases, caches and queues, and choosing trade-offs you can defend.
prereqs:
  - rest-apis
  - sql
learn:
  - topic: Requirements first
    detail: Clarify users, scale, read/write ratio and what 'fast enough' means before drawing boxes.
  - topic: Scaling basics
    detail: Vertical vs horizontal scaling, load balancers and stateless services.
  - topic: Databases
    detail: SQL vs NoSQL, indexes, replication, sharding and when you actually need them.
  - topic: Caching
    detail: What to cache, where (CDN, application, database) and how to keep it fresh.
  - topic: Asynchronous work
    detail: Queues and events for slow jobs like email, video processing and notifications.
  - topic: Consistency and availability
    detail: CAP in practice, idempotency, retries and what happens when a service is down.
  - topic: Observability
    detail: Logs, metrics and traces so you know when the design is failing.
  - topic: Estimation
    detail: Back-of-the-envelope maths for traffic, storage and bandwidth.
resources:
  - title: Google SRE books (free online)
    url: https://sre.google/books/
    provider: Google
    type: docs
    cost: free
    official: true
  - title: System Design Primer
    url: https://github.com/donnemartin/system-design-primer
    provider: Donne Martin
    type: docs
    cost: free
  - title: Designing Data-Intensive Applications (book)
    url: https://dataintensive.net/
    provider: Martin Kleppmann
    type: book
    cost: paid
  - title: ByteByteGo
    url: https://bytebytego.com/
    provider: Alex Xu
    type: course
    cost: freemium
checked: 2026-10-06
---

## In plain English

Building something that works for 10 users is mostly coding. Making it work for 10 million - without falling over, losing data or costing a fortune - is system design. It's about knowing the building blocks (databases, caches, queues, load balancers) and the trade-offs between them.

## Why it matters

System design interviews decide mid-level and senior offers at most companies. More importantly, it's the difference between engineers who build features and engineers who are trusted with architecture.

## How to practise

Pick a familiar product (a URL shortener, a chat app, a news feed), design it in 45 minutes out loud, then compare with a published design. Focus on explaining *why*, not drawing more boxes.
