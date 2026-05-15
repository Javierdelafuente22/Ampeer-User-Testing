// Shared survey primitives — reuse Ampeer's PwButton, PwScreen, PwProgress, etc.,
// but provide a couple of survey-specific helpers (QuestionHeader, EndStudyButton).

function QuestionHeader({ index, total, prompt, subtitle }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div className="t-label" style={{
        color: 'var(--lime-600)', marginBottom: 8, fontSize: 13, fontWeight: 600,
      }}>
        Question {index} of {total}
      </div>
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

// Floating "End study" pill — sits above the iOS chrome at top-right.
// On desktop it must clear the IOSDevice's fake status bar (~50px),
// so we use top: 60. On mobile (full-screen viewport, no fake frame),
// the same value puts it on top of TabHeader items (bell, weather pill,
// live counter). On mobile we sit just below the real OS safe area.
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
