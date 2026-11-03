# Code Journey: system design

Revision notes on how the system is built, how it handles failure, how it grows, and how the pieces talk to each other. The database has its own file: `3-database-design.md`.

---

## 1. The big picture

```
                         VISITOR'S BROWSER
  +-----------------------------------------------------------------+
  |  Pages (React)      PathProvider (My Path state)   CJ AI panel  |
  |  Service worker (offline)      Supabase client (user token)     |
  +--------+------------------------------+---------------+---------+
           |                              |               |
           | page requests                | own data      | questions
           v                              v               v
  +-------------------------+    +----------------+   +------------------------+
  |  VERCEL                 |    |  SUPABASE      |   |  VERCEL route handlers |
  |  Static pages           |    |  Auth          |   |  /api/chat             |
  |  (built from files in   |    |  Postgres      |<--|  /api/contact          |
  |   content/ at build)    |    |  + RLS rules   |   |  /api/cron/weekly-email|
  |                         |    |  + SQL funcs   |   |  /api/email/unsubscribe|
  |  Admin dashboard        |    |  + vector index|   |  Admin server actions  |
  +-------------------------+    +----------------+   +-----------+------------+
                                                                  |
                              +-----------------------------------+------------+
                              |                 |                              |
                        +-----v-----+     +-----v------+                +------v-----+
                        |  GEMINI   |     |  RESEND    |                | GITHUB     |
                        |  AI model |     |  email     |                | ACTIONS    |
                        +-----------+     +------------+                | link check |
                                                                        | index sync |
                                                                        +------------+
```

Three ideas explain the whole picture:

1. **Public content is files.** Roles, skills, pay and the quiz live in `content/`. They are turned into web pages when the site is built. Showing a page never touches a database.
2. **Personal data goes straight from the browser to the database.** The browser sends the user's login token, and the database's row-level security rules decide what that user may see or change.
3. **Only work that needs a secret or heavy logic runs on a server.** The AI, the contact form, the weekly email and the admin dashboard.

---

## 2. The parts and their jobs

| Part | Built with | Job |
|---|---|---|
| Content | Markdown and YAML files, checked by scripts | The whole curriculum, pay data, quiz, glossary |
| Website | Next.js 16, React 19, Tailwind | Renders every page, mostly at build time |
| Client state | React context | Shared UI state, and My Path progress |
| Database | Supabase (Postgres) | Accounts, progress, votes, AI index, usage counts, messages |
| Sign-in | Supabase Auth | Email and password, Google, GitHub |
| AI chat | Route handler + Gemini + SQL search | Answers from the site's own content, with citations |
| Email | Resend, through a daily cron | Opt-in weekly progress email |
| Offline | Service worker and web manifest | Installable app, offline reading of seen pages |
| Admin | Server actions, one shared password | Dashboard for the team |
| Quality checks | Build script, link checker, AI evaluation | Keep content and answers correct |

---

## 3. How the main flows work

### 3.1 Opening a page (most traffic)

```
Visitor -> CDN -> pre-built HTML page
                    |
                    v
              page loads in the browser
              (no database call for public pages)
```

Almost every public page is ready before anyone visits it. The CDN serves it. This is why the site stays fast and cannot be broken by a database outage.

### 3.2 Ticking off a skill (My Path)

```
Tap "Done"
   |
   +--> screen updates immediately (optimistic)
   |
   +--> database write with the user's token
          |
          +--> row-level security: is this my row?   yes -> saved
          |                                          no  -> refused
          +--> trigger: first time this skill is done -> log an event
                                                          (feeds the streak)
   If the write fails: the screen change is undone.
```

### 3.3 Asking CJ AI a question

```
Question + login token
   |
   1. Check the login token is valid
   2. Check today's count (40 a day) and add one
   3. If it is a follow-up, rewrite it as a standalone search
   4. Find any role or skill named in the question
   5. Turn the question into numbers (embedding) and search the index
      (meaning search and keyword search, combined)
   6. Is the best match strong enough?
        no  -> reply "Code Journey doesn't cover that yet", with the closest pages
        yes -> send the numbered sources, then stream the answer as it is written
```

The model never searches. The server finds the passages first, and the model may only answer from them.

### 3.4 Weekly progress email

```
Vercel cron, every day at 03:30 UTC
   |
   v
Check the secret -> pick today's group (one of seven, by weekday)
   |
   v
Database picks opted-in users in this group, not emailed in the last 6 days
   |
   v
Build each email from the user's route and progress
   |
   v
Send in batches of 100 -> mark each batch as sent only after it succeeds
```

### 3.5 Contact form

```
Form submit -> hidden "website" field filled? -> pretend it worked (bots)
            -> check email and message length
            -> more than 5 messages from this network this hour? -> refuse
            -> save to the team inbox (signed-in senders are linked)
```

### 3.6 Keeping the AI index up to date

```
Content changed and pushed to main
   |
   v
GitHub Action: rebuild passages -> re-embed only what changed -> update the index
   |
   v
Run the evaluation: does the right page come back?  Must score 85% or more, or the job fails.
```

---

## 4. Who may touch what

| Data | Who writes it | How it is protected |
|---|---|---|
| Content | The owner, through reviewed code changes | Build fails on bad content |
| A user's progress, bookmarks, votes, projects | That user, from the browser | Row-level security on every table |
| Progress history (for streaks) | Database trigger only | No client write allowed |
| AI index | The sync job, with the secret key | Table closed to browsers |
| Usage count, chat feedback | Server for the count, user for feedback | Count only changes through one function |
| Contact messages, login failures | Server only | Table closed to browsers |
| Secrets (service key, Gemini key, admin password) | Set in hosting environment | Never in browser code |

