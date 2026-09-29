export type BuildMode = 'draft' | 'release';

export function getBuildMode(env: Record<string, string | undefined> = process.env): BuildMode {
  const mode = env.D18_BUILD_MODE ?? 'draft';
  if (mode !== 'draft' && mode !== 'release') {
    throw new Error(`D18_BUILD_MODE must be "draft" or "release", got "${mode}"`);
  }
  return mode;
}

/** The published address; SITE_URL overrides it, e.g. for a staging copy. */
export const DEFAULT_SITE_URL = 'https://www.dembinszky18.hu/';

export function resolveSiteUrl(env: Record<string, string | undefined> = process.env): string {
  const configured = env.SITE_URL?.trim();
  if (configured) return configured.endsWith('/') ? configured : `${configured}/`;
  return DEFAULT_SITE_URL;
}
