// Stage 1 — split across two pages so each step feels uncluttered.
//   Page 1: optional first name + solar profile
//   Page 2: renewable-energy knowledge level

const STAGE1_SOLAR_OPTIONS = [
  { value: 'yes_solar',          label: 'Yes' },
  { value: 'no_solar_yes_interest', label: "No, but I would be interested" },
  { value: 'no_interest',      label: "No, and I'm not interested" },
];

const STAGE1_KNOWLEDGE_OPTIONS = [
  { value: 'expert',       label: 'Active — I have a smart home and manage my own energy' },
  { value: 'mid',      label: 'Curious - I have looked into it, but have not set anything up yet' },
  { value: 'non-expert', label: 'New to it — Energy is not something I have thought much about' },
];

function Stage1({ responses, update, onComplete, onBack }) {
  const TOTAL = 2;
  const [q, setQ] = React.useState(0);

  const onNext = () => (q < TOTAL - 1 ? setQ(q + 1) : onComplete());
  const goBack = () => (q === 0 ? onBack() : setQ(q - 1));

  const canContinue =
    (q === 0 && responses.solarProfile !== undefined) ||
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

          {/* Solar profile */}
          <Field label="Do you have solar panels at home?">
            <ChoiceQuestion
              options={STAGE1_SOLAR_OPTIONS}
              value={responses.solarProfile}
              onChange={(v) => update({ solarProfile: v })}
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
