---
title: Forward Deployed Engineer
aliases: [FDE, Forward Deployed Software Engineer, Deployment Strategist (technical), Customer Engineer]
summary: Forward deployed engineers work directly with customers to build real solutions on their company's product - understanding the customer's problem, writing the integrations and tools that solve it, and feeding what they learn back to the product team.
whereTheyWork: AI companies and model providers, data and analytics platforms, enterprise software companies, and startups selling complex products to large customers.
dayInLife:
  - Sit with a customer's operations team to understand the process they want to automate.
  - Build a working prototype on your product with the customer's real data, in days.
  - Write the integration that connects your platform to their systems.
  - Explain a technical trade-off to a customer's executive in plain language.
  - Tell your product team which missing feature is blocking three customers.
stages:
  - name: Foundations
    summary: Strong general engineering - one language, data and APIs.
    skills: [python, sql, git, rest-apis, command-line]
    project: Build a script that pulls data from two public APIs, joins it in SQL and produces a useful report - documented for a non-technical reader.
    doneWhen: You can quickly build small tools that connect systems and explain what they do.
    weeks: 10–14
  - name: Core
    summary: Building full solutions fast, including with AI.
    skills: [typescript, react, llm-apis, rag, data-modeling]
    project: A small internal tool with a web UI that uses an LLM to answer questions over a company's documents.
    doneWhen: You can go from a vague problem to a working demo in a week.
    weeks: 12–16
  - name: Job-ready
    summary: Customers, deployment and reliability.
    skills: [working-with-customers, ai-agents, deployment, docker, technical-writing, ai-coding-tools]
    project: Find a real person with a real problem, build something that helps them, deploy it, and write up what you learned from their feedback.
    doneWhen: You've shipped something a real user relies on and can tell the story of how you understood their needs.
    weeks: 10–14
  - name: Senior
    summary: Owning large accounts and shaping the product.
    skills: [system-design, authentication, observability]
    project: Write a solution design for an enterprise rollout - architecture, security, data access, rollout plan and success metrics.
    doneWhen: Customers trust you with their hardest problems, and your feedback changes the product roadmap.
skills:
  must: [python, sql, rest-apis, working-with-customers, llm-apis, git]
  should: [typescript, react, rag, ai-agents, deployment, technical-writing]
  nice: [system-design, docker, data-modeling, authentication, observability]
tools: [Python, SQL, TypeScript and React, your company's platform and APIs, LLM APIs, Docker, a cloud console, notebooks, slides and docs, an AI coding assistant]
interview:
  rounds:
    - Recruiter screen
    - Coding - practical problems, often with messy, realistic data
    - Decomposition or case round - break down an ambiguous customer problem
    - Customer role-play or presentation
    - Behavioural round on ownership, ambiguity and communication
  practice:
    - { title: Tech Interview Handbook, url: "https://www.techinterviewhandbook.org/", provider: Yangshun Tay, type: docs, cost: free }
    - { title: Building effective agents, url: "https://www.anthropic.com/engineering/building-effective-agents", provider: Anthropic, type: article, cost: free }
    - { title: The Mom Test (book), url: "https://www.momtestbook.com/", provider: Rob Fitzpatrick, type: book, cost: paid }
aiImpact: The forward deployed role has grown with AI - companies selling AI models and platforms need engineers who can turn a powerful but general product into something that works for a specific customer. AI tools make FDEs faster at building prototypes; the scarce skills are understanding the customer's problem, judging what's feasible, and earning trust.
market:
  - text: The role was popularised by Palantir and has spread quickly to AI labs and enterprise AI companies since 2024.
  - text: Postings typically ask for strong software engineering plus communication and travel; many roles involve working on-site with customers.
adjacent: [ai-engineer, full-stack-engineer, solutions-engineer, backend-engineer]
updated: 2026-10-06
---

## Is this role for you?

FDE suits engineers who enjoy people as much as code - who like messy, real-world problems, switching contexts, and seeing their work used immediately. It's demanding: you need broad engineering skills *and* the ability to communicate with executives.

## FDE or Solutions Engineer?

Solutions engineers mostly design and demonstrate how a product fits, often before a sale. FDEs write substantial production code inside customer environments after the sale. Both reward technical range and communication.
