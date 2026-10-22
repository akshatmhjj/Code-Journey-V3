# Security and privacy

How Code Journey protects user data, who can reach what, and the reasons behind each rule. Security here is mostly about **who may read and write which rows**, so most of this file is about the database, and the rest covers the few server routes and the admin area.

---

## 1. The threat model in plain words

| Who might try | What they want | What stops them |
|---|---|---|
| A stranger with the public key from the site | Another person's progress, email or messages | Row-level security on every user table |
| A logged-in user | Another user's data, or the team's data | RLS checks `auth.uid()` on every row; the team's tables have no policies at all |
| A bot | Spam through the contact form, or passwords guessed at the admin page | Honeypot field, per-network limits, slowed failures |
| Someone who reads the browser bundle | Secret keys | Secrets are never in `NEXT_PUBLIC_` variables; server-only modules fail the build if imported by a client file |
| Someone on a shared device | Private pages from the last visitor | The service worker never stores private pages |
| A crawler or AI assistant | Private or personal pages | `robots.txt` disallows them; the public path page is `noindex` |
| A malicious job advert | Injected text | The job post checker runs as plain text matching in the browser. Nothing from the text is executed or sent |

The project does not have a formal threat model document. This table is a summary of what the code does, not a claim of completeness.

---

## 2. The three levels of database access

This is the most important table in the security model. Mixing up the rows is the most dangerous mistake in this codebase.

| Level | Credential | Who uses it | Bypasses RLS? |
|---|---|---|---|
| **1. The visitor** | The `anon` key (public by design) plus the user's login token, sent by the Supabase client | Browser code: progress, bookmarks, votes, suggestions, projects, profile | No. RLS limits the user to their own rows |
| **2. The visitor, checked on the server** | The `anon` key plus the visitor's token, passed as a Bearer header | `/api/chat` (to ask Supabase who is calling, and to count messages) and `/api/contact` (to attach the account) | No |
| **3. The server itself** | `SUPABASE_SERVICE_ROLE_KEY` | `adminDb()` for the dashboard, the weekly email batch, the contact insert, and the indexing scripts | **Yes, all of it** |

Three rules follow:

1. The service-role key is never in the browser, never in a `NEXT_PUBLIC_` variable, and never imported by a client component.
2. `src/lib/admin.ts` and `src/lib/content.ts` start with `import "server-only"`. If a client component imports either one, the build fails. That is a safety net, not a convention.
3. A new route that needs the service role must check its own inputs, because nothing else will.

---

## 3. Row-level security, in detail

### The rule for every user table

1. Enable RLS in the same migration that creates the table. A table without RLS is readable by anyone with the public key. This is written in the developer guide as rule 1.
2. Use `to authenticated`, so anonymous visitors match no policy.
3. Use `(select auth.uid()) = user_id` for `using` and `with check`. The `with check` stops a user from writing a row that belongs to someone else.
4. Give each operation only the policies it needs. For example, `user_progress_events` allows `select` for the owner and has no insert policy, so only the trigger writes it.

### The fix that shows why this matters

The first profile migration (`20261006000100_profiles_rls_and_indexes.sql`) opens with a comment: `profiles had RLS disabled, so the public anon key could read every email and edit any row`. The fix enabled RLS and added policies. It is a good example to know: the table had been in use before the rule was enforced, and the gap was only found by reading the schema.

### Tables with RLS and no policies

These tables are closed to every client. Only the service role, or a `security definer` function that the server calls, can read them:

- `doc_chunks` (read through `match_doc_chunks()`)
- `contact_messages`
- `admin_login_failures`

### Functions that are public on purpose

| Function | Why it is open | What it returns |
|---|---|---|
| `get_public_path(handle)` | Public profile pages | Handle, public name, role, statuses, streak, links, projects. Never the email, the user ID or the token |
| `resource_helpful_counts(urls)` | Helpful counts on resources | Counts only |
| `match_doc_chunks(...)` | CJ AI search | Public content passages only |
| `handle_available(handle)` | Checking a handle while choosing it | Signed-in users only (granted to `authenticated`). Returns yes or no |

Each is `security definer` with a fixed `search_path`, so it runs with its owner's rights but cannot be redirected to another schema's objects.

### Functions for the server only

`admin_stats()`, `admin_users()` and `weekly_email_batch()` are granted only to `service_role`. The trigger function `limit_resource_suggestions()` is revoked from every client role, so it can only run as a trigger. The developer guide describes the pattern (`20261012000000_contact_and_admin.sql`).

