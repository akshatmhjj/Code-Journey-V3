---
title: Message Queues & Events
domain: web
level: advanced
hours: 20–30
brief: Message queues and event streams let services hand off work and react to events without waiting on each other - the backbone of background jobs and scalable systems.
prereqs:
  - rest-apis
learn:
  - topic: Why queue
    detail: Move slow work (emails, video processing, reports) out of the request path.
  - topic: Producers, consumers and brokers
    detail: Who sends, who receives, and what sits in between.
  - topic: Queues vs streams
    detail: RabbitMQ/SQS-style work queues vs Kafka-style event logs.
  - topic: Delivery guarantees
    detail: At-least-once delivery, and why consumers must be idempotent.
  - topic: Retries and dead-letter queues
    detail: What happens to messages that keep failing.
  - topic: Ordering and partitioning
    detail: When order matters and how streams preserve it.
  - topic: Event-driven design
    detail: Publishing events so other services can react independently.
resources:
  - title: RabbitMQ tutorials
    url: https://www.rabbitmq.com/tutorials
    provider: RabbitMQ
    type: course
    cost: free
    official: true
  - title: Apache Kafka quickstart
    url: https://kafka.apache.org/quickstart
    provider: Apache
    type: docs
    cost: free
    official: true
  - title: Amazon SQS developer guide
    url: https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html
    provider: AWS
    type: docs
    cost: free
    official: true
checked: 2026-10-06
---

## In plain English

When you upload a video, the site doesn't make you wait while it's processed. It drops a note in a queue - "process video 123" - and replies straight away. A separate worker picks up the note when it can. Queues decouple the fast part from the slow part.
