// State machine that drives the whole user study. The phase variable
// walks through each step in order:
//
//   consent → stage1 → transition → onboarding → stage2 → transition →
//   app_exploration → stage3 → submitting → complete (or fallback)
//
// Stage 3 has a "Back to the app" path that re-enters MainAppShell and
// then returns to the same question. A page refresh always restarts the
// study — the assumption is one participant per session.
function PeerwayRoot() {
  const [phase, setPhase] = React.useState(() => {
    try { sessionStorage.removeItem('pw_onboarded'); } catch (e) {}
    return 'consent';
  });

  const [responses, setResponses] = React.useState(() => ({
    startedAt: new Date().toISOString(),
    consentAgreed: false,
    firstName: '',
  }));

  // The name shown throughout the demo. If the participant gave one, the
  // app uses it but masks the missing surname (e.g. "Javi •••••"). If not,
  // we fall back to the default "Sarah Chen" persona.
  const trimmedFirst = (responses.firstName || '').trim();
  const userProvidedName = trimmedFirst.length > 0;
  const displayFirstName = userProvidedName ? trimmedFirst : 'Sarah';
  const displayFullName  = userProvidedName ? `${trimmedFirst} •••••` : 'Sarah Chen';
  const displayInitials  = userProvidedName
    ? trimmedFirst.charAt(0).toUpperCase()
    : 'SC';
  const [submissionError, setSubmissionError] = React.useState(null);

  // Held at the root so the tab-visit counter survives navigation in and out
  // of MainAppShell during Stage 3.
  const [tabsVisited, setTabsVisited] = React.useState([]);

  // The Stage 3 question index lives here so it's kept when the participant
  // taps "Back to the app" and later returns to the questionnaire.
  const [stage3Q, setStage3Q] = React.useState(0);
  const [stage3RevisitingApp, setStage3RevisitingApp] = React.useState(false);

  const update = React.useCallback((patch) => {
    setResponses(r => ({ ...r, ...patch }));
  }, []);

  // Final submit: tag the responses with the end time and duration, send
  // them to Supabase, and route to either the success or fallback screen.
  const handleSubmit = React.useCallback(async () => {
    const finalResponses = {
      ...responses,
      appTabsVisited: tabsVisited,
      completedAt: new Date().toISOString(),
      durationSeconds: Math.round((Date.now() - new Date(responses.startedAt).getTime()) / 1000),
    };
    setResponses(finalResponses);
    setPhase('submitting');
    const result = await window.submitSurveyToSheets(finalResponses);
    if (result.ok) {
      setPhase('complete');
    } else {
      setSubmissionError(result.error);
      setPhase('fallback');
    }
  }, [responses, tabsVisited]);

  // "Try again" handler on the fallback screen. Uses the responses we
  // already finalised, no re-tagging needed.
  const retrySubmit = React.useCallback(async () => {
    setPhase('submitting');
    const result = await window.submitSurveyToSheets({ ...responses, appTabsVisited: tabsVisited });
    if (result.ok) {
      setPhase('complete');
    } else {
      setSubmissionError(result.error);
      setPhase('fallback');
    }
  }, [responses, tabsVisited]);

  // Drops a survey screen into the iOS device frame on desktop, or renders
  // it full-viewport on mobile. Used by almost every phase below.
  const renderInFrame = (content) => {
    const isMobile =
      window.matchMedia('(max-width: 600px) and (pointer: coarse)').matches ||
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;

    if (isMobile) {
      return (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'var(--cream-50, #F4F5F2)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            {content}
          </div>
        </div>
      );
    }
    return (
      <div style={{
        minHeight: '100vh', background: '#E8E3D6',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px', boxSizing: 'border-box',
      }}>
        <div style={{ transform: `scale(${DESKTOP_FRAME_SCALE})`, transformOrigin: 'center' }}>
          <IOSDevice width={390} height={844}>
            {content}
          </IOSDevice>
        </div>
      </div>
    );
  };

  // ─────────────────────── phase routing ───────────────────────

  // Stage 3 "Back to the app" mode: drop the participant straight onto the
  // tab that's most relevant to the question they're answering, so they
  // don't have to navigate around to verify their answer.
  if (phase === 'stage3' && stage3RevisitingApp) {
    const tabForStage3Q = (qi) => {
      if (qi === 4) return 'community';
      if (qi === 5 || qi === 6) return 'dashboard';
      if (qi === 7 || qi === 8) return 'assistant';
      if (qi === 9) return 'profile';
      return 'home';
    };
    return (
      <MainAppShell
        firstName={displayFirstName}
        fullName={displayFullName}
        initials={displayInitials}
        userProvidedName={userProvidedName}
        initialTab={tabForStage3Q(stage3Q)}
        tabsVisited={tabsVisited}
        onTabVisit={(id) => {
          setTabsVisited(prev => prev.includes(id) ? prev : [...prev, id]);
        }}
        endStudyMode="return"
        onEndStudy={() => setStage3RevisitingApp(false)}
      />
    );
  }

  if (phase === 'consent') {
    return renderInFrame(
      <ConsentScreen onContinue={() => {
        update({ consentAgreed: true });
        setPhase('stage1');
      }}/>
    );
  }

  if (phase === 'stage1') {
    return renderInFrame(
      <Stage1
        responses={responses}
        update={update}
        onBack={() => setPhase('consent')}
        onComplete={() => setPhase('transition_to_onboarding')}
      />
    );
  }

  if (phase === 'transition_to_onboarding') {
    return renderInFrame(
      <TransitionScreen
        title="You are about to begin the onboarding experience."
        subtitle="About 2 minutes. Go through every screen as if you were a real user."
        cta="Start onboarding"
        onContinue={() => setPhase('onboarding')}
      />
    );
  }

  if (phase === 'onboarding') {
    return (
      <OnboardingFlow
        firstName={displayFirstName}
        fullName={displayFullName}
        initials={displayInitials}
        userProvidedName={userProvidedName}
        onComplete={() => {
          try { sessionStorage.setItem('pw_onboarded', '1'); } catch (e) {}
          setPhase('transition_to_stage2');
        }}
      />
    );
  }

  if (phase === 'transition_to_stage2') {
    return renderInFrame(
      <TransitionScreen
        eyebrow="Onboarding complete"
        title="Tell us how that felt."
        subtitle="5 quick questions about the onboarding experience — about 2 minutes. There are no wrong answers."
        cta="Start questionnaire"
        onContinue={() => setPhase('stage2')}
      />
    );
  }

  if (phase === 'stage2') {
    return renderInFrame(
      <Stage2
        responses={responses}
        update={update}
        onBack={() => setPhase('transition_to_stage2')}
        onComplete={() => setPhase('transition_to_app')}
      />
    );
  }

  if (phase === 'transition_to_app') {
    return renderInFrame(
      <TransitionScreen
        title="Thank you — explore the main app next."
        subtitle="It will take you about 4 minutes. Once explored, click the button top right to end the demo."
        cta="Open the app"
        onContinue={() => setPhase('app_exploration')}
      />
    );
  }

  if (phase === 'app_exploration') {
    return (
      <MainAppShell
        firstName={displayFirstName}
        fullName={displayFullName}
        initials={displayInitials}
        userProvidedName={userProvidedName}
        tabsVisited={tabsVisited}
        onTabVisit={(id) => {
          setTabsVisited(prev => prev.includes(id) ? prev : [...prev, id]);
        }}
        endStudyMode="end"
        onEndStudy={() => setPhase('transition_to_stage3')}
      />
    );
  }

  if (phase === 'transition_to_stage3') {
    return renderInFrame(
      <TransitionScreen
        eyebrow="Demo complete"
        title="One last set of questions."
        subtitle="12 quick questions about your time in the app — about 3 minutes."
        cta="Start questionnaire"
        onContinue={() => setPhase('stage3')}
      />
    );
  }

  if (phase === 'stage3') {
    return renderInFrame(
      <Stage3
        responses={responses}
        update={update}
        questionIndex={stage3Q}
        setQuestionIndex={setStage3Q}
        onBackToApp={() => setStage3RevisitingApp(true)}
        onSubmit={handleSubmit}
      />
    );
  }

  if (phase === 'submitting') {
    return renderInFrame(<SubmittingScreen/>);
  }

  if (phase === 'complete') {
    return renderInFrame(<CompleteScreen/>);
  }

  if (phase === 'fallback') {
    return renderInFrame(
      <FallbackScreen
        responses={{ ...responses, appTabsVisited: tabsVisited }}
        error={submissionError}
        onRetry={retrySubmit}
      />
    );
  }

  return null;
}

Object.assign(window, { PeerwayRoot });
