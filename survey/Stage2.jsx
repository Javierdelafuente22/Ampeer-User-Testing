// Stage 2 — Post-onboarding (4 Yes/Maybe/No + 2 screenshot comparisons).
function Stage2({ responses, update, onComplete, onBack }) {
  const TOTAL = 6;
  const [q, setQ] = React.useState(0);
  const onNext = () => (q < TOTAL - 1 ? setQ(q + 1) : onComplete());
  const goBack = () => (q === 0 ? onBack() : setQ(q - 1));

  const answers = [
    responses.stage2_q1_simpleOnboarding,
    responses.stage2_q2_understoodAmpeer,
    responses.stage2_q3_understoodPricing,
    responses.stage2_q4_informedAboutRights,
    responses.stage2_q5_setupComparison,
    responses.stage2_q6_termsComparison,
  ];
  const answered = answers[q] !== undefined;

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
            prompt="Did you understand how the trading price is set?"/>
          <YesMaybeNoQuestion
            value={responses.stage2_q3_understoodPricing}
            onChange={(v) => update({ stage2_q3_understoodPricing: v })}/>
        </>
      )}
      {q === 3 && (
        <>
          <QuestionHeader index={4} total={TOTAL}
            prompt="Did you feel informed about your rights and regulations in energy trading?"/>
          <YesMaybeNoQuestion
            value={responses.stage2_q4_informedAboutRights}
            onChange={(v) => update({ stage2_q4_informedAboutRights: v })}/>
        </>
      )}
      {q === 4 && (
        <>
          <QuestionHeader index={5} total={TOTAL}
            prompt="Which account setup process felt simpler?"
            subtitle="Compare the two onboarding flows below."/>
          <ComparisonQuestion
            ampeerImage="survey-screenshots/ampeer-setup.png"
            enphaseImage="survey-screenshots/enphase-setup.png"
            value={responses.stage2_q5_setupComparison}
            onChange={(v) => update({ stage2_q5_setupComparison: v })}/>
        </>
      )}
      {q === 5 && (
        <>
          <QuestionHeader index={6} total={TOTAL}
            prompt="Which presentation of terms felt clearer and more trustworthy?"
            subtitle="Look at how each app presents its legal terms."/>
          <ComparisonQuestion
            ampeerImage="survey-screenshots/ampeer-terms.png"
            enphaseImage="survey-screenshots/enphase-terms.png"
            value={responses.stage2_q6_termsComparison}
            onChange={(v) => update({ stage2_q6_termsComparison: v })}/>
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
