export const CONSENT_STORAGE_KEY = 'd18-statisztika';

export type ConsentState = 'granted' | 'denied' | 'ask';

/**
 * The visitor's effective choice. Blocked storage and browser privacy signals count as a refusal,
 * so no notice is shown that could never be remembered or that the browser already answered.
 */
export function resolveConsent(
  stored: string | null | Error,
  signals: { gpc?: boolean; dnt?: string | null },
): ConsentState {
  if (stored instanceof Error) return 'denied';
  if (signals.gpc === true || signals.dnt === '1') return 'denied';
  if (stored === 'granted' || stored === 'denied') return stored;
  return 'ask';
}
