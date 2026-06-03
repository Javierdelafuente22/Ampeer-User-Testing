// Helpers used only by the survey screens. Everything visual relies on the
// Ampeer primitives (PwButton, PwScreen, etc.), but a few survey-specific
// pieces live here: the question header and the floating "End study" pill.

// "Question N of M" eyebrow plus the prompt and optional subtitle.
function QuestionHeader({ index, total, prompt, subtitle, hideEyebrow }) {
  return (
    <div style={{ marginBottom: 22 }}>
      {!hideEyebrow && (
        <div className="t-label" style={{
          color: 'var(--lime-600)', marginBottom: 8, fontSize: 13, fontWeight: 600,
        }}>
          Question {index} of {total}
        </div>
      )}
      <h2 className="t-title" style={{
        fontSize: 26, lineHeight: 1.15, margin: '0 0 8px',
        color: 'var(--ink-900)', fontWeight: 600, letterSpacing: '-0.025em',
        textWrap: 'pretty',
      }}>
        {prompt}
      </h2>
      {subtitle && (
        <p style={{
          fontSize: 14, lineHeight: 1.5, color: 'var(--ink-600)', margin: 0,
          textWrap: 'pretty',
        }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

// Floating pill at the top-right of MainAppShell. Shows progress while the
// participant explores the app, then becomes the "End study" action once
// all tabs have been visited.
//
// On desktop it sits below the fake iOS status bar (~50px); on mobile it
// drops below the real OS safe-area inset instead.
function EndStudyButton({ enabled, visitedCount, totalCount = 5, onClick, isMobile }) {
  const [hov, setHov] = React.useState(false);
  const top = isMobile ? 'calc(env(safe-area-inset-top, 0px) + 6px)' : 60;
  return (
    <button
      onClick={enabled ? onClick : undefined}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      disabled={!enabled}
      style={{
        position: 'absolute',
        top,
        right: 16,
        zIndex: 70,
        appearance: 'none',
        cursor: enabled ? 'pointer' : 'not-allowed',
        border: '1px solid ' + (enabled ? 'var(--ink-900)' : 'var(--cream-200)'),
        background: enabled ? (hov ? 'var(--forest-700)' : 'var(--ink-900)') : 'var(--surface)',
        color: enabled ? '#fff' : 'var(--ink-400)',
        padding: '8px 14px',
        borderRadius: 999,
        fontFamily: 'var(--font-sans)',
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: '-0.005em',
        boxShadow: enabled ? '0 6px 18px rgba(7,22,15,0.18)' : '0 1px 2px rgba(10,12,11,0.05)',
        display: 'inline-flex', alignItems: 'center', gap: 6,
        transition: 'background .15s, box-shadow .15s, transform .12s',
      }}
    >
      {enabled ? (
        <>
          <span style={{ color: 'var(--lime-400)', display: 'flex' }}>
            <IconCheck size={12}/>
          </span>
          <span>End study</span>
        </>
      ) : (
        <span>Visit all 5 tabs · {visitedCount}/{totalCount}</span>
      )}
    </button>
  );
}

Object.assign(window, { QuestionHeader, EndStudyButton });
