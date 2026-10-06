---
title: Full-Stack Engineer
aliases: [Full-Stack Developer, Product Engineer, Software Engineer (Full-Stack), Web Developer]
summary: Full-stack engineers ship features end to end - the screen a user sees, the API behind it and the database underneath - and are trusted to take an idea from sketch to production.
whereTheyWork: Startups and small product teams above all, plus agencies, internal-tools teams and product squads at larger companies.
dayInLife:
  - Build a feature across the stack - a database column, an API route and the form that uses it.
  - Decide whether logic belongs on the server or in the browser.
  - Fix a bug a customer reported, starting from a screenshot.
  - Set up a preview deployment so the designer can try a change.
  - Review AI-generated code for edge cases before merging it.
stages:
  - name: Foundations
    summary: How the web works and the languages every web page is made of.
    skills: [how-the-internet-works, html, css, javascript, git, command-line]
    project: A responsive multi-page site with a working contact form, published on your own domain.
    doneWhen: You can build a layout from a screenshot and explain the request–response cycle.
    weeks: 10–14
  - name: Core
    summary: A frontend framework, a backend runtime and a database - connected.
    skills: [typescript, react, nodejs, rest-apis, sql, postgresql]
    project: A small product (a habit tracker or job board) with a React frontend, a Node.js API and PostgreSQL.
    doneWhen: You can add a feature that needs a new table, a new endpoint and a new screen without help.
    weeks: 14–18
  - name: Job-ready
    summary: The framework, auth, testing and deployment teams expect.
    skills: [nextjs, authentication, testing-basics, frontend-testing, deployment, docker, ai-coding-tools]
    project: Rebuild your product in Next.js with sign-in, tests in CI and a production deploy with a custom domain.
    doneWhen: Your app is live, tested and observable - and you can explain every part of it in an interview.
    weeks: 8–12
  - name: Senior
    summary: Architecture, performance and leading features across teams.
    skills: [system-design, web-performance, web-security, caching, observability]
    project: Take a slow page from your app to a Lighthouse score above 90 and write up what you changed and why.
    doneWhen: Teammates ask you how a feature should be split between client, server and database.
skills:
  must: [html, css, javascript, typescript, react, nodejs, sql, rest-apis, git]
  should: [nextjs, postgresql, authentication, testing-basics, deployment, docker, ai-coding-tools]
  nice: [system-design, web-performance, caching, graphql, observability]
tools: [VS Code or Cursor, Chrome DevTools, Git and GitHub, PostgreSQL, Postman or Bruno, Vercel or similar, Docker, an AI coding assistant]
interview:
  rounds:
    - Recruiter or founder screen
    - Coding - algorithms, or a practical exercise in JavaScript/TypeScript
    - Take-home or live build of a small full-stack feature
    - System design for mid-level and above
    - Behavioural round on shipping, trade-offs and working with product and design
  practice:
    - { title: Tech Interview Handbook, url: "https://www.techinterviewhandbook.org/", provider: Yangshun Tay, type: docs, cost: free }
    - { title: Front End Interview Handbook, url: "https://www.frontendinterviewhandbook.com/", provider: GreatFrontEnd, type: docs, cost: free }
    - { title: System Design Primer, url: "https://github.com/donnemartin/system-design-primer", provider: Donne Martin, type: docs, cost: free }
    - { title: LeetCode, url: "https://leetcode.com/", provider: LeetCode, type: practice, cost: freemium }
aiImpact: AI tools make one person much faster across the whole stack, which plays to full-stack strengths - small teams can ship what used to take several specialists. The flip side is that shallow knowledge is easier to replace. Aim for depth in at least one layer, and the judgement to check AI output where layers meet - auth, data integrity and error handling.
market:
  - text: Startups and small teams hire full-stack engineers heavily because one person can own a whole feature.
  - text: React with TypeScript on the frontend and Node.js or Python on the backend is the most common pairing in full-stack job posts.
adjacent: [frontend-engineer, backend-engineer, devops-engineer, ai-engineer]
updated: 2026-10-06
---

## Is this role for you?

Full-stack suits generalists who get bored doing one thing and like seeing a feature through from idea to production. It rewards curiosity and range, and it's the most common role at early-stage startups.

It's harder to go deep everywhere, though. Many full-stack engineers lean towards one side over time - if you notice that, [Frontend](/roles/frontend-engineer) or [Backend](/roles/backend-engineer) is a natural specialisation.

## A sensible order

Learn the frontend first: you see results immediately, which keeps motivation high. Then add a backend and a database. Trying to learn both at once is the most common way people stall.
