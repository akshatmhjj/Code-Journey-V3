---
title: Workflow Orchestration (Airflow)
domain: data
level: intermediate
hours: 20–30
brief: Orchestrators schedule and run data and ML pipelines - handling dependencies, retries and monitoring. Apache Airflow is the most widely used.
prereqs:
  - python
learn:
  - topic: DAGs
    detail: Pipelines as directed acyclic graphs of tasks, written in Python.
  - topic: Scheduling
    detail: Run hourly, daily or when data arrives.
  - topic: Operators and tasks
    detail: Run SQL, Python, Spark or containers as steps.
  - topic: Dependencies and retries
    detail: Make tasks idempotent so reruns are safe.
  - topic: Backfills
    detail: Re-run history after fixing a bug.
  - topic: Monitoring
    detail: See failed runs, logs and alerts in the UI.
  - topic: Alternatives
    detail: Dagster and Prefect take different approaches worth knowing.
resources:
  - title: Apache Airflow documentation
    url: https://airflow.apache.org/docs/apache-airflow/stable/index.html
    provider: Apache
    type: docs
    cost: free
    official: true
  - title: Dagster documentation
    url: https://docs.dagster.io/
    provider: Dagster Labs
    type: docs
    cost: free
    official: true
  - title: Astronomer Learn
    url: https://www.astronomer.io/docs/learn/
    provider: Astronomer
    type: docs
    cost: free
checked: 2026-10-06
---

## In plain English

A data pipeline might pull from an API, clean the data, load it into a warehouse, then refresh a model - every night, in order, retrying if something fails. An orchestrator is the conductor that makes sure each step runs at the right time and tells you when one doesn't.
