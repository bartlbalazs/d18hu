import { describe, expect, it } from 'vitest';
import {
  musicEditorialItemSchema,
  musicEditorialSchema,
  musicMediaSchema,
  type MusicEditorialItem,
} from '../../src/lib/editorial/schema.ts';
import { readFileSync } from 'node:fs';
import { parse as parseYaml } from 'yaml';
import {
  buildMusicEntries,
  RECORDING_RELATIONS,
  recordingLines,
  eraForYear,
  mergeIntoEra,
  musicAnchor,
  youtubeIdFrom,
  type MusicEntry,
} from '../../src/lib/timeline/music.ts';

const ID = 'dQw4w9WgXcQ';

const required = {
  year: 1935,
  title: 'Szomorú vasárnap',
  credit: 'Kalmár Pál · Seress Rezső',
  recording_artist: 'Kalmár Pál',
  recording_relation: 'period_recording',
};

function item(overrides: Partial<MusicEditorialItem> = {}): MusicEditorialItem {
  return musicEditorialItemSchema.parse({ ...required, ...overrides });
}

describe('youtubeIdFrom', () => {
  it.each([
    `https://www.youtube.com/watch?v=${ID}`,
    `https://youtube.com/watch?v=${ID}&t=42s`,
    `https://m.youtube.com/watch?v=${ID}`,
    `https://music.youtube.com/watch?v=${ID}`,
    `https://youtu.be/${ID}`,
    `https://youtu.be/${ID}?si=abc`,
    `https://www.youtube.com/embed/${ID}`,
    `https://www.youtube-nocookie.com/embed/${ID}`,
    `https://www.youtube.com/shorts/${ID}`,
    `https://www.youtube.com/live/${ID}`,
  ])('reads the id from %s', (url) => {
    expect(youtubeIdFrom(url)).toBe(ID);
  });

  it.each([
    `https://vimeo.com/${ID}`,
    `https://www.youtube.com/watch?v=short`,
    `https://www.youtube.com/channel/UC1234567890`,
    `https://www.youtube.com/playlist?list=PL123`,
    `http://www.youtube.com/watch?v=${ID}`,
    'nem url',
  ])('rejects %s', (url) => {
    expect(youtubeIdFrom(url)).toBeUndefined();
  });
});

describe('musicAnchor', () => {
  it('builds zene-<year>-<slug> without accents', () => {
    expect(musicAnchor(1935, 'Szomorú vasárnap')).toBe('zene-1935-szomoru-vasarnap');
    expect(musicAnchor(1901, 'Őszi rózsa, fehér őszi rózsa')).toBe('zene-1901-oszi-rozsa-feher-oszi-rozsa');
  });
});

describe('eraForYear', () => {
  it.each([
    [1901, '1873-1913'],
    [1913, '1873-1913'],
    [1916, '1914-1938'],
    [1942, '1939-1945'],
    [1968, '1946-1968'],
  ])('puts %i in %s', (year, era) => {
    expect(eraForYear(year)).toBe(era);
  });

  it.each([1872, 1969])('throws for %i', (year) => {
    expect(() => eraForYear(year)).toThrow(/outside every era/);
  });
});

describe('musicEditorialSchema', () => {
  const file = (overrides: Record<string, unknown> = {}) => ({
    music_timeline: { schema_version: 1, label: 'Mit hallgatott Budapest?', cta_label: 'Meghallgatom', items: [], ...overrides },
  });

  it('reads the items of the music_timeline file', () => {
    expect(musicEditorialSchema.parse(file({ items: [required] })).music_timeline.items).toHaveLength(1);
  });

  it.each([
    ['schema_version', 2],
    ['label', 'Zene'],
    ['cta_label', 'Meghallgatom YouTube-on'],
  ])('rejects a different %s', (key, value) => {
    expect(() => musicEditorialSchema.parse(file({ [key]: value }))).toThrow();
  });

  it.each(['image_url', 'image_alt', 'thumbnail', 'cover'])('rejects the image field %s outside media', (field) => {
    expect(() => musicEditorialItemSchema.parse({ ...required, [field]: 'x' })).toThrow();
  });

  it('rejects a type other than music and a recording relation that is not snake_case', () => {
    expect(() => musicEditorialItemSchema.parse({ ...required, type: 'event' })).toThrow();
    expect(() => musicEditorialItemSchema.parse({ ...required, recording_relation: 'Later recording' })).toThrow();
  });

  it('accepts the optional recording details', () => {
    const details = {
      recording_relation: 'author_period_recording',
      recording_year: 1914,
      recording_release_year: 1993,
      recording_label: 'Columbia',
      recording_catalog_number: 'E 972',
      recording_source: 'János vitéz (1938), hangosfilm',
    };
    expect(musicEditorialItemSchema.parse({ ...required, ...details })).toMatchObject(details);
  });
});

