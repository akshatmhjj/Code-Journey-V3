---
title: Authentication & Authorization
domain: web
level: intermediate
hours: 20–30
brief: Authentication proves who a user is; authorisation decides what they're allowed to do. Getting both right is what keeps accounts and data safe.
prereqs:
  - rest-apis
learn:
  - topic: Authentication vs authorisation
    detail: Who are you? vs what can you do?
  - topic: Passwords done right
    detail: Hash with bcrypt or Argon2. Never store or log plain text.
  - topic: Sessions and cookies
    detail: Server-side sessions with secure, HttpOnly, SameSite cookies.
  - topic: Tokens and JWTs
    detail: Stateless tokens - what's inside, how they're signed, and their pitfalls.
  - topic: OAuth 2.0 and OpenID Connect
    detail: "'Sign in with Google' - delegated login without handling passwords."
  - topic: Roles and permissions
    detail: Role-based access control, and checking permissions on the server every time.
  - topic: Auth providers
    detail: When to use Supabase Auth, Auth0, Clerk or Firebase instead of building it.
  - topic: Multi-factor and resets
    detail: MFA, password reset flows and email verification.
resources:
  - title: OWASP Authentication Cheat Sheet
    url: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
    provider: OWASP
    type: docs
    cost: free
    official: true
  - title: OAuth 2.0
    url: https://oauth.net/2/
    provider: oauth.net
    type: docs
    cost: free
    official: true
  - title: OAuth 2.0 Simplified
    url: https://www.oauth.com/
    provider: Aaron Parecki
    type: book
    cost: free
  - title: Introduction to JSON Web Tokens
    url: https://jwt.io/introduction
    provider: jwt.io
    type: article
    cost: free
checked: 2026-10-06
---

## In plain English

Logging in is a promise: "this request really comes from Priya." Authentication is checking that promise; authorisation is checking that Priya is allowed to delete this post. Most security breaches in apps come from getting one of these subtly wrong.

## A rule worth remembering

Never trust the client. Hide buttons in the UI for convenience, but always check permissions on the server - and use a well-tested auth provider unless you have a strong reason not to.
