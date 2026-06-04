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
| `age_range`                       | `18_24` / `25_34` / `35_54` / `55_plus` (nullable — optional) |
| `energy_knowledge`                | `expert` / `mid` / `non-expert`               |
| `stage2_simple_onboarding`        | `yes` / `maybe` / `no`                        |
| `stage2_understood_ampeer`        | `yes` / `maybe` / `no`                        |
| `stage2_terms_helped_rights`      | `yes` / `maybe` / `no`                        |
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
| `stage3_assistant_trustworthy`    | `yes` / `maybe` / `no`                        |
| `stage3_smart_mode_respectful_privacy` | `yes` / `maybe` / `no`                   |
| `stage3_profile_support`          | `yes` / `maybe` / `no`                        |
| `stage3_app_willingness_solar`    | `yes` / `maybe` / `no`                        |
| `stage3_open_feedback`            | free text (nullable)                          |
| `follow_up_email`                 | `alex@example.com` (nullable)                 |
