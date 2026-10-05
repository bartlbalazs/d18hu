import { z } from 'astro/zod';
import { ERA_IDS } from '../timeline/types.ts';

const httpsUrl = z.string().regex(/^https:\/\/\S+$/, 'must be an https:// URL');

export const eventImageEditorialSchema = z.strictObject({
  alt: z.string().default(''),
  caption: z.string().default(''),
  credit: z.string().default(''),
  license: z.string().default(''),
  sourceUrl: httpsUrl.optional(),
  sourceLabel: z.string().optional(),
  depictsHouse: z.boolean().default(false),
  kind: z.enum(['photo', 'document']).default('photo'),
});

export const documentHighlightSchema = z.strictObject({
  kind: z.enum(['transcription', 'excerpt']),
  label: z.string(),
  text: z.string(),
  verified: z.boolean(),
});

export const eventEditorialSchema = z.strictObject({
  title: z.string().optional(),
  /** Set on AI-drafted titles; the owner removes it after reviewing the title. */
  titleNeedsReview: z.boolean().optional(),
  image: eventImageEditorialSchema.optional(),
  highlight: documentHighlightSchema.optional(),
});

export const eventsEditorialSchema = z.record(z.string(), eventEditorialSchema);

const eraEditorialSchema = z.strictObject({
  intro: z.string().default(''),
  eventsHeading: z.string().default(''),
  /** Large decorative year shown faintly behind the era opener. */
  backgroundYear: z.string().regex(/^\d{4}$/).optional(),
});

const musicSourceSchema = z.strictObject({
  title: z.string(),
  url: httpsUrl,
  /** What the source proves; kept for editors, not shown on the page. */
  purpose: z.string().optional(),
});

/** One archive image for a song: a file in src/assets/music/, toned down by the shared card treatment. */
export const musicMediaSchema = z.strictObject({
  src: z.string().regex(/^[a-z0-9][a-z0-9._-]*\.(jpe?g|png|webp)$/, 'must be a file name in src/assets/music/'),
  alt: z.string().default(''),
  /** An image that adds nothing to the text gets alt="" and skips the alt checks. */
  decorative: z.boolean().default(false),
  caption: z.string().default(''),
  credit: z.string().default(''),
  license: z.string().default(''),
  license_url: httpsUrl.optional(),
  /** How the file differs from the source, e.g. downscaling; licences such as CC BY-SA ask for it. */
  modifications: z.string().optional(),
  source_title: z.string().optional(),
  source_url: httpsUrl.optional(),
  /** The crop's focus point, as CSS object-position, e.g. "50% 35%". */
  position: z.string().regex(/^\d{1,3}% \d{1,3}%$/, 'must look like "50% 35%"').optional(),
});

/**
 * One song of the „Mit hallgatott Budapest?” layer. Strict, so any image field other than media is rejected.
 * slug, anchor_id, youtube_id and youtube_embed_url are optional and checked against the values
 * derived from year, title and youtube_url.
 */
export const musicEditorialItemSchema = z.strictObject({
  type: z.literal('music').default('music'),
  year: z.number().int().min(1873).max(1968),
  slug: z.string().optional(),
  anchor_id: z.string().optional(),
  title: z.string().trim().min(1),
  /** The line under the title: performer, or composer and work. */
  credit: z.string().trim().min(1),
  composer: z.string().optional(),
  lyricist: z.string().optional(),
  work: z.string().optional(),
  description: z.string().default(''),
  /** Set on AI-drafted notes; the owner removes it after checking the note. */
  descriptionNeedsReview: z.boolean().optional(),
  playback_source: z.literal('youtube').default('youtube'),
  youtube_url: z.union([z.literal(''), httpsUrl]).default(''),
  youtube_id: z.string().optional(),
  youtube_embed_url: httpsUrl.optional(),
  /** Who is heard in the linked recording, which may be later than the song's year. */
  recording_artist: z.string().trim().min(1),
  /** How the recording relates to the song's year, e.g. period_recording, later_recording, hungaroton_reissue. */
  recording_relation: z.string().regex(/^[a-z]+(_[a-z]+)*$/, 'must be a snake_case word, e.g. later_recording'),
  recording_note: z.string().default(''),
  // Recording details; the card's short recording line is built from them.
  recording_year: z.number().int().optional(),
  recording_release_year: z.number().int().optional(),
  recording_label: z.string().optional(),
  recording_catalog_number: z.string().optional(),
  recording_source: z.string().optional(),
  sources: z.array(musicSourceSchema).default([]),
  media: musicMediaSchema.optional(),
});

/** editorial/music.yaml. The label and button text are fixed by the spec, so the file can only confirm them. */
export const musicEditorialSchema = z.strictObject({
  music_timeline: z.strictObject({
    schema_version: z.literal(1),
    label: z.literal('Mit hallgatott Budapest?'),
    cta_label: z.literal('Meghallgatom'),
    items: z.array(musicEditorialItemSchema),
  }),
});

export const siteEditorialSchema = z.strictObject({
  building: z.strictObject({
    name: z.string(),
    streetAddress: z.string(),
    postalCode: z.string().default(''),
    addressLocality: z.string(),
    addressRegion: z.string().default(''),
    addressCountry: z.string().default('HU'),
    geo: z
      .strictObject({ latitude: z.number().nullable(), longitude: z.number().nullable() })
      .default({ latitude: null, longitude: null }),
  }),
  hero: z.strictObject({
    eyebrow: z.string(),
    title: z.string(),
    titleAccent: z.string(),
    subtitle: z.string(),
    arcNote: z.string(),
    photo: z.strictObject({
      alt: z.string().default(''),
      caption: z.string().default(''),
      credit: z.string().default(''),
      source: z.strictObject({ label: z.string(), url: httpsUrl }).optional(),
    }),
  }),
  eras: z.strictObject(
    Object.fromEntries(ERA_IDS.map((id) => [id, eraEditorialSchema])) as Record<
      (typeof ERA_IDS)[number],
      typeof eraEditorialSchema
    >,
  ),
  impresszum: z.strictObject({
    operator: z.string().default(''),
    author: z.string().default(''),
    contactEmail: z.string().default(''),
    hostingProvider: z.string().default(''),
    hostingAddress: z.string().default(''),
    hostingContactUrl: z.string().default(''),
    copyrightNotice: z.string().default(''),
  }),
  // Optional: an empty ID builds the site without analytics. Not part of the editorial audit.
  analytics: z
    .strictObject({
      measurementId: z
        .string()
        .regex(/^(G-[A-Z0-9]+)?$/, 'must be a Google Analytics measurement ID (G-…) or empty')
        .default(''),
    })
    .default({ measurementId: '' }),
});

export type EventImageEditorial = z.infer<typeof eventImageEditorialSchema>;
export type DocumentHighlight = z.infer<typeof documentHighlightSchema>;
export type EventEditorial = z.infer<typeof eventEditorialSchema>;
export type EventsEditorial = z.infer<typeof eventsEditorialSchema>;
export type SiteEditorial = z.infer<typeof siteEditorialSchema>;
export type MusicEditorialItem = z.infer<typeof musicEditorialItemSchema>;
export type MusicEditorial = z.infer<typeof musicEditorialSchema>;
