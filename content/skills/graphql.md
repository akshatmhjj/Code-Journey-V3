---
title: GraphQL
domain: web
level: intermediate
hours: 15–25
brief: GraphQL is an API style where the client asks for exactly the fields it needs in one request, described by a typed schema.
prereqs:
  - rest-apis
learn:
  - topic: Schema and types
    detail: The contract between client and server.
  - topic: Queries
    detail: Ask for exactly the fields you need, nested, in one round trip.
  - topic: Mutations
    detail: Create, update and delete through the same endpoint.
  - topic: Resolvers
    detail: Server functions that fetch each field's data.
  - topic: The N+1 problem
    detail: Batching with DataLoader so nested queries don't hammer the database.
  - topic: Clients
    detail: Apollo Client, urql or Relay for caching on the frontend.
  - topic: When to choose it
    detail: Great for many clients and complex data; REST is often simpler.
resources:
  - title: Learn GraphQL
    url: https://graphql.org/learn/
    provider: GraphQL Foundation
    type: docs
    cost: free
    official: true
  - title: Apollo documentation
    url: https://www.apollographql.com/docs/
    provider: Apollo
    type: docs
    cost: free
  - title: How to GraphQL
    url: https://www.howtographql.com/
    provider: Prisma
    type: course
    cost: free
checked: 2026-10-06
---

## In plain English

With REST, a mobile app might call three endpoints and throw away half the data. With GraphQL it sends one query describing exactly what it needs and gets exactly that back.
