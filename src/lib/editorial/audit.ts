import type { TimelineEvent } from './assemble.ts';
import type { SiteEditorial } from './schema.ts';

export type MissingItem = { scope: 'event' | 'site'; id?: string; field: string; message: string };

const PLACEHOLDER = /^(todo|tbd|tba|xxx|\.\.\.|…|-|—)$/i;
const EXAMPLE_DOMAIN = /\bexample\.(com|org|net)\b/i;

export function isMissingValue(value: string | null | undefined): boolean {
  const text = value?.trim() ?? '';
  return text === '' || PLACEHOLDER.test(text) || EXAMPLE_DOMAIN.test(text) || /\bTODO\b/.test(text);
}

/** Lists editorial data that must exist before a release build; empty result = releasable. */
export function auditEditorial(
  events: TimelineEvent[],
  site: SiteEditorial,
  options: { siteUrlConfigured: boolean },
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
  if (!options.siteUrlConfigured) {
    add({ scope: 'site', field: 'SITE_URL', message: 'final site URL not set (environment variable)' });
  }
  return missing;
}

export function formatMissingItems(items: MissingItem[]): string {
  const lines = items.map((item) => {
    const subject = item.scope === 'event' ? `event ${item.id}` : 'site';
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
