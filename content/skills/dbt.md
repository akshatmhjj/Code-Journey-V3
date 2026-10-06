---
title: dbt
domain: data
level: intermediate
hours: 15–25
brief: dbt lets you transform data in your warehouse with version-controlled, tested SQL — bringing software engineering habits to analytics.
prereqs:
  - sql
  - git
learn:
  - topic: Models
    detail: SELECT statements that become tables and views.
  - topic: ref() and lineage
    detail: Build models on models, with a dependency graph.
  - topic: Tests
    detail: unique, not_null, relationships and custom tests on your data.
  - topic: Documentation
    detail: Describe models and columns; generate a browsable site.
  - topic: Sources and seeds
    detail: Declare raw data and load small reference tables.
  - topic: Materialisations
    detail: Views, tables and incremental models.
  - topic: Project structure
    detail: Staging, intermediate and marts layers.
resources:
  - title: dbt Learn (free courses)
    url: https://learn.getdbt.com/
    provider: dbt Labs
    type: course
    cost: free
    official: true
  - title: dbt documentation
    url: https://docs.getdbt.com/
    provider: dbt Labs
    type: docs
    cost: free
    official: true
checked: 2026-10-06
---

## In plain English

Analysts used to keep transformation SQL in scattered scripts. dbt puts it in a Git repo with tests and docs, so data you report on is built the same way every time — and you know when it breaks.
