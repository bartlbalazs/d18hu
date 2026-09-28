export type BuildMode = 'draft' | 'release';

export function getBuildMode(env: Record<string, string | undefined> = process.env): BuildMode {
  const mode = env.D18_BUILD_MODE ?? 'draft';
  if (mode !== 'draft' && mode !== 'release') {
    throw new Error(`D18_BUILD_MODE must be "draft" or "release", got "${mode}"`);
  }
  return mode;
}

/** Placeholder origin used only for draft builds when no site URL is configured. */
export const DRAFT_FALLBACK_SITE_URL = 'https://draft.invalid';

export function resolveSiteUrl(env: Record<string, string | undefined> = process.env): string {
  const configured = env.SITE_URL?.trim();
  if (configured) return configured.endsWith('/') ? configured : `${configured}/`;
  return `${DRAFT_FALLBACK_SITE_URL}/`;
}

export function isSiteUrlConfigured(siteUrl: string): boolean {
  return !siteUrl.startsWith(DRAFT_FALLBACK_SITE_URL);
}
