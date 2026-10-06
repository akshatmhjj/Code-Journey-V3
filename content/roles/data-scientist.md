---
title: Data Scientist
aliases: [Applied Scientist, Product Data Scientist, Decision Scientist, Quantitative Analyst]
summary: Data scientists use statistics, experiments and machine learning to explain what drives outcomes and predict what happens next — then turn that into decisions a business can act on.
whereTheyWork: Tech and product companies, banks and insurers, e-commerce, healthcare and pharma, consulting, and research labs.
dayInLife:
  - Design an A/B test and work out how long it must run to be trustworthy.
  - Build a model to predict which customers are likely to cancel.
  - Explore a new dataset and find the two variables that actually matter.
  - Explain to a product manager why a result isn't statistically meaningful yet.
  - Write the analysis up so others can reproduce it.
stages:
  - name: Foundations
    summary: Python, SQL and the statistics everything else rests on.
    skills: [python, sql, statistics, git]
    project: Analyse a public dataset in a notebook — clean it, describe it, and test one clear hypothesis.
    doneWhen: You can explain p-values, confidence intervals and correlation vs causation without notes.
    weeks: 12–16
  - name: Core
    summary: Working with data at speed and showing what it says.
    skills: [pandas, data-visualization, ab-testing, math-for-ml]
    project: Analyse a (real or simulated) A/B test end to end — sample size, results, uncertainty and a recommendation.
    doneWhen: You can take a vague business question and turn it into an analysis plan.
    weeks: 10–14
  - name: Job-ready
    summary: Machine learning you can explain and defend.
    skills: [machine-learning, data-storytelling, ai-coding-tools]
    project: A churn or price-prediction model with honest evaluation, feature importance and a write-up a manager could follow.
    doneWhen: Your portfolio shows two complete projects, from question to recommendation.
    weeks: 10–14
  - name: Senior
    summary: Deeper models, production and influence.
    skills: [deep-learning, mlops, llm-apis, technical-writing]
    project: Take a model to production behind an API and monitor how its performance changes over time.
    doneWhen: Your analyses change decisions, and other scientists build on your methods.
skills:
  must: [python, sql, statistics, pandas, machine-learning, data-visualization]
  should: [ab-testing, math-for-ml, data-storytelling, git]
  nice: [deep-learning, mlops, llm-apis, r, spark]
tools: [Jupyter or VS Code, pandas, scikit-learn, SQL warehouses (BigQuery, Snowflake), matplotlib and seaborn, Git, an experimentation platform, an AI coding assistant]
interview:
  rounds:
    - Recruiter screen
    - SQL and Python coding
    - Statistics and probability questions
    - Product or case round — design a metric or an experiment
    - Machine learning concepts and a take-home project for many roles
  practice:
    - { title: DataLemur, url: "https://datalemur.com/", provider: DataLemur, type: practice, cost: freemium }
    - { title: Machine Learning Interviews (free book), url: "https://huyenchip.com/ml-interviews-book/", provider: Chip Huyen, type: book, cost: free }
    - { title: Kaggle competitions, url: "https://www.kaggle.com/competitions", provider: Kaggle, type: practice, cost: free }
    - { title: StrataScratch, url: "https://www.stratascratch.com/", provider: StrataScratch, type: practice, cost: freemium }
aiImpact: LLMs now handle a lot of routine coding and first-pass analysis, and some classic modelling problems are solved by calling a foundation model. What remains hard — and valued — is experimental design, causal reasoning, knowing when a result is noise, and translating findings into decisions. Many data scientists now also evaluate and improve LLM-based features.
market:
  - text: Job titles have split — "product data scientist" roles lean on SQL, statistics and experiments, while "ML-focused" roles overlap with ML Engineer.
  - text: Most postings ask for Python, SQL and statistics first; deep learning is usually a plus rather than a requirement.
adjacent: [data-analyst, ml-engineer, ai-engineer, data-engineer]
updated: 2026-10-06
---

## Is this role for you?

Data science suits people who enjoy statistics and uncertainty — who want to know not just *what* happened but whether it's real and *why*. Expect more data cleaning and communication than model building.

## Data Scientist or ML Engineer?

Data scientists focus on analysis, experiments and models that inform decisions. [ML Engineers](/roles/ml-engineer) focus on building and running models in production systems. If you enjoy software engineering as much as maths, look at the ML Engineer route.
