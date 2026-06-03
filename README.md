# Ampeer

A user study for the UI testing of **Ampeer**, a mobile app prototype for peer-to-peer solar energy trading. The repository contains both the survey wrapper that records participant feedback to Supabase and the full interactive prototype the participants test.

## Live links

- **Survey** (what participants take part in): <https://www.ampeersurvey.com/>
- **App prototype** (survey-free version of the app): <https://www.ampeerenergy.com/>

## What's in this repo

```
app/             The main five-tab Ampeer app (Home, Community, Dashboard, Assistant, Profile)
components/      The six-screen onboarding flow + shared UI primitives
survey/          Consent, profile, post-onboarding and post-app questionnaires
survey-screenshots/   Comparison images used in the survey (Ampeer vs Enphase)
tokens.css       Design system tokens (colours, type scale, radii, shadows)
index.html       Single entry point — loads everything in the browser
SURVEY.md        Detailed setup walkthrough for the Supabase backend
```

## Running it locally if preferred

There is no build step — the project uses Babel Standalone to transpile JSX in the browser. Any static file server will work:

```bash
# Python
python -m http.server 5500

# or Node
npx serve .
```

Then open <http://localhost:5500>.

A fresh page load drops you into the consent screen and walks you through the full study. Refreshing the page restarts the study from the beginning (one session per participant).

## How the study is wired up

The survey writes one row per participant into a single `responses` table on Supabase. The full schema, Row Level Security policy, and step-by-step setup instructions live in [SURVEY.md](SURVEY.md).

In short:

1. The participant agrees to the consent screen.
2. Stage 1 collects optional profile information (name, age range, energy knowledge).
3. The participant goes through the six-screen onboarding flow.
4. Stage 2 asks five questions about the onboarding experience.
5. The participant explores the main app and must visit all five tabs to end the study.
6. Stage 3 asks twelve questions about the app itself.
7. The responses are POSTed to Supabase. If the request fails, a fallback screen shows the responses as JSON so they can be recorded by hand.

The Supabase publishable key in [survey/submission.js](survey/submission.js) is a public anon key — security is enforced server-side by an insert-only Row Level Security policy.

## A quick tour of the code

If you want to read through the main pieces:

- [app/PeerwayRoot.jsx](app/PeerwayRoot.jsx) — the state machine that drives the whole study.
- [app/MainAppShell.jsx](app/MainAppShell.jsx) — the five-tab main app container.
- [app/HouseTab.jsx](app/HouseTab.jsx) — the animated weather-driven energy flow scene.
- [app/AssistantTab.jsx](app/AssistantTab.jsx) — the AI agent chat with the mission-check pattern.
- [survey/Stage3.jsx](survey/Stage3.jsx) — the longest questionnaire, with the "back to the app" mid-survey navigation.
- [survey/submission.js](survey/submission.js) — the Supabase POST and column mapping.

## Anonymous response data

The aggregated, fully anonymised responses collected during the live study are saved in [survey-final-answers-anonymous.csv](survey-final-answers-anonymous.csv) for transparency. No identifying information (name, email, IP, location) is included.

## Contact

Javier de la Fuente — <jd2322@ic.ac.uk>
