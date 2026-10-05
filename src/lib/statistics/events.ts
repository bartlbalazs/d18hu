export type StatisticsEvent = { name: string; params: Record<string, string> };

export type ClickedLink = {
  /** The resolved (absolute) href. */
  href: string;
  dataset: Record<string, string | undefined>;
  /** Whether the link is in the main menu (#fomenu). */
  inMenu: boolean;
  /** Whether the link is inside <main>, where every external link is an archive source. */
  inContent: boolean;
  /** Whether the link is the music player's YouTube link, reported as music_open_youtube instead. */
  inMusicPlayer: boolean;
  /** The enclosing timeline event's or music card's id, if any. */
  eventId?: string;
  pagePath: string;
  siteOrigin: string;
};

const ERA_FRAGMENT = /^#korszak-(.+)$/;

/** The one reading event a click stands for, or null: only these 3 link events are ever sent. */
export function statisticsEventFor(link: ClickedLink): StatisticsEvent | null {
  if (link.inMusicPlayer) return null;
  const url = new URL(link.href);
  if (link.inContent && url.protocol === 'https:' && url.origin !== link.siteOrigin) {
    return {
      name: 'archive_source_click',
      params: { source_url: link.href, timeline_event: link.eventId ?? link.pagePath },
    };
  }
  if (link.dataset.statImage) {
    return { name: 'image_zoom', params: { image_name: link.dataset.statImage } };
  }
  if (link.inMenu) {
    const era = ERA_FRAGMENT.exec(url.hash)?.[1];
    if (era) return { name: 'era_select', params: { era } };
  }
  return null;
}

export const MUSIC_EVENT_NAMES = [
  'music_play',
  'music_pause',
  'music_change',
  'music_close',
  'music_jump_to_timeline',
  'music_open_youtube',
] as const;

const MUSIC_PARAMS = ['year', 'title', 'artist', 'youtube_id'] as const;

/** A music player event as sent to statistics, or null for anything but the six known events. */
export function musicStatisticsEvent(detail: unknown): StatisticsEvent | null {
  if (!detail || typeof detail !== 'object') return null;
  const { name, params } = detail as { name?: unknown; params?: unknown };
  if (!MUSIC_EVENT_NAMES.includes(name as (typeof MUSIC_EVENT_NAMES)[number])) return null;
  if (!params || typeof params !== 'object') return null;
  const values = params as Record<string, unknown>;
  if (!MUSIC_PARAMS.every((key) => typeof values[key] === 'string')) return null;
  return {
    name: name as string,
    params: Object.fromEntries(MUSIC_PARAMS.map((key) => [key, values[key] as string])),
  };
}
