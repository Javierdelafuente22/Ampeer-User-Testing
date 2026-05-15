// Transition screen — high-contrast forest-green takeover that signals
// "you're about to begin a new part of the study."

function TransitionScreen({ title, subtitle, cta, onContinue, eyebrow = 'Next up' }) {
  return (
    <div className="pw-fade-in" style={{
      width: '100%', height: '100%',
      minHeight: '100%',
      background: 'linear-gradient(170deg, var(--forest-900) 0%, var(--forest-700) 60%, var(--forest-600) 100%)',
      color: '#F2EFE7',
      display: 'flex', flexDirection: 'column',
      padding: '64px 24px 32px',
      boxSizing: 'border-box',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Soft top-right glow */}
      <div style={{
        position: 'absolute', top: -120, right: -120,
        width: 360, height: 360, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,192,111,0.32), rgba(0,192,111,0) 70%)',
        pointerEvents: 'none',
      }}/>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
        {/* Icon badge */}
        <div style={{
          width: 72, height: 72, borderRadius: 999,
          background: 'rgba(0,192,111,0.18)',
          border: '1px solid rgba(0,192,111,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--lime-400)',
          marginBottom: 28,
          boxShadow: '0 8px 32px rgba(0,168,98,0.28)',
        }}>
          <IconBolt size={28}/>
        </div>

        {/* Eyebrow */}
        <div className="t-label" style={{
          color: 'var(--lime-400)',
          fontSize: 12, fontWeight: 600,
          letterSpacing: '0.05em',
          marginBottom: 14,
        }}>
          {eyebrow}
        </div>

        {/* Title */}
        <h1 className="t-title" style={{
          fontSize: 30, lineHeight: 1.1,
          margin: '0 0 14px',
          color: '#fff',
          fontWeight: 600,
          letterSpacing: '-0.025em',
          textWrap: 'pretty',
          maxWidth: 360,
        }}>
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p style={{
            fontSize: 15, lineHeight: 1.5,
            color: 'rgba(242,239,231,0.72)',
            margin: 0,
            maxWidth: 360,
            textWrap: 'pretty',
          }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* CTA pinned to the bottom */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <PwButton variant="accent" onClick={onContinue} icon={<IconArrowRight size={16}/>}>
          {cta}
        </PwButton>
      </div>
    </div>
  );
}

Object.assign(window, { TransitionScreen });
