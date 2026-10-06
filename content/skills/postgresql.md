---
title: PostgreSQL
domain: data
level: intermediate
hours: 25–40
brief: "PostgreSQL is a powerful open-source relational database and the most-used database among developers. Learn it beyond basic SQL: schemas, indexes, transactions and performance."
prereqs:
  - sql
learn:
  - topic: Schema design
    detail: Tables, primary and foreign keys, constraints and normalisation.
  - topic: Data types
    detail: Text, numeric, timestamps with time zones, JSONB, arrays and UUIDs.
  - topic: Indexes
    detail: B-tree indexes, when they help, and reading EXPLAIN ANALYZE.
  - topic: Transactions
    detail: ACID, isolation levels and avoiding race conditions.
  - topic: Migrations
    detail: Changing schemas safely on a live database.
  - topic: Security
    detail: Roles, grants and row-level security.
  - topic: Extensions
    detail: pgvector for embeddings, PostGIS for maps, pg_stat_statements for tuning.
  - topic: Backups and connections
    detail: Point-in-time recovery and connection pooling.
resources:
  - title: PostgreSQL documentation
    url: https://www.postgresql.org/docs/current/
    provider: PostgreSQL
    type: docs
    cost: free
    official: true
  - title: Use The Index, Luke
    url: https://use-the-index-luke.com/
    provider: Markus Winand
    type: book
    cost: free
  - title: PostgreSQL Exercises
    url: https://pgexercises.com/
    provider: pgexercises
    type: practice
    cost: free
  - title: PostgreSQL Tutorial
    url: https://neon.com/postgresql/tutorial
    provider: Neon
    type: course
    cost: free
checked: 2026-10-06
---

## In plain English

SQL is the language; PostgreSQL is a database that speaks it very well. Knowing Postgres properly — designing tables, adding the right index, using transactions — is what keeps apps correct and fast as data grows.
