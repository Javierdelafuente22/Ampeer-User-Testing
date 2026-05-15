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
              fontSize: 14, color: 'var(--ink-900)', fontWeight: 500,
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

function YesMaybeNoQuestion({ value, onChange, skipLabel }) {
  return (
    <>
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
              <span>{opt.label}</span>
              {/* Reserve check-icon space on every button so when one is
                  selected, the labels stay vertically aligned across the row. */}
              <span style={{
                color: 'var(--lime-400)',
                display: 'flex',
                visibility: selected ? 'visible' : 'hidden',
              }}>
                <IconCheck size={14}/>
              </span>
            </button>
          );
        })}
      </div>
      {skipLabel && (
        <button
          onClick={() => onChange('skip')}
          style={{
            appearance: 'none', cursor: 'pointer',
            width: '100%', marginTop: 10,
            padding: '12px 14px',
            borderRadius: 'var(--r-md)',
            background: value === 'skip' ? 'var(--ink-700)' : 'transparent',
            color: value === 'skip' ? '#fff' : 'var(--ink-500)',
            border: '1px dashed ' + (value === 'skip' ? 'var(--ink-700)' : 'var(--cream-200)'),
            fontFamily: 'var(--font-sans)',
            fontSize: 13, fontWeight: 500,
            letterSpacing: '-0.005em',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            transition: 'background .15s, color .15s, border-color .15s',
          }}
        >
          {value === 'skip' && (
            <span style={{ color: 'var(--lime-400)', display: 'flex' }}>
              <IconCheck size={12}/>
            </span>
          )}
          <span>{skipLabel}</span>
        </button>
      )}
    </>
  );
}

const COMP_OPTIONS = [
  { value: 'ampeer',         label: 'Ampeer' },
  { value: 'about_the_same', label: 'About the same' },
  { value: 'enphase',        label: 'Enphase' },
];

function ScreenshotCard({ label, src, onClick }) {
  const [hov, setHov] = React.useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      aria-label={`Zoom in: ${label} screenshot`}
      style={{
        appearance: 'none', cursor: 'pointer',
        padding: 0, textAlign: 'left',
        background: 'var(--surface)',
        border: '1px solid ' + (hov ? 'var(--ink-900)' : 'var(--cream-200)'),
        borderRadius: 'var(--r-md)',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        fontFamily: 'var(--font-sans)',
        boxShadow: hov ? '0 6px 20px rgba(10,12,11,0.10)' : 'none',
        transform: hov ? 'translateY(-1px)' : 'none',
        transition: 'box-shadow .15s, transform .15s, border-color .15s',
      }}
    >
      <div style={{
        position: 'relative',
        width: '100%', aspectRatio: '9 / 16',
        background: 'var(--cream-100)',
      }}>
        <img
          src={src}
          alt={`${label} screenshot`}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        {/* Subtle zoom affordance overlay */}
        <div style={{
          position: 'absolute', top: 6, right: 6,
          width: 24, height: 24, borderRadius: 999,
          background: 'rgba(10,12,11,0.55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 12,
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}>
          🔍
        </div>
      </div>
      <div style={{
        padding: '8px 10px', fontSize: 11, fontWeight: 600,
        letterSpacing: '0.04em', textTransform: 'uppercase',
        color: 'var(--ink-600)', textAlign: 'center',
        borderTop: '1px solid var(--cream-200)',
      }}>
        {label}
      </div>
    </button>
  );
}

function ComparisonQuestion({ ampeerImage, enphaseImage, value, onChange }) {
  // null | 'ampeer' | 'enphase' — which screenshot is expanded in the lightbox.
  const [expanded, setExpanded] = React.useState(null);

  return (
    <div style={{ marginTop: 8 }}>
      {/* Tap-to-zoom hint — plain muted subtitle */}
      <p style={{
        margin: '0 0 14px',
        fontSize: 14, lineHeight: 1.5,
        color: 'var(--ink-600)',
        fontFamily: 'var(--font-sans)',
        letterSpacing: '-0.005em',
      }}>
        Tap a screenshot to zoom in.
      </p>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 12, marginBottom: 18,
      }}>
        <ScreenshotCard label="Ampeer" src={ampeerImage}
          onClick={() => setExpanded('ampeer')}/>
        <ScreenshotCard label="Enphase Enlighten" src={enphaseImage}
          onClick={() => setExpanded('enphase')}/>
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

      {expanded && (
        <Lightbox
          src={expanded === 'ampeer' ? ampeerImage : enphaseImage}
          label={expanded === 'ampeer' ? 'Ampeer' : 'Enphase Enlighten'}
          onClose={() => setExpanded(null)}
        />
      )}
    </div>
  );
}

// Fullscreen image overlay for the comparison screenshots.
// Tap-outside / ESC / close-button all dismiss it.
//
// Rendered via a portal into document.body so it escapes all parent scroll
// containers (.pw-screen, IOSDevice's flex:1 overflow:auto, etc). Without
// the portal, wheel/scroll events from inside the lightbox would bubble up
// and scroll those ancestors, which makes the close button appear to drift.
function Lightbox({ src, label, onClose }) {
  React.useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);

    // Belt-and-suspenders body lock (no-op on this app since body is already
    // overflow: hidden, but keeps the lock intact for any future change).
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
    };
  }, [onClose]);

  const content = (
    <div
      onClick={onClose}
      onWheel={(e) => e.preventDefault()}
      onTouchMove={(e) => e.preventDefault()}
      role="dialog"
      aria-label={`${label} screenshot`}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.92)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        overscrollBehavior: 'contain',
        touchAction: 'none',
        animation: 'pwFade .22s ease',
      }}
    >
      {/* Label, top-left */}
      <div style={{
        position: 'absolute', top: 'calc(env(safe-area-inset-top, 0px) + 56px)', left: 20,
        color: '#fff', fontSize: 13, fontWeight: 600,
        letterSpacing: '0.04em', textTransform: 'uppercase',
        fontFamily: 'var(--font-sans)',
        opacity: 0.85,
        padding: '6px 12px',
        borderRadius: 999,
        background: 'rgba(255,255,255,0.10)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}>
        {label}
      </div>

      {/* Close button, top-right */}
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        aria-label="Close zoomed image"
        style={{
          position: 'absolute',
          top: 'calc(env(safe-area-inset-top, 0px) + 52px)', right: 20,
          width: 44, height: 44, borderRadius: 999,
          appearance: 'none', border: 0,
          background: 'rgba(255,255,255,0.15)',
          color: '#fff', cursor: 'pointer',
          fontSize: 26, lineHeight: 1, fontWeight: 300,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
      >
        ×
      </button>

      {/* Image, centred */}
      <img
        src={src}
        alt={`${label} screenshot — zoomed`}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '100%', maxHeight: '100%',
          margin: 'auto',
          display: 'block',
          objectFit: 'contain',
          padding: '116px 16px 32px',
          boxSizing: 'border-box',
          cursor: 'default',
        }}
      />
    </div>
  );
  return ReactDOM.createPortal(content, document.body);
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
