---
title: Playwright
domain: quality
level: intermediate
hours: 15–25
brief: Playwright automates real browsers — Chromium, Firefox and WebKit — for reliable end-to-end tests, with auto-waiting, tracing and parallel runs built in.
prereqs:
  - javascript
  - testing-basics
learn:
  - topic: Setup and first test
    detail: npm init playwright, then a test that visits a page and checks it.
  - topic: Locators
    detail: getByRole, getByLabel and getByText — resilient, user-facing selectors.
  - topic: Auto-waiting and assertions
    detail: expect(...).toBeVisible() instead of sleeps.
  - topic: Fixtures and setup
    detail: Reuse login state and test data.
  - topic: Network control
    detail: Mock or intercept API calls for stable tests.
  - topic: Debugging
    detail: UI mode, trace viewer, screenshots and videos.
  - topic: Cross-browser and parallel
    detail: Run across browsers and shards in CI.
  - topic: Page objects (sparingly)
    detail: Organise large suites without hiding what tests do.
resources:
  - title: "Playwright: Getting started"
    url: https://playwright.dev/docs/intro
    provider: Microsoft
    type: docs
    cost: free
    official: true
  - title: Playwright best practices
    url: https://playwright.dev/docs/best-practices
    provider: Microsoft
    type: docs
    cost: free
    official: true
  - title: Playwright for Python
    url: https://playwright.dev/python/docs/intro
    provider: Microsoft
    type: docs
    cost: free
    official: true
  - title: Build with Playwright (Microsoft Learn)
    url: https://learn.microsoft.com/en-us/training/modules/build-with-playwright/
    provider: Microsoft
    type: course
    cost: free
checked: 2026-10-06
---

## A first look

```typescript
import { test, expect } from "@playwright/test";

test("visitor can find a role", async ({ page }) => {
  await page.goto("https://www.codejourney.space/roles");
  await page.getByRole("link", { name: /Frontend Engineer/ }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Frontend Engineer");
});
```
