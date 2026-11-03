# Code Journey: database design

Revision notes on the database: what it stores, why it stores only that, who may read and write each table, and how to change it safely. It runs on Supabase (hosted Postgres 17). The system overview is in `2-system-design.md`.

---

## 1. The core idea

The database does **not** hold the curriculum. Roles, skills, pay and the quiz are files in the code repo. The database holds only:

1. **Who the user is** and their choices (route, statuses, bookmarks, votes).
2. **A log** of what happened (completed skills, for streaks).
3. **The AI index** (the searchable passages from the site's content).
4. **Usage and operations** (daily chat counts, feedback, contact messages, login failures).

Three rules shape the design:

- **Store choices, derive everything else.** Percentages, stages, milestones and streaks are calculated from choices and the log. Nothing is stored twice, so nothing can drift out of date.
- **Every user table is protected by row-level security (RLS).** A user can only see and change their own rows, enforced by the database itself, not by app code.
- **Content references are plain text, not foreign keys.** Skill and role slugs (such as `git`) are stored as text, so the database does not need the content to exist. The cost: renaming a slug orphans saved progress, so slugs never change.

---

## 2. The tables

### 2.1 Map

```
  auth.users (Supabase login accounts)
      |
      +-- profiles (1 row each: name, handle, theme, email opt-in, social links)
      +-- user_paths (1 row: chosen destination)
      +-- user_skill_status (1 row per started skill: learning or done)
      +-- user_progress_events (1 row per skill completed, append only)
      +-- user_saved_resources (bookmarks)
      +-- resource_votes (helpful / not helpful)
      +-- resource_suggestions (suggested links, for review)
      +-- user_projects (one project link per route stage)
      +-- chat_usage (messages per day)
      +-- chat_feedback (thumbs up or down on answers)

  No user link needed:
      doc_chunks (AI index)
      contact_messages (team inbox)
      admin_login_failures (rate limit for the admin page)
```

### 2.2 Table by table

| Table | What it stores | Key columns | Written by | Who can read |
|---|---|---|---|---|
| `profiles` | Account details and settings | id, name, handle, public name, path_public, weekly_email, email_token, theme, mode, github, linkedin, leetcode links | A trigger at sign-up, then the user | Owner only (public handle data via a safe function) |
| `user_paths` | The one route a user is working towards | user_id (key), role_slug, started_at | The user | Owner |
| `user_skill_status` | Status per skill. No row means "to do" | user_id + skill_slug (key), status: learning or done | The user | Owner |
| `user_progress_events` | Log of completions, never edited | user_id, skill_slug, created_at | Trigger only | Owner (read only) |
| `user_saved_resources` | Bookmarks, keyed by link | user_id + url (key), title snapshot, skill_slug | The user | Owner |
| `resource_votes` | Helpful or not helpful, per link | user_id + url (key), vote: 1 or -1 | The user | Owner. Helpful totals are public through a function |
| `resource_suggestions` | Suggested better links | skill_slug, url, title, note, status: new, accepted, declined | The user, max 5 a day | Owner (their own), team in the dashboard |
| `user_projects` | Project link per stage | user_id, role_slug, stage_name (unique together), title, https url | The user | Owner, and the public page through a function |
| `doc_chunks` | AI index: passages, a 768-number meaning vector, and a full-text vector | key (unique), source type, url, title, heading, content, content_hash, embedding, text vector | The sync job, with the secret key | Nobody directly. Read only through the search function |
| `chat_usage` | Questions asked per user per day | user_id + day (key), messages | The quota function | Owner (their own count) |
| `chat_feedback` | Thumbs up or down, with the question, answer and sources shown | user_id, question, answer, sources, rating (1 or -1), comment | The user | Owner (insert and read own) |
| `contact_messages` | Contact form inbox | name, email, topic, message, page, ip_hash, status: new or done | Server route only | Nobody from the browser |
| `admin_login_failures` | Failed admin sign-ins, for throttling | ip_hash, created_at | Server only | Nobody from the browser |
| `notes`, `tasks`, `activity_logs` | Leftovers from the first version of the app | Generic | Nothing in current code uses them | Owner (policies exist) |

### 2.3 Important details

- **Progress is one row per skill.** Changing a status updates that row. This keeps writes small.
- **The event log is the streak's memory.** A trigger adds a row only when a skill becomes done for the first time. Editing a finished skill adds nothing. This is why streaks survive later edits.
- **Statuses are restricted.** The database only accepts `learning` or `done`, and only valid slugs and https links.
- **Public profile links are restricted.** GitHub, LinkedIn and LeetCode links must match each site's profile pattern. Nothing else can be linked from a public page.
- **The AI index is closed to browsers.** The table has no access policy, so only the search function (and the sync job) can read it.
- **Contact and admin tables are closed to browsers.** Only server code with the secret key can touch them.
- **Suggestions cannot be self-approved.** A user can insert only with status `new`.

---

## 3. Functions and triggers

Functions run inside the database. They are how the app does things that a plain table read or write cannot.

| Name | Type | What it does |
|---|---|---|
| `handle_new_user` | Trigger on sign-up | Creates the profile row, with name and email. The browser never does this |
| `log_progress_event` | Trigger on status change | Adds a completion event the first time a skill becomes done |
| `limit_resource_suggestions` | Trigger on insert | Rejects a sixth suggestion in one day |
| `streak_weeks(user)` | Calculation | Counts consecutive active weeks, Monday to Sunday, UTC |
| `my_streak()` | Callable by the user | Returns the streak and whether this week already counts |
| `get_public_path(handle)` | Callable by anyone | Returns the public profile page data, never the email or the user id |
| `handle_available(handle)` | Callable by signed-in users | Checks a handle is free |
| `resource_helpful_counts(links)` | Callable by anyone | Helpful totals for up to 500 links |
| `consume_chat_message(limit)` | Callable by signed-in users | Adds one to today's count and says whether it is within the limit |
| `match_doc_chunks(vector, text, count)` | Callable by anyone | Searches the AI index, combining meaning and keyword matches |
| `unsubscribe_weekly_email(token)` | Callable by anyone | Turns off the email for the owner of that token |
| `weekly_email_batch(group, limit)` | Server only | Picks the users to email today |
| `admin_stats()`, `admin_users(...)` | Server only | Data for the admin dashboard |

Why some functions are "security definer": they need to see across rows, for example to count everyone's streak, or to build a public page. They run with the owner's rights, but each sets a fixed search path so no other schema can interfere. Server-only functions are closed to browsers entirely.

---

## 4. Access rules, the standard pattern

Every user table follows the same shape:

- Row-level security is switched on in the same change that creates the table.
- The policy applies only to signed-in users (`to authenticated`), so anonymous visitors match nothing.
- A user may read and write only rows where the user id equals their own login id.

In words: "a row is visible and writable only if its owner is the person asking." The check is written so the database evaluates it once per query, not once per row.

Tables that must never be seen by browsers simply have row-level security on with no policies.

---

## 5. Key design decisions

| Decision | Why | Trade-off |
|---|---|---|
| Curriculum in files, not tables | Reviewed like code, checked by the build, no admin screens to secure | Editing needs Git |
| Percentages and milestones calculated, not stored | Always match the current route | Recalculated each time, which is cheap at this size |
| Streak from an event log | History survives edits, and is exact | Needs the trigger; the log grows over time |
| Slugs as text, no foreign keys | Content lives in files, so the database cannot check it | Renaming a slug orphans progress |
| Bookmarks and votes keyed by link | The content has no database ids | A link that changes counts as a new one |
| IP addresses stored as salted hashes | Rate limits need a key, but raw addresses are personal data | Rotating the secret key resets the limits |
| AI index as one table with a meaning vector and a text vector | One query can combine both search types | Re-indexing changes passages by content hash, so unchanged text is never re-paid for |
| Quota as an atomic function | Two open tabs cannot both slip under the limit | One extra round trip per question |

---

## 6. Changing the database safely

1. **Write a new migration file.** Never edit one that has already been applied.
2. **Make it safe to run twice.** Use "create if not exists", "add column if not exists", and "create or replace function".
3. **Name it with a timestamp later than the newest file.** The latest is `20261020000000_project_showcase.sql`.
4. **Enable row-level security in the same file** as any new user table, and add the owner-only policy.
5. **Test locally** by rebuilding the whole database from the migrations.
6. **The owner applies it to production by hand.** Nothing does this automatically.

### How the 19 migrations are organised

| Stage | Files | What changed |
|---|---|---|
| Foundation | Baseline, sign-up trigger, first RLS fix | Base tables, profiles created on sign-up, profiles locked down |
| AI | Five files, all from 7 October | Index, search, quota, feedback, search improvements |
| Personal | Theme, My Path, saved resources, votes and suggestions | User tables, each with RLS |
| Public and email | Public path, weekly email | Handles, opt-in email, unsubscribe |
| Progress | Streaks and the event log | Event log, streak functions |
| Operations | Contact and admin | Contact inbox, admin statistics |
| Profile links and showcase | GitHub, LinkedIn, LeetCode, projects | Link constraints, project table |

**Known maintenance issue:** the public profile function is written five times across migrations, each copying the previous version and adding a field. The current version is the last one. A cleaner setup keeps one definition per function.

---

## 7. Adding new data in future

Ask these questions first:

1. **Is it content or user data?** Content goes in files. User data goes in a table.
2. **Who owns a row?** If it is a user, add a `user_id` and the standard owner-only policy.
3. **Should a browser ever read it directly?** If not, enable RLS with no policies and expose it through a function.
4. **Is it derived?** If you can calculate it from what is stored, do not store it.
5. **Does it need history?** If yes, add an append-only table written by a trigger, the same way the progress log works.
6. **Does it need a limit?** Use a constraint for format and a function for counts.

Typical future needs and how to fit them:

| Future feature | Fit |
|---|---|
| Per-person admin roles | A roles table, checked inside the admin functions |
| Time zones for streaks | A time zone column on profiles, passed into the streak function |
| Answer cache for CJ AI | A table keyed by normalised question, with an expiry date |
| Team or classroom groups | A groups table and a membership table, with policies that check membership |
| Audit trail | An append-only table written by triggers on admin actions |

---

## 8. Revision questions

1. Why is the course content not in the database?
2. What is the one thing that writes to `user_progress_events`, and why only that?
3. How does the database stop one user reading another user's progress?
4. Why does the streak survive a skill being edited after it is done?
5. Why are slugs stored as plain text, and what is the risk?
6. Which tables can a browser never touch directly, and how is the AI index searched?
