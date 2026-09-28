import type { ArchiveImage, ArchiveManifest } from '../images/manifest.ts';
import type { ParsedEvent, ParsedTimeline } from '../timeline/types.ts';
import type { DocumentHighlight, EventImageEditorial, EventsEditorial } from './schema.ts';

export type TimelineEventImage = ArchiveImage & EventImageEditorial;

export type TimelineEvent = ParsedEvent & {
  title?: string;
  titleNeedsReview: boolean;
  image?: TimelineEventImage;
  highlight?: DocumentHighlight;
  variant: 'compact' | 'image' | 'document';
};

export class OrphanedEditorialEntryError extends Error {
  constructor(problems: string[]) {
    super(
      `editorial/events.yaml has entries that no longer match the timeline ` +
        `(re-key them to the current event ids):\n  ${problems.join('\n  ')}`,
    );
    this.name = 'OrphanedEditorialEntryError';
  }
}

export class MissingArchiveImageError extends Error {
  constructor(missing: { id: string; url: string }[]) {
    super(
      `images are not downloaded yet; run "pnpm images:fetch":\n  ` +
        missing.map((item) => `${item.id}  ${item.url}`).join('\n  '),
    );
    this.name = 'MissingArchiveImageError';
  }
}

/** Joins research rows with owner-maintained editorial data and the downloaded image manifest. */
export function assembleEvents(
  timeline: ParsedTimeline,
  editorial: EventsEditorial,
  manifest: ArchiveManifest,
): TimelineEvent[] {
  const eventsById = new Map(timeline.events.map((event) => [event.id, event]));
  const orphans: string[] = [];
  for (const [id, entry] of Object.entries(editorial)) {
    const event = eventsById.get(id);
    if (!event) orphans.push(`${id}: no timeline event has this id`);
    else if (entry.image && !event.originalImageUrl) {
      orphans.push(`${id}: has image data but the timeline row has no Kép URL`);
    }
  }
  if (orphans.length > 0) throw new OrphanedEditorialEntryError(orphans);

  const imagesByUrl = new Map(manifest.images.map((image) => [image.originalUrl, image]));
  const missingImages: { id: string; url: string }[] = [];

  const events = timeline.events.map((event): TimelineEvent => {
    const entry = editorial[event.id] ?? {};
    let image: TimelineEventImage | undefined;
    if (event.originalImageUrl) {
      const archived = imagesByUrl.get(event.originalImageUrl);
      if (!archived) missingImages.push({ id: event.id, url: event.originalImageUrl });
      else image = { ...archived, ...(entry.image ?? emptyImageEditorial()) };
    }
    const highlight = entry.highlight?.verified ? entry.highlight : undefined;
    return {
      ...event,
      title: entry.title?.trim() || undefined,
      titleNeedsReview: entry.titleNeedsReview ?? false,
      image,
      highlight,
      variant: highlight ? 'document' : image ? 'image' : 'compact',
    };
  });

  if (missingImages.length > 0) throw new MissingArchiveImageError(missingImages);
  return events;
}

function emptyImageEditorial(): EventImageEditorial {
  return { alt: '', caption: '', credit: '', license: '', depictsHouse: false, kind: 'photo' };
}
