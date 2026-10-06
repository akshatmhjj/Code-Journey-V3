---
title: Apache Spark
domain: data
level: advanced
hours: 30–50
brief: Apache Spark processes data too large for one machine by spreading the work across a cluster, with SQL and DataFrame APIs in Python (PySpark).
prereqs:
  - python
  - sql
learn:
  - topic: Why distributed
    detail: When data or computation outgrows a single machine.
  - topic: DataFrames and Spark SQL
    detail: Familiar operations that run in parallel.
  - topic: Lazy evaluation
    detail: Transformations build a plan; actions run it.
  - topic: Partitions and shuffles
    detail: Why some operations are expensive and how to reduce them.
  - topic: File formats
    detail: Parquet and Delta/Iceberg tables for fast analytics.
  - topic: Performance tuning
    detail: Caching, broadcast joins and reading the Spark UI.
resources:
  - title: "Spark: Quick start"
    url: https://spark.apache.org/docs/latest/quick-start.html
    provider: Apache
    type: docs
    cost: free
    official: true
  - title: PySpark documentation
    url: https://spark.apache.org/docs/latest/api/python/index.html
    provider: Apache
    type: docs
    cost: free
    official: true
  - title: Data Engineering Zoomcamp
    url: https://github.com/DataTalksClub/data-engineering-zoomcamp
    provider: DataTalks.Club
    type: course
    cost: free
checked: 2026-10-06
---

## In plain English

pandas works on one computer's memory. When you have a billion rows, Spark splits the data across many machines, runs the same operations on each piece, and combines the results - while you write code that looks a lot like pandas or SQL.
