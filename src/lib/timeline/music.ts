import type { MusicEditorialItem } from '../editorial/schema.ts';
import { slugify } from './ids.ts';
import { ERA_IDS, type EraId, type SourceLink } from './types.ts';

export type MusicMedia = {
  file: string;
  alt: string;
  decorative: boolean;
  caption: string;
  credit: string;
  license: string;
  licenseUrl?: string;
  modifications?: string;
  sourceTitle?: string;
  sourceUrl?: string;
  /** CSS object-position of the crop. */
  position: string;
};

export type RecordingLines = { primary: string; secondary?: string };

/** One song of the „Mit hallgatott Budapest?” layer, placed in the era that contains its year. */
export type MusicEntry = {
  kind: 'music';
  anchor: string;
  era: EraId;
  year: number;
  title: string;
  credit: string;
  composer?: string;
  lyricist?: string;
  work?: string;
  description: string;
  descriptionNeedsReview: boolean;
  sources: SourceLink[];
  /** Empty in draft builds until a recording is chosen. */
  youtubeUrl: string;
  youtubeId: string;
  recordingArtist: string;
  recordingRelation: MusicEditorialItem['recording_relation'];
  /** The editor's longer note on the recording; shown in the card's sources panel. */
  recordingNote: string;
  /** The card's short „Felvétel: …” line; only for songs with a recording. */
  recording?: RecordingLines;
  media?: MusicMedia;
};

/**
 * The Hungarian phrase the card shows for each recording_relation. periodYear: the recording is from the song's
 * own time, so the song's year stands in when recording_year is not given.
 */
export const RECORDING_RELATIONS: Record<string, { phrase: string; periodYear: boolean }> = {
  period_recording: { phrase: 'korabeli felvétel', periodYear: true },
  period_recording_reissue: { phrase: 'korabeli felvétel újrakiadása', periodYear: true },
  author_period_recording: { phrase: 'gramofonfelvétel a szerző előadásában', periodYear: true },
  archival_film_recording: { phrase: 'archív filmfelvétel', periodYear: false },
  later_recording: { phrase: 'későbbi felvétel', periodYear: false },
  hungaroton_reissue: { phrase: 'Hungaroton-újrakiadás', periodYear: false },
};

/** „Felvétel: <artist>, <year>” and a second line of label, catalogue number and recording type. */
export function recordingLines(item: MusicEditorialItem): RecordingLines {
  const relation = RECORDING_RELATIONS[item.recording_relation];
  const year = item.recording_year ?? (relation?.periodYear ? item.year : undefined);
  const primary = `Felvétel: ${item.recording_artist.trim()}${year ? `, ${year}` : ''}`;
  const release = [item.recording_label?.trim(), item.recording_catalog_number?.trim()].filter(Boolean).join(' ');
  const kind = relation
    ? `${relation.phrase}${item.recording_release_year ? `, ${item.recording_release_year}` : ''}`
    : '';
  const secondary = [release, kind].filter(Boolean).join(' · ');
  return secondary ? { primary, secondary } : { primary };
}

function mediaOf(media: MusicEditorialItem['media']): MusicMedia | undefined {
  if (!media) return undefined;
  return {
    file: media.src,
    alt: media.alt.trim(),
    decorative: media.decorative,
    caption: media.caption.trim(),
    credit: media.credit.trim(),
    license: media.license.trim(),
    licenseUrl: media.license_url,
    modifications: media.modifications?.trim() || undefined,
    sourceTitle: media.source_title?.trim() || undefined,
    sourceUrl: media.source_url,
    position: media.position ?? '50% 50%',
  };
}

