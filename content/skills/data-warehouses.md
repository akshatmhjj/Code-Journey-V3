---
title: Data Warehouses (BigQuery, Snowflake)
domain: data
level: intermediate
hours: 20–35
brief: Cloud data warehouses store a company's analytical data and run SQL over billions of rows in seconds. BigQuery, Snowflake, Redshift and Databricks are the most common.
prereqs:
  - sql
learn:
  - topic: OLTP vs OLAP
    detail: Why analytics needs a different database from your app.
  - topic: Columnar storage
    detail: Why scanning a few columns of a huge table is fast.
  - topic: Loading data
    detail: Batch loads, ELT, and tools like Fivetran or Airbyte.
  - topic: Partitioning and clustering
    detail: Organise tables so queries scan less data.
  - topic: Cost
    detail: Pay-per-scan vs compute credits, and how to avoid surprise bills.
  - topic: Access control
    detail: Roles, row- and column-level security for sensitive data.
  - topic: Lakehouses
    detail: Open table formats (Iceberg, Delta) and where they fit.
resources:
  - title: BigQuery documentation
    url: https://cloud.google.com/bigquery/docs
    provider: Google Cloud
    type: docs
    cost: free
    official: true
  - title: Snowflake documentation
    url: https://docs.snowflake.com/
    provider: Snowflake
    type: docs
    cost: free
    official: true
  - title: Amazon Redshift documentation
    url: https://docs.aws.amazon.com/redshift/
    provider: AWS
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

Your app's database is built for many small reads and writes. A warehouse is built for the opposite: a few huge questions, like "revenue by country by week for three years." It stores data by column and spreads queries across many machines, so those questions come back in seconds.

## Try it free

BigQuery has a free tier and public datasets - you can query billions of rows without setting anything up.
