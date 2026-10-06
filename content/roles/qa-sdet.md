---
title: QA Engineer / SDET
aliases: [Software Development Engineer in Test, Test Automation Engineer, QA Automation Engineer, Software Tester]
summary: QA engineers and SDETs make sure software works before users find out it doesn't — designing what to test, automating those tests, and building the tooling that lets teams release with confidence.
whereTheyWork: Product companies, banks and insurers, healthcare and regulated industries, e-commerce, gaming, and IT services firms.
dayInLife:
  - Read a new feature's requirements and work out the cases most likely to break.
  - Write automated end-to-end tests for a checkout flow.
  - Investigate a flaky test that fails one run in ten.
  - Test an API directly to check errors and edge cases.
  - Sign off a release — or explain clearly why it shouldn't go out yet.
stages:
  - name: Foundations
    summary: How software is built and how testing fits in, plus one language.
    skills: [testing-basics, test-design, how-the-internet-works, javascript, git]
    project: Write a test plan and 30 test cases for a real website (e.g. a store's checkout), and file well-written bug reports.
    doneWhen: You can design boundary, negative and edge cases for any form and explain why each matters.
    weeks: 8–12
  - name: Core
    summary: Automating tests for web apps and APIs.
    skills: [playwright, api-testing, sql, command-line]
    project: An automated suite for a demo site — UI tests with Playwright and API tests — running locally with a readable report.
    doneWhen: Your tests are stable, readable and fail with messages that point to the problem.
    weeks: 10–14
  - name: Job-ready
    summary: Tests in pipelines, at scale, across browsers.
    skills: [test-automation, ci-cd, performance-testing, accessibility, ai-coding-tools]
    project: Run your suite in GitHub Actions on every pull request, across browsers, with a load test for one key endpoint.
    doneWhen: A failing test blocks a bad merge automatically, and you can say how much traffic the app handles.
    weeks: 8–12
  - name: Senior
    summary: Owning quality strategy across teams.
    skills: [docker, observability, technical-writing, system-design]
    project: Write a test strategy for a product — what to automate, at which level, and what to monitor in production.
    doneWhen: Teams ask you how to test something before they build it.
skills:
  must: [testing-basics, test-design, playwright, api-testing, javascript, git]
  should: [test-automation, ci-cd, sql, performance-testing, accessibility]
  nice: [python, docker, observability, ai-coding-tools]
tools: [Playwright (or Cypress/Selenium), Postman or Bruno, Git and GitHub, GitHub Actions, browser DevTools, k6 or JMeter, Jira or Linear, an AI coding assistant]
interview:
  rounds:
    - Recruiter screen
    - Test design — "how would you test this login page / lift / API?"
    - Coding — automation code and some easy algorithm problems for SDET roles
    - Practical — write or fix automated tests
    - Behavioural round on handling bugs and release pressure
  practice:
    - { title: Test Automation University, url: "https://testautomationu.applitools.com/", provider: Applitools, type: course, cost: free }
    - { title: Ministry of Testing, url: "https://www.ministryoftesting.com/", provider: Ministry of Testing, type: community, cost: freemium }
    - { title: Playwright best practices, url: "https://playwright.dev/docs/best-practices", provider: Microsoft, type: docs, cost: free, official: true }
    - { title: LeetCode, url: "https://leetcode.com/", provider: LeetCode, type: practice, cost: freemium }
aiImpact: AI tools can now generate test cases and automation code quickly, which shifts value from writing scripts to deciding what's worth testing, building reliable test infrastructure, and testing AI features themselves — where outputs vary and "correct" is harder to define. Testers with strong automation and engineering skills are in a much better position than purely manual testers.
market:
  - text: Postings increasingly ask for automation and coding skills (SDET) rather than manual testing alone; Playwright has become a leading choice for new web automation.
  - text: Regulated industries — banking, healthcare, insurance — continue to hire dedicated QA teams.
adjacent: [frontend-engineer, backend-engineer, devops-engineer]
updated: 2026-10-06
---

## Is this role for you?

Quality engineering suits people who naturally ask "what if?", notice small inconsistencies, and get satisfaction from catching a problem before customers do. Communication matters a lot: a clear bug report saves hours.

## Manual testing vs SDET

Manual testing is a common way in, but on its own it's a shrinking market. Aim to automate early — an SDET is a software engineer whose product is test infrastructure, and it opens routes into development and DevOps later.