The rule to remember: **the browser writes only to tables where row-level security limits it to its own rows. Everything else goes through a server that holds the secret.**

---

## 5. How failure is handled

| What fails | What the visitor sees | How the system copes |
|---|---|---|
| Database is down | Public pages still work. Sign-in, progress and chat show errors | Public pages never ask the database. Failed progress changes are undone on screen |
| AI key is missing | Chat says it is not configured | Checked first, before any work |
| Embedding quota used up | Chat still answers, using keyword search only | Search falls back to keywords |
| Main AI model overloaded (429, 500, 503) | Answer comes from a faster backup model | Retry happens before any text is sent |
| AI fails halfway through an answer | Friendly "couldn't finish" message | Stream ends with an error event, no stack trace shown |
| Question not covered by the site | "Doesn't cover that yet", plus closest pages | No AI call made, so no cost and no guessing |
| Daily chat limit reached | Clear message, resets at midnight UTC | Counted atomically in the database |
| One email batch fails | That batch is not marked sent, so it can be retried | Mark-as-sent only after success |
| Bad content file | Build stops, nothing goes live | Schema and relationship checks run before every build |
| Service worker bug | Some visitors see an old version | Its file is never cached; bump a version to replace caches |
| Dead resource link | Found by the weekly check, not by visitors | Link checker report |

**Principle:** fail small, fail loudly at build time, and never show a broken state for long. Public content is the safest part, so it is built ahead of time.

---

## 6. Load and limits

| Part | Limit or control | What breaks first at higher use |
|---|---|---|
| Public pages | CDN, pre-built | Build time as content grows |
| Progress writes | Database connections, row checks | Connection count on a small database plan |
| Chat | 40 questions a day per user, plus AI rate limits | AI quotas, long before the app does |
| Email | 100 a day by default | The email provider's daily limit |
| Contact form | 5 messages an hour per network | Only spam from many networks |
| Admin dashboard | Counts over all users | Slower queries as the tables grow |

One CJ AI question makes up to three AI or database calls before the first word appears. That is the slowest path in the system.

---

## 7. How to grow it in future

### 7.1 Adding content (no code change)

- **New skill:** add it to the catalogue, write its page file, and add it to the relevant roles. The build checks that every link is valid.
- **New role:** add it to the catalogue, write its route file, add its pay row, and add quiz weights so the quiz can suggest it.
- **New blog post, glossary term or FAQ:** add a file or an entry. The AI index picks it up on the next sync.

### 7.2 Adding features

- **New user data:** add a table with row-level security in the same change, following the pattern in the database file.
- **New server route:** validate every input, limit abuse, return simple errors, and keep secrets on the server.
- **New private page:** exclude it from the offline cache and from search engines.
- **New colour theme:** add a palette, its dark version, and a database constraint update.

### 7.3 Scaling steps, in the order to do them

| Step | Why | Effort |
|---|---|---|
| Automated tests for streaks, quota and access rules | Protect the fragile logic before it grows | Medium |
| Refund a chat message when the answer fails | Fair quota | Small |
| Calibrate the AI confidence threshold from the evaluation | Better answers | Small |
| Cache answers to repeated questions | Lower AI cost | Small |
| Per-person admin accounts with an audit trail | Accountability for the team | Medium |
| Error alerts for the chat and email routes | Notice failures before users report them | Medium |
| Content-Security-Policy header | Stronger browser protection | Medium |
| Time zone for streaks | Fair weeks for everyone | Small |
| Verify sign-in tokens locally instead of a network call | Faster chat | Small |

### 7.4 Things to watch as it grows

- **Build time** as roles and skills increase, especially the compare pages.
- **Email volume**, which needs a bigger plan or a longer send window.
- **AI quotas**, which are the first real limit on usage.
- **Database size** for the progress log and the chat counters.

---

## 8. Build and release

```
Developer works on branch Dev
   -> commits with a short prefix (feat, fix, ui, content, refactor)
   -> merges into main
   -> Vercel builds: content check first, then the site
   -> live

Database changes are separate:
   -> new migration file written and tested locally (reset rebuilds everything)
   -> the owner applies it to production by hand
```

Database changes are never applied automatically. That keeps a bad schema change from going live by accident.

---

## 9. Security in one page

- **Secrets stay on the server.** The service key, the AI key, the email key, the cron secret and the admin password are never sent to a browser.
- **Row-level security on every user table.** A user can only read and write their own rows.
- **Admin is one shared password.** Signed cookie, failed attempts limited, sessions last 7 days.
- **Abuse limits.** Daily AI quota, contact form limits, login failure limits.
- **Private pages are never cached offline and are hidden from search engines.**
- **Privacy by design.** Opt-in email, no ads, analytics only with consent in Europe.

Known gaps to mention honestly: no automated tests, no Content-Security-Policy header, one shared admin password, and no error alerting.

---

## 10. Revision questions

1. Why does a public page keep working when the database is down?
2. What happens, step by step, when a visitor ticks a skill?
3. Why does the AI answer "doesn't cover that" instead of guessing, and what decides it?
4. Why is the weekly email split into seven groups?
5. Which part of the system holds secrets, and why only that part?
6. What would you fix first if traffic grew ten times?
