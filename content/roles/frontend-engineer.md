---
title: Frontend Engineer
aliases: [Frontend Developer, UI Engineer, React Developer, Web Developer]
summary: Frontend engineers build everything a user sees and interacts with in a web product - layouts, forms, navigation, animations - and make it fast, accessible and reliable on every screen size.
whereTheyWork: Product companies and SaaS startups, e-commerce, agencies and consultancies, media sites, and internal-tools teams inside large companies.
dayInLife:
  - Turn a design from Figma into a working, responsive screen.
  - Wire that screen to an API, with loading, empty and error states.
  - Review a teammate's pull request and an AI assistant's suggested changes.
  - Track down why a page feels slow on a mid-range Android phone.
  - Agree with backend engineers on the shape of a new API response.
stages:
  - name: Foundations
    summary: How the web works and the three languages every page is made of.
    skills: [how-the-internet-works, html, css, javascript, git, command-line]
    project: A responsive personal site with a contact form, published on your own URL.
    doneWhen: You can rebuild a simple page from a screenshot without a tutorial and explain what happens between typing a URL and seeing the page.
    weeks: 10–14
  - name: Core
    summary: Real applications - components, types and data from APIs.
    skills: [typescript, react, rest-apis, state-management, accessibility]
    project: A job board that loads listings from a public API, with search, filters, loading and error states, fully usable with only a keyboard.
    doneWhen: You can design a component tree for a new screen and explain where each piece of state lives and why.
    weeks: 12–16
  - name: Job-ready
    summary: The tools and habits teams expect on day one.
    skills: [nextjs, tailwind-css, frontend-testing, web-performance, deployment, ai-coding-tools]
    project: A full app with sign-in, a database-backed feature, automated tests in CI, and a Lighthouse mobile score above 90.
    doneWhen: Someone can clone your repo, run one command, and see tests pass - and your live app holds up on a slow phone.
    weeks: 8–12
  - name: Senior
    summary: Owning architecture, quality and other people's growth.
    skills: [system-design, design-systems, web-security, observability, technical-writing]
    project: Lead a feature across teams - write the design doc, set the performance budget, and mentor someone through it.
    doneWhen: Other engineers come to you for frontend architecture decisions, and your decisions hold up a year later.
skills:
  must: [html, css, javascript, typescript, react, git, accessibility, rest-apis]
  should: [nextjs, tailwind-css, frontend-testing, web-performance, state-management, ai-coding-tools, deployment]
  nice: [design-systems, graphql, web-security, nodejs, system-design]
tools: [VS Code or Cursor, Chrome DevTools, Git and GitHub, npm or pnpm, Figma, Vite, Vercel or Netlify, Playwright, an AI coding assistant]
interview:
  rounds:
    - Recruiter or hiring-manager screen
    - JavaScript and web fundamentals (closures, the event loop, the DOM, CSS layout)
    - A live UI build - usually React, sometimes plain JavaScript
    - Frontend system design for mid-level roles and above (e.g. design an infinite feed or autocomplete)
    - Behavioural round on collaboration, ownership and trade-offs
  practice:
    - { title: Front End Interview Handbook, url: "https://www.frontendinterviewhandbook.com/", provider: GreatFrontEnd, type: docs, cost: free }
    - { title: GreatFrontEnd, url: "https://www.greatfrontend.com/", provider: GreatFrontEnd, type: practice, cost: freemium }
    - { title: Frontend Mentor, url: "https://www.frontendmentor.io/", provider: Frontend Mentor, type: practice, cost: freemium }
    - { title: LeetCode, url: "https://leetcode.com/", provider: LeetCode, type: practice, cost: freemium }
aiImpact: AI coding assistants now produce first drafts of components, styles and tests in seconds, so the bar for entry-level work has moved up. What stays valuable is judgement - knowing whether generated UI is accessible, fast and maintainable, structuring state so features don't collide, and turning vague product requirements into clear interfaces. Learn to use these tools daily, and learn the fundamentals well enough to catch their mistakes.
market:
  - text: JavaScript and TypeScript are consistently among the most-used languages in the Stack Overflow Developer Survey, and React remains the most-used web framework there.
    source: { title: Stack Overflow Developer Survey, url: "https://survey.stackoverflow.co/" }
  - text: Most frontend postings now ask for TypeScript and at least one meta-framework such as Next.js, alongside React.
adjacent: [full-stack-engineer, design-engineer, cross-platform-mobile-engineer, qa-sdet]
updated: 2026-10-06
---

## Is this role for you?

You'll enjoy frontend work if you like seeing results immediately, care how things look and feel, and get satisfaction from making something easy to use. It suits people who notice when a button is two pixels off and when a form is confusing.

It's less of a fit if you'd rather never think about design or browsers, or you prefer working on data and infrastructure that users never see. In that case, look at [Backend Engineer](/roles/backend-engineer) or [Data Engineer](/roles/data-engineer).

## Frontend or full-stack?

Many job posts blur the two. Frontend roles go deeper on UI architecture, accessibility and performance. [Full-stack](/roles/full-stack-engineer) roles add APIs and databases and usually expect a bit less depth on each. Starting with frontend and adding backend later is a common, sensible route.
