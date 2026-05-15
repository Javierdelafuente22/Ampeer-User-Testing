// Stage 3 — Post-app (6 Yes/Maybe/No + 2 screenshot comparisons + open feedback).
// Q6 branches based on the Stage 1 solar profile.
// Includes a "Back to the app" button that returns to MainAppShell on the same question.

function Stage3({ responses, update, onSubmit, onBackToApp, questionIndex, setQuestionIndex }) {
  const TOTAL = 9; // 8 numbered + 1 final open-text panel
  const q = questionIndex;
  const onNext = () => (q < TOTAL - 1 ? setQuestionIndex(q + 1) : onSubmit());
  const goBack = () => (q > 0 ? setQuestionIndex(q - 1) : undefined);

  const isProsumerOrInterested =
    responses.solarProfile === 'have_solar' ||
    responses.solarProfile === 'interested_in_solar';
  const q6Prompt = isProsumerOrInterested
    ? 'Would you use an app like this if it were available to you?'
    : 'Would you consider switching to solar panels if an app like this were available?';

  const answers = [
    responses.stage3_q1_animationHelped,
    responses.stage3_q2_dataEasyToUnderstand,
    responses.stage3_q3_communityConnection,
    responses.stage3_q4_privacyComfortable,
    responses.stage3_q5_assistantTrustworthy,
    responses.stage3_q6_wouldUseOrSwitch,
    responses.stage3_q7_homeOverviewComparison,
    responses.stage3_q8_dashboardComparison,
  ];
  const answered = q === 8 ? true : answers[q] !== undefined;

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
          <QuestionHeader index={1} total={8}
            prompt="Did the live energy flow animation help you understand what was happening in your home?"/>
          <YesMaybeNoQuestion
            value={responses.stage3_q1_animationHelped}
            onChange={(v) => update({ stage3_q1_animationHelped: v })}/>
        </>
      )}
      {q === 1 && (
        <>
          <QuestionHeader index={2} total={8}
            prompt="Was the data and information across the app easy to understand?"/>
          <YesMaybeNoQuestion
            value={responses.stage3_q2_dataEasyToUnderstand}
            onChange={(v) => update({ stage3_q2_dataEasyToUnderstand: v })}/>
        </>
      )}
      {q === 2 && (
        <>
          <QuestionHeader index={3} total={8}
            prompt="Did you feel a sense of connection to your local energy community?"/>
          <YesMaybeNoQuestion
            value={responses.stage3_q3_communityConnection}
            onChange={(v) => update({ stage3_q3_communityConnection: v })}/>
        </>
      )}
      {q === 3 && (
        <>
          <QuestionHeader index={4} total={8}
            prompt="Did you feel comfortable with how your identity and data are kept private?"/>
          <YesMaybeNoQuestion
            value={responses.stage3_q4_privacyComfortable}
            onChange={(v) => update({ stage3_q4_privacyComfortable: v })}/>
        </>
      )}
      {q === 4 && (
        <>
          <QuestionHeader index={5} total={8}
            prompt="Did the AI assistant feel useful and trustworthy?"/>
          <YesMaybeNoQuestion
            value={responses.stage3_q5_assistantTrustworthy}
            onChange={(v) => update({ stage3_q5_assistantTrustworthy: v })}/>
        </>
      )}
      {q === 5 && (
        <>
          <QuestionHeader index={6} total={8} prompt={q6Prompt}/>
          <YesMaybeNoQuestion
            value={responses.stage3_q6_wouldUseOrSwitch}
            onChange={(v) => update({ stage3_q6_wouldUseOrSwitch: v })}/>
        </>
      )}
      {q === 6 && (
        <>
          <QuestionHeader index={7} total={8}
            prompt="Which home energy overview felt more intuitive?"/>
          <ComparisonQuestion
            ampeerImage="survey-screenshots/ampeer-home.png"
            enphaseImage="survey-screenshots/enphase-home.png"
            value={responses.stage3_q7_homeOverviewComparison}
            onChange={(v) => update({ stage3_q7_homeOverviewComparison: v })}/>
        </>
      )}
      {q === 7 && (
        <>
          <QuestionHeader index={8} total={8}
            prompt="Which dashboard made it easier to understand your energy at a glance?"/>
          <ComparisonQuestion
            ampeerImage="survey-screenshots/ampeer-dashboard.png"
            enphaseImage="survey-screenshots/enphase-dashboard.png"
            value={responses.stage3_q8_dashboardComparison}
            onChange={(v) => update({ stage3_q8_dashboardComparison: v })}/>
        </>
      )}
      {q === 8 && (
        <>
          <QuestionHeader index={9} total={9}
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
