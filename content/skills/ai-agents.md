---
title: AI Agents & Tool Use
domain: ai
level: intermediate
hours: 25–40
brief: Agents are LLM systems that take actions — calling tools and APIs in a loop to complete a task. Building them well means knowing when to use them, and keeping them safe and testable.
prereqs:
  - llm-apis
  - prompt-engineering
learn:
  - topic: Workflows vs agents
    detail: Fixed steps you control, or a model deciding the next step — start with the simplest that works.
  - topic: Tool calling
    detail: Define tools with clear names, descriptions and input schemas.
  - topic: The agent loop
    detail: Think, act, observe, repeat — and how to stop.
  - topic: Model Context Protocol
    detail: A standard way to connect models to tools and data sources.
  - topic: Memory and state
    detail: What the agent should remember within and across tasks.
  - topic: Guardrails
    detail: Permissions, confirmations for risky actions and limits on cost and steps.
  - topic: Evaluating agents
    detail: Test on realistic tasks and inspect the full trace, not just the final answer.
resources:
  - title: Model Context Protocol
    url: https://modelcontextprotocol.io/
    provider: Model Context Protocol
    type: docs
    cost: free
    official: true
  - title: OpenAI Agents SDK
    url: https://openai.github.io/openai-agents-python/
    provider: OpenAI
    type: docs
    cost: free
    official: true
  - title: Building effective agents
    url: https://www.anthropic.com/engineering/building-effective-agents
    provider: Anthropic
    type: article
    cost: free
  - title: Hugging Face Agents Course
    url: https://huggingface.co/learn/agents-course/unit0/introduction
    provider: Hugging Face
    type: course
    cost: free
checked: 2026-10-06
---

## In plain English

A chatbot answers. An agent *does*: it can search, read a file, call an API, look at the result and decide what to do next. That power is why agents need careful design — clear tools, limits and a way to check their work.
