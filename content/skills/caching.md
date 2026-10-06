---
title: Caching (Redis)
domain: web
level: intermediate
hours: 15–25
brief: Caching keeps a copy of expensive results close at hand so they can be served instantly. Redis is the most widely used in-memory cache and data store.
prereqs:
  - rest-apis
learn:
  - topic: Why cache
    detail: Cut response times and database load for data that's read far more than written.
  - topic: Where to cache
    detail: Browser, CDN, application memory, Redis, and the database itself.
  - topic: Cache-aside
    detail: Check the cache, fall back to the database, store the result.
  - topic: Expiry and invalidation
    detail: TTLs, and clearing stale data when the source changes.
  - topic: HTTP caching
    detail: Cache-Control, ETags and what CDNs do with them.
  - topic: Redis beyond caching
    detail: Rate limiting, sessions, queues, leaderboards and pub/sub.
  - topic: Pitfalls
    detail: Stale data, cache stampedes and caching per-user data by mistake.
resources:
  - title: Redis documentation
    url: https://redis.io/docs/latest/
    provider: Redis
    type: docs
    cost: free
    official: true
  - title: Redis learning hub
    url: https://redis.io/learn
    provider: Redis
    type: course
    cost: free
    official: true
  - title: "MDN: HTTP caching"
    url: https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching
    provider: MDN
    type: docs
    cost: free
    official: true
checked: 2026-10-06
---

## In plain English

If a thousand people ask for today's top products, there's no need to calculate the list a thousand times. Calculate it once, keep it in fast memory for a few minutes, and hand out copies. That's caching — and deciding when the copy is too old is the hard part.
