// Clean main-app shell — 5-tab app.
// On mobile (touch + narrow screen), renders full-screen with no frame.
// On desktop, keeps the centered IOSDevice card.

// Weather state is owned here (not in HouseTab) so the override applied on the
// Home tab also drives the Community tab's animation.
const SHELL_WEATHER_LAT = 51.48, SHELL_WEATHER_LON = -0.20; // Fulham, SW6
function shellClassifyWeather(code) {
  if (code <= 1) return 'sunny';
  if (code <= 64) return 'cloudy';
  return 'rainy';
}

// Night runs 20:00–06:00 UK local time. Overrides the live weather kind.
function isUKNight(date) {
  const hr = parseInt(
    new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', hour: 'numeric', hour12: false }).format(date),
    10
  );
  return hr >= 20 || hr < 6;
}

function useWeatherState() {
  const [weather, setWeather] = React.useState(null);
  const [override, setOverride] = React.useState(null);
  const [now, setNow] = React.useState(() => new Date());

  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60 * 1000);
    return () => clearInterval(id);
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${SHELL_WEATHER_LAT}&longitude=${SHELL_WEATHER_LON}&current=temperature_2m,weather_code&timezone=Europe%2FLondon`;
    fetch(url)
      .then(r => r.json())
      .then(d => {
        if (cancelled) return;
        if (d && d.current && typeof d.current.weather_code === 'number') {
          setWeather({
            kind: shellClassifyWeather(d.current.weather_code),
            temp: Math.round(d.current.temperature_2m),
          });
        } else {
          setWeather({ kind: 'sunny', temp: 18, error: true });
        }
      })
      .catch(() => { if (!cancelled) setWeather({ kind: 'sunny', temp: 18, error: true }); });
    return () => { cancelled = true; };
  }, []);

  const isNight = isUKNight(now);
  // Time wins over weather: at night, kind is 'night' regardless of cloud cover.
  const liveKind = isNight ? 'night' : (weather?.kind ?? 'sunny');
  const activeKind = override || liveKind;
  const activeTemp = weather?.temp ?? 18;
  const isLoading = !weather;
  const hasError = !!weather?.error;
  const isLive = !override && weather && !hasError;

  return { weather, override, setOverride, liveKind, activeKind, activeTemp, isLoading, hasError, isLive };
}

function MainAppShell({
  tabsVisited = [], onTabVisit, endStudyMode, onEndStudy,
  firstName = 'Sarah', fullName = 'Sarah Chen', initials = 'SC',
}) {
  const [tab, setTab] = React.useState('home');
  const [communityHighlight, setCommunityHighlight] = React.useState(false);
  const [homeHighlight, setHomeHighlight] = React.useState(true);
  const weatherState = useWeatherState();

  const isMobile =
    window.matchMedia('(max-width: 600px) and (pointer: coarse)').matches ||
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;

  // Report the initial 'home' visit immediately so the counter starts at 1/5,
  // not 0/5. Subsequent visits are reported when the user taps a tab.
  React.useEffect(() => {
    onTabVisit && onTabVisit(tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSetTab = (nextTab) => {
    setTab(nextTab);
    onTabVisit && onTabVisit(nextTab);
  };

  const handleNavigate = (nextTab, fromBanner = false) => {
    handleSetTab(nextTab);
    if (fromBanner && nextTab === 'community') setCommunityHighlight(true);
  };

  // Survey chrome — end-study button overlay. Visible only when a mode is set
  // (i.e. we're inside the study, not in standalone-app mode).
  const allTabsVisited = tabsVisited.length >= 5;
  const surveyOverlay = endStudyMode === 'end' ? (
    <EndStudyButton
      enabled={allTabsVisited}
      visitedCount={tabsVisited.length}
      onClick={onEndStudy}
      isMobile={isMobile}
    />
  ) : endStudyMode === 'return' ? (
    <ReturnToSurveyButton onClick={onEndStudy} isMobile={isMobile}/>
  ) : null;

  const renderTab = () => {
    switch (tab) {
      case 'home':      return <HouseTab onNavigate={handleNavigate} highlight={homeHighlight} onClearHighlight={() => setHomeHighlight(false)} weatherState={weatherState}/>;
      case 'community': return <CommunityTab highlight={communityHighlight} onClearHighlight={() => setCommunityHighlight(false)} weatherState={weatherState}/>;
      case 'dashboard': return <DashboardTab onNavigate={handleNavigate}/>;
      case 'profile':   return <ProfileTab fullName={fullName} initials={initials}/>;
      default:          return <DashboardTab/>;
    }
  };

  // AssistantTab is always mounted to preserve conversation + toggle state.
  // It is shown/hidden via display rather than remounted on tab switch.
  const assistantLayer = (style) => (
    <div style={{ position: 'absolute', inset: 0, display: tab === 'assistant' ? 'flex' : 'none', flexDirection: 'column', ...style }}>
      <AssistantTab firstName={firstName}/>
      <TabBar active={tab} onChange={handleSetTab}/>
    </div>
  );

  if (isMobile) {
    return (
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'var(--cream-50, #F4F5F2)',
        overflow: 'hidden',
      }}>
        {assistantLayer({})}
        {tab !== 'assistant' && (
          <div key={tab} style={{ position: 'absolute', inset: 0 }} className="pw-fade-in">
            {renderTab()}
            <TabBar active={tab} onChange={handleSetTab}/>
          </div>
        )}
        {surveyOverlay}
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#E8E3D6',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px', boxSizing: 'border-box',
    }}>
      <IOSDevice width={390} height={844}>
        <div style={{ height: '100%', position: 'relative' }}>
          {assistantLayer({})}
          {tab !== 'assistant' && (
            <div key={tab} style={{ height: '100%', position: 'relative' }} className="pw-fade-in">
              {renderTab()}
              <TabBar active={tab} onChange={handleSetTab}/>
            </div>
          )}
          {surveyOverlay}
        </div>
      </IOSDevice>
    </div>
  );
}

// Floating "Return to questionnaire" pill — shown when the participant is
// revisiting the app from Stage 3.
function ReturnToSurveyButton({ onClick, isMobile }) {
  const [hov, setHov] = React.useState(false);
  const top = isMobile ? 'calc(env(safe-area-inset-top, 0px) + 6px)' : 60;
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'absolute',
        top, right: 16,
        zIndex: 70,
        appearance: 'none', cursor: 'pointer',
        border: '1px solid var(--ink-900)',
        background: hov ? 'var(--forest-700)' : 'var(--ink-900)',
        color: '#fff',
        padding: '8px 14px',
        borderRadius: 999,
        fontFamily: 'var(--font-sans)',
        fontSize: 12, fontWeight: 600,
        letterSpacing: '-0.005em',
        boxShadow: '0 6px 18px rgba(7,22,15,0.18)',
        display: 'inline-flex', alignItems: 'center', gap: 6,
        transition: 'background .15s',
      }}
    >
      <IconArrowRight size={12}/>
      <span>Return to questionnaire</span>
    </button>
  );
}

Object.assign(window, { MainAppShell });
