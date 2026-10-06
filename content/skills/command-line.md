---
title: Command Line & Linux Basics
domain: foundations
level: beginner
hours: 10–20
brief: The command line lets you control a computer by typing instead of clicking. Developers use it all day to run code, manage files, use Git and work on servers.
prereqs: []
learn:
  - topic: Navigating
    detail: pwd, ls, cd - know where you are and move around the file system.
  - topic: Files and folders
    detail: mkdir, touch, cp, mv, rm - create, copy, move and delete (carefully).
  - topic: Reading files
    detail: cat, less, head, tail -f - look inside files and follow logs as they grow.
  - topic: Searching
    detail: grep and find - locate text in files and files on disk.
  - topic: Pipes and redirection
    detail: "| > >> - chain small commands into powerful ones."
  - topic: Permissions
    detail: chmod, chown and sudo - who can read, write and run what.
  - topic: Processes
    detail: ps, top, kill - see what's running and stop what's stuck.
  - topic: Environment
    detail: PATH, environment variables and your shell config (.zshrc or .bashrc).
resources:
  - title: GNU Bash manual
    url: https://www.gnu.org/software/bash/manual/bash.html
    provider: GNU
    type: docs
    cost: free
    official: true
  - title: The Missing Semester of Your CS Education
    url: https://missing.csail.mit.edu/
    provider: MIT
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

Clicking through folders is fine for a few files. Typing `grep -r "TODO" src` finds every TODO in a project in a second. The command line is a faster, scriptable way to tell a computer what to do - and on servers it's often the only way.

## Why it matters

Git, package managers, build tools, Docker and cloud tools are all used from the terminal. Being comfortable here makes every other skill easier to learn.
