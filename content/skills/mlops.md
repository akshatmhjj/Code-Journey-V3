---
title: MLOps
domain: ai
level: advanced
hours: 40–60
brief: The practices and tools for getting ML models into production and keeping them healthy - reproducible training, deployment, monitoring and retraining.
prereqs:
  - machine-learning
  - docker
learn:
  - topic: Reproducibility
    detail: Version data, code and parameters so any model can be rebuilt.
  - topic: Experiment tracking
    detail: Log runs and compare them with MLflow or Weights & Biases.
  - topic: Model registry
    detail: Promote models from staging to production with approvals.
  - topic: Serving
    detail: Batch predictions vs real-time APIs, and latency budgets.
  - topic: Monitoring
    detail: Data drift, prediction drift and business metrics after launch.
  - topic: Pipelines and retraining
    detail: Automate training on schedules or triggers.
  - topic: CI/CD for ML
    detail: Test data and models, not just code.
resources:
  - title: MLflow documentation
    url: https://mlflow.org/docs/latest/index.html
    provider: MLflow
    type: docs
    cost: free
    official: true
  - title: Made With ML
    url: https://madewithml.com/
    provider: Goku Mohandas
    type: course
    cost: free
  - title: MLOps Zoomcamp
    url: https://github.com/DataTalksClub/mlops-zoomcamp
    provider: DataTalks.Club
    type: course
    cost: free
  - title: Rules of Machine Learning
    url: https://developers.google.com/machine-learning/guides/rules-of-ml
    provider: Google
    type: article
    cost: free
checked: 2026-10-06
---

## In plain English

Training a good model in a notebook is maybe a fifth of the work. The rest is making it run reliably in production, knowing when it starts getting worse, and retraining it without drama. That's MLOps.
