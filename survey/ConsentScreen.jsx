// Consent screen — first thing the participant sees.
function ConsentScreen({ onContinue }) {
  const [agreed, setAgreed] = React.useState(false);
  return (
    <PwScreen>
      <PwPageTitle
        eyebrow="User study"
        title="Welcome — and thank you."
        subtitle="You're about to test Ampeer, a prototype app for peer-to-peer solar energy trading. Your honest reactions will shape the design."
        size={32}
      />

      <div style={{
        marginTop: 8,
        background: 'var(--surface)',
        border: '1px solid var(--cream-200)',
        borderRadius: 'var(--r-lg)',
        padding: '18px 20px',
        display: 'flex', flexDirection: 'column', gap: 14,
      }}>
        <InfoRow icon="⏱"  title="About 15 minutes" detail="Two short questionnaires, an onboarding flow, and free exploration of the app."/>
        <InfoRow icon="🔒" title="Anonymous"        detail="We don't collect your name, email, or any identifying information."/>
        <InfoRow icon="↩︎" title="You can withdraw any time" detail="Close the tab and your responses for this session are discarded."/>
        <InfoRow icon="📤" title="What we collect"  detail="Only your answers to the survey questions. No tracking, no analytics."/>
      </div>

      <div style={{ marginTop: 18 }}>
        <PwReassurance title="Research purposes only">
          Responses help us improve the design and are not used for any other purpose.
        </PwReassurance>
      </div>

      <button
        type="button"
        onClick={() => setAgreed((a) => !a)}
        style={{
          appearance: 'none', width: '100%', textAlign: 'left', cursor: 'pointer',
          marginTop: 20, display: 'flex', gap: 12, alignItems: 'flex-start',
          padding: '14px 16px',
          background: agreed ? 'var(--lime-50)' : 'var(--surface)',
          border: '1px solid ' + (agreed ? 'var(--lime-500)' : 'var(--cream-200)'),
          borderRadius: 'var(--r-md)',
          transition: 'background .18s, border-color .18s',
          fontFamily: 'var(--font-sans)',
        }}
      >
        <div style={{
          width: 22, height: 22, borderRadius: 6,
          border: '1.5px solid ' + (agreed ? 'var(--ink-900)' : 'var(--ink-300)'),
          background: agreed ? 'var(--ink-900)' : 'transparent',
          flexShrink: 0, marginTop: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all .16s',
        }}>
          {agreed && <span style={{ color: 'var(--lime-400)', display: 'flex' }}><IconCheck size={14}/></span>}
        </div>
        <span style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--ink-700)' }}>
          I understand the purpose of this study and agree to participate. I know I can stop at any time.
        </span>
      </button>

      <div style={{ marginTop: 20 }}>
        <PwButton onClick={onContinue} disabled={!agreed} icon={<IconArrowRight size={16}/>}>
          Begin study
        </PwButton>
      </div>
    </PwScreen>
  );
}

function InfoRow({ icon, title, detail }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <div style={{
        width: 32, height: 32, borderRadius: 10,
        background: 'var(--lime-50)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16, flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-900)', letterSpacing: '-0.005em' }}>
          {title}
        </div>
        <div style={{ fontSize: 13, color: 'var(--ink-600)', marginTop: 2, lineHeight: 1.45 }}>
          {detail}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ConsentScreen });
