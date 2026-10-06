---
title: Analytics Engineer
aliases: [Analytics Developer, BI Engineer, Data Modeller, dbt Developer]
summary: Analytics engineers turn raw data into clean, tested, well-documented tables that analysts and dashboards can trust - applying software engineering habits to SQL and data modelling.
whereTheyWork: Tech and SaaS companies, e-commerce, fintech, and any organisation with a modern data stack (a cloud warehouse plus dbt).
dayInLife:
  - Model raw event data into a clean "orders" table with one row per order.
  - Add tests so a duplicate in a source system is caught before it reaches a dashboard.
  - Agree on exactly how "monthly active users" is defined, then encode it once.
  - Review a teammate's dbt pull request.
  - Speed up a model that's become slow and expensive.
stages:
  - name: Foundations
    summary: SQL in depth and how analysts use data.
    skills: [sql, spreadsheets, git, statistics]
    project: Answer ten business questions on a public dataset with advanced SQL (CTEs, window functions), all version-controlled in Git.
    doneWhen: You can write complex SQL confidently and explain why your numbers are correct.
    weeks: 8–12
  - name: Core
    summary: Modelling and transforming data properly.
    skills: [data-modeling, data-warehouses, dbt, python]
    project: A dbt project on a warehouse - staging, intermediate and mart layers, with tests and documentation.
    doneWhen: Your models have clear grain, tests on every key, and docs someone else can follow.
    weeks: 10–14
  - name: Job-ready
    summary: Shipping data like software, and serving it to people.
    skills: [ci-cd, bi-tools, data-storytelling, airflow, ai-coding-tools]
    project: Run your dbt project in CI, schedule it, and build a dashboard on your marts with documented metric definitions.
    doneWhen: A broken change is caught in CI, and analysts self-serve from your models.
    weeks: 8–12
  - name: Senior
    summary: Owning the data model and metric definitions for a business.
    skills: [system-design, technical-writing, spark]
    project: Design a semantic layer or metrics catalogue for a company and the plan to migrate dashboards onto it.
    doneWhen: The company trusts one set of numbers - and they come from your models.
skills:
  must: [sql, data-modeling, dbt, data-warehouses, git]
  should: [python, ci-cd, bi-tools, data-storytelling, airflow]
  nice: [statistics, spark, technical-writing, ai-coding-tools]
tools: [SQL, dbt, a cloud warehouse (BigQuery, Snowflake, Databricks), Git and GitHub, an orchestrator, a BI tool (Looker, Power BI, Tableau), an AI coding assistant]
interview:
  rounds:
    - Recruiter screen
    - Advanced SQL test
    - Data modelling exercise - design tables for a business process
    - dbt or take-home project review
    - Behavioural round on working with analysts and stakeholders
  practice:
    - { title: dbt Learn (free courses), url: "https://learn.getdbt.com/", provider: dbt Labs, type: course, cost: free, official: true }
    - { title: DataLemur, url: "https://datalemur.com/", provider: DataLemur, type: practice, cost: freemium }
    - { title: StrataScratch, url: "https://www.stratascratch.com/", provider: StrataScratch, type: practice, cost: freemium }
aiImpact: AI can now answer data questions in plain English - but only reliably on top of clean, well-defined, documented models. That makes analytics engineering more important, not less - the semantic layer and metric definitions you build are what AI tools query.
market:
  - text: The analytics engineer title grew with the "modern data stack" - cloud warehouses plus dbt - and is now common at data-mature companies.
  - text: Postings almost always ask for strong SQL and dbt; Python and a BI tool are common extras.
adjacent: [data-analyst, data-engineer, data-scientist]
updated: 2026-10-06
---

## Is this role for you?

Analytics engineering suits people who love SQL, care about getting numbers exactly right, and like bringing order to messy data. It's a natural next step for [Data Analysts](/roles/data-analyst) who enjoy the technical side more than presenting.

## Analytics or data engineer?

[Data Engineers](/roles/data-engineer) move data into the warehouse and run the infrastructure. Analytics engineers work inside the warehouse, shaping that data into models people use.
