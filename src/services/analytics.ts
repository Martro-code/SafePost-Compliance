import ReactGA from 'react-ga4';

// Vercel environment variable: VITE_GA4_MEASUREMENT_ID=G-83RED7R563

/**
 * Check if the user has accepted cookie consent.
 * GA4 must only fire when consent is given.
 */
function hasConsent(): boolean {
  return localStorage.getItem('safepost_cookie_consent') === 'accepted';
}

/**
 * Initialise GA4. Call once at app startup.
 * Only initialises if the measurement ID is set and the user has accepted cookies.
 */
export function initGA4(): void {
  const measurementId = import.meta.env.VITE_GA4_MEASUREMENT_ID;
  if (!measurementId || !hasConsent()) return;
  ReactGA.initialize(measurementId);
}

/**
 * Returns true if GA4 has been initialised (consent was given at startup).
 */
export function isGA4Initialised(): boolean {
  return ReactGA.isInitialized;
}

/**
 * Send a page view. Only fires if GA4 is initialised.
 */
export function trackPageView(path: string): void {
  if (!isGA4Initialised()) return;
  ReactGA.send({ hitType: 'pageview', page: path });
}

// ─── Custom event helpers ────────────────────────────────────────────────────
// Each function checks consent before firing.
// No PII, health information, or compliance content is ever sent.

export function trackSignUp(method: 'email' | 'google'): void {
  if (!isGA4Initialised()) return;
  ReactGA.event('sign_up', { method });
}

export function trackLogin(method: 'email' | 'google'): void {
  if (!isGA4Initialised()) return;
  ReactGA.event('login', { method });
}

export function trackComplianceCheckRun(platform: string, contentType: string): void {
  if (!isGA4Initialised()) return;
  ReactGA.event('compliance_check_run', {
    platform,
    content_type: contentType,
  });
}

export function trackComplianceResultViewed(
  verdict: 'compliant' | 'non_compliant',
  issuesCount: number,
): void {
  if (!isGA4Initialised()) return;
  ReactGA.event('compliance_result_viewed', {
    verdict,
    issues_count: issuesCount,
  });
}

export function trackUpgradeInitiated(plan: string, billing: 'monthly' | 'annual'): void {
  if (!isGA4Initialised()) return;
  ReactGA.event('upgrade_initiated', { plan, billing });
}

export function trackUpgradeCompleted(plan: string, value: number): void {
  if (!isGA4Initialised()) return;
  ReactGA.event('upgrade_completed', { plan, value });
}

export function trackPdfExported(): void {
  if (!isGA4Initialised()) return;
  ReactGA.event('pdf_exported');
}

export function trackContactFormSubmitted(): void {
  if (!isGA4Initialised()) return;
  ReactGA.event('contact_form_submitted');
}
