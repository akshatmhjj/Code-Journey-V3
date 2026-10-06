---
title: Data Analyst
aliases: [Business Analyst, Product Analyst, BI Analyst, Reporting Analyst]
summary: Data analysts answer business questions with data - pulling it with SQL, cleaning it, finding what changed and why, and explaining it in charts and dashboards people actually use.
whereTheyWork: Almost every industry - e-commerce, banking, consulting, healthcare, SaaS, logistics - usually within product, marketing, finance or operations teams.
dayInLife:
  - Answer "why did sign-ups drop last week?" with a SQL query and a chart.
  - Clean a messy export from a CRM before anyone can trust the numbers.
  - Build or update a dashboard the sales team checks every morning.
  - Explain a finding to a manager in two minutes, without jargon.
  - Agree on exactly how a metric like "active user" is defined.
stages:
  - name: Foundations
    summary: Spreadsheets, SQL and the basic statistics behind every report.
    skills: [spreadsheets, sql, statistics]
    project: Take a public dataset (e.g. a city's bike-share trips), answer five business questions in SQL, and summarise them in a spreadsheet.
    doneWhen: You can write queries with joins, GROUP BY and CTEs, and explain a mean, median and percentage change correctly.
    weeks: 8–12
  - name: Core
    summary: Visualising data and turning numbers into a story.
    skills: [data-visualization, bi-tools, data-storytelling]
    project: A public dashboard (Power BI or Tableau Public) on a topic you care about, with a one-page written summary of what it shows.
    doneWhen: Someone non-technical can read your dashboard and tell you the main takeaway.
    weeks: 8–10
  - name: Job-ready
    summary: Python for analysis, experiments and version control.
    skills: [python, pandas, ab-testing, git, ai-coding-tools]
    project: An analysis notebook that cleans a messy dataset, tests a hypothesis, and ends in a clear recommendation - published on GitHub.
    doneWhen: You have three portfolio projects, each with a question, method, result and recommendation.
    weeks: 8–12
  - name: Senior
    summary: Owning metrics and shaping how the business uses data.
    skills: [data-modeling, dbt, technical-writing]
    project: Define the core metrics for a product, document them, and build the clean tables that power them.
    doneWhen: Teams come to you to decide what to measure, not just to pull numbers.
skills:
  must: [sql, spreadsheets, data-visualization, bi-tools, statistics]
  should: [python, pandas, data-storytelling, ab-testing, git]
  nice: [data-modeling, dbt, r, ai-coding-tools]
tools: [Excel or Google Sheets, a SQL editor (DBeaver, BigQuery console), Power BI or Tableau, Looker Studio, Jupyter, Python with pandas, an AI assistant for writing queries]
interview:
  rounds:
    - Recruiter screen
    - SQL test - joins, aggregations, window functions
    - Case study - interpret a dataset or dashboard and make a recommendation
    - Spreadsheet or BI exercise
    - Behavioural round on communicating findings to non-technical people
  practice:
    - { title: DataLemur, url: "https://datalemur.com/", provider: DataLemur, type: practice, cost: freemium }
    - { title: StrataScratch, url: "https://www.stratascratch.com/", provider: StrataScratch, type: practice, cost: freemium }
    - { title: SQLZoo, url: "https://sqlzoo.net/", provider: SQLZoo, type: interactive, cost: free }
    - { title: Kaggle datasets, url: "https://www.kaggle.com/datasets", provider: Kaggle, type: practice, cost: free }
aiImpact: AI can now write SQL and build first-draft charts from a plain-English question, so pulling numbers alone is less valuable. Analysts who thrive know the business, define metrics carefully, spot when a number is wrong, and explain what it means for a decision. Checking AI-written queries against the data is now part of the job.
market:
  - text: SQL appears in the large majority of data analyst job posts, usually alongside Excel and one BI tool (Power BI or Tableau).
  - text: Data analyst is one of the most common entry points into tech for career changers, especially from finance, operations and research.
adjacent: [data-scientist, analytics-engineer, data-engineer]
updated: 2026-10-06
---

## Is this role for you?

Analytics suits curious people who like puzzles and explaining things. Most of the job is asking good questions, cleaning data and communicating clearly - not advanced maths or machine learning.

It's also one of the best routes into tech from another field: your domain knowledge (finance, marketing, healthcare) is a real advantage.

## Analyst or scientist?

Analysts explain what happened and why. [Data Scientists](/roles/data-scientist) go further into statistics and prediction. Many people start as analysts and move across once they've added Python, statistics and machine learning.
