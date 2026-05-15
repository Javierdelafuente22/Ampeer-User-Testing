# Ampeer — Embedded user study

The app ships with a user-testing survey wrapped around the existing onboarding
and main-app experience. A fresh page load drops the participant into the
consent screen, walks them through the study, and posts their responses to a
Google Sheet on submit.

## Flow

```
1.  Consent
2.  Stage 1 — Profile (two pages: optional name + solar question, then knowledge)
3.  Green takeover — "You are about to begin the onboarding experience."
4.  Onboarding (the existing 6-screen Ampeer flow, personalised with the name)
5.  Green takeover — "Onboarding complete. Tell us how that felt."
6.  Stage 2 — Post-onboarding (3 Yes/Maybe/No + 2 screenshot comparisons = 5 q)
7.  Green takeover — "You will now explore the full app…"
8.  App exploration  ← full Ampeer MainAppShell with a floating
                       "Visit all 5 tabs — N/5" pill at top-right that
                       becomes "End study" once all 5 tabs have been visited
9.  Green takeover — "Demo complete. One last set of questions."
10. Stage 3 — Post-app (9 Yes/Maybe/No (2 with optional "Skip") + 2 comparisons
                        + open feedback + optional follow-up email = 12 panels).
              A persistent "Back to the app" link lets the participant
              re-enter MainAppShell and resume on the same question.
11. Submit → Supabase
12. Thank-you screen (or fallback display if the POST fails)
```

Refreshing the page restarts the study from consent (one participant per
session).

## File layout (the changes)

```
survey/
  ConsentScreen.jsx
  Stage1.jsx
  Stage2.jsx
  Stage3.jsx
  TransitionScreen.jsx
  SubmissionScreens.jsx    (submitting / complete / fallback)
  Questions.jsx            (YesMaybeNo / Comparison / Choice / OpenText)
  SurveyPrimitives.jsx     (QuestionHeader, EndStudyButton)
  submission.js            (POST to Google Sheets)
survey-screenshots/        (8 comparison PNGs, all placeholders)
  README.md                 spec for what each file should contain
app/PeerwayRoot.jsx        ← rewritten as the study state-machine orchestrator
app/MainAppShell.jsx       ← accepts tab-visit + end-study survey props
index.html                 ← loads the survey scripts after the app scripts
```

Nothing else in the original app code was changed — the onboarding screens, the
five tabs, the design tokens, and the iOS frame all still work exactly as
before.

## Configure Supabase (5 minutes)

The whole survey writes into a single table with one JSONB column. No client
library is required — the browser POSTs straight to Supabase's REST API.

### 1. Create the project

1. Go to <https://supabase.com>, sign in, **New project**.
2. Pick any name and region. Wait ~1 minute for it to provision.

### 2. Create the table

> **First time?** Just run the block below.
>
> **Migrating from a previous schema?** Run `drop table if exists responses;`
> first to start clean. The column layout below replaces the old one.

In the Supabase dashboard, open **SQL Editor → New query**, paste this, then
**Run**:

```sql
create table responses (
  id         uuid        primary key default gen_random_uuid(),
  created_at timestamptz not null    default now(),

  -- Meta
  started_at        text,
  completed_at      text,
  duration_seconds  integer,
  consent_agreed    boolean,
  first_name        text,

  -- Stage 1 — profile
  solar_profile     text,
  energy_knowledge  text,

  -- Stage 2 — post-onboarding (5 questions)
  stage2_simple_onboarding    text,  -- yes / maybe / no
  stage2_understood_ampeer    text,  -- yes / maybe / no
  stage2_terms_helped_rights  text,  -- yes / maybe / no / skip
  stage2_setup_comparison     text,  -- ampeer / about_the_same / enphase
  stage2_terms_comparison     text,  -- ampeer / about_the_same / enphase

  -- App exploration
  app_tabs_visited  text[],

  -- Stage 3 — post-app (11 questions + optional comment + optional email)
  stage3_data_easy_to_understand   text,  -- yes / maybe / no
  stage3_home_animation_helped     text,  -- yes / maybe / no
  stage3_home_pricing_clear        text,  -- yes / maybe / no
  stage3_home_overview_comparison  text,  -- ampeer / about_the_same / enphase
  stage3_community_sense           text,  -- yes / maybe / no
  stage3_dashboard_reports_useful  text,  -- yes / maybe / no
  stage3_dashboard_comparison      text,  -- ampeer / about_the_same / enphase
  stage3_assistant_trustworthy     text,  -- yes / maybe / no / skip
  stage3_smart_mode_intrusive      text,  -- yes / maybe / no / skip
  stage3_profile_support           text,  -- yes / maybe / no
  stage3_app_willingness_solar     text,  -- yes / maybe / no
  stage3_open_feedback             text,

  -- Optional follow-up contact
  follow_up_email                  text
);

alter table responses enable row level security;

create policy "anyone can insert"
  on responses
  for insert
  to anon
  with check (true);
```

One row per participant, one column per answer. Columns are nullable so
participants who abandon mid-study still produce a partial row.

### 3. Wire the keys into the app

In Supabase, open **Project Settings → API**. Copy:

