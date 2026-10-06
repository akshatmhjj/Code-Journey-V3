---
title: API Testing
domain: quality
level: intermediate
hours: 15–25
brief: Testing APIs directly - status codes, response shapes, errors, auth and edge cases - which is faster and more stable than testing everything through the UI.
prereqs:
  - rest-apis
  - testing-basics
learn:
  - topic: Why test APIs
    detail: Most business logic lives behind the API; tests here are fast and stable.
  - topic: Happy paths
    detail: Correct status, headers and body for valid requests.
  - topic: Errors and validation
    detail: Missing fields, wrong types and helpful error messages.
  - topic: Auth and permissions
    detail: No token, expired token, wrong user.
  - topic: Contracts and schemas
    detail: Validate responses against an OpenAPI or JSON schema.
  - topic: Test data
    detail: Create and clean up data so tests don't depend on each other.
  - topic: Automating it
    detail: Postman/Bruno collections, or code with Playwright, pytest or REST Assured.
resources:
  - title: "Playwright: API testing"
    url: https://playwright.dev/docs/api-testing
    provider: Microsoft
    type: docs
    cost: free
    official: true
  - title: OpenAPI Specification
    url: https://swagger.io/specification/
    provider: OpenAPI Initiative
    type: docs
    cost: free
    official: true
  - title: Postman Learning Center
    url: https://learning.postman.com/docs/introduction/overview/
    provider: Postman
    type: docs
    cost: free
  - title: REST Assured
    url: https://rest-assured.io/
    provider: REST Assured
    type: tool
    cost: free
checked: 2026-10-06
---

## In plain English

Instead of clicking through a sign-up form to check the server rejects a bad email, send the request straight to the API and check the response. API tests run in milliseconds and catch problems before any UI exists.
