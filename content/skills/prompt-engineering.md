---
title: Prompt Engineering
domain: ai
level: beginner
hours: 10–20
brief: Writing instructions that get reliable, useful results from language models - clear goals, context, examples and output formats - and testing that they work.
prereqs:
  - llm-apis
learn:
  - topic: Be clear and specific
    detail: State the task, the audience and what a good answer looks like.
  - topic: Give context
    detail: Include the information the model needs instead of hoping it knows.
  - topic: Examples (few-shot)
    detail: Show one or two input/output pairs for tricky formats.
  - topic: Structure
    detail: Separate instructions, context and data with clear sections or tags.
  - topic: Output formats
    detail: Ask for JSON or a fixed template when code will read the result.
  - topic: Let it reason
    detail: Ask for step-by-step thinking on complex tasks when appropriate.
  - topic: Iterate with evals
    detail: Change one thing at a time and measure on a fixed set of examples.
resources:
  - title: Prompt engineering overview
    url: https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview
    provider: Anthropic
    type: docs
    cost: free
    official: true
  - title: Gemini prompting strategies
    url: https://ai.google.dev/gemini-api/docs/prompting-strategies
    provider: Google
    type: docs
    cost: free
    official: true
  - title: OpenAI prompt engineering guide
    url: https://platform.openai.com/docs/guides/prompt-engineering
    provider: OpenAI
    type: docs
    cost: free
    official: true
  - title: Prompt Engineering Guide
    url: https://www.promptingguide.ai/
    provider: DAIR.AI
    type: docs
    cost: free
checked: 2026-10-06
---

## In plain English

A language model does what you ask, not what you meant. Prompt engineering is the craft of asking well: giving the model the context, examples and constraints a smart new colleague would need to do the job right first time.
