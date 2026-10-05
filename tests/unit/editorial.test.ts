import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  assembleEvents,
  MissingArchiveImageError,
  OrphanedEditorialEntryError,
} from '../../src/lib/editorial/assemble.ts';
import { auditEditorial, isMissingValue } from '../../src/lib/editorial/audit.ts';
import { musicEditorialItemSchema, siteEditorialSchema, type EventsEditorial } from '../../src/lib/editorial/schema.ts';
import { buildMusicEntries } from '../../src/lib/timeline/music.ts';
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
    hostingProvider: 'Tárhely Kft.',
    hostingAddress: 'Budapest',
    hostingContactUrl: 'https://tarhely.hu/kapcsolat',
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
    expect(auditEditorial(events, completeSite)).toEqual([]);
  });

  it('lists every missing item', () => {
    const editorial = completeEditorial();
    delete editorial[firstId];
    editorial[imageEventId] = { title: 'Cím', titleNeedsReview: true, image: { ...completeImage, credit: '' } };
    const site = structuredClone(completeSite);
    site.impresszum.contactEmail = 'valaki@example.com';
    site.building.postalCode = '';

    const items = auditEditorial(assembleEvents(timeline, editorial, manifest), site);
    expect(items.map((item) => `${item.id ?? 'site'}:${item.field}`)).toEqual([
      `${firstId}:title`,
      `${imageEventId}:title`,
      `${imageEventId}:image.credit`,
      'site:impresszum.contactEmail',
      'site:building.postalCode',
    ]);
  });

  it('lists music without a reviewed note or a recording', () => {
    const events = assembleEvents(timeline, completeEditorial(), manifest);
    const song = { credit: 'A', recording_artist: 'A', recording_relation: 'period_recording' };
    const music = buildMusicEntries(
      [
        { ...song, year: 1901, title: 'Kész', description: 'Jegyzet.', youtube_url: 'https://youtu.be/dQw4w9WgXcQ' },
        { ...song, year: 1904, title: 'Üres' },
        { ...song, year: 1916, title: 'Vázlat', description: 'Jegyzet.', descriptionNeedsReview: true },
      ].map((entry) => musicEditorialItemSchema.parse(entry)),
    );
    const items = auditEditorial(events, completeSite, music);
    expect(items.map((item) => `${item.scope} ${item.id}:${item.field} ${item.message}`)).toEqual([
      'music zene-1904-ures:description no note',
      'music zene-1904-ures:youtube_url no recording',
      'music zene-1916-vazlat:description AI-drafted note not yet reviewed',
      'music zene-1916-vazlat:youtube_url no recording',
    ]);
  });

  it('lists music images without alt text, credit or licence', () => {
    const events = assembleEvents(timeline, completeEditorial(), manifest);
    const song = {
      credit: 'A',
      recording_artist: 'A',
      recording_relation: 'period_recording',
      description: 'Jegyzet.',
      youtube_url: '',
    };
    const complete = { src: 'a.jpg', alt: 'Fráter Lóránd portréja', credit: 'Fortepan', license: 'CC BY-SA 3.0' };
    const music = buildMusicEntries(
      [
        { ...song, year: 1901, title: 'Kész', youtube_url: 'https://youtu.be/dQw4w9WgXcQ', media: complete },
        { ...song, year: 1904, title: 'Hiányos', youtube_url: 'https://youtu.be/aaaaaaaaaaa', media: { src: 'b.jpg' } },
        { ...song, year: 1916, title: 'Általános', youtube_url: 'https://youtu.be/bbbbbbbbbbb', media: { ...complete, alt: 'Kép' } },
        {
          ...song,
          year: 1926,
          title: 'Díszítés',
          youtube_url: 'https://youtu.be/ccccccccccc',
          media: { ...complete, alt: '', decorative: true },
        },
      ].map((entry) => musicEditorialItemSchema.parse(entry)),
    );
    const items = auditEditorial(events, completeSite, music);
    expect(items.map((item) => `${item.id}:${item.field} ${item.message}`)).toEqual([
      'zene-1904-hianyos:media.alt image alt missing',
      'zene-1904-hianyos:media.credit image credit missing',
      'zene-1904-hianyos:media.license image license missing',
      'zene-1916-altalanos:media.alt image alt is generic',
    ]);
  });

  it('treats placeholders as missing', () => {
    for (const value of ['', '  ', 'TODO', 'tbd', '…', 'info@example.org', 'Név TODO']) {
      expect(isMissingValue(value)).toBe(true);
    }
    expect(isMissingValue('Kovács Anna')).toBe(false);
  });
});
