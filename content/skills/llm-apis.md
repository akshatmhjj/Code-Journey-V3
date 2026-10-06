---
title: LLM APIs
domain: ai
level: beginner
hours: 15–25
brief: Calling large language models from code — sending messages, controlling output, handling streaming, tools and errors — through provider APIs like Gemini, OpenAI and Anthropic.
prereqs:
  - python
  - rest-apis
learn:
  - topic: Messages and roles
    detail: System instructions, user and assistant turns, and conversation history.
  - topic: Parameters
    detail: Model choice, max tokens and temperature — and what they change.
  - topic: Structured output
    detail: Ask for JSON that matches a schema, and validate it.
  - topic: Streaming
    detail: Show tokens as they arrive for a responsive UI.
  - topic: Tool (function) calling
    detail: Let the model request actions your code performs.
  - topic: Tokens and cost
    detail: Count tokens, cache prompts and pick model sizes sensibly.
  - topic: Errors and limits
    detail: Rate limits, retries with backoff and timeouts.
  - topic: Keys and safety
    detail: Keep API keys on the server; never in the browser.
resources:
  - title: Gemini API documentation
    url: https://ai.google.dev/gemini-api/docs
    provider: Google
    type: docs
    cost: free
    official: true
  - title: OpenAI API documentation
    url: https://platform.openai.com/docs/overview
    provider: OpenAI
    type: docs
    cost: free
    official: true
  - title: Claude API documentation
    url: https://docs.claude.com/en/api/overview
    provider: Anthropic
    type: docs
    cost: free
    official: true
  - title: Hugging Face Transformers
    url: https://huggingface.co/docs/transformers/index
    provider: Hugging Face
    type: docs
    cost: free
checked: 2026-10-06
---

## In plain English

An LLM API is a web service: you send text (and sometimes images or files), and it sends back generated text. Everything in AI engineering — chatbots, retrieval, agents — is built on calling these APIs well.

## A first look

```python
from google import genai

client = genai.Client()  # reads GEMINI_API_KEY from the environment
reply = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="Explain what a REST API is in two sentences.",
)
print(reply.text)
```
