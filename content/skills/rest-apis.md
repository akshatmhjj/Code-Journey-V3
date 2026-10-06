---
title: REST APIs
domain: web
level: beginner
hours: 20–30
brief: REST APIs let apps talk to servers over HTTP using URLs, methods and JSON. Almost every app - web, mobile or AI - is built on top of them.
prereqs:
  - how-the-internet-works
learn:
  - topic: Resources and URLs
    detail: "Model things as nouns: /users, /users/42/orders."
  - topic: HTTP methods
    detail: GET reads, POST creates, PUT/PATCH update, DELETE removes.
  - topic: Status codes
    detail: 200 OK, 201 Created, 400 Bad Request, 401/403 auth errors, 404 Not Found, 500 server error.
  - topic: JSON bodies and headers
    detail: Content-Type, Authorization, and consistent response shapes.
  - topic: Validation and errors
    detail: Reject bad input early with clear error messages.
  - topic: Pagination, filtering, sorting
    detail: ?page=2&limit=20&sort=-created - keep responses small and predictable.
  - topic: Versioning and docs
    detail: Change APIs without breaking clients; describe them with OpenAPI.
  - topic: Calling APIs
    detail: fetch, curl and tools like Postman or Bruno.
resources:
  - title: "MDN: HTTP"
    url: https://developer.mozilla.org/en-US/docs/Web/HTTP
    provider: MDN
    type: docs
    cost: free
    official: true
  - title: OpenAPI Specification
    url: https://swagger.io/specification/
    provider: OpenAPI Initiative
    type: docs
    cost: free
    official: true
  - title: Web API design best practices
    url: https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design
    provider: Microsoft
    type: article
    cost: free
  - title: Postman Learning Center
    url: https://learning.postman.com/docs/introduction/overview/
    provider: Postman
    type: docs
    cost: free
checked: 2026-10-06
---

## In plain English

An API is a menu a server offers: "ask me for /products and I'll send a list; send me a new order to /orders and I'll save it." REST is the most common style - plain URLs, standard HTTP methods and JSON.

## A first look

```bash
curl -X POST https://api.example.com/orders \
  -H "Content-Type: application/json" \
  -d '{"productId": 42, "quantity": 2}'
# → 201 Created  {"id": 981, "status": "pending"}
```
