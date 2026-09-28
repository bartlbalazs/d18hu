import { readFileSync } from 'node:fs';
import { parse as parseYaml } from 'yaml';
import { getBuildMode, isSiteUrlConfigured, resolveSiteUrl, type BuildMode } from './build-mode.ts';
import { assembleEvents, type TimelineEvent } from './editorial/assemble.ts';
import {
  auditEditorial,
  formatMissingItems,
  MissingEditorialItemsError,
  type MissingItem,
} from './editorial/audit.ts';
import { eventsEditorialSchema, siteEditorialSchema, type SiteEditorial } from './editorial/schema.ts';
import { readManifest } from './images/manifest.ts';
import { parseTimeline } from './timeline/parse.ts';
import type { ParsedEra } from './timeline/types.ts';

export const TIMELINE_PATH = 'input/timeline.md';
export const EVENTS_EDITORIAL_PATH = 'editorial/events.yaml';
export const SITE_EDITORIAL_PATH = 'editorial/site.yaml';

export type Era = ParsedEra & SiteEditorial['eras'][ParsedEra['id']] & { events: TimelineEvent[] };

export type SiteData = {
  mode: BuildMode;
  isDraft: boolean;
  eras: Era[];
  events: TimelineEvent[];
  site: SiteEditorial;
  missingItems: MissingItem[];
};

let cached: SiteData | undefined;

/** Loads and validates all content once per build. Structural problems throw in every mode. */
export function loadSiteData(): SiteData {
  if (cached) return cached;

  const mode = getBuildMode();
  const timeline = parseTimeline(readFileSync(TIMELINE_PATH, 'utf8'));
  const eventsEditorial = eventsEditorialSchema.parse(readYamlFile(EVENTS_EDITORIAL_PATH) ?? {});
  const site = siteEditorialSchema.parse(readYamlFile(SITE_EDITORIAL_PATH));
  const events = assembleEvents(timeline, eventsEditorial, readManifest());

  const missingItems = auditEditorial(events, site, {
    siteUrlConfigured: isSiteUrlConfigured(resolveSiteUrl()),
  });
  if (missingItems.length > 0) {
    if (mode === 'release') throw new MissingEditorialItemsError(missingItems);
    console.warn(`\n[d18] Draft build.\n${formatMissingItems(missingItems)}\n`);
  }

  const eras = timeline.eras.map((era) => ({
    ...era,
    ...site.eras[era.id],
    events: events.filter((event) => event.era === era.id),
  }));

  cached = { mode, isDraft: mode === 'draft', eras, events, site, missingItems };
  return cached;
}

function readYamlFile(path: string): unknown {
  try {
    return parseYaml(readFileSync(path, 'utf8'));
  } catch (error) {
    throw new Error(`could not read ${path}: ${(error as Error).message}`);
  }
}
