---
title: Data Engineer
aliases: [Big Data Engineer, Data Platform Engineer, ETL Developer, Analytics Data Engineer]
summary: Data engineers build the pipelines and warehouses that every analyst, data scientist and AI system depends on — moving data reliably from where it's created to where it's useful, clean and on time.
whereTheyWork: Any company with meaningful data — tech, banking, e-commerce, telecom, healthcare, logistics — and data consultancies and cloud providers.
dayInLife:
  - Build a pipeline that loads yesterday's orders into the warehouse by 6 a.m.
  - Fix a job that failed overnight and backfill the missing day.
  - Model raw events into clean tables analysts can trust.
  - Add data-quality tests so a broken source doesn't silently corrupt reports.
  - Cut the cost of a warehouse query that scans far more data than it needs.
stages:
  - name: Foundations
    summary: SQL, Python and the tools of the trade.
    skills: [sql, python, git, command-line, data-modeling]
    project: Load a public dataset into PostgreSQL with a Python script, model it into clean tables, and answer five questions in SQL.
    doneWhen: You can write complex SQL (window functions, CTEs) and explain how you designed your tables.
    weeks: 10–14
  - name: Core
    summary: Warehouses, transformations and orchestration.
    skills: [postgresql, data-warehouses, dbt, airflow, docker]
    project: A daily pipeline — extract from an API, load into a warehouse, transform with dbt, orchestrated by Airflow, all in Docker.
    doneWhen: Your pipeline runs on a schedule, recovers from failures, and has tests on its outputs.
    weeks: 12–16
  - name: Job-ready
    summary: Scale, streaming and the cloud.
    skills: [spark, message-queues, aws, ci-cd, observability, ai-coding-tools]
    project: Process a dataset too large for pandas with Spark, add a streaming source with Kafka, and deploy it on a cloud provider.
    doneWhen: You can explain batch vs streaming trade-offs and run both.
    weeks: 10–14
  - name: Senior
    summary: Platforms, cost and governance.
    skills: [system-design, terraform, technical-writing]
    project: Design a data platform for a mid-size company — ingestion, storage, modelling, access control and cost — as a design doc.
    doneWhen: Teams trust your data without double-checking it, and your platform's costs are predictable.
skills:
  must: [sql, python, data-modeling, data-warehouses, airflow, git]
  should: [dbt, spark, docker, aws, postgresql, ci-cd]
  nice: [message-queues, terraform, system-design, observability]
tools: [SQL, Python, a cloud warehouse (BigQuery, Snowflake, Redshift or Databricks), dbt, Airflow or Dagster, Spark, Kafka, Docker, Git, an AI coding assistant]
interview:
  rounds:
    - Recruiter screen
    - SQL — advanced queries, window functions, performance
    - Python coding — data manipulation and some algorithms
    - Data modelling exercise — design tables for a business process
    - Pipeline or data system design for mid-level and above
  practice:
    - { title: Data Engineering Zoomcamp, url: "https://github.com/DataTalksClub/data-engineering-zoomcamp", provider: DataTalks.Club, type: course, cost: free }
    - { title: DataLemur, url: "https://datalemur.com/", provider: DataLemur, type: practice, cost: freemium }
    - { title: StrataScratch, url: "https://www.stratascratch.com/", provider: StrataScratch, type: practice, cost: freemium }
    - { title: Fundamentals of Data Engineering (book), url: "https://www.oreilly.com/library/view/fundamentals-of-data/9781098108298/", provider: Joe Reis & Matt Housley, type: book, cost: paid }
aiImpact: AI systems are hungry for clean, well-organised data, which has increased demand for data engineering rather than reduced it. AI tools help write SQL and pipeline code, but the hard parts — modelling, reliability, cost control and data quality — still need careful engineers. Many data engineers now also build the pipelines that feed retrieval systems and model training.
market:
  - text: SQL, Python, a cloud warehouse and an orchestrator (usually Airflow) appear in most data engineering job posts; Spark and dbt are close behind.
  - text: Demand for data engineers has grown alongside AI, because model quality depends on data quality.
adjacent: [data-analyst, analytics-engineer, backend-engineer, ml-engineer]
updated: 2026-10-06
---

## Is this role for you?

Data engineering suits people who like building reliable systems more than presenting findings — who get satisfaction from a pipeline that runs every night without anyone noticing. It's backend engineering with data as the product.

## A common path

Many data engineers start as [Data Analysts](/roles/data-analyst) or [Backend Engineers](/roles/backend-engineer). If you already know SQL well, you're a good part of the way there.
