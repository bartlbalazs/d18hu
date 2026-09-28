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

export const articleSchema = z.strictObject({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  summary: z.string(),
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
    copyrightNotice: z.string().default(''),
  }),
  articles: z.array(articleSchema).default([]),
});

export type EventImageEditorial = z.infer<typeof eventImageEditorialSchema>;
export type DocumentHighlight = z.infer<typeof documentHighlightSchema>;
export type EventEditorial = z.infer<typeof eventEditorialSchema>;
export type EventsEditorial = z.infer<typeof eventsEditorialSchema>;
export type SiteEditorial = z.infer<typeof siteEditorialSchema>;
export type Article = z.infer<typeof articleSchema>;
