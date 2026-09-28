import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { DuplicateEventIdError, parseTimeline, TimelineParseError } from '../../src/lib/timeline/parse.ts';

const fixture = readFileSync('tests/unit/fixtures/minimal.md', 'utf8');

describe('parseTimeline (fixture)', () => {
  const timeline = parseTimeline(fixture);

  it('reads four eras and stops before the non-event section', () => {
    expect(timeline.eras.map((era) => era.id)).toEqual(['1873-1913', '1914-1938', '1939-1945', '1946-1968']);
    expect(timeline.eras[0].title).toBe('Első korszak');
    expect(timeline.events).toHaveLength(5);
    expect(timeline.events.map((event) => event.sourceIndex)).toEqual([1, 2, 3, 4, 5]);
  });

  it('maps lanes to categories and keeps the person sub-label', () => {
    const person = timeline.events[3];
    expect(person.sourceLane).toBe('D18 • személy');
    expect(person.category).toBe('house');
    expect(person.personSubtype).toBe(true);
    expect(timeline.events[4].category).toBe('area');
  });

  it('keeps date labels and descriptions verbatim, including emphasis', () => {
    const person = timeline.events[3];
    expect(person.dateLabel).toBe('1945. jan. 15. vagy 17.');
    expect(person.dateLabelHtml).toBe('1945. jan. 15. <strong>vagy</strong> 17.');
    expect(person.sortStart).toBeUndefined();
    expect(timeline.events[1].descriptionHtml).toBe('A ház <strong>valószínű</strong> tervezője Mellinger.');
  });

  it('turns "—" into empty values and parses sources, certainty and image URL', () => {
    const [first, second] = timeline.events;
    expect(first.confidence).toBeNull();
    expect(first.originalImageUrl).toBeUndefined();
    expect(first.articleIdea).toBeUndefined();
    expect(second.confidence).toBe('probable');
    expect(second.sources).toEqual([
      { label: 'B', url: 'https://example.org/b' },
      { label: 'C', url: 'https://example.org/c' },
    ]);
    expect(second.originalImageUrl).toBe('https://example.org/img_1.jpg');
    expect(second.articleIdea).toBe('Ki építette?');
    expect(timeline.events[2].sources).toEqual([]);
  });

  it('derives ids from content only, so inserting a row does not change other ids', () => {
    const inserted = fixture.replace(
      '| 1914 | Világ |',
      '| 1913 | Világ | Egy új sor. | — | — | — | — |\n| 1914 | Világ |',
    );
    const before = timeline.events.map((event) => event.id);
    const after = parseTimeline(inserted).events.map((event) => event.id);
    expect(after.filter((id) => before.includes(id))).toEqual(before);
    expect(before[0]).toBe('1873-nov-17-pest-buda-es-obuda');
  });
});

describe('parseTimeline errors', () => {
  it('rejects a separator row with too few cells', () => {
    const broken = fixture.replace('|---|---|---|---|---|---|---|', '|---|---|---|---|---|---|');
    expect(() => parseTimeline(broken)).toThrow(/era 1873-1913: no event table found/);
  });

  it('rejects unknown lanes and certainty values with the row number', () => {
    expect(() => parseTimeline(fixture.replace('| Világ |', '| Európa |'))).toThrow(
      /era 1914-1938, row 3: unknown Sáv value "Európa"/,
    );
    expect(() => parseTimeline(fixture.replace('| Igazolt |', '| Biztos |'))).toThrow(TimelineParseError);
  });

  it('rejects non-link text in the sources column and non-https links', () => {
    expect(() => parseTimeline(fixture.replace('[Forrás A](https://example.org/a)', 'belső PDF'))).toThrow(
      /Külső forrás may only contain Markdown links/,
    );
    expect(() => parseTimeline(fixture.replace('https://example.org/a', 'http://example.org/a'))).toThrow(
      /https/,
    );
  });

  it('rejects duplicate derived ids', () => {
    const duplicated = fixture.replace(
      '| 1914 | Világ |',
      '| 1914 | Világ | Kitör az első világháború. | — | — | — | — |\n| 1914 | Világ |',
    );
    expect(() => parseTimeline(duplicated)).toThrow(DuplicateEventIdError);
  });

  it('rejects a missing era', () => {
    const threeEras = fixture.split('## Negyedik korszak')[0] + '## Amit egyelőre **nem** viszünk fel házeseményként\n';
    expect(() => parseTimeline(threeEras)).toThrow(/expected 4 eras, found 3/);
  });
});

describe('parseTimeline (input/timeline.md)', () => {
  const timeline = parseTimeline(readFileSync('input/timeline.md', 'utf8'));
  const count = <K extends 'era' | 'sourceLane' | 'category' | 'confidence'>(key: K) =>
    Object.fromEntries(
      [...new Set(timeline.events.map((event) => String(event[key])))].map((value) => [
        value,
        timeline.events.filter((event) => String(event[key]) === value).length,
      ]),
    );

  it('contains all 108 events with the documented distribution', () => {
    expect(timeline.events).toHaveLength(108);
    expect(count('sourceLane')).toEqual({ Magyarország: 28, Világ: 33, Környék: 14, D18: 21, 'D18 • személy': 12 });
    expect(count('category')).toEqual({ hungary: 28, world: 33, area: 14, house: 33 });
    expect(count('confidence')).toEqual({ null: 61, probable: 29, verified: 17, hypothesis: 1 });
    expect(timeline.events.filter((event) => event.originalImageUrl)).toHaveLength(5);
  });

  it('has unique ids of reasonable length', () => {
    const ids = timeline.events.map((event) => event.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(Math.max(...ids.map((id) => id.length))).toBeLessThanOrEqual(80);
  });
});
