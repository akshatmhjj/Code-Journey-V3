---
title: Backend Engineer
aliases: [Backend Developer, Server-side Engineer, API Developer, Software Engineer (Backend)]
summary: Backend engineers build the parts of a product users never see - APIs, databases, authentication, background jobs - and keep them correct, fast and secure as traffic grows.
whereTheyWork: Almost every software company - SaaS, fintech, e-commerce, marketplaces, banks and enterprise IT, and the platform teams inside large tech companies.
dayInLife:
  - Design and build an API endpoint, from the database query to the JSON response.
  - Write a database migration and check it won't lock a busy table.
  - Investigate why one request in a hundred is slow, using logs and traces.
  - Review a pull request for correctness, security and error handling.
  - Agree on the shape of an API with the frontend and mobile teams.
stages:
  - name: Foundations
    summary: One programming language, the tools every engineer uses, and how requests travel.
    skills: [how-the-internet-works, command-line, git, python, data-structures-algorithms]
    project: A command-line tool that reads a CSV, transforms it and writes a report - with tests, in a public Git repo.
    doneWhen: You can solve easy and some medium coding problems in your language, and explain what happens during an HTTP request.
    weeks: 10–14
  - name: Core
    summary: APIs and databases - the heart of the job.
    skills: [nodejs, rest-apis, sql, postgresql, authentication, testing-basics]
    project: A REST API for a small product (say, a book club) with sign-up, login, CRUD endpoints, PostgreSQL and automated tests.
    doneWhen: You can design tables and endpoints for a new feature on paper, then build them with tests, without a tutorial.
    weeks: 12–16
  - name: Job-ready
    summary: Shipping it, running it and keeping it safe.
    skills: [docker, ci-cd, deployment, caching, web-security, observability, ai-coding-tools]
    project: Containerise your API, deploy it with a CI pipeline, add caching to a slow endpoint, and add logging and a health check.
    doneWhen: A push to main runs tests and deploys automatically, and you can find the cause of an error from logs alone.
    weeks: 8–12
  - name: Senior
    summary: Systems that scale, and decisions others build on.
    skills: [system-design, message-queues, kubernetes, aws, technical-writing]
    project: Write a design doc for a feature that needs a background queue (e.g. sending 100k emails), then build and load-test it.
    doneWhen: You can defend trade-offs between consistency, cost and complexity - and you've been on call for something you built.
skills:
  must: [python, nodejs, sql, rest-apis, git, authentication, testing-basics, docker]
  should: [postgresql, caching, ci-cd, web-security, observability, deployment, data-structures-algorithms]
  nice: [system-design, message-queues, kubernetes, aws, graphql]
tools: [VS Code or an IDE like PyCharm, Postman or Bruno, PostgreSQL, Docker, Git and GitHub, a cloud console (AWS, GCP or Azure), Redis, an AI coding assistant]
interview:
  rounds:
    - Recruiter or hiring-manager screen
    - Coding - data structures and algorithms, usually 1–2 problems
    - Practical backend round - build or extend a small API, or debug one
    - System design for mid-level and above (e.g. a URL shortener, rate limiter or chat service)
    - Behavioural round on ownership, incidents and collaboration
  practice:
    - { title: Tech Interview Handbook, url: "https://www.techinterviewhandbook.org/", provider: Yangshun Tay, type: docs, cost: free }
    - { title: NeetCode roadmap, url: "https://neetcode.io/roadmap", provider: NeetCode, type: practice, cost: freemium }
    - { title: LeetCode, url: "https://leetcode.com/", provider: LeetCode, type: practice, cost: freemium }
    - { title: System Design Primer, url: "https://github.com/donnemartin/system-design-primer", provider: Donne Martin, type: docs, cost: free }
aiImpact: AI assistants now write a lot of routine backend code - CRUD endpoints, validation, tests, SQL. The value has shifted to judgement that AI handles poorly - data modelling, knowing what can fail in production, security, and designing systems that stay simple as they grow. Backend engineers also increasingly build the services that call LLM APIs, so knowing how to work with them safely is becoming part of the job.
market:
  - text: PostgreSQL is the most-used database among respondents to recent Stack Overflow Developer Surveys, and Python and JavaScript/TypeScript are among the most-used languages.
    source: { title: Stack Overflow Developer Survey, url: "https://survey.stackoverflow.co/" }
  - text: Backend job posts commonly ask for one main language (Python, Java, Go, C# or Node.js), SQL, Docker and experience with a cloud provider.
adjacent: [full-stack-engineer, devops-engineer, data-engineer, ai-engineer]
updated: 2026-10-06
---

## Is this role for you?

Backend suits people who like logic, data and systems more than visuals - who enjoy asking "what happens if two people do this at the same time?" and getting the answer right. You'll spend more time reading logs and designing tables than adjusting layouts.

If you want to see your work on screen right away, [Frontend Engineer](/roles/frontend-engineer) or [Full-Stack Engineer](/roles/full-stack-engineer) may feel better.

## Which language?

Pick one and go deep; the concepts transfer. This route uses Python and Node.js because they're beginner-friendly and widely hired for. Java and C# dominate in banks and large enterprises, and Go is popular for infrastructure and high-traffic services. Look at job posts in your city and choose what appears most.
