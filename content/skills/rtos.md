---
title: Real-Time Operating Systems
domain: specialist
level: advanced
hours: 30–50
brief: Real-time operating systems such as FreeRTOS and Zephyr let embedded devices run several tasks with predictable timing — essential when a deadline missed is a failure.
prereqs:
  - microcontrollers
learn:
  - topic: Why real time
    detail: Hard vs soft deadlines and predictability over raw speed.
  - topic: Tasks and scheduling
    detail: Priorities, pre-emption and the scheduler.
  - topic: Synchronisation
    detail: Mutexes, semaphores and avoiding priority inversion.
  - topic: Communication
    detail: Queues, event groups and notifications between tasks.
  - topic: Timing
    detail: Ticks, delays, software timers and interrupt interaction.
  - topic: Memory
    detail: Static vs dynamic allocation and stack sizing.
  - topic: Debugging
    detail: Tracing tools and finding deadlocks and stack overflows.
resources:
  - title: FreeRTOS
    url: https://www.freertos.org/
    provider: FreeRTOS
    type: docs
    cost: free
    official: true
  - title: Mastering the FreeRTOS Real Time Kernel (book)
    url: https://github.com/FreeRTOS/FreeRTOS-Kernel-Book
    provider: FreeRTOS
    type: book
    cost: free
    official: true
  - title: Zephyr Project documentation
    url: https://docs.zephyrproject.org/latest/
    provider: Zephyr Project
    type: docs
    cost: free
    official: true
  - title: Interrupt blog
    url: https://interrupt.memfault.com/
    provider: Memfault
    type: article
    cost: free
checked: 2026-10-06
---

## In plain English

A simple device runs one loop forever. A complex one — say, a drone — must read sensors, adjust motors and talk over radio at the same time, each on a strict schedule. An RTOS splits the work into tasks and guarantees the most urgent ones always run on time.
