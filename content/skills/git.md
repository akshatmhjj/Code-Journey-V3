---
title: Git & GitHub
domain: foundations
level: beginner
hours: 10–20
brief: Git records every change to your code so you can undo mistakes, work on ideas in parallel, and collaborate without overwriting each other. GitHub is where teams share it.
prereqs: []
learn:
  - topic: Repositories and commits
    detail: git init, git add, git commit - save snapshots of your project with clear messages.
  - topic: History and undo
    detail: git log, git diff, git restore and git revert - see what changed and safely go back.
  - topic: Branches
    detail: git switch -c feature - work on something new without touching the main code.
  - topic: Merging and conflicts
    detail: Combine branches, and resolve conflicts calmly when two changes touch the same lines.
  - topic: Remotes
    detail: git clone, git push, git pull - sync your work with GitHub.
  - topic: Pull requests
    detail: Propose changes, get reviews, and merge - the way almost every team works.
  - topic: .gitignore and secrets
    detail: Keep node_modules, build output and .env files out of the repo. Never commit keys.
  - topic: Rebase basics
    detail: Tidy a branch before merging - and know when not to rewrite shared history.
resources:
  - title: Pro Git (free book)
    url: https://git-scm.com/book/en/v2
    provider: Git project
    type: docs
    cost: free
    official: true
  - title: "GitHub Docs: Get started"
    url: https://docs.github.com/en/get-started
    provider: GitHub
    type: docs
    cost: free
    official: true
  - title: Learn Git Branching
    url: https://learngitbranching.js.org/
    provider: Peter Cottle
    type: interactive
    cost: free
  - title: Oh Shit, Git!?!
    url: https://ohshitgit.com/
    provider: Katie Sylor-Miller
    type: article
    cost: free
checked: 2026-10-06
---

## In plain English

Git is a save system for code with unlimited undo. Every commit is a snapshot you can return to. Branches let you try an idea in a separate copy, then merge it back only if it works. GitHub (or GitLab) stores those snapshots online so a team can work on the same project.

## Why it matters

Every software job uses Git, from day one. Interviewers often look at your GitHub, and a tidy history with clear commit messages quietly signals that you know how teams work.

## A first look

```bash
git switch -c add-search      # new branch
git add src/search.ts
git commit -m "Add search to the header"
git push -u origin add-search # then open a pull request
```
