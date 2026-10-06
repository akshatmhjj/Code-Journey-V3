---
title: Data Modeling
domain: data
level: intermediate
hours: 20–30
brief: Designing how data is organised into tables - facts, dimensions and keys - so it's correct, easy to query and consistent across reports.
prereqs:
  - sql
learn:
  - topic: Entities and relationships
    detail: One-to-many, many-to-many and keys.
  - topic: Normalisation
    detail: Avoid duplicated data in transactional databases.
  - topic: Dimensional modelling
    detail: Fact tables (events) and dimension tables (who, what, where) for analytics.
  - topic: Grain
    detail: Decide exactly what one row means - the most important modelling choice.
  - topic: Slowly changing dimensions
    detail: Track how attributes like a customer's plan change over time.
  - topic: Metric definitions
    detail: Define 'active user' once, in code, for everyone.
resources:
  - title: "dbt: How we structure our dbt projects"
    url: https://docs.getdbt.com/best-practices/how-we-structure/1-guide-overview
    provider: dbt Labs
    type: docs
    cost: free
    official: true
  - title: The Data Warehouse Toolkit (book)
    url: https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/books/data-warehouse-dw-toolkit/
    provider: Kimball Group
    type: book
    cost: paid
  - title: Database design basics
    url: https://support.microsoft.com/en-us/office/database-design-basics-eb2159cf-1e30-401a-8084-bd4f9c9ca1f5
    provider: Microsoft
    type: article
    cost: free
checked: 2026-10-06
---

## In plain English

If two dashboards show different revenue, the problem is usually the data model. Modelling is deciding what each table means and how they connect, so every report starts from the same, trustworthy foundation.
