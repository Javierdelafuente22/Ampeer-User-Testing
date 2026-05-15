// Supabase submission. One row per participant, one column per question.
// See SURVEY.md for the setup walkthrough (project + table + RLS).
//
// The publishable key is designed to be public — security is enforced by the
// Row Level Security policy on the `responses` table.

const SUPABASE_URL             = 'https://jdmhxmjjqighphplybdc.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_NIoQxGgvIcfd8yFLV2-ORQ_YZuqgMyC';

// Map the in-memory responses object (camelCase) to the database row
// (snake_case columns). Adding / renaming a question? Update here + the SQL.
function mapResponsesToRow(r) {
  return {
    // Meta
    started_at:        r.startedAt        || null,
    completed_at:      r.completedAt      || null,
    duration_seconds:  r.durationSeconds  || null,
    consent_agreed:    !!r.consentAgreed,
    first_name:        (r.firstName && r.firstName.trim()) ? r.firstName.trim() : null,

    // Stage 1 — profile
    solar_profile:     r.solarProfile     || null,
    energy_knowledge:  r.energyKnowledge  || null,

    // Stage 2 — post-onboarding (5 questions)
    stage2_simple_onboarding:           r.stage2_q1_simpleOnboarding           || null,
    stage2_understood_ampeer:           r.stage2_q2_understoodAmpeer           || null,
    stage2_terms_helped_rights:         r.stage2_q3_termsHelpedUnderstandRights|| null,
    stage2_setup_comparison:            r.stage2_q4_setupComparison            || null,
    stage2_terms_comparison:            r.stage2_q5_termsComparison            || null,

    // App exploration
    app_tabs_visited:  Array.isArray(r.appTabsVisited) ? r.appTabsVisited : null,

    // Stage 3 — post-app (11 questions + open feedback)
    stage3_data_easy_to_understand:     r.stage3_q1_dataEasyToUnderstand       || null,
    stage3_home_animation_helped:       r.stage3_q2_homeAnimationHelped        || null,
    stage3_home_pricing_clear:          r.stage3_q3_homePricingClear           || null,
    stage3_home_overview_comparison:    r.stage3_q4_homeOverviewComparison     || null,
    stage3_community_sense:             r.stage3_q5_communitySense             || null,
    stage3_dashboard_reports_useful:    r.stage3_q6_dashboardReportsUseful     || null,
    stage3_dashboard_comparison:        r.stage3_q7_dashboardComparison        || null,
    stage3_assistant_trustworthy:       r.stage3_q8_assistantTrustworthy       || null,
    stage3_smart_mode_intrusive:        r.stage3_q9_smartModeIntrusive         || null,
    stage3_profile_support:             r.stage3_q10_profileSupport            || null,
    stage3_app_willingness_solar:       r.stage3_q11_appWillingnessSolar       || null,
    stage3_open_feedback:               (r.stage3_openFeedback && r.stage3_openFeedback.trim())
                                          ? r.stage3_openFeedback.trim() : null,

    // Optional follow-up contact
    follow_up_email:                    (r.followUpEmail && r.followUpEmail.trim())
                                          ? r.followUpEmail.trim() : null,
  };
}

async function submitSurveyToSheets(responses) {
  // (Name kept for backwards compatibility with PeerwayRoot.)
  if (SUPABASE_URL.includes('REPLACE_WITH_YOUR_PROJECT_REF')
      || SUPABASE_PUBLISHABLE_KEY.includes('REPLACE_WITH_YOUR_PUBLISHABLE_KEY')) {
    return {
      ok: false,
      error: 'Supabase not configured. Edit SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY in survey/submission.js.',
    };
  }

  const row = mapResponsesToRow(responses);

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/responses`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_PUBLISHABLE_KEY,
        'Authorization': `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify(row),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      return {
        ok: false,
        error: `Supabase responded ${res.status}${detail ? ': ' + detail : ''}`,
      };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: (err && err.message) || 'Network error' };
  }
}

Object.assign(window, { submitSurveyToSheets, mapResponsesToRow });
