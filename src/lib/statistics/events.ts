export type StatisticsEvent = { name: string; params: Record<string, string> };

export type ClickedLink = {
  /** The resolved (absolute) href. */
  href: string;
  dataset: Record<string, string | undefined>;
  /** Whether the link is in the main menu (#fomenu). */
  inMenu: boolean;
  /** Whether the link is inside <main>, where every external link is an archive source. */
  inContent: boolean;
  /** The enclosing timeline event's id, if any. */
  eventId?: string;
  pagePath: string;
  siteOrigin: string;
};

const ERA_FRAGMENT = /^#korszak-(.+)$/;

/** The one reading event a click stands for, or null: only these 3 events are ever sent. */
export function statisticsEventFor(link: ClickedLink): StatisticsEvent | null {
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