describe('musicMediaSchema', () => {
  const media = {
    src: 'frater-lorand.jpg',
    alt: 'Fráter Lóránd portréja',
    caption: 'Fráter Lóránd az 1910-es években',
    credit: 'Fortepan / Ismeretlen',
    license: 'CC BY-SA 3.0',
    source_title: 'Fortepan 12345',
    source_url: 'https://fortepan.hu/hu/photos/?id=12345',
    position: '50% 30%',
  };

  it('accepts a full media block', () => {
    expect(musicMediaSchema.parse(media)).toMatchObject(media);
  });

  it.each([
    { src: 'music/a.jpg' },
    { src: 'A.jpg' },
    { src: 'a.gif' },
    { position: '50%' },
    { position: 'center' },
    { source_url: 'http://x.hu' },
    { thumbnail: 'x' },
  ])('rejects %o', (overrides) => {
    expect(() => musicMediaSchema.parse({ ...media, ...overrides })).toThrow();
  });
});

describe('recordingLines', () => {
  const items = musicEditorialSchema.parse(parseYaml(readFileSync('editorial/music.yaml', 'utf8'))).music_timeline.items;
  const byYear = (year: number) => items.find((entry) => entry.year === year)!;

  it.each([
    [1901, 'Felvétel: Fráter Lóránd, 1914', 'Columbia E 972 · gramofonfelvétel a szerző előadásában'],
    [1904, 'Felvétel: Palló Imre, Kiss Ferenc, 1938', 'archív filmfelvétel'],
    [1916, 'Felvétel: Honthy Hanna, Feleki Kamill és Homm Pál', 'későbbi felvétel'],
    [1926, 'Felvétel: Udvardy Tibor és Petress Zsuzsa', 'későbbi felvétel'],
    [1935, 'Felvétel: Kalmár Pál, 1935', 'korabeli felvétel újrakiadása'],
    [1942, 'Felvétel: Karády Katalin, 1942', 'korabeli felvétel'],
    [1959, 'Felvétel: Kovács Eszti', 'Hungaroton-újrakiadás, 1993'],
    [1968, 'Felvétel: Illés, 1968', 'korabeli felvétel'],
  ])('builds the %i line from editorial/music.yaml', (year, primary, secondary) => {
    expect(recordingLines(byYear(year))).toEqual({ primary, secondary });
  });

  it('prefers recording_year to the song year', () => {
    expect(recordingLines(item({ recording_year: 1937 })).primary).toBe('Felvétel: Kalmár Pál, 1937');
  });

  it('shows no year for a later recording without recording_year', () => {
    expect(recordingLines(item({ recording_relation: 'later_recording' })).primary).toBe('Felvétel: Kalmár Pál');
  });

  it('shows a label without a catalogue number on its own', () => {
    expect(recordingLines(item({ recording_label: 'Odeon' })).secondary).toBe('Odeon · korabeli felvétel');
  });

  it('has a phrase for every relation in editorial/music.yaml', () => {
    for (const entry of items) expect(RECORDING_RELATIONS[entry.recording_relation], entry.title).toBeDefined();
  });
});

