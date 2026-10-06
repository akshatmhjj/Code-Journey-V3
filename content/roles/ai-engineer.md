---
title: AI Engineer
aliases: [LLM Engineer, Applied AI Engineer, GenAI Engineer, AI Application Developer]
summary: AI engineers build products on top of large language models — chat assistants, retrieval over company documents, agents that use tools — and make them reliable, safe and affordable in production.
whereTheyWork: AI-first startups, product teams adding AI features at established companies, consultancies, and internal-tools teams automating work with LLMs.
dayInLife:
  - Build a retrieval pipeline so an assistant answers from a company's own documents.
  - Write and refine a prompt, then prove the change helped with an evaluation set.
  - Add a tool an agent can call, with guardrails on what it's allowed to do.
  - Cut cost and latency by caching answers and choosing the right model size.
  - Investigate a bad answer a user reported and trace where it went wrong.
stages:
  - name: Foundations
    summary: Strong Python, APIs and the software basics AI work sits on.
    skills: [python, git, command-line, rest-apis, how-the-internet-works]
    project: A Python script that calls a public API, handles errors and retries, and stores results — with tests.
    doneWhen: You can build a small, tested Python service that talks to other services over HTTP.
    weeks: 10–14
  - name: Core
    summary: Working with LLMs directly — prompts, structured output and retrieval.
    skills: [llm-apis, prompt-engineering, rag, vector-databases]
    project: A "chat with your docs" app over a set of PDFs that cites the passages it used.
    doneWhen: You can explain why an answer was wrong — retrieval, prompt or model — and fix the right part.
    weeks: 10–14
  - name: Job-ready
    summary: Agents, evaluation and shipping it.
    skills: [ai-agents, llm-evals, deployment, observability, ai-coding-tools]
    project: An agent that completes a real task with two or three tools, plus an evaluation suite that runs in CI and a deployed demo.
    doneWhen: You can show, with numbers, that a change made your system better rather than just different.
    weeks: 10–14
  - name: Senior
    summary: Reliability, cost and architecture at scale.
    skills: [system-design, machine-learning, mlops, caching, web-security]
    project: Write a design doc for an AI feature with latency, cost and failure budgets, and the plan for monitoring quality after launch.
    doneWhen: You can choose between prompting, retrieval, fine-tuning and plain code — and justify it.
skills:
  must: [python, llm-apis, prompt-engineering, rag, rest-apis, git]
  should: [vector-databases, ai-agents, llm-evals, deployment, observability]
  nice: [machine-learning, mlops, system-design, typescript, caching]
tools: [Python (FastAPI or similar), an LLM provider SDK (Gemini, OpenAI, Anthropic), a vector store (pgvector, Qdrant, Pinecone), an evaluation tool, Jupyter, Docker, an AI coding assistant]
interview:
  rounds:
    - Recruiter screen
    - Coding in Python — practical rather than puzzle-heavy at many companies
    - LLM system design — e.g. design a support assistant over a knowledge base
    - Discussion of a project you built — choices, evaluation and failures
    - Behavioural round
  practice:
    - { title: AI Engineering (book), url: "https://www.oreilly.com/library/view/ai-engineering/9781098166298/", provider: Chip Huyen, type: book, cost: paid }
    - { title: DeepLearning.AI short courses, url: "https://www.deeplearning.ai/short-courses/", provider: DeepLearning.AI, type: course, cost: free }
    - { title: Building effective agents, url: "https://www.anthropic.com/engineering/building-effective-agents", provider: Anthropic, type: article, cost: free }
aiImpact: This role exists because of AI and changes as fast as the models do. Tools and frameworks shift every few months, so the lasting skills are the fundamentals — software engineering, retrieval, evaluation and cost control. Engineers who can measure quality, rather than judge it by eye, are the ones teams trust to ship.
market:
  - text: AI engineer has become one of the fastest-growing job titles since 2023, at both startups and established companies adding AI features.
  - text: Postings typically want strong Python and software engineering first, then LLM experience — retrieval, agents and evaluation — shown through projects.
adjacent: [ml-engineer, backend-engineer, full-stack-engineer, forward-deployed-engineer]
updated: 2026-10-06
---

## Is this role for you?

AI engineering suits builders who like fast-moving tools and are comfortable with systems that are sometimes wrong. Much of the work is experimentation: try a change, measure it, keep what works.

You don't need a research background. You do need solid software engineering — most AI engineers came from backend or full-stack roles.

## AI Engineer or ML Engineer?

AI engineers build *with* existing models through APIs. [ML Engineers](/roles/ml-engineer) train, fine-tune and serve models themselves. If you're more excited by the models than the products, look at the ML route.
