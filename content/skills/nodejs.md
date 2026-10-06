---
title: Node.js
domain: web
level: intermediate
hours: 60–90
brief: JavaScript on the server - APIs, databases, authentication.
prereqs:
  - javascript
learn:
  - topic: Express.js
    detail: The most popular Node.js framework. Create routes with app.get('/path', handler). Middleware for auth, logging, parsing.
  - topic: REST API Design
    detail: GET (read), POST (create), PUT/PATCH (update), DELETE. Return JSON. Use HTTP status codes (200, 201, 400, 401, 404, 500).
  - topic: Middleware
    detail: "Functions that run between request and response: authenticate user, parse JSON body, log requests, validate inputs."
  - topic: PostgreSQL + Prisma
    detail: Prisma ORM gives you type-safe database access. Define your schema once, get auto-generated, type-checked queries.
  - topic: JWT Authentication
    detail: JSON Web Tokens - sign a token on login, verify it on every protected request. Never store plain passwords.
  - topic: Environment Variables
    detail: .env files keep secrets (DB passwords, API keys) out of your code. Never commit them to git.
  - topic: Error Handling
    detail: Global error middleware catches unhandled errors. Never expose stack traces to users in production.
  - topic: Deployment
    detail: Railway (backend + DB) or Render for hosting. Vercel for frontend. Environment variables set in the dashboard.
resources:
  - title: Node.js Learn
    url: https://nodejs.org/en/learn
    provider: OpenJS Foundation
    type: docs
    cost: free
    official: true
  - title: Prisma Docs
    url: https://www.prisma.io/docs
    provider: Prisma
    type: docs
    cost: free
  - title: The Odin Project
    url: https://www.theodinproject.com
    provider: The Odin Project
    type: course
    cost: free
  - title: Traversy Media
    url: https://www.youtube.com/@TraversyMedia
    provider: YouTube
    type: video
    cost: free
checked: 2026-10-06
---

## In plain English

Node.js takes JavaScript - which only lived in browsers - and lets it run on a server. Think of a restaurant: the frontend is the dining room (what customers see), and Node.js is the kitchen (where orders are processed, food is prepared, and records are kept). The kitchen handles things the dining room can't: storing data permanently, sending emails, processing payments, keeping secrets hidden from customers.

## A first look

```javascript
// 1. Basic server
import express from "express";
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

// 2. API route
app.get("/api", (req, res) => {
  res.json({ message: "API working" });
});

// 3. Start server
app.listen(3000, () => {
  console.log("Server running");
});
```
