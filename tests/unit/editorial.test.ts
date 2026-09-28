import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  assembleEvents,
  MissingArchiveImageError,
  OrphanedEditorialEntryError,
} from '../../src/lib/editorial/assemble.ts';
import { auditEditorial, isMissingValue } from '../../src/lib/editorial/audit.ts';
import { siteEditorialSchema, type EventsEditorial } from '../../src/lib/editorial/schema.ts';
import type { ArchiveManifest } from '../../src/lib/images/manifest.ts';
import { parseTimeline } from '../../src/lib/timeline/parse.ts';

const timeline = parseTimeline(readFileSync('tests/unit/fixtures/minimal.md', 'utf8'));
const [firstId, imageEventId] = timeline.events.map((event) => event.id);
const manifest: ArchiveManifest = {
  images: [
    {
      originalUrl: 'https://example.org/img_1.jpg',
      file: 'img-12345678.jpg',
      sha256: 'x',
      width: 1600,
      height: 1000,
      contentType: 'image/jpeg',
      fetchedAt: '2026-09-28T00:00:00Z',
    },
  ],
};

const completeImage = {
  alt: 'Utcakép',
  caption: 'Nem bizonyítottan a 18-as ház.',
  credit: 'Fortepan / Klösz György',
  license: 'CC BY-SA 3.0',
  depictsHouse: false,
  kind: 'photo' as const,
};

function completeEditorial(): EventsEditorial {
  return Object.fromEntries(
    timeline.events.map((event) => [
      event.id,
      { title: `Cím ${event.sourceIndex}`, ...(event.id === imageEventId ? { image: completeImage } : {}) },
    ]),
  );
}

const completeSite = siteEditorialSchema.parse({
  building: {
    name: 'Dembinszky utca 18.',
    streetAddress: 'Dembinszky utca 18.',
    postalCode: '1071',
    addressLocality: 'Budapest',
  },
  hero: {
    eyebrow: 'e',
    title: 'Dembinszky',
    titleAccent: 'utca 18.',
    subtitle: 's',
    arcNote: 'a',
    photo: { alt: 'Homlokzat', caption: 'A ház mai homlokzata', credit: 'Fotó: tulajdonos' },
  },
  eras: Object.fromEntries(
    timeline.eras.map((era) => [era.id, { intro: 'Bevezető.', eventsHeading: 'Események' }]),
  ),
  impresszum: {
    operator: 'Üzemeltető',
    author: 'Szerző',
    contactEmail: 'szerzo@d18.hu',
    copyrightNotice: '© 2026',
  },
});

describe('assembleEvents', () => {
  it('joins titles and archive images and picks the display variant', () => {
    const events = assembleEvents(timeline, completeEditorial(), manifest);
    const imageEvent = events.find((event) => event.id === imageEventId)!;
    expect(imageEvent.variant).toBe('image');
    expect(imageEvent.image).toMatchObject({ file: 'img-12345678.jpg', width: 1600, caption: completeImage.caption });
    expect(events[0].title).toBe('Cím 1');
    expect(events[0].variant).toBe('compact');
  });

  it('only renders verified document highlights', () => {
    const editorial = completeEditorial();
    editorial[firstId].highlight = { kind: 'transcription', label: 'Hirdetés', text: 'Szöveg', verified: false };
    expect(assembleEvents(timeline, editorial, manifest)[0].variant).toBe('compact');
    editorial[firstId].highlight!.verified = true;
    expect(assembleEvents(timeline, editorial, manifest)[0].variant).toBe('document');
  });

  it('fails on editorial entries that match no event', () => {
    const editorial = { ...completeEditorial(), 'regi-azonosito': { title: 'Árva' } };
    expect(() => assembleEvents(timeline, editorial, manifest)).toThrow(OrphanedEditorialEntryError);
  });

  it('fails on image data for an event without Kép URL', () => {
    const editorial = completeEditorial();
    editorial[firstId].image = completeImage;
    expect(() => assembleEvents(timeline, editorial, manifest)).toThrow(/has no Kép URL/);
  });

  it('fails when a Kép URL has not been downloaded', () => {
    expect(() => assembleEvents(timeline, completeEditorial(), { images: [] })).toThrow(MissingArchiveImageError);
  });
});

describe('auditEditorial', () => {
  it('passes complete data', () => {
    const events = assembleEvents(timeline, completeEditorial(), manifest);
    expect(auditEditorial(events, completeSite, { siteUrlConfigured: true })).toEqual([]);
  });

  it('lists every missing item', () => {
    const editorial = completeEditorial();
    delete editorial[firstId];
    editorial[imageEventId] = { title: 'Cím', titleNeedsReview: true, image: { ...completeImage, credit: '' } };
    const site = structuredClone(completeSite);
    site.impresszum.contactEmail = 'valaki@example.com';
    site.building.postalCode = '';

    const items = auditEditorial(assembleEvents(timeline, editorial, manifest), site, { siteUrlConfigured: false });
    expect(items.map((item) => `${item.id ?? 'site'}:${item.field}`)).toEqual([
      `${firstId}:title`,
      `${imageEventId}:title`,
      `${imageEventId}:image.credit`,
      'site:impresszum.contactEmail',
      'site:building.postalCode',
      'site:SITE_URL',
    ]);
  });

  it('treats placeholders as missing', () => {
    for (const value of ['', '  ', 'TODO', 'tbd', '…', 'info@example.org', 'Név TODO']) {
      expect(isMissingValue(value)).toBe(true);
    }
    expect(isMissingValue('Kovács Anna')).toBe(false);
  });
});
