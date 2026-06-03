// The four question controls shared across all three stages:
//   ChoiceQuestion           — list of radio-style options
//   YesMaybeNoQuestion       — Yes / Maybe / No, optionally with a "Skip"
//   ComparisonQuestion       — two side-by-side screenshots + 3 options
//   ExplanatoryScreenshot    — single reference image with tap-to-zoom
//   OpenTextQuestion         — free-text area

// A vertical list of single-select options.
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

// Three big buttons (Yes / Maybe / No). Pass `skipLabel` to add a dashed
// "skip" button underneath for questions the participant may not be able to answer.
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
                padding: '16px 12px',
                borderRadius: 'var(--r-md)',
                background: selected ? 'var(--ink-900)' : 'var(--surface)',
                color: selected ? '#fff' : 'var(--ink-900)',
                border: '1px solid ' + (selected ? 'var(--ink-900)' : 'var(--cream-200)'),
                boxShadow: selected ? '0 0 0 2px var(--lime-500)' : 'none',
                fontFamily: 'var(--font-sans)', fontSize: 16, fontWeight: 600,
                letterSpacing: '-0.005em',
                transition: 'background .15s, color .15s, border-color .15s, box-shadow .15s',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {opt.label}
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

// One thumbnail card used by ComparisonQuestion. Clicking opens the Lightbox.
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

// Side-by-side Ampeer / Enphase screenshots with three answer buttons
// underneath. Either screenshot can be tapped to open in a full-screen lightbox.
function ComparisonQuestion({ ampeerImage, enphaseImage, value, onChange }) {
  // null when neither screenshot is zoomed; otherwise 'ampeer' or 'enphase'.
  const [expanded, setExpanded] = React.useState(null);

  return (
    <div style={{ marginTop: 8 }}>
      {/* Tap-to-zoom hint */}
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

// Full-screen zoomed view of a screenshot. Dismissed by tap-outside, the
// close button, or the Escape key.
//
// Rendered through a portal into document.body so it sits above the iOS
// device frame and the survey's scroll containers. Without the portal,
// wheel/scroll events would leak into ancestors and make the close button
// appear to drift as the user scrolled.
function Lightbox({ src, label, onClose }) {
  React.useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);

    // Lock body scroll while the lightbox is open. Today this is a no-op
    // (body is already overflow: hidden) but it keeps the guarantee if
    // that ever changes.
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

// One reference screenshot shown under a YMN question, half the canvas wide,
// to remind the participant where the feature lives. Tap to zoom.
function ExplanatoryScreenshot({ src, alt = 'Reference screenshot' }) {
  const [expanded, setExpanded] = React.useState(false);
  const [hov, setHov] = React.useState(false);
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
      <button
        type="button"
        onClick={() => setExpanded(true)}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        aria-label={`Zoom in: ${alt}`}
        style={{
          appearance: 'none', cursor: 'pointer',
          padding: 0, textAlign: 'left',
          width: 'calc(50% - 6px)',
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
            alt={alt}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
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
      </button>
      {expanded && (
        <Lightbox src={src} label={alt} onClose={() => setExpanded(false)}/>
      )}
    </div>
  );
}

// Plain multi-line free-text input.
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

Object.assign(window, { ChoiceQuestion, YesMaybeNoQuestion, ComparisonQuestion, ExplanatoryScreenshot, OpenTextQuestion });
