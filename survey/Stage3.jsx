// Stage 3 — Post-app (11 numbered + 1 open feedback = 12 panels total).
// Q11 wording branches on the Stage 1 solar profile.
// "Back to the app" lets the participant re-enter MainAppShell mid-survey
// and resume on the same question they left.

function Stage3({ responses, update, onSubmit, onBackToApp, questionIndex, setQuestionIndex }) {
  const TOTAL = 12; // displayed total — 11 questions + 1 open-text/email panel
  const q = questionIndex;
  const onNext = () => (q < TOTAL - 1 ? setQuestionIndex(q + 1) : onSubmit());
  const goBack = () => (q > 0 ? setQuestionIndex(q - 1) : undefined);

  // Q11 wording branches on Stage 1 solar profile.
  const isProsumerOrInterested =
    responses.solarProfile === 'have_solar' ||
    responses.solarProfile === 'interested_in_solar';
  const q11Prompt = isProsumerOrInterested
    ? 'Would you use an app like this if it were available to you?'
    : 'Would this app make you more willing to install solar panels?';

  const answers = [
    responses.stage3_q1_dataEasyToUnderstand,
    responses.stage3_q2_homeAnimationHelped,
    responses.stage3_q3_homePricingClear,
    responses.stage3_q4_homeOverviewComparison,
    responses.stage3_q5_communitySense,
    responses.stage3_q6_dashboardReportsUseful,
    responses.stage3_q7_dashboardComparison,
    responses.stage3_q8_assistantTrustworthy,
    responses.stage3_q9_smartModeIntrusive,
    responses.stage3_q10_profileSupport,
    responses.stage3_q11_appWillingnessSolar,
  ];
  // Last panel (q=11) is the optional open text + email, no answer required.
  const answered = q === 11 ? true : answers[q] !== undefined;

  return (
    <PwScreen step={q} totalSteps={TOTAL} onBack={q > 0 ? goBack : undefined}>
      {/* "Back to the app" link */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <button onClick={onBackToApp} style={{
          appearance: 'none', cursor: 'pointer',
          border: '1px solid var(--cream-200)',
          background: 'var(--surface)',
          color: 'var(--ink-700)',
          padding: '8px 12px', borderRadius: 999,
          fontSize: 12, fontWeight: 500,
          fontFamily: 'var(--font-sans)',
          display: 'inline-flex', alignItems: 'center', gap: 6,
          letterSpacing: '-0.005em',
        }}>
          <IconExternal size={12}/>
          Back to the app
        </button>
      </div>

      {q === 0 && (
        <>
          <QuestionHeader index={1} total={TOTAL}
            prompt="Was the data and information across the app easy to understand?"/>
          <YesMaybeNoQuestion
            value={responses.stage3_q1_dataEasyToUnderstand}
            onChange={(v) => update({ stage3_q1_dataEasyToUnderstand: v })}/>
        </>
      )}
      {q === 1 && (
        <>
          <QuestionHeader index={2} total={TOTAL}
            prompt="Did the energy flow animation in the home tab help you understand what was happening in your home?"/>
          <YesMaybeNoQuestion
            value={responses.stage3_q2_homeAnimationHelped}
            onChange={(v) => update({ stage3_q2_homeAnimationHelped: v })}/>
        </>
      )}
      {q === 2 && (
        <>
          <QuestionHeader index={3} total={TOTAL}
            prompt="Was the pricing in the home tab clear and easy to understand?"/>
          <YesMaybeNoQuestion
            value={responses.stage3_q3_homePricingClear}
            onChange={(v) => update({ stage3_q3_homePricingClear: v })}/>
        </>
      )}
      {q === 3 && (
        <>
          <QuestionHeader index={4} total={TOTAL}
            prompt="Which home energy overview feels easier to use at a glance?"/>
          <ComparisonQuestion
            ampeerImage="survey-screenshots/ampeer-home.png"
            enphaseImage="survey-screenshots/enphase-home.png"
            value={responses.stage3_q4_homeOverviewComparison}
            onChange={(v) => update({ stage3_q4_homeOverviewComparison: v })}/>
        </>
      )}
      {q === 4 && (
        <>
          <QuestionHeader index={5} total={TOTAL}
            prompt="Did the community tab give you a sense of being part of a local energy network?"/>
          <YesMaybeNoQuestion
            value={responses.stage3_q5_communitySense}
            onChange={(v) => update({ stage3_q5_communitySense: v })}/>
        </>
      )}
      {q === 5 && (
        <>
          <QuestionHeader index={6} total={TOTAL}
            prompt="Did the weekly report and notifications in the dashboard help you understand your energy activity?"/>
          <YesMaybeNoQuestion
            value={responses.stage3_q6_dashboardReportsUseful}
            onChange={(v) => update({ stage3_q6_dashboardReportsUseful: v })}/>
        </>
      )}
      {q === 6 && (
        <>
          <QuestionHeader index={7} total={TOTAL}
            prompt="Which dashboard shows information that would be most useful to you?"/>
          <ComparisonQuestion
            ampeerImage="survey-screenshots/ampeer-dashboard.png"
            enphaseImage="survey-screenshots/enphase-dashboard.png"
            value={responses.stage3_q7_dashboardComparison}
            onChange={(v) => update({ stage3_q7_dashboardComparison: v })}/>
        </>
      )}
      {q === 7 && (
        <>
          <QuestionHeader index={8} total={TOTAL}
            prompt="Did the AI assistant feel useful and trustworthy?"/>
          <YesMaybeNoQuestion
            value={responses.stage3_q8_assistantTrustworthy}
            onChange={(v) => update({ stage3_q8_assistantTrustworthy: v })}
            skipLabel="Skip — I didn't use the AI assistant"/>
        </>
      )}
      {q === 8 && (
        <>
          <QuestionHeader index={9} total={TOTAL}
            prompt="Did the smart mode in the AI assistant feel intrusive?"/>
          <YesMaybeNoQuestion
            value={responses.stage3_q9_smartModeIntrusive}
            onChange={(v) => update({ stage3_q9_smartModeIntrusive: v })}
            skipLabel="Skip — I didn't use smart mode"/>
        </>
      )}
      {q === 9 && (
        <>
          <QuestionHeader index={10} total={TOTAL}
            prompt="Did the Profile tab give you the support and information you needed?"/>
          <YesMaybeNoQuestion
            value={responses.stage3_q10_profileSupport}
            onChange={(v) => update({ stage3_q10_profileSupport: v })}/>
        </>
      )}
      {q === 10 && (
        <>
          <QuestionHeader index={11} total={TOTAL} prompt={q11Prompt}/>
          <YesMaybeNoQuestion
            value={responses.stage3_q11_appWillingnessSolar}
            onChange={(v) => update({ stage3_q11_appWillingnessSolar: v })}/>
        </>
      )}
      {q === 11 && (
        <>
          <QuestionHeader index={12} total={TOTAL}
            prompt="Anything else you'd like to share?"
            subtitle="Optional — anything that surprised, confused, or delighted you."/>
          <OpenTextQuestion
            value={responses.stage3_openFeedback || ''}
            onChange={(v) => update({ stage3_openFeedback: v })}/>

          {/* Optional follow-up email */}
          <div style={{ marginTop: 24 }}>
            <div style={{
              fontSize: 14, fontWeight: 600, color: 'var(--ink-900)',
              letterSpacing: '-0.005em', marginBottom: 4,
            }}>
              Up for a quick follow-up?
            </div>
            <div style={{
              fontSize: 12, color: 'var(--ink-600)', lineHeight: 1.45,
              marginBottom: 10,
            }}>
              Leave your email if you'd be happy to discuss your experience over a
              10-minute chat. Completely optional — only used to reach out for this study.
            </div>
            <input
              type="email"
              className="pw-input"
              value={responses.followUpEmail || ''}
              onChange={(e) => update({ followUpEmail: e.target.value })}
              placeholder="you@example.com"
              style={{ height: 52, fontSize: 16 }}
            />
          </div>
        </>
      )}

      <div style={{ marginTop: 32 }}>
        <PwButton
          onClick={onNext}
          disabled={!answered}
          icon={q < TOTAL - 1 ? <IconArrowRight size={16}/> : <IconCheck size={16}/>}
        >
          {q < TOTAL - 1 ? 'Next' : 'Submit'}
        </PwButton>
      </div>
    </PwScreen>
  );
}

Object.assign(window, { Stage3 });
