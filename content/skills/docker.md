---
title: Docker
domain: cloud-devops
level: intermediate
hours: 20–35
brief: Docker packages an app with everything it needs into a container that runs the same on your laptop, a teammate's machine and in production.
prereqs:
  - command-line
learn:
  - topic: Images and containers
    detail: An image is the recipe; a container is a running copy.
  - topic: Dockerfiles
    detail: FROM, COPY, RUN, CMD — build your own images.
  - topic: Layers and caching
    detail: Order instructions so rebuilds are fast.
  - topic: Smaller, safer images
    detail: Multi-stage builds, slim base images and non-root users.
  - topic: Ports, volumes and environment
    detail: Expose services, persist data and pass configuration.
  - topic: Docker Compose
    detail: Run an app, its database and its cache together with one command.
  - topic: Registries
    detail: Push and pull images from Docker Hub, GHCR or a cloud registry.
  - topic: Debugging
    detail: docker logs, docker exec and inspecting what went wrong.
resources:
  - title: "Docker: Get started"
    url: https://docs.docker.com/get-started/
    provider: Docker
    type: docs
    cost: free
    official: true
  - title: Dockerfile best practices
    url: https://docs.docker.com/build/building/best-practices/
    provider: Docker
    type: docs
    cost: free
    official: true
  - title: Play with Docker
    url: https://labs.play-with-docker.com/
    provider: Docker
    type: interactive
    cost: free
  - title: Docker Curriculum
    url: https://docker-curriculum.com/
    provider: Prakhar Srivastav
    type: course
    cost: free
checked: 2026-10-06
---

## In plain English

"It works on my machine" happens because machines differ. A container bundles your app with its exact runtime and libraries, like a shipping container that fits any ship. Build it once, run it anywhere.

## A first look

```dockerfile
FROM node:22-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
USER node
CMD ["node", "server.js"]
```
