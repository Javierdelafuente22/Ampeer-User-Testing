// Reusable question UI: single-choice, Yes/Maybe/No, Comparison (with screenshots),
// and an open text area.

function ChoiceQuestion({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            style={{
              appearance: 'none', cursor: 'pointer', textAlign: 'left',
              padding: '16px 18px',
              borderRadius: 'var(--r-md)',
              background: selected ? 'var(--lime-50)' : 'var(--surface)',
              border: '1px solid ' + (selected ? 'var(--lime-500)' : 'var(--cream-200)'),
              display: 'flex', alignItems: 'center', gap: 12,
              fontFamily: 'var(--font-sans)',
              transition: 'background .15s, border-color .15s',
            }}
          >
            <div style={{
              width: 22, height: 22, borderRadius: 999,
              border: '1.5px solid ' + (selected ? 'var(--ink-900)' : 'var(--ink-300)'),
              background: selected ? 'var(--ink-900)' : 'transparent',
              flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {selected && (
                <span style={{ color: 'var(--lime-400)', display: 'flex' }}>
                  <IconCheck size={14}/>
                </span>
              )}
            </div>
            <span style={{
              fontSize: 15, color: 'var(--ink-900)', fontWeight: 500,
              letterSpacing: '-0.005em',
            }}>
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

const YMN_OPTIONS = [
  { value: 'yes',   label: 'Yes' },
  { value: 'maybe', label: 'Maybe' },
  { value: 'no',    label: 'No' },
];

function YesMaybeNoQuestion({ value, onChange }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
      gap: 10, marginTop: 12,
    }}>
      {YMN_OPTIONS.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            style={{
              appearance: 'none', cursor: 'pointer',
              padding: '20px 12px',
              borderRadius: 'var(--r-md)',
              background: selected ? 'var(--ink-900)' : 'var(--surface)',
              color: selected ? '#fff' : 'var(--ink-900)',
              border: '1px solid ' + (selected ? 'var(--ink-900)' : 'var(--cream-200)'),
              fontFamily: 'var(--font-sans)', fontSize: 16, fontWeight: 600,
              letterSpacing: '-0.005em',
              transition: 'background .15s, color .15s, border-color .15s',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            }}
          >
            {selected && (
              <span style={{ color: 'var(--lime-400)', display: 'flex' }}>
                <IconCheck size={14}/>
              </span>
            )}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

const COMP_OPTIONS = [
  { value: 'ampeer',         label: 'Ampeer' },
  { value: 'about_the_same', label: 'About the same' },
  { value: 'enphase',        label: 'Enphase' },
];

function ScreenshotCard({ label, src }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--cream-200)',
      borderRadius: 'var(--r-md)',
      overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        width: '100%', aspectRatio: '9 / 16',
        background: 'var(--cream-100)',
      }}>
        <img
          src={src}
          alt={`${label} screenshot`}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>
      <div style={{
        padding: '8px 10px', fontSize: 11, fontWeight: 600,
        letterSpacing: '0.04em', textTransform: 'uppercase',
        color: 'var(--ink-600)', textAlign: 'center',
        borderTop: '1px solid var(--cream-200)',
      }}>
        {label}
      </div>
    </div>
  );
}

function ComparisonQuestion({ ampeerImage, enphaseImage, value, onChange }) {
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 12, marginBottom: 18,
      }}>
        <ScreenshotCard label="Ampeer" src={ampeerImage}/>
        <ScreenshotCard label="Enphase Enlighten" src={enphaseImage}/>
      </div>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8,
      }}>
        {COMP_OPTIONS.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              style={{
                appearance: 'none', cursor: 'pointer',
                padding: '14px 8px',
                borderRadius: 'var(--r-md)',
                background: selected ? 'var(--ink-900)' : 'var(--surface)',
                color: selected ? '#fff' : 'var(--ink-900)',
                border: '1px solid ' + (selected ? 'var(--ink-900)' : 'var(--cream-200)'),
                fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600,
                letterSpacing: '-0.005em',
                transition: 'background .15s, color .15s, border-color .15s',
                lineHeight: 1.25,
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function OpenTextQuestion({ value, onChange, placeholder = 'Optional — anything else on your mind?' }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={5}
      style={{
        width: '100%', padding: '14px 16px',
        borderRadius: 'var(--r-md)',
        border: '1px solid var(--cream-200)',
        fontFamily: 'var(--font-sans)', fontSize: 15,
        color: 'var(--ink-900)', resize: 'vertical', outline: 'none',
        background: '#fff', lineHeight: 1.5, boxSizing: 'border-box',
      }}
    />
  );
}

Object.assign(window, { ChoiceQuestion, YesMaybeNoQuestion, ComparisonQuestion, OpenTextQuestion });
