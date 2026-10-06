---
title: Test Design & Strategy
domain: quality
level: beginner
hours: 15–25
brief: Deciding what to test and how - finding the cases most likely to break, choosing the right level of test, and writing bug reports people can act on.
prereqs:
  - testing-basics
learn:
  - topic: Requirements to tests
    detail: Turn acceptance criteria into concrete test cases.
  - topic: Equivalence partitioning
    detail: Group inputs that behave the same; test one from each group.
  - topic: Boundary values
    detail: "Bugs cluster at edges: 0, 1, max, max+1."
  - topic: Negative and edge cases
    detail: Empty, too long, wrong type, duplicate, concurrent.
  - topic: Exploratory testing
    detail: Structured, time-boxed exploration guided by risk.
  - topic: Risk-based priorities
    detail: Test what matters most to users and the business first.
  - topic: Bug reports
    detail: Steps to reproduce, expected vs actual, environment and evidence.
  - topic: Test strategy
    detail: What to automate, at which level, and what to monitor in production.
resources:
  - title: ISTQB Certified Tester Foundation Level syllabus
    url: https://www.istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/
    provider: ISTQB
    type: docs
    cost: free
    official: true
  - title: Ministry of Testing
    url: https://www.ministryoftesting.com/
    provider: Ministry of Testing
    type: community
    cost: freemium
  - title: Test Pyramid
    url: https://martinfowler.com/bliki/TestPyramid.html
    provider: Martin Fowler
    type: article
    cost: free
checked: 2026-10-06
---

## In plain English

You can't test everything, so testing is a series of smart choices. Test design is the thinking that comes before writing tests: which inputs are risky, which paths matter, and how to cover the most ground with the fewest cases.
