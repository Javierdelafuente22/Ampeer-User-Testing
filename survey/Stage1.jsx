// Stage 1 — split across two pages so each step feels uncluttered.
//   Page 1: optional first name + solar profile
//   Page 2: renewable-energy knowledge level

const STAGE1_SOLAR_OPTIONS = [
  { value: 'have_solar',          label: 'I have solar panels at home' },
  { value: 'interested_in_solar', label: "I'm interested in buying solar panels" },
  { value: 'not_interested',      label: "I'm not interested in solar panels" },
];

const STAGE1_KNOWLEDGE_OPTIONS = [
  { value: 'a_lot',       label: 'I know a lot about it' },
  { value: 'basics',      label: 'I know the basics' },
  { value: 'very_little', label: 'I know very little' },
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
            eyebrow="A few quick questions"
            title="Tell us about you."
            subtitle="Two quick steps before the demo. Should take under a minute."
            size={30}
          />

          {/* First name (optional) */}
          <Field
            label="Your first name"
            sublabel="Optional — just so we can refer to you in the study."
          >
            <input
              className="pw-input"
              value={responses.firstName || ''}
              onChange={(e) => update({ firstName: e.target.value })}
              placeholder="e.g. Javi"
              style={{ height: 52, fontSize: 16 }}
              autoFocus
            />
          </Field>

          {/* Solar profile */}
          <Field label="Which best describes you?">
            <ChoiceQuestion
              options={STAGE1_SOLAR_OPTIONS}
              value={responses.solarProfile}
              onChange={(v) => update({ solarProfile: v })}
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
              help us understand who the study reached. Nothing is shared outside the research team.
            </div>
          </div>
        </>
      )}

      {q === 1 && (
        <>
          <PwPageTitle
            eyebrow="Almost there"
            title="One last thing."
            subtitle="There are no wrong answers — this helps us understand your background."
            size={30}
          />

          <Field label="How would you describe your knowledge of renewable energy?">
            <ChoiceQuestion
              options={STAGE1_KNOWLEDGE_OPTIONS}
              value={responses.energyKnowledge}
              onChange={(v) => update({ energyKnowledge: v })}
            />
          </Field>
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
        fontSize: 14,
        fontWeight: 600,
        color: 'var(--ink-900)',
        letterSpacing: '-0.005em',
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
