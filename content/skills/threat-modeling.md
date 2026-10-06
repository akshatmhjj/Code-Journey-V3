---
title: Threat Modeling
domain: security
level: intermediate
hours: 10–20
brief: Thinking through how a system could be attacked before it's built - what you're protecting, from whom, and which defences matter most.
prereqs:
  - web-security
learn:
  - topic: Four questions
    detail: What are we building? What can go wrong? What will we do about it? Did we do a good job?
  - topic: Data-flow diagrams
    detail: Draw components, data stores and trust boundaries.
  - topic: STRIDE
    detail: Spoofing, tampering, repudiation, information disclosure, denial of service and elevation of privilege.
  - topic: Assets and attackers
    detail: What's valuable, and who realistically wants it.
  - topic: Prioritising risks
    detail: Likelihood and impact - fix what matters first.
  - topic: Mitigations
    detail: "Map each threat to a control: auth, validation, encryption, rate limiting, logging."
  - topic: Making it routine
    detail: Lightweight threat models in design reviews, not a one-off document.
resources:
  - title: OWASP Threat Modeling Cheat Sheet
    url: https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html
    provider: OWASP
    type: docs
    cost: free
    official: true
  - title: OWASP Threat Dragon
    url: https://owasp.org/www-project-threat-dragon/
    provider: OWASP
    type: tool
    cost: free
    official: true
  - title: Threat Modeling Manifesto
    url: https://www.threatmodelingmanifesto.org/
    provider: Threat Modeling Manifesto
    type: article
    cost: free
  - title: Microsoft Threat Modeling Tool
    url: https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool
    provider: Microsoft
    type: tool
    cost: free
checked: 2026-10-06
---

## In plain English

Before building a house, you'd think about where the doors and windows are and who might try them. Threat modelling does the same for software: draw how data moves, ask what could go wrong at each step, and decide which defences are worth it - while changes are still cheap.
