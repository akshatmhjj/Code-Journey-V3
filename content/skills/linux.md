---
title: Linux Administration
domain: cloud-devops
level: beginner
hours: 40–60
brief: Running and looking after Linux servers - users, packages, services, logs and security. Most of the internet runs on Linux, so this is the base of every infrastructure role.
prereqs:
  - command-line
learn:
  - topic: The file system
    detail: /etc, /var/log, /home, /usr - where things live and why.
  - topic: Users, groups and permissions
    detail: Who can do what, sudo, and least privilege.
  - topic: Packages
    detail: apt or dnf - installing, updating and pinning software.
  - topic: Services with systemd
    detail: systemctl start/enable/status, and reading journalctl logs.
  - topic: Processes and resources
    detail: top, htop, free, df, du - what's using CPU, memory and disk.
  - topic: SSH
    detail: Key-based login, config files and hardening a server.
  - topic: Networking tools
    detail: ip, ss, curl, dig - check ports, connections and DNS.
  - topic: Firewalls and updates
    detail: ufw or firewalld, and keeping a server patched.
resources:
  - title: Ubuntu Server documentation
    url: https://documentation.ubuntu.com/server/
    provider: Canonical
    type: docs
    cost: free
    official: true
  - title: Linux Journey
    url: https://linuxjourney.com/
    provider: Linux Journey
    type: course
    cost: free
  - title: The Linux Command Line (free book)
    url: https://linuxcommand.org/tlcl.php
    provider: William Shotts
    type: book
    cost: free
  - title: "OverTheWire: Bandit"
    url: https://overthewire.org/wargames/bandit/
    provider: OverTheWire
    type: practice
    cost: free
checked: 2026-10-06
---

## In plain English

Your laptop has an operating system you click around in. Servers run Linux, usually with no screen at all - you manage them over SSH from a terminal. Linux administration is knowing how to keep one of those machines healthy, secure and doing its job.

## How to practise

Rent the cheapest cloud VM you can find (or run one locally), and do everything there: host a site, add a user, read logs, break something and fix it.
