---
title: Deploying Web Apps
domain: cloud-devops
level: beginner
hours: 10–20
brief: Getting your app from your laptop onto the internet - choosing a host, configuring environments and domains, and shipping updates safely.
prereqs:
  - git
learn:
  - topic: Hosting options
    detail: Static hosts, platforms (Vercel, Netlify, Render, Fly.io) and raw cloud servers.
  - topic: Environment variables
    detail: Separate config and secrets for development and production.
  - topic: Build vs runtime
    detail: What happens at build time, and what runs on the server.
  - topic: Domains and HTTPS
    detail: DNS records, custom domains and automatic certificates.
  - topic: Preview deployments
    detail: A live URL for every pull request.
  - topic: Databases in production
    detail: Managed databases, migrations and backups.
  - topic: Rollbacks
    detail: Undo a bad release in seconds.
  - topic: The Twelve-Factor App
    detail: Principles for apps that deploy cleanly anywhere.
resources:
  - title: Vercel documentation
    url: https://vercel.com/docs
    provider: Vercel
    type: docs
    cost: free
    official: true
  - title: Netlify documentation
    url: https://docs.netlify.com/
    provider: Netlify
    type: docs
    cost: free
    official: true
  - title: Render documentation
    url: https://render.com/docs
    provider: Render
    type: docs
    cost: free
    official: true
  - title: The Twelve-Factor App
    url: https://12factor.net/
    provider: Heroku
    type: article
    cost: free
checked: 2026-10-06
---

## In plain English

An app nobody can open isn't finished. Deployment is the last mile: putting your code on a server, connecting a domain, keeping secrets safe and making updates routine. Modern platforms make the first deploy take minutes - learn what they do for you so you can debug when it goes wrong.
