// Client-side telemetry helper
export function getVisitorId(): string {
  let id = localStorage.getItem('biomentor_visitor_id');
  if (!id) {
    id = 'vis_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
    localStorage.setItem('biomentor_visitor_id', id);
  }
  return id;
}

export function initTelemetryHeartbeat(): void {
  const visitorId = getVisitorId();
  const sessionKey = 'biomentor_session_init';
  const hasInitedSession = sessionStorage.getItem(sessionKey);

  const ping = (isNewSession: boolean = false) => {
    fetch('/api/telemetry/heartbeat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitorId,
        userAgent: navigator.userAgent,
        isNewSession,
      }),
    }).catch(() => {
      // silent background failure handling
    });
  };

  if (!hasInitedSession) {
    sessionStorage.setItem(sessionKey, 'true');
    ping(true);
  } else {
    ping(false);
  }

  // Periodic heartbeat every 4 minutes while tab is active
  setInterval(() => {
    if (document.visibilityState === 'visible') {
      ping(false);
    }
  }, 240000);
}