---

## 4. Input validation in the database

Constraints, not only application code, enforce the formats:

| Column | Constraint | Effect |
|---|---|---|
| Slugs (`role_slug`, `skill_slug`) | `~ '^[a-z0-9-]{2,60}$'` | Only valid slugs can be stored |
| `user_saved_resources.url`, `resource_votes.url`, `resource_suggestions.url` | Starts with `http` or `https`, at most 2048 characters | No `javascript:` or other schemes |
| `user_projects.url` | `^https://` and a length limit | Project links are https only |
| `profiles.github_url` | Must match a GitHub profile pattern | Public links can only go to GitHub |
| `profiles.linkedin_url` | Must be `linkedin.com/in/...` or `/company/...` | Public links can only go to LinkedIn profiles |
| `profiles.leetcode_url` | Must be `leetcode.com/<name>` or `/u/<name>` | Public links can only go to LeetCode |
| `profiles.theme`, `profiles.mode` | Allowed values only | The theme cannot be an arbitrary string |
| `user_skill_status.status` | `learning` or `done` | Typos cannot be stored |
| `contact_messages.email` | Length and a basic `_@_` pattern in the database, a stricter regex in the route | Two layers |
| `resource_suggestions.status` | `new`, `accepted` or `declined`, and inserts must start as `new` | Users cannot approve their own suggestions |
| `chat_feedback.rating` | `1` or `-1` | |

The pattern to copy: **the database refuses bad values even if a future route forgets to check them.**

---

## 5. Server routes and what each one checks

### `/api/chat`

- Requires a valid bearer token. `auth.getUser()` must return a user.
- Validates the body: it must be JSON, with at most 12 turns, 2000 characters each, and the last turn must be from the user.
- Quota checked atomically in the database.
- Only public passages reach the model, and the system prompt limits answers to them.
- Returns generic error messages. Stack traces go to the server log, never to the browser.

### `/api/contact`

| Check | How |
|---|---|
| Honeypot | A hidden `website` field. If it has a value, the server returns `ok` and stores nothing |
| Required fields | Email format (a regex) and a message of at least 10 characters |
| Length limits | Name 100, email 254, topic 20, message 3000, page 300 characters |
| Topic | Must be one of five values, otherwise it becomes `other` |
| Rate limit | 5 messages an hour per salted IP hash |
| Account link | If a valid token is sent, the user ID is attached |

### `/api/cron/weekly-email`

- Requires `Authorization: Bearer <CRON_SECRET>`, otherwise 401.
- Group parameter is validated (`0` to `6`). The dry-run flag builds emails without sending.
- Sends with a `List-Unsubscribe` header and one-click support, so mail clients can unsubscribe in one tap.

### `/api/email/unsubscribe`

Token-based. The token is a random UUID per user (`email_token`). The database function `unsubscribe_weekly_email(token)` turns the email off for that owner. No login is needed, and no email address is shown.

### `/admin`

Covered in section 6.

---

## 6. Admin sign-in, step by step

The dashboard uses one password, `ADMIN_PASSWORD`, set in the hosting environment. There are no admin accounts or roles.

| Step | What happens |
|---|---|
| Configured? | The page refuses to work unless both `ADMIN_PASSWORD` and the service-role key are set |
| Throttle | Failed attempts are stored with a salted hash of the caller's IP. Eight failures in fifteen minutes block the form |
| Compare | The password is compared with `crypto.timingSafeEqual` on SHA-256 digests, so the comparison time does not reveal how much of the password matched |
| Slow down | A failed attempt waits 600 ms before the reply |
| Session | On success, a cookie holds `expiry.signature`. The signature is an HMAC-SHA256 keyed with the password. The cookie is `HttpOnly`, `SameSite=Strict`, `Secure` in production, scoped to `/admin`, and lasts 7 days |
| Every action | `requireAdmin()` checks the cookie first. Server actions that change data start with it |
| Sign out | The cookie is deleted |

**Consequence to know:** changing `ADMIN_PASSWORD` changes the signing key, so every session ends at once. That is a feature for an incident.

**Limit to know:** there is one shared password. There is no audit of which person did what, and no second factor. For a small team, that is a reasonable starting point. The next step would be Supabase Auth with an admin role claim, and per-person sign-in.

---