const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;
const WATCH_HOSTS = new Set(['youtube.com', 'www.youtube.com', 'm.youtube.com', 'music.youtube.com']);
const EMBED_HOSTS = new Set([...WATCH_HOSTS, 'youtube-nocookie.com', 'www.youtube-nocookie.com']);
const PATH_ID = /^\/(?:embed|shorts|live)\/([^/?#]+)\/?$/;

/** The video id of a YouTube URL, or undefined when the URL is not a recognised single-video address. */
export function youtubeIdFrom(url: string): string | undefined {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return undefined;
  }
  if (parsed.protocol !== 'https:') return undefined;
  const host = parsed.hostname;
  let id: string | null | undefined;
  if (host === 'youtu.be') {
    id = parsed.pathname.slice(1).replace(/\/$/, '');
  } else if (WATCH_HOSTS.has(host) && parsed.pathname === '/watch') {
    id = parsed.searchParams.get('v');
  } else if (EMBED_HOSTS.has(host)) {
    id = PATH_ID.exec(parsed.pathname)?.[1];
  }
  return id && YOUTUBE_ID.test(id) ? id : undefined;
}

export function musicSlug(year: number, title: string): string {
  return `${year}-${slugify(title)}`;
}

export function musicAnchor(year: number, title: string): string {
  return `zene-${musicSlug(year, title)}`;
}

export function youtubeEmbedUrl(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}`;
}

export function eraForYear(year: number): EraId {
  const era = ERA_IDS.find((id) => {
    const [start, end] = id.split('-').map(Number);
    return year >= start && year <= end;
  });
  if (!era) throw new Error(`editorial/music.yaml: year ${year} is outside every era`);
  return era;
}

export function buildMusicEntries(items: MusicEditorialItem[]): MusicEntry[] {
  const problems: string[] = [];
  const seenAnchors = new Set<string>();
  const seenIds = new Set<string>();

  const entries = items.map((item): MusicEntry => {
    const anchor = musicAnchor(item.year, item.title);
    if (seenAnchors.has(anchor)) problems.push(`${anchor}: two songs have this anchor`);
    seenAnchors.add(anchor);
    if (item.anchor_id && item.anchor_id !== anchor) {
      problems.push(`${anchor}: anchor_id "${item.anchor_id}" does not match year and title`);
    }
    const slug = musicSlug(item.year, item.title);
    if (item.slug && item.slug !== slug) problems.push(`${anchor}: slug "${item.slug}" does not match (${slug})`);
    if (!RECORDING_RELATIONS[item.recording_relation]) {
      problems.push(`${anchor}: recording_relation "${item.recording_relation}" has no Hungarian phrase in RECORDING_RELATIONS`);
    }

    const youtubeUrl = item.youtube_url.trim();
    const youtubeId = youtubeUrl ? youtubeIdFrom(youtubeUrl) : undefined;
    if (youtubeUrl && !youtubeId) problems.push(`${anchor}: youtube_url is not a YouTube video address`);
    if (item.youtube_id && youtubeId && item.youtube_id !== youtubeId) {
      problems.push(`${anchor}: youtube_id "${item.youtube_id}" does not match youtube_url (${youtubeId})`);
    }
    if (youtubeId) {
      if (seenIds.has(youtubeId)) problems.push(`${anchor}: video ${youtubeId} is used by another song`);
      seenIds.add(youtubeId);
      if (item.youtube_embed_url && item.youtube_embed_url !== youtubeEmbedUrl(youtubeId)) {
        problems.push(`${anchor}: youtube_embed_url must be ${youtubeEmbedUrl(youtubeId)}`);
      }
    }

    return {
      kind: 'music',
      anchor,
      era: eraForYear(item.year),
      year: item.year,
      title: item.title.trim(),
      credit: item.credit.trim(),
      composer: item.composer?.trim() || undefined,
      lyricist: item.lyricist?.trim() || undefined,
      work: item.work?.trim() || undefined,
      description: item.description.trim(),
      descriptionNeedsReview: item.descriptionNeedsReview ?? false,
      sources: item.sources.map((source) => ({ label: source.title, url: source.url })),
      youtubeUrl,
      youtubeId: youtubeId ?? '',
      recordingArtist: item.recording_artist.trim(),
      recordingRelation: item.recording_relation,
      recordingNote: item.recording_note.trim(),
      recording: youtubeId ? recordingLines(item) : undefined,
      media: mediaOf(item.media),
    };
  });

  if (problems.length > 0) throw new Error(`editorial/music.yaml:\n  ${problems.join('\n  ')}`);
  return entries;
}

function startYear(event: { sortStart?: string; dateLabel: string }): number | undefined {
  const year = event.sortStart?.slice(0, 4) ?? /\d{4}/.exec(event.dateLabel)?.[0];
  return year ? Number(year) : undefined;
}

/**
 * Puts each song after the era's last event of the same or an earlier year, or first when there is none.
 * Events keep their order; songs of the same year keep their file order.
 */
export function mergeIntoEra<E extends { sortStart?: string; dateLabel: string }>(
  events: E[],
  music: MusicEntry[],
): (E | MusicEntry)[] {
  const afterEvent = new Map<number, MusicEntry[]>();
  for (const entry of music) {
    let position = -1;
    events.forEach((event, index) => {
      const year = startYear(event);
      if (year !== undefined && year <= entry.year) position = index;
    });
    afterEvent.set(position, [...(afterEvent.get(position) ?? []), entry]);
  }
  return [
    ...(afterEvent.get(-1) ?? []),
    ...events.flatMap((event, index) => [event, ...(afterEvent.get(index) ?? [])]),
  ];
}
