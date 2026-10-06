---
title: Application Security Engineer
aliases: [AppSec Engineer, Product Security Engineer, Security Engineer, DevSecOps Engineer]
summary: Application security engineers find and fix security flaws in the software a company builds - reviewing designs and code, testing for vulnerabilities, and building guardrails so developers ship secure code by default.
whereTheyWork: Tech and SaaS companies, banks and fintech, healthcare, e-commerce, security consultancies, and government and defence contractors.
dayInLife:
  - Threat-model a new payments feature with the team building it.
  - Review a pull request that changes how sessions work.
  - Triage findings from a security scanner and separate real risks from noise.
  - Verify and fix a vulnerability reported through the bug bounty programme.
  - Add a security check to the CI pipeline so a class of bug can't come back.
stages:
  - name: Foundations
    summary: How the web works, one language and solid development basics.
    skills: [how-the-internet-works, python, git, command-line, rest-apis]
    project: Build a small web API with login in Python, then write down every way you think it could be attacked.
    doneWhen: You can read and write code comfortably and explain HTTP, cookies and sessions in detail.
    weeks: 10–14
  - name: Core
    summary: Web vulnerabilities and how to find them.
    skills: [web-security, owasp-top-10, authentication, security-testing]
    project: Work through the PortSwigger Web Security Academy labs for the main vulnerability classes, and write up five in your own words.
    doneWhen: You can find, exploit (in a lab) and explain how to fix each OWASP Top 10 class.
    weeks: 14–18
  - name: Job-ready
    summary: Security in the development lifecycle.
    skills: [threat-modeling, ci-cd, docker, cloud-security, ai-coding-tools]
    project: Add SAST, dependency and secret scanning to a CI pipeline, threat-model an app, and fix what you find.
    doneWhen: You can review a design or pull request and give developers specific, fixable feedback.
    weeks: 10–14
  - name: Senior
    summary: Security programmes and architecture.
    skills: [system-design, kubernetes, technical-writing]
    project: Write a secure-by-default guideline for your stack (auth, secrets, input handling) and get a team to adopt it.
    doneWhen: Developers come to you early, and whole classes of vulnerabilities stop appearing.
skills:
  must: [web-security, owasp-top-10, authentication, security-testing, python, rest-apis]
  should: [threat-modeling, cloud-security, ci-cd, docker, git]
  nice: [kubernetes, system-design, technical-writing]
tools: [Burp Suite, OWASP ZAP, Semgrep or CodeQL, dependency scanners, a secrets scanner, Git, a cloud console, an AI coding assistant]
interview:
  rounds:
    - Recruiter screen
    - Web security fundamentals - explain and fix common vulnerabilities
    - Secure code review - find the bugs in a snippet
    - Threat modelling or design review exercise
    - Coding or scripting, and a behavioural round
  practice:
    - { title: PortSwigger Web Security Academy, url: "https://portswigger.net/web-security", provider: PortSwigger, type: interactive, cost: free }
    - { title: OWASP Juice Shop, url: "https://owasp.org/www-project-juice-shop/", provider: OWASP, type: practice, cost: free, official: true }
    - { title: Hack The Box, url: "https://www.hackthebox.com/", provider: Hack The Box, type: practice, cost: freemium }
    - { title: TryHackMe, url: "https://tryhackme.com/", provider: TryHackMe, type: practice, cost: freemium }
aiImpact: AI coding tools increase the volume of code shipped - and AI-generated code can repeat insecure patterns confidently. That raises demand for people who can review code, design guardrails and automate checks at scale. AI features also bring new risks, such as prompt injection and data leakage, that AppSec teams now own.
market:
  - text: Application security is one of the most consistently hired specialisms in cybersecurity, especially at companies building their own software.
  - text: Postings usually want development experience plus web security knowledge; certifications help less than demonstrable skills (labs, write-ups, bug bounty findings).
adjacent: [cloud-security-engineer, backend-engineer, devops-engineer, qa-sdet]
updated: 2026-10-06
---

## Is this role for you?

AppSec suits curious people who enjoy figuring out how things break - and who can explain risks to developers without lecturing. It sits between development and security, so coding ability matters as much as security knowledge.

## A common path

Many AppSec engineers start as developers ([Backend](/roles/backend-engineer) or [Full-Stack](/roles/full-stack-engineer)) and move across. Practising legally on labs like PortSwigger's and Juice Shop is the fastest way to build real skills.

## Stay legal

Only test systems you own or have written permission to test. Bug bounty programmes are the legal way to practise on real companies.
