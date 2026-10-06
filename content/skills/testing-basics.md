---
title: Testing Basics
domain: foundations
level: beginner
hours: 15–25
brief: Writing code that checks your code. Tests catch bugs before users do, let you change things without fear, and document how the code is meant to behave.
prereqs:
  - javascript
learn:
  - topic: Why test
    detail: Fast feedback, safe refactoring and living documentation.
  - topic: Unit tests
    detail: Test one function or module in isolation with clear inputs and expected outputs.
  - topic: Integration tests
    detail: Check that pieces work together — your API with a real database, for example.
  - topic: End-to-end tests
    detail: Drive the real app like a user would; fewer, slower, but high confidence.
  - topic: The test pyramid
    detail: Many fast unit tests, fewer integration tests, a handful of end-to-end tests.
  - topic: Arrange, act, assert
    detail: A simple structure that keeps tests readable.
  - topic: Mocks and fakes
    detail: Replace slow or external dependencies — sparingly.
  - topic: Running tests in CI
    detail: Tests only protect you if they run on every change.
resources:
  - title: Vitest guide
    url: https://vitest.dev/guide/
    provider: Vitest
    type: docs
    cost: free
    official: true
  - title: "pytest: Get started"
    url: https://docs.pytest.org/en/stable/getting-started.html
    provider: pytest
    type: docs
    cost: free
    official: true
  - title: "Jest: Getting started"
    url: https://jestjs.io/docs/getting-started
    provider: Jest
    type: docs
    cost: free
    official: true
  - title: The Practical Test Pyramid
    url: https://martinfowler.com/articles/practical-test-pyramid.html
    provider: Ham Vocke / martinfowler.com
    type: article
    cost: free
checked: 2026-10-06
---

## In plain English

A test is a small program that runs your code and checks the result. If you change something and a test fails, you've found a bug in seconds instead of hearing about it from a user next week.

## A first look

```javascript
import { expect, test } from "vitest";
import { slugify } from "./slugify";

test("turns a title into a URL slug", () => {
  expect(slugify("Hello, World!")).toBe("hello-world");
});
```
