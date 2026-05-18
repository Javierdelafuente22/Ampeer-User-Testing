// Stage 1 — split across two pages so each step feels uncluttered.
//   Page 1: optional first name + optional age range
//   Page 2: renewable-energy knowledge level

const STAGE1_AGE_OPTIONS = [
  { value: '18_24', label: '18–24' },
  { value: '25_34', label: '25–34' },
  { value: '35_54', label: '35–54' },
  { value: '55_plus', label: '55+' },
];

const STAGE1_KNOWLEDGE_OPTIONS = [
  { value: 'expert',       label: 'Active — I have manage my home energywith an app' },
  { value: 'mid',      label: 'Curious - I have looked into it, but have not set anything up yet' },
  { value: 'non-expert', label: 'New to it — Energy is not something I have thought much about' },
];

function Stage1({ responses, update, onComplete, onBack }) {
  const TOTAL = 2;
  const [q, setQ] = React.useState(0);

  const onNext = () => (q < TOTAL - 1 ? setQ(q + 1) : onComplete());
  const goBack = () => (q === 0 ? onBack() : setQ(q - 1));

  // Page 1 is now all optional (name + age range), so Next is always enabled.
  // Page 2's knowledge question is still required.
  const canContinue =
    q === 0 ||
    (q === 1 && responses.energyKnowledge !== undefined);

  return (
    <PwScreen step={q} totalSteps={TOTAL} onBack={goBack}>
      {q === 0 && (
        <>
          <PwPageTitle
            eyebrow="Before we start..."
            title="Tell us about you."
            subtitle="There are no wrong answers — this helps us understand your background."
            size={30}
          />

          {/* First name (optional) */}
          <Field
            label="Your first name — optional"
          >
            <input
              className="pw-input"
              value={responses.firstName || ''}
              onChange={(e) => update({ firstName: e.target.value })}
              placeholder="e.g. Sarah"
              style={{ height: 52, fontSize: 16 }}
              autoFocus
            />
          </Field>

          {/* Age range (optional) */}
          <Field label="Your age range — optional">
            <ChoiceQuestion
              options={STAGE1_AGE_OPTIONS}
              value={responses.ageRange}
              onChange={(v) => update({ ageRange: v })}
            />
          </Field>
        </>
      )}

      {q === 1 && (
        <>
          <PwPageTitle
            eyebrow="Before we start..."
            title="Tell us about you."
            size={30}
          />

          <Field label="How would you describe your experience with managing your home's energy?">
            <ChoiceQuestion
              options={STAGE1_KNOWLEDGE_OPTIONS}
              value={responses.energyKnowledge}
              onChange={(v) => update({ energyKnowledge: v })}
            />
          </Field>

          {/* Why we ask */}
          <div style={{
            marginTop: 6, marginBottom: 18,
            padding: '12px 14px',
            background: 'var(--cream-100)',
            borderRadius: 'var(--r-md)',
            display: 'flex', gap: 10, alignItems: 'flex-start',
            fontSize: 12, lineHeight: 1.5, color: 'var(--ink-600)',
          }}>
            <span style={{ marginTop: 1, color: 'var(--forest-500)', flexShrink: 0, display: 'inline-flex' }}>
              <IconShield size={14}/>
            </span>
            <div>
              <span style={{ fontWeight: 600, color: 'var(--ink-900)' }}>Why we ask.</span>{' '}
              Your name (if you give one) is only used to personalise the demo. Profile questions
              help us understand who the study reached.
            </div>
          </div>
        </>
      )}

      <PwButton onClick={onNext} disabled={!canContinue} icon={<IconArrowRight size={16}/>}>
        {q < TOTAL - 1 ? 'Next' : 'Continue'}
      </PwButton>
    </PwScreen>
  );
}

// Small field wrapper — label + optional sublabel + control.
function Field({ label, sublabel, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{
        fontSize: 17,
        fontWeight: 600,
        color: 'var(--ink-900)',
        letterSpacing: '-0.01em',
        lineHeight: 1.3,
        marginBottom: sublabel ? 4 : 10,
      }}>
        {label}
      </div>
      {sublabel && (
        <div style={{
          fontSize: 12,
          color: 'var(--ink-600)',
          marginBottom: 10,
          lineHeight: 1.45,
        }}>
          {sublabel}
        </div>
      )}
      {children}
    </div>
  );
}

Object.assign(window, { Stage1 });