- **Project URL** (e.g. `https://abcde12345.supabase.co`)
- **Publishable key** — labelled `publishable` (starts with `sb_publishable_`).
  This is the public client-side key. NOT the `service_role` / secret key,
  which must never go in client code or git.

Open [`survey/submission.js`](survey/submission.js) and replace the two
constants at the top:

```js
const SUPABASE_URL             = 'https://abcde12345.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_…';
```

The publishable key is designed to be public, so it's safe to commit it to a
public repo. Security is enforced by the Row Level Security policy you
created above (only inserts allowed, no read/update/delete from anonymous
clients).

### 4. Read the responses

- **Quick browse**: Supabase dashboard → **Table Editor → responses**.
- **Query**: SQL Editor, e.g.
  ```sql
  select created_at, first_name, solar_profile, energy_knowledge,
         stage2_setup_comparison, stage3_dashboard_comparison
    from responses
   order by created_at desc;
  ```
- **Export to CSV**: Table Editor → ⋯ menu → **Export data to CSV**.

### Changing the schema later

Adding or renaming a question? Update three places:

1. The SQL — `alter table responses add column ...`
2. The mapping in [`survey/submission.js`](survey/submission.js) →
   `mapResponsesToRow`
3. The question component itself (Stage1/Stage2/Stage3 .jsx)

> **CORS note.** Supabase returns proper CORS headers, so the client knows
> when a submission succeeded or failed. The fallback screen now only triggers
> on real failures.

## Replace the comparison screenshots

`survey-screenshots/` contains 8 labelled placeholders. Replace each with the
real screenshot at the same filename. See
[`survey-screenshots/README.md`](survey-screenshots/README.md) for the list of
files, what they should depict, and image-spec tips.

## Run locally

The project has no build step — open [`index.html`](index.html) in a browser,
or serve it with any static server:

```bash
# Python
python -m http.server 5500
# or Node
npx serve .
```

Then open <http://localhost:5500> (or whatever port your server uses).

## Deploy to Vercel

The whole project is static, so deployment is trivial:

1. `git init && git add . && git commit -m "Initial"` and push to GitHub.
2. In Vercel, **New Project → Import** the repo.
3. **Framework Preset**: *Other* (no build needed).
4. **Build Command**: leave empty.
5. **Output Directory**: leave empty (root of the repo is served).
6. Deploy. That's it.

> The current production build is at
> <https://javierdelafuente22.github.io/Ampeer/>. Once the survey is on Vercel,
> point your participants at the Vercel URL — they'll get the study; the
> GitHub Pages URL keeps the original app for anyone who wants to see it
> survey-free.

## Disabling the survey

If you ever want the app to behave like the original (skip straight to
onboarding then the main app), revert [`app/PeerwayRoot.jsx`](app/PeerwayRoot.jsx)
to the simpler version saved in your backup. The survey files in `survey/` and
the `tabsVisited` plumbing in `MainAppShell.jsx` are independent and only
activate when `endStudyMode` is passed in.

## Data shape

Each row in the `responses` table looks like:

| column                            | example                                       |
| --------------------------------- | --------------------------------------------- |
| `created_at`                      | `2026-05-15T17:38:42.910Z`                    |
| `started_at`                      | `2026-05-15T17:24:01.123Z`                    |
| `completed_at`                    | `2026-05-15T17:38:42.910Z`                    |
| `duration_seconds`                | `881`                                         |
| `consent_agreed`                  | `true`                                        |
| `first_name`                      | `Alex` (or `null` if not provided)            |
| `solar_profile`                   | `have_solar` / `interested_in_solar` / `not_interested` |
| `energy_knowledge`                | `a_lot` / `basics` / `very_little`            |
| `stage2_simple_onboarding`        | `yes` / `maybe` / `no`                        |
| `stage2_understood_ampeer`        | `yes` / `maybe` / `no`                        |
| `stage2_terms_helped_rights`      | `yes` / `maybe` / `no` / `skip`               |
| `stage2_setup_comparison`         | `ampeer` / `about_the_same` / `enphase`       |
| `stage2_terms_comparison`         | `ampeer` / `about_the_same` / `enphase`       |
| `app_tabs_visited`                | `{home,community,dashboard,assistant,profile}` (Postgres text[]) |
| `stage3_data_easy_to_understand`  | `yes` / `maybe` / `no`                        |
| `stage3_home_animation_helped`    | `yes` / `maybe` / `no`                        |
| `stage3_home_pricing_clear`       | `yes` / `maybe` / `no`                        |
| `stage3_home_overview_comparison` | `ampeer` / `about_the_same` / `enphase`       |
| `stage3_community_sense`          | `yes` / `maybe` / `no`                        |
| `stage3_dashboard_reports_useful` | `yes` / `maybe` / `no`                        |
| `stage3_dashboard_comparison`     | `ampeer` / `about_the_same` / `enphase`       |
| `stage3_assistant_trustworthy`    | `yes` / `maybe` / `no` / `skip`               |
| `stage3_smart_mode_intrusive`     | `yes` / `maybe` / `no` / `skip`               |
| `stage3_profile_support`          | `yes` / `maybe` / `no`                        |
| `stage3_app_willingness_solar`    | `yes` / `maybe` / `no`                        |
| `stage3_open_feedback`            | free text (nullable)                          |
| `follow_up_email`                 | `alex@example.com` (nullable)                 |
