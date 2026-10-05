import { readFileSync } from 'node:fs';
import { parse as parseYaml } from 'yaml';
import { getBuildMode, resolveSiteUrl, type BuildMode } from './build-mode.ts';
import { assembleEvents, type TimelineEvent } from './editorial/assemble.ts';
import {
  auditEditorial,
  formatMissingItems,
  MissingEditorialItemsError,
  type MissingItem,
} from './editorial/audit.ts';
import {
  eventsEditorialSchema,
  musicEditorialSchema,
  siteEditorialSchema,
  type SiteEditorial,
} from './editorial/schema.ts';
import { readManifest } from './images/manifest.ts';
import { buildMusicEntries, mergeIntoEra, type MusicEntry } from './timeline/music.ts';
import { parseTimeline } from './timeline/parse.ts';
import type { ParsedEra } from './timeline/types.ts';

export const TIMELINE_PATH = 'input/timeline.md';
export const EVENTS_EDITORIAL_PATH = 'editorial/events.yaml';
export const SITE_EDITORIAL_PATH = 'editorial/site.yaml';
export const MUSIC_EDITORIAL_PATH = 'editorial/music.yaml';

export type Era = ParsedEra &
  SiteEditorial['eras'][ParsedEra['id']] & {
    events: TimelineEvent[];
    /** What the era's timeline shows: its events with the music entries placed among them. */
    items: (TimelineEvent | MusicEntry)[];
  };

export type SiteData = {
  mode: BuildMode;
  isDraft: boolean;
  eras: Era[];
  events: TimelineEvent[];
  music: MusicEntry[];
  site: SiteEditorial;
  missingItems: MissingItem[];
  analytics: Analytics;
};

/** Analytics exists only in release builds with a measurement ID, and only runs on `siteHost`. */
export type Analytics = { enabled: boolean; measurementId: string; siteHost: string };

let cached: SiteData | undefined;

/** Loads and validates all content once per build. Structural problems throw in every mode. */
export function loadSiteData(): SiteData {
  if (cached) return cached;

  const mode = getBuildMode();
  const timeline = parseTimeline(readFileSync(TIMELINE_PATH, 'utf8'));
  const eventsEditorial = eventsEditorialSchema.parse(readYamlFile(EVENTS_EDITORIAL_PATH) ?? {});
  const site = siteEditorialSchema.parse(readYamlFile(SITE_EDITORIAL_PATH));
  const events = assembleEvents(timeline, eventsEditorial, readManifest());
  const music = buildMusicEntries(musicEditorialSchema.parse(readYamlFile(MUSIC_EDITORIAL_PATH)).music_timeline.items);

  const missingItems = auditEditorial(events, site, music);
  if (missingItems.length > 0) {
    if (mode === 'release') throw new MissingEditorialItemsError(missingItems);
    console.warn(`\n[d18] Draft build.\n${formatMissingItems(missingItems)}\n`);
  }

  const eras = timeline.eras.map((era) => {
    const eraEvents = events.filter((event) => event.era === era.id);
    return {
      ...era,
      ...site.eras[era.id],
      events: eraEvents,
      items: mergeIntoEra(eraEvents, music.filter((entry) => entry.era === era.id)),
    };
  });

  const { measurementId } = site.analytics;
  const analytics = {
    enabled: mode === 'release' && measurementId !== '',
    measurementId,
    siteHost: new URL(resolveSiteUrl()).hostname,
  };

  cached = { mode, isDraft: mode === 'draft', eras, events, music, site, missingItems, analytics };
  return cached;
}

function readYamlFile(path: string): unknown {
  try {
    return parseYaml(readFileSync(path, 'utf8'));
  } catch (error) {
    throw new Error(`could not read ${path}: ${(error as Error).message}`);
  }
}
