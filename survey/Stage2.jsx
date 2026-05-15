// Stage 2 — Post-onboarding (5 questions).
// Q1, Q2: simple YMN.
// Q3: YMN + 4th "Skip — I didn't read the Terms & Conditions" button.
// Q4, Q5: screenshot comparisons.

function Stage2({ responses, update, onComplete, onBack }) {
  const TOTAL = 5;
  const [q, setQ] = React.useState(0);
  const onNext = () => (q < TOTAL - 1 ? setQ(q + 1) : onComplete());
  const goBack = () => (q === 0 ? onBack() : setQ(q - 1));

  const answers = [
    responses.stage2_q1_simpleOnboarding,
    responses.stage2_q2_understoodAmpeer,
    responses.stage2_q3_termsHelpedUnderstandRights,
    responses.stage2_q4_setupComparison,
    responses.stage2_q5_termsComparison,
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
            prompt="Did the Terms & Conditions plain English summary help you understand your rights?"/>
          <YesMaybeNoQuestion
            value={responses.stage2_q3_termsHelpedUnderstandRights}
            onChange={(v) => update({ stage2_q3_termsHelpedUnderstandRights: v })}
            skipLabel="Skip — I didn't read the Terms & Conditions"/>
        </>
      )}
      {q === 3 && (
        <>
          <QuestionHeader index={4} total={TOTAL}
            prompt="Which account setup process feels simpler and more trustworthy?"
            subtitle="Enphase is one of the most popular home energy management apps in the UK."/>
          <ComparisonQuestion
            ampeerImage="survey-screenshots/ampeer-setup.png"
            enphaseImage="survey-screenshots/enphase-setup.png"
            value={responses.stage2_q4_setupComparison}
            onChange={(v) => update({ stage2_q4_setupComparison: v })}/>
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
