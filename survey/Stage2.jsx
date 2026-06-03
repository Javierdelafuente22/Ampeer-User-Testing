// Stage 2 — five questions shown after onboarding:
//   Q1, Q2, Q4: Yes/Maybe/No
//   Q3, Q5:    Ampeer vs Enphase screenshot comparisons
// Q4 also offers a "Read T&C" button that opens the full terms screen.

// Renders one question at a time and tracks the participant's answers.
function Stage2({ responses, update, onComplete, onBack }) {
  const TOTAL = 5;
  const [q, setQ] = React.useState(0);
  const [viewingTerms, setViewingTerms] = React.useState(false);
  const onNext = () => (q < TOTAL - 1 ? setQ(q + 1) : onComplete());
  const goBack = () => (q === 0 ? onBack() : setQ(q - 1));

  // The display order isn't the storage order: the setup comparison
  // (stored as q4) is shown before the terms YMN (stored as q3).
  // Storage keys stay stable so the Supabase schema doesn't need to change.
  const answers = [
    responses.stage2_q1_simpleOnboarding,
    responses.stage2_q2_understoodAmpeer,
    responses.stage2_q4_setupComparison,
    responses.stage2_q3_termsHelpedUnderstandRights,
    responses.stage2_q5_termsComparison,
  ];
  const answered = answers[q] !== undefined;

  // While the terms screen is open it replaces the questionnaire entirely.
  if (viewingTerms) {
    return (
      <Screen5_Legal
        readOnly
        returnLabel="Return to questionnaire"
        onNext={() => setViewingTerms(false)}
      />
    );
  }

  return (
    <PwScreen step={q} totalSteps={TOTAL} onBack={goBack}>
      {q === 0 && (
        <>
          <QuestionHeader index={1} total={TOTAL}
            prompt="Was the onboarding process simple to complete?"/>
          <YesMaybeNoQuestion
            value={responses.stage2_q1_simpleOnboarding}
            onChange={(v) => update({ stage2_q1_simpleOnboarding: v })}/>
        </>
      )}
      {q === 1 && (
        <>
          <QuestionHeader index={2} total={TOTAL}
            prompt="Did you understand what Ampeer does and how it benefits you?"/>
          <YesMaybeNoQuestion
            value={responses.stage2_q2_understoodAmpeer}
            onChange={(v) => update({ stage2_q2_understoodAmpeer: v })}/>
        </>
      )}
      {q === 2 && (
        <>
          <QuestionHeader index={3} total={TOTAL}
            prompt="Which account setup process feels simpler and more trustworthy?"
            subtitle="Enphase is one of the most popular home energy management apps in the UK."/>
          <ComparisonQuestion
            ampeerImage="survey-screenshots/ampeer-setup.png"
            enphaseImage="survey-screenshots/enphase-setup.png"
            value={responses.stage2_q4_setupComparison}
            onChange={(v) => update({ stage2_q4_setupComparison: v })}/>
        </>
      )}
      {q === 3 && (
        <>
          <QuestionHeader index={4} total={TOTAL}
            prompt="Did the Terms & Conditions plain English summary help you understand your rights?"/>
          <YesMaybeNoQuestion
            value={responses.stage2_q3_termsHelpedUnderstandRights}
            onChange={(v) => update({ stage2_q3_termsHelpedUnderstandRights: v })}/>
          <button
            onClick={() => setViewingTerms(true)}
            style={{
              appearance: 'none', cursor: 'pointer',
              width: '100%', marginTop: 10,
              padding: '12px 14px',
              borderRadius: 'var(--r-md)',
              background: 'transparent',
              color: 'var(--ink-900)',
              border: '1px solid var(--ink-900)',
              fontFamily: 'var(--font-sans)',
              fontSize: 13, fontWeight: 600,
              letterSpacing: '-0.005em',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
            <IconDoc size={14}/>
            <span>Read T&amp;C</span>
          </button>
        </>
      )}
      {q === 4 && (
        <>
          <QuestionHeader index={5} total={TOTAL}
            prompt="Which presentation of terms feels simpler and more trustworthy?"/>
          <ComparisonQuestion
            ampeerImage="survey-screenshots/ampeer-terms.png"
            enphaseImage="survey-screenshots/enphase-terms.png"
            value={responses.stage2_q5_termsComparison}
            onChange={(v) => update({ stage2_q5_termsComparison: v })}/>
        </>
      )}

      <div style={{ marginTop: 32 }}>
        <PwButton onClick={onNext} disabled={!answered} icon={<IconArrowRight size={16}/>}>
          {q < TOTAL - 1 ? 'Next' : 'Continue'}
        </PwButton>
      </div>
    </PwScreen>
  );
}

Object.assign(window, { Stage2 });