## 7. Why the IP is hashed

Rate limiting needs something stable to count against, and the IP address is that thing. Storing the raw address would make the table personal data. So the code stores a 32-character truncation of SHA-256 over the service-role key plus the IP address.

- The salt means someone with a copy of the table cannot reverse the hash by guessing addresses, because they do not have the key.
- Rotating the service-role key resets all the counters. That is acceptable, and worth knowing.
- Behind a proxy, the first address in `x-forwarded-for` is used, falling back to `x-real-ip`. Only trust these headers on a platform that sets them.

---

## 8. Browser-side protections

| Protection | How |
|---|---|
| No secrets in the bundle | Only the anon key and the project URL are `NEXT_PUBLIC_` |
| Security headers | `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: SAMEORIGIN`, `Permissions-Policy` turning off camera, microphone and geolocation |
| No inline user HTML | Markdown from our own files is rendered to HTML at build time. The CJ AI answer is rendered by a small custom parser that never inserts raw HTML |
| Link targets | Where external links open in a new tab, they use `rel="noopener noreferrer"` (for example on project links) |
| Private pages not cached | The service worker skips `/me`, `/admin`, `/login`, `/u/`, `/email/` and `/api/` |
| Crawlers kept out | `robots.ts` disallows the same private paths for every bot |

**Not set yet:** a `Content-Security-Policy` header. The site loads scripts from Google Analytics and fonts from Google. A strict policy would need those allowed by name, with nonces or hashes for the inline theme and consent scripts. This is a real gap and a good improvement (see [12-known-gaps-and-improvements.md](12-known-gaps-and-improvements.md)).

---

## 9. Privacy: what the product promises, and how the code keeps it

| Promise | How it is kept |
|---|---|
| Reading needs no account | Public pages never query the database |
| No selling of data, no ads | Ad storage is always denied in Consent Mode; no ad scripts exist |
| Email is opt-in | `profiles.weekly_email` defaults to false; the weekly job selects only true rows |
| Every email can be stopped in one tap | Token link plus the `List-Unsubscribe` header |
| Public pages are the user's choice | `path_public` defaults to false; the page is `noindex` |
| Nothing personal is saved on a shared device | Private pages are never cached by the service worker |
| The job post checker does not upload | Matching runs in the browser, with no network call in `gap.ts` |
| Analytics only where allowed | GA4 with consent: denied by default for EEA, UK and Switzerland visitors, granted elsewhere, and a banner for European time zones lets them choose. The choice is stored in `localStorage` as `cj-consent` |
| The contact message stays in the team inbox | Stored in `contact_messages`, with no automatic forwarding |

### What the team holds

| Data | Kept | Notes |
|---|---|---|
| Account basics | Email, name, sign-in provider, creation and last sign-in dates | Managed by Supabase Auth |
| Progress | Route, statuses, the event log | The event log is needed for streaks |
| Bookmarks, votes, suggestions, projects | Yes | Votes stay private, except the helpful count |
| CJ AI | Daily message counts, and feedback with the question and answer | Chat text itself is not stored, except in feedback rows the user creates |
| Contact messages | Name, email, topic, message, page, a salted IP hash | Kept until the team deletes them |
| Admin sign-in failures | Salted IP hash and time | Used only to throttle |

The privacy page is the public statement. Keep it in step with this table when the data changes.

---

## 10. Checklist for any change that touches data

Use this when adding a table, route, or field:

1. Does it hold personal data? If yes, where is it read, and who may read it?
2. Is RLS enabled in the same migration, and does each policy use `(select auth.uid())`?
3. Does a constraint enforce the format, or only the code?
4. If it is a server route, does it validate length and type, rate limit, and return a generic error?
5. Does it need the service role? If yes, is it only ever called from server code?
6. Should the service worker cache it? If it is personal, the answer is no.
7. Should `robots.ts` disallow it? If it is personal or an API, the answer is yes.
8. Does the privacy page still describe it correctly?

---

## 11. What a reviewer should look for first

- A new table without `enable row level security`.
- A policy without `to authenticated`, or without `with check` on writes.
- A `NEXT_PUBLIC_` variable holding anything secret.
- A client component importing `admin.ts`, `content.ts`, `rag.ts`, or `gemini.ts`.
- A route that returns `error.message` from a database or model call to the browser.
- A new private page missing from the service worker's list and from `robots.ts`.
- A `security definer` function without `set search_path`.
