---
title: Frontend Testing
domain: web
level: intermediate
hours: 20–30
brief: Testing user interfaces the way people use them — components with Testing Library, and full flows in a real browser with Playwright.
prereqs:
  - react
  - testing-basics
learn:
  - topic: What to test
    detail: Behaviour users see, not implementation details.
  - topic: Component tests
    detail: Render a component, interact with it, check the result — with Testing Library.
  - topic: Queries that mirror users
    detail: getByRole and getByLabelText before test IDs.
  - topic: Mocking network calls
    detail: Test loading, success and error states without a real server (e.g. MSW).
  - topic: End-to-end tests
    detail: Playwright drives a real browser through sign-up or checkout.
  - topic: Visual and accessibility checks
    detail: Catch layout regressions and a11y issues automatically.
  - topic: Fast and stable
    detail: Avoid flaky waits; run tests in CI on every pull request.
resources:
  - title: Testing Library docs
    url: https://testing-library.com/docs/
    provider: Testing Library
    type: docs
    cost: free
    official: true
  - title: Vitest guide
    url: https://vitest.dev/guide/
    provider: Vitest
    type: docs
    cost: free
    official: true
  - title: "Playwright: Getting started"
    url: https://playwright.dev/docs/intro
    provider: Microsoft
    type: docs
    cost: free
    official: true
  - title: Mock Service Worker
    url: https://mswjs.io/docs/
    provider: MSW
    type: docs
    cost: free
checked: 2026-10-06
---

## In plain English

A good UI test does what a user would: types into the field labelled "Email", clicks "Sign up", and checks that "Welcome!" appears. If the test only passes when the app really works, you can refactor freely.
