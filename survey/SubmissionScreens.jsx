// Submitting / Complete / Fallback screens after Stage 3 submit.

function SubmittingScreen() {
  return (
    <PwScreen>
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '80px 16px', textAlign: 'center',
      }}>
        <div style={{ position: 'relative', width: 64, height: 64 }}>
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 999,
            border: '2px solid var(--cream-200)',
          }}/>
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 999,
            border: '2px solid transparent',
            borderTopColor: 'var(--forest-700)',
            borderRightColor: 'var(--forest-700)',
            animation: 'pwSurveySpin 1.1s cubic-bezier(.5,.1,.5,.9) infinite',
          }}/>
        </div>
        <style>{`@keyframes pwSurveySpin { to { transform: rotate(360deg); } }`}</style>
        <div className="t-display" style={{ marginTop: 24, fontSize: 22 }}>
          Submitting your responses…
        </div>
        <div style={{ marginTop: 6, fontSize: 13, color: 'var(--ink-600)' }}>
          This usually takes a second or two.
        </div>
      </div>
    </PwScreen>
  );
}

function CompleteScreen() {
  return (
    <PwScreen>
      {/* Brand mark up top */}
      <div style={{
        display: 'flex', justifyContent: 'center',
        marginTop: 8, marginBottom: 36,
      }}>
        <PeerwayLogo size={20}/>
      </div>

      <div style={{ textAlign: 'center' }}>
        <div style={{
          margin: '0 auto 24px',
          width: 80, height: 80, borderRadius: 999,
          background: 'var(--ink-900)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--lime-400)',
          boxShadow: '0 10px 30px rgba(0,168,98,0.20)',
        }}>
          <IconCheck size={36}/>
        </div>
        <PwPageTitle
          title="Thank you."
          subtitle="Your responses have been recorded. Feedback from people like you is what makes the design better."
          size={28}
        />
        <div style={{
          marginTop: 18, display: 'inline-block',
          padding: '12px 14px',
          background: 'var(--lime-50)',
          border: '1px solid var(--lime-100)',
          borderRadius: 'var(--r-md)',
          fontSize: 13, color: 'var(--forest-700)',
        }}>
          You may now close this tab.
        </div>
      </div>

      {/* Contact footer */}
      <div style={{
        marginTop: 56,
        padding: '16px 18px',
        borderTop: '1px solid var(--cream-200)',
        textAlign: 'center',
      }}>
        <div className="t-label" style={{
          color: 'var(--ink-500)', fontSize: 11,
          marginBottom: 8,
        }}>
          Any queries
        </div>
        <div style={{
          fontSize: 14, color: 'var(--ink-900)', fontWeight: 500,
          letterSpacing: '-0.005em',
        }}>
          Javier de la Fuente
        </div>
        <a href="mailto:jd2322@ic.ac.uk" style={{
          display: 'inline-block', marginTop: 4,
          fontSize: 13, color: 'var(--forest-700)',
          textDecoration: 'none', fontFamily: 'var(--font-sans)',
          letterSpacing: '-0.005em',
        }}>
          jd2322@ic.ac.uk
        </a>
      </div>
    </PwScreen>
  );
}

function FallbackScreen({ responses, error, onRetry }) {
  const json = JSON.stringify(responses, null, 2);
  const copy = async () => {
    try { await navigator.clipboard.writeText(json); } catch (e) {}
  };
  return (
    <PwScreen>
      <PwPageTitle
        eyebrow="Submission failed"
        title="Sorry — we couldn't reach the server."
        subtitle="Please screenshot the responses below, or copy them, so the researcher can record them manually."
        size={26}
      />
      {error && (
        <div style={{
          padding: '10px 12px', borderRadius: 'var(--r-md)',
          background: '#FBECE6', color: 'var(--error)',
          fontSize: 12, marginBottom: 16,
          fontFamily: 'var(--font-mono)',
        }}>
          {error}
        </div>
      )}
      <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
        <PwButton onClick={onRetry} icon={<IconRefresh size={14}/>} style={{ flex: 1 }}>
          Try again
        </PwButton>
        <PwButton variant="ghost" onClick={copy} style={{ flex: 1 }}>
          Copy responses
        </PwButton>
      </div>
      <pre style={{
        margin: 0, padding: 14,
        background: 'var(--ink-900)', color: '#E8F2EC',
        borderRadius: 'var(--r-md)',
        fontSize: 11, lineHeight: 1.5,
        overflow: 'auto', maxHeight: 380,
        fontFamily: 'var(--font-mono)',
        whiteSpace: 'pre-wrap', wordBreak: 'break-word',
      }}>
        {json}
      </pre>
    </PwScreen>
  );
}

Object.assign(window, { SubmittingScreen, CompleteScreen, FallbackScreen });
