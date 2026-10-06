---
title: Shell Scripting (Bash)
domain: cloud-devops
level: intermediate
hours: 20–30
brief: Writing Bash scripts to automate repetitive tasks — deployments, backups, setup and glue between tools. The everyday language of infrastructure work.
prereqs:
  - command-line
learn:
  - topic: Scripts and shebangs
    detail: "#!/usr/bin/env bash, making files executable, and running them."
  - topic: Variables and quoting
    detail: Always quote "$vars" — the source of most Bash bugs.
  - topic: Conditionals and loops
    detail: if, case, for and while for real automation.
  - topic: Exit codes and error handling
    detail: set -euo pipefail, and checking that commands succeeded.
  - topic: Functions and arguments
    detail: $1, $@, getopts — build small reusable tools.
  - topic: Text processing
    detail: grep, sed, awk, cut, sort and jq for JSON.
  - topic: Scheduling
    detail: cron and systemd timers.
  - topic: Linting
    detail: ShellCheck catches mistakes before they bite.
resources:
  - title: GNU Bash manual
    url: https://www.gnu.org/software/bash/manual/bash.html
    provider: GNU
    type: docs
    cost: free
    official: true
  - title: BashGuide
    url: https://mywiki.wooledge.org/BashGuide
    provider: Greg's Wiki
    type: docs
    cost: free
  - title: ShellCheck
    url: https://www.shellcheck.net/
    provider: ShellCheck
    type: tool
    cost: free
  - title: "Missing Semester: Shell tools and scripting"
    url: https://missing.csail.mit.edu/2020/shell-tools/
    provider: MIT
    type: course
    cost: free
checked: 2026-10-06
---

## In plain English

If you type the same five commands every week, a script can do it for you — the same way every time. Bash scripts glue tools together: back up a database, deploy a build, clean old logs.

## A first look

```bash
#!/usr/bin/env bash
set -euo pipefail
backup="db-$(date +%F).sql.gz"
pg_dump "$DATABASE_URL" | gzip > "$backup"
echo "Saved $backup"
```