describe('buildMusicEntries', () => {
  it('throws on a recording relation without a Hungarian phrase', () => {
    expect(() => buildMusicEntries([item({ recording_relation: 'unknown_relation' })])).toThrow(
      /zene-1935-szomoru-vasarnap: recording_relation "unknown_relation" has no Hungarian phrase/,
    );
  });

  it('sets the recording line only for songs with a recording', () => {
    expect(buildMusicEntries([item()])[0].recording).toBeUndefined();
    expect(buildMusicEntries([item({ youtube_url: `https://youtu.be/${ID}` })])[0].recording).toEqual({
      primary: 'Felvétel: Kalmár Pál, 1935',
      secondary: 'korabeli felvétel',
    });
  });

  it('maps media with its defaults', () => {
    const [entry] = buildMusicEntries([item({ media: musicMediaSchema.parse({ src: 'a.jpg', alt: ' Kalmár Pál ' }) })]);
    expect(entry.media).toEqual({
      file: 'a.jpg',
      alt: 'Kalmár Pál',
      decorative: false,
      caption: '',
      credit: '',
      license: '',
      licenseUrl: undefined,
      modifications: undefined,
      sourceTitle: undefined,
      sourceUrl: undefined,
      position: '50% 50%',
    });
    expect(buildMusicEntries([item()])[0].media).toBeUndefined();
  });

  it('derives the anchor, era and id', () => {
    const [entry] = buildMusicEntries([item({ youtube_url: `https://youtu.be/${ID}`, youtube_id: ID })]);
    expect(entry).toMatchObject({ anchor: 'zene-1935-szomoru-vasarnap', era: '1914-1938', youtubeId: ID });
  });

  it('allows a missing recording in drafts', () => {
    expect(buildMusicEntries([item()])[0].youtubeId).toBe('');
  });

  it('throws on a non-YouTube URL', () => {
    expect(() => buildMusicEntries([item({ youtube_url: 'https://example.com/song' })])).toThrow(/not a YouTube/);
  });

  it('throws when youtube_id does not match the URL', () => {
    expect(() =>
      buildMusicEntries([item({ youtube_url: `https://youtu.be/${ID}`, youtube_id: 'aaaaaaaaaaa' })]),
    ).toThrow(/does not match/);
  });

  it('accepts matching slug, anchor_id and embed URL', () => {
    const [entry] = buildMusicEntries([
      item({
        slug: '1935-szomoru-vasarnap',
        anchor_id: 'zene-1935-szomoru-vasarnap',
        youtube_url: `https://www.youtube.com/watch?v=${ID}`,
        youtube_embed_url: `https://www.youtube-nocookie.com/embed/${ID}`,
      }),
    ]);
    expect(entry).toMatchObject({ credit: 'Kalmár Pál · Seress Rezső', recordingArtist: 'Kalmár Pál' });
  });

  it.each([
    [{ slug: '1935-gloomy-sunday' }, /slug/],
    [{ anchor_id: 'zene-1936-szomoru-vasarnap' }, /anchor_id/],
    [{ youtube_url: `https://youtu.be/${ID}`, youtube_embed_url: 'https://www.youtube.com/embed/x' }, /youtube_embed_url/],
  ])('throws when %o disagrees with year, title or URL', (overrides, message) => {
    expect(() => buildMusicEntries([item(overrides as Partial<MusicEditorialItem>)])).toThrow(message);
  });

  it('throws on a duplicate anchor', () => {
    expect(() => buildMusicEntries([item(), item()])).toThrow(/two songs have this anchor/);
  });

  it('throws on a duplicate video', () => {
    const url = `https://youtu.be/${ID}`;
    expect(() => buildMusicEntries([item({ youtube_url: url }), item({ title: 'Más', youtube_url: url })])).toThrow(
      /used by another song/,
    );
  });
});

describe('mergeIntoEra', () => {
  const events = [
    { id: 'a', dateLabel: '1914', sortStart: '1914' },
    { id: 'b', dateLabel: '1926. máj. 3.', sortStart: '1926-05-03' },
    { id: 'c', dateLabel: '1930 körül' },
    { id: 'd', dateLabel: '1937', sortStart: '1937' },
  ];
  const song = (year: number, title = `dal ${year}`) => ({ ...buildMusicEntries([item({ year, title })])[0] });
  const order = (items: ({ id: string } | MusicEntry)[]) =>
    items.map((entry) => ('kind' in entry ? entry.anchor : entry.id));

  it('puts a song before every later event', () => {
    expect(order(mergeIntoEra(events, [song(1914, 'x')]))).toEqual(['a', 'zene-1914-x', 'b', 'c', 'd']);
  });

  it('puts a song with no earlier event first', () => {
    expect(order(mergeIntoEra(events.slice(1), [song(1916, 'x')]))).toEqual(['zene-1916-x', 'b', 'c', 'd']);
  });

  it('uses the year in the label when there is no sort date, and goes after same-year events', () => {
    expect(order(mergeIntoEra(events, [song(1935, 'x')]))).toEqual(['a', 'b', 'c', 'zene-1935-x', 'd']);
    expect(order(mergeIntoEra(events, [song(1926, 'x')]))).toEqual(['a', 'b', 'zene-1926-x', 'c', 'd']);
  });

  it('puts a song after the last event', () => {
    expect(order(mergeIntoEra(events, [song(1938, 'x')]))).toEqual(['a', 'b', 'c', 'd', 'zene-1938-x']);
  });

  it('keeps file order for songs of the same year', () => {
    expect(order(mergeIntoEra(events, [song(1935, 'x'), song(1935, 'y')]))).toEqual([
      'a',
      'b',
      'c',
      'zene-1935-x',
      'zene-1935-y',
      'd',
    ]);
  });
});
