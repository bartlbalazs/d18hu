import type { MusicEntry } from '../timeline/music.ts';
import type { TimelineEvent } from './assemble.ts';
import type { SiteEditorial } from './schema.ts';

export type MissingItem = { scope: 'event' | 'music' | 'site'; id?: string; field: string; message: string };

const PLACEHOLDER = /^(todo|tbd|tba|xxx|\.\.\.|…|-|—)$/i;
const EXAMPLE_DOMAIN = /\bexample\.(com|org|net)\b/i;
const GENERIC_ALT = new Set(['kép', 'fotó', 'image', 'music image', 'portré']);

export function isMissingValue(value: string | null | undefined): boolean {
  const text = value?.trim() ?? '';
  return text === '' || PLACEHOLDER.test(text) || EXAMPLE_DOMAIN.test(text) || /\bTODO\b/.test(text);
}

/** Lists editorial data that must exist before a release build; empty result = releasable. */
export function auditEditorial(
  events: TimelineEvent[],
  site: SiteEditorial,
  music: MusicEntry[] = [],
): MissingItem[] {
  const missing: MissingItem[] = [];
  const add = (item: MissingItem) => missing.push(item);

  for (const event of events) {
    if (isMissingValue(event.title)) {
      add({ scope: 'event', id: event.id, field: 'title', message: 'no editorial title' });
    } else if (event.titleNeedsReview) {
      add({ scope: 'event', id: event.id, field: 'title', message: 'AI-drafted title not yet reviewed' });
    }
    if (event.image) {
      for (const field of ['alt', 'caption', 'credit', 'license'] as const) {
        if (isMissingValue(event.image[field])) {
          add({ scope: 'event', id: event.id, field: `image.${field}`, message: `image ${field} missing` });
        }
      }
    }
  }

  for (const entry of music) {
    if (isMissingValue(entry.description)) {
      add({ scope: 'music', id: entry.anchor, field: 'description', message: 'no note' });
    } else if (entry.descriptionNeedsReview) {
      add({ scope: 'music', id: entry.anchor, field: 'description', message: 'AI-drafted note not yet reviewed' });
    }
    if (isMissingValue(entry.youtubeUrl)) {
      add({ scope: 'music', id: entry.anchor, field: 'youtube_url', message: 'no recording' });
    }
    const media = entry.media;
    if (media) {
      if (!media.decorative && isMissingValue(media.alt)) {
        add({ scope: 'music', id: entry.anchor, field: 'media.alt', message: 'image alt missing' });
      } else if (!media.decorative && GENERIC_ALT.has(media.alt.trim().toLowerCase())) {
        add({ scope: 'music', id: entry.anchor, field: 'media.alt', message: 'image alt is generic' });
      }
      for (const field of ['credit', 'license'] as const) {
        if (isMissingValue(media[field])) {
          add({ scope: 'music', id: entry.anchor, field: `media.${field}`, message: `image ${field} missing` });
        }
      }
    }
  }

  for (const field of ['alt', 'caption', 'credit'] as const) {
    if (isMissingValue(site.hero.photo[field])) {
      add({ scope: 'site', field: `hero.photo.${field}`, message: `facade photo ${field} missing` });
    }
  }
  for (const [eraId, era] of Object.entries(site.eras)) {
    for (const field of ['intro', 'eventsHeading'] as const) {
      if (isMissingValue(era[field])) {
        add({ scope: 'site', field: `eras.${eraId}.${field}`, message: `era ${field} missing` });
      }
    }
  }
  for (const [field, value] of Object.entries(site.impresszum)) {
    if (isMissingValue(value)) {
      add({ scope: 'site', field: `impresszum.${field}`, message: 'empty' });
    }
  }
  if (isMissingValue(site.building.postalCode)) {
    add({ scope: 'site', field: 'building.postalCode', message: 'postal code missing' });
  }
  return missing;
}

export function formatMissingItems(items: MissingItem[]): string {
  const lines = items.map((item) => {
    const subject = item.scope === 'site' ? 'site' : `${item.scope} ${item.id}`;
    return `  ${subject.padEnd(60)} ${item.field.padEnd(26)} ${item.message}`;
  });
  return `Missing editorial items (${items.length}):\n${lines.join('\n')}`;
}

export class MissingEditorialItemsError extends Error {
  constructor(items: MissingItem[]) {
    super(`release build blocked.\n${formatMissingItems(items)}`);
    this.name = 'MissingEditorialItemsError';
  }
}
