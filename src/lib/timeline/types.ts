export const ERA_IDS = ['1873-1913', '1914-1938', '1939-1945', '1946-1968'] as const;
export type EraId = (typeof ERA_IDS)[number];

export const SOURCE_LANES = ['D18', 'D18 • személy', 'Környék', 'Magyarország', 'Világ'] as const;
export type SourceLane = (typeof SOURCE_LANES)[number];

export type Category = 'house' | 'area' | 'hungary' | 'world';
export type Confidence = 'verified' | 'probable' | 'hypothesis' | null;

export type SourceLink = { label: string; url: string };

export type ParsedEra = {
  id: EraId;
  number: number;
  title: string;
};

/** One row of the research timeline, before editorial data is joined in. */
export type ParsedEvent = {
  id: string;
  era: EraId;
  sourceIndex: number;
  dateLabel: string;
  dateLabelHtml: string;
  sortStart?: string;
  sortEnd?: string;
  sourceLane: SourceLane;
  category: Category;
  personSubtype: boolean;
  descriptionHtml: string;
  descriptionText: string;
  confidence: Confidence;
  sources: SourceLink[];
  originalImageUrl?: string;
  articleIdea?: string;
  raw: string[];
};

export type ParsedTimeline = {
  eras: ParsedEra[];
  events: ParsedEvent[];
};
