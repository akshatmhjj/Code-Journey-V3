---
title: MLOps Engineer
aliases: [ML Platform Engineer, ML Infrastructure Engineer, LLMOps Engineer, AI Platform Engineer]
summary: MLOps engineers build the platform that trains, deploys, serves and monitors machine learning models — so data scientists and ML engineers can ship models reliably, reproducibly and at reasonable cost.
whereTheyWork: Companies running many models in production, AI labs and AI-first startups, cloud providers, and platform teams at large enterprises.
dayInLife:
  - Build a pipeline that retrains a model weekly and only promotes it if it beats the current one.
  - Get a model's serving latency under 100 ms on cheaper hardware.
  - Set up monitoring that alerts when input data starts drifting.
  - Help a data scientist turn a notebook into a reproducible training job.
  - Manage GPU capacity and cost across teams.
stages:
  - name: Foundations
    summary: Software engineering, Linux and ML basics.
    skills: [python, linux, git, command-line, machine-learning]
    project: Train a scikit-learn model, then turn the notebook into a tested Python package with a command-line entry point.
    doneWhen: You write clean, tested Python and understand how a model is trained and evaluated.
    weeks: 10–14
  - name: Core
    summary: Containers, pipelines and the cloud.
    skills: [docker, ci-cd, aws, mlops, airflow]
    project: A containerised training pipeline with experiment tracking and a model registry, triggered by CI.
    doneWhen: Anyone can reproduce any model you've trained from a commit and a run ID.
    weeks: 12–16
  - name: Job-ready
    summary: Serving, scaling and monitoring.
    skills: [kubernetes, terraform, observability, deployment, llm-apis, ai-coding-tools]
    project: Serve a model on Kubernetes with autoscaling, a canary rollout, and drift and latency monitoring.
    doneWhen: You can ship a new model version with no downtime and roll back in a minute.
    weeks: 12–16
  - name: Senior
    summary: ML platforms for many teams.
    skills: [system-design, deep-learning, incident-response]
    project: Design an internal ML platform — training, feature storage, serving, monitoring and cost controls — as a design doc.
    doneWhen: Other teams ship models faster and more safely because of your platform.
skills:
  must: [python, mlops, docker, kubernetes, ci-cd, machine-learning]
  should: [aws, terraform, airflow, observability, deployment]
  nice: [deep-learning, llm-apis, system-design, incident-response]
tools: [Python, Docker, Kubernetes, MLflow or Weights & Biases, Airflow or Kubeflow, a cloud ML platform (SageMaker, Vertex AI), Terraform, Prometheus and Grafana, GPUs, an AI coding assistant]
interview:
  rounds:
    - Recruiter screen
    - Coding — Python and some algorithms
    - ML fundamentals — training, evaluation, common failure modes
    - ML platform or system design — serving, retraining, monitoring at scale
    - Infrastructure scenario and behavioural round
  practice:
    - { title: MLOps Zoomcamp, url: "https://github.com/DataTalksClub/mlops-zoomcamp", provider: DataTalks.Club, type: course, cost: free }
    - { title: Made With ML, url: "https://madewithml.com/", provider: Goku Mohandas, type: course, cost: free }
    - { title: Designing Machine Learning Systems (book), url: "https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/", provider: Chip Huyen, type: book, cost: paid }
aiImpact: Large language models have created a new branch of the job — LLMOps — covering prompt and model versioning, evaluation pipelines, GPU serving and inference cost. Demand for engineers who can run AI reliably and cheaply in production has grown sharply.
market:
  - text: MLOps roles overlap with platform and ML engineering; postings most often ask for Kubernetes, a cloud ML platform and Python.
  - text: Serving and evaluating large language models has become a growing part of MLOps work since 2024.
adjacent: [ml-engineer, platform-engineer, devops-engineer, ai-engineer]
updated: 2026-10-06
---

## Is this role for you?

MLOps suits people who enjoy infrastructure and automation and find machine learning interesting — but get more satisfaction from making models run reliably than from improving their accuracy.

## Getting in

Most MLOps engineers come from [DevOps](/roles/devops-engineer), [ML Engineering](/roles/ml-engineer) or backend roles. If you have infrastructure skills, add ML fundamentals; if you have ML skills, add Docker, Kubernetes and CI/CD.
