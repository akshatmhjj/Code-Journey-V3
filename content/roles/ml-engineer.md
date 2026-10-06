---
title: ML Engineer
aliases: [Machine Learning Engineer, Applied ML Engineer, Deep Learning Engineer, ML Software Engineer]
summary: ML engineers train, deploy and maintain machine learning models in real products - building the data pipelines, training jobs and serving systems that keep models accurate and fast.
whereTheyWork: Tech companies with ranking, search, recommendations or fraud problems; AI labs; autonomous systems and robotics; fintech; and healthcare imaging.
dayInLife:
  - Build features from raw event data for a recommendation model.
  - Train a model, compare it to the current one and decide if it's worth shipping.
  - Put a model behind an API and get its response time under budget.
  - Investigate why a model's accuracy dropped after a product change.
  - Automate retraining so the model stays fresh without manual work.
stages:
  - name: Foundations
    summary: Python, the maths behind models, and software basics.
    skills: [python, math-for-ml, statistics, git, data-structures-algorithms]
    project: Implement linear regression and gradient descent from scratch in NumPy, then compare with scikit-learn.
    doneWhen: You can explain what a gradient is and why it's used, and write clean, tested Python.
    weeks: 12–16
  - name: Core
    summary: Classical ML and deep learning, done properly.
    skills: [pandas, sql, machine-learning, deep-learning, pytorch]
    project: Train an image or text classifier in PyTorch with a proper validation set, error analysis and a written evaluation.
    doneWhen: You can diagnose overfitting, data leakage and class imbalance, and fix them.
    weeks: 14–18
  - name: Job-ready
    summary: Getting models into production and keeping them there.
    skills: [docker, mlops, deployment, airflow, observability, ai-coding-tools]
    project: Serve your model behind an API in a container, with a scheduled retraining pipeline and monitoring for drift.
    doneWhen: Your model runs in production-like conditions and you'd know within a day if it degraded.
    weeks: 10–14
  - name: Senior
    summary: ML systems at scale.
    skills: [system-design, kubernetes, aws, llm-apis, spark]
    project: Design an end-to-end ML system (e.g. feed ranking) - data, training, serving, evaluation and cost - as a design doc.
    doneWhen: You can make trade-offs between model quality, latency and cost and explain them to non-ML engineers.
skills:
  must: [python, machine-learning, deep-learning, pytorch, sql, math-for-ml, git]
  should: [mlops, docker, statistics, deployment, data-structures-algorithms]
  nice: [kubernetes, airflow, spark, aws, llm-apis, system-design]
tools: [Python, PyTorch, scikit-learn, Jupyter, MLflow or Weights & Biases, Docker, a cloud ML platform (SageMaker, Vertex AI), GPUs, an AI coding assistant]
interview:
  rounds:
    - Recruiter screen
    - Coding - data structures and algorithms
    - ML fundamentals - bias/variance, metrics, model choices
    - ML system design - e.g. design a recommendation or fraud-detection system
    - Project deep dive and behavioural round
  practice:
    - { title: Machine Learning Interviews (free book), url: "https://huyenchip.com/ml-interviews-book/", provider: Chip Huyen, type: book, cost: free }
    - { title: Designing Machine Learning Systems (book), url: "https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/", provider: Chip Huyen, type: book, cost: paid }
    - { title: NeetCode roadmap, url: "https://neetcode.io/roadmap", provider: NeetCode, type: practice, cost: freemium }
    - { title: Kaggle competitions, url: "https://www.kaggle.com/competitions", provider: Kaggle, type: practice, cost: free }
aiImpact: Foundation models have replaced many custom models for language and vision tasks, so some ML work has moved to fine-tuning, evaluation and serving large models efficiently. Demand stays strong for engineers who understand training deeply and can run models reliably and cheaply at scale.
market:
  - text: ML engineer postings increasingly overlap with AI engineering - fine-tuning, serving and evaluating large models alongside classical ML.
  - text: Most roles expect solid software engineering; strong coding often matters as much as maths in interviews.
adjacent: [ai-engineer, data-scientist, mlops-engineer, backend-engineer]
updated: 2026-10-06
---

## Is this role for you?

ML engineering suits people who enjoy both maths and software engineering and want to see models working in the real world, not just in notebooks. It's one of the more demanding routes, so expect it to take longer than most.

## Where to start

If you're new to programming, begin with [Data Analyst](/roles/data-analyst) or [Backend Engineer](/roles/backend-engineer) skills and move across. If you already code well, start with the maths and classical ML here before deep learning.
