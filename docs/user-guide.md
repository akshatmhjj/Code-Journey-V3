# Code Journey: User Guide

**Code Journey is a map of tech careers.** You pick a job you are curious about, and it shows you what to learn, in what order, and where to learn each thing for free.

You do not need an account to read anything. An account only lets you save your progress and use the chat assistant.

---

## The big idea in one minute

Most people who want to get into tech do not get stuck for lack of courses. They get stuck because they do not know **what to learn next, or why**. Code Journey answers one question:

> "To become a ___, what do I learn, in what order, and where do I learn each thing?"

The site is drawn like a **city metro map**:

| On the map | What it means for you |
|---|---|
| **A line** | A field of tech, such as Web, Mobile, Data, AI, Cloud and DevOps, Quality, Security, Customer-facing and Specialist |
| **A destination** | A job role, such as Frontend Engineer or Data Analyst. There are 26 |
| **A station** | One skill you need on the way, such as Git or SQL. There are 99 |

Code Journey does **not** teach or sell courses. It collects the best official documentation and free material and points you to it. Official docs come first.

---

## Your first visit: a simple workflow

### Step 1 - Find a direction

Pick whichever fits you:

- **Not sure what you want?** Open **Compass**. It is an 8-question quiz that suggests roles that suit you, and tells you why ("Because you like finding answers in data").
- **Have a rough idea?** Open **Roles** and read the one-sentence summary of a few. Pick the one that sounds most like you.
- **Like to explore?** Use the **network map** on the home page. Each line is a field, and each stop is a role.
- **Looking for something specific?** Use the **search bar** at the top. It finds roles, skills and resources.

### Step 2 - Read the role page

Each role page tells you, in plain words:

- What the job is, and where people with this job work
- A typical day
- The route, split into four stages: **Foundations, Core, Job-ready, Senior**
- For every stage: the skills to learn, a **project to build**, a **"you're done when..."** check, and rough weeks (assuming about 10 hours a week)
- The tools used, how interviews usually go, how AI is changing the job, and similar roles

Treat the week ranges as a guide, not a deadline.

### Step 3 - Open a skill

Each skill page is built for quick learning:

- **A 60-second brief** explaining what the skill is
- **A learning checklist** of the topics inside it
- **Hand-picked resources**, with official documentation first. Each shows whether it is free, freemium or paid, and when its link was last checked
- **Prerequisites**, so you know what to learn first

### Step 4 - Compare before you commit

- **Compare** puts any two roles side by side: shared skills, time to job-ready, pay and interview style.
- **Pay by role** (the Market page) shows salaries for India and the US. Every number links to its public source. Nothing is guessed.

### Step 5 - Save your route and track progress (needs a free account)

1. Click **Sign in** (email and password, or Google or GitHub).
2. On a role page, choose **Save route**. That role becomes your destination.
3. On any skill page, mark it **To do, Learning** or **Done**.
4. Open **My Path** to see:
   - Your overall percentage and your current stage
   - The next few stations to work on
   - Hours left, as a range
   - A **weekly streak**. Ticking off at least one station in a week keeps it going, and one busy day never breaks it
   - **Milestones** (first station, each stage, halfway, the whole route) with a small celebration. You can share a finished stage
5. Optional: turn on the **weekly progress email**, or make your **public path page** so you can share your journey. Both are opt-in.

### Step 6 - Use the extras whenever you need them

| Tool | When to use it |
|---|---|
| **Job post checker** | You found a job ad. Paste it in, and it shows which skills it asks for, which you already have, and what to learn next. It runs in your browser and nothing is uploaded |
| **CJ AI** (chat assistant) | You have a question like "What should I learn after SQL?" It answers **only** from Code Journey's own pages and shows its sources. You need to be signed in, and there is a daily message limit |
| **Saved resources** | Bookmark a good link to find it later |
| **Helpful votes and suggestions** | Mark a resource helpful or suggest a new one |
| **Glossary** | Plain-English meanings of tech words |
| **Blog and roadmap guides** | Short reads on mindset, roadmaps and basics |
| **FAQ and contact form** | Still have a question? Send a message from the bottom of the FAQ |

---

## Making the site feel like yours

- **Themes:** four colour themes (Tangerine, Harbor, Juniper, Orchard), each in light and dark. Open **Theme settings** from the header. Signed-in users keep their choice across devices.
- **Quick search:** the search icon in the header opens a command palette. Use the arrow keys and Enter to jump anywhere.
- **Install it as an app:** on Chrome or Edge, use **Install the app** in the footer. On iPhone, use Share, then **Add to Home Screen**. The app opens full-screen with its own icon. Long-press the icon for shortcuts to My Path, Compass, the job post checker and all roles.
- **Offline:** pages you have already opened still work without a connection. Pages you have not opened show a friendly offline screen that lists the ones you can read. Private pages such as My Path are never saved on the device.

---

## What happens to your data

- Reading is free and needs no account.
- If you sign up, Code Journey stores your name, email and progress to run your account.
- Emails are opt-in, and every email has an unsubscribe link.
- Data is never sold, and ad tracking is always off.
- Anonymous page-visit analytics are on by default in most countries. In the EU, UK and Switzerland they stay off until you accept the consent banner. The Privacy page has the full details.

---

## Quick answers

**I'm completely new. Where do I start?**
Take the Compass quiz, pick one suggested role, and follow its route from the first station. Do not jump ahead. Each stage tells you what "done" looks like before you move on.

**Do I have to do everything on a role page?**
No. Skills are grouped as **must**, **should** and **nice to have**. Start with the musts.

**Can I switch roles later?**
Yes. Many skills are shared between roles, so your progress is not wasted. Use Compare to see how much overlaps.

**A link is broken.**
Tell the team through the contact form at the bottom of the FAQ, or the resource suggestion feature. Links are also checked automatically every week.

**Where do I find the full documentation?**
The two documentation files in the project are `README.md` (what the project is) and `docs/learn/pwa.md` (how the installable app works). Everything else in the project is site content.

---

## Where the pieces of the site live (for the curious)

| Page | Address |
|---|---|
| Home and network map | `/` |
| Roles, and one role | `/roles`, `/roles/<role>` |
| Compare two roles | `/roles/compare` |
| Skills, and one skill | `/skills`, `/skills/<skill>` |
| Fields (domains) | `/domains` |
| Resources | `/resources` |
| Compass quiz | `/compass` |
| Job post checker | `/gap` |
| Pay by role | `/market` |
| My Path (private) | `/me` |
| Public path page | `/u/<handle>` |
| Glossary | `/glossary` |
| Blog | `/blog` |
| FAQ and contact | `/faq` |
| About, Privacy, Terms | `/about`, `/privacy`, `/terms` |
