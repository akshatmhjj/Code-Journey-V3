---
title: Kubernetes
domain: cloud-devops
level: advanced
hours: 50–80
brief: Kubernetes runs and manages containers across many machines — restarting failures, scaling with traffic and rolling out updates without downtime.
prereqs:
  - docker
  - networking
learn:
  - topic: Why Kubernetes
    detail: What it solves — and when a simpler platform is the better choice.
  - topic: Pods, Deployments and ReplicaSets
    detail: How your containers are run and kept alive.
  - topic: Services and Ingress
    detail: Stable networking inside the cluster and traffic from outside.
  - topic: ConfigMaps and Secrets
    detail: Configuration without rebuilding images.
  - topic: Resource requests and limits
    detail: Fair scheduling and avoiding noisy neighbours.
  - topic: Health checks
    detail: Liveness and readiness probes.
  - topic: Scaling and rollouts
    detail: Horizontal Pod Autoscaler, rolling updates and rollbacks.
  - topic: kubectl and Helm
    detail: Day-to-day commands and packaging apps.
resources:
  - title: Kubernetes Basics tutorial
    url: https://kubernetes.io/docs/tutorials/kubernetes-basics/
    provider: Kubernetes
    type: interactive
    cost: free
    official: true
  - title: Kubernetes concepts
    url: https://kubernetes.io/docs/concepts/
    provider: Kubernetes
    type: docs
    cost: free
    official: true
  - title: Killercoda Kubernetes scenarios
    url: https://killercoda.com/
    provider: Killercoda
    type: interactive
    cost: free
  - title: Kubernetes the Hard Way
    url: https://github.com/kelseyhightower/kubernetes-the-hard-way
    provider: Kelsey Hightower
    type: course
    cost: free
checked: 2026-10-06
---

## In plain English

Docker runs one container. Kubernetes runs hundreds across a fleet of machines, and keeps them in the state you describe: "always three copies of the API, restart any that die, spread them across zones." You declare what you want; Kubernetes keeps making it true.

## Learn Docker first

Kubernetes concepts only make sense once containers feel natural.
