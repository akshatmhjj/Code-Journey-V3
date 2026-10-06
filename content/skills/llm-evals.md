---
title: LLM Evaluation
domain: ai
level: intermediate
hours: 15–25
brief: Measuring whether an LLM feature actually works — building test sets, scoring outputs with code, people and other models, and catching regressions before users do.
prereqs:
  - llm-apis
learn:
  - topic: Why evals
    detail: Without measurement, every prompt change is a guess.
  - topic: Look at your data
    detail: Read real outputs and categorise failures before writing metrics.
  - topic: Test sets
    detail: Representative examples, edge cases and past failures.
  - topic: Code-based checks
    detail: Format, length, required facts and forbidden content.
  - topic: LLM-as-judge
    detail: Using a model to grade — with a clear rubric and checks against human labels.
  - topic: Human review
    detail: When people need to judge, and how to make it consistent.
  - topic: Evals in CI
    detail: Run them on every change and track scores over time.
resources:
  - title: Develop test cases (Anthropic)
    url: https://docs.claude.com/en/docs/test-and-evaluate/develop-tests
    provider: Anthropic
    type: docs
    cost: free
    official: true
  - title: OpenAI evals guide
    url: https://platform.openai.com/docs/guides/evals
    provider: OpenAI
    type: docs
    cost: free
    official: true
  - title: Your AI product needs evals
    url: https://hamel.dev/blog/posts/evals/
    provider: Hamel Husain
    type: article
    cost: free
  - title: promptfoo
    url: https://www.promptfoo.dev/docs/intro/
    provider: promptfoo
    type: tool
    cost: free
checked: 2026-10-06
---

## In plain English

LLMs give different answers to the same question, and a prompt tweak that fixes one case can quietly break five others. Evals are the tests for AI features: a fixed set of examples you score every time something changes.
