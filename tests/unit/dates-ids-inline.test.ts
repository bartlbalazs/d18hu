import { describe, expect, it } from 'vitest';
import { deriveDates } from '../../src/lib/timeline/dates.ts';
import { deriveEventId, slugify } from '../../src/lib/timeline/ids.ts';
import { escapeHtml, renderInlineHtml } from '../../src/lib/timeline/inline-html.ts';

describe('deriveDates', () => {
  it.each([
    ['1903. dec. 27.', { sortStart: '1903-12-27' }],
    ['1956. okt. 3.', { sortStart: '1956-10-03' }],
    ['1929. okt.', { sortStart: '1929-10' }],
    ['1889', { sortStart: '1889' }],
    ['1901–1902', { sortStart: '1901', sortEnd: '1902' }],
    ['1944. dec. 24. – 1945. febr. 13.', { sortStart: '1944-12-24', sortEnd: '1945-02-13' }],
  ])('derives %s', (label, expected) => {
    expect(deriveDates(label)).toEqual(expected);
  });

  it.each([
    '1901 körül',
    '1945. jan. 15. vagy 17.',
    '1904. júl. 1. / júl. 10.',
    '1945 után, pontos év nélkül',
    '1901. ápr. 20. – közölt dátum',
    '1925. ősz',
    '1944. jún. vége',
    '1914. júl.–aug.',
    '1944. okt. 15–16.',
  ])('never invents a date for "%s"', (label) => {
    expect(deriveDates(label)).toEqual({});
  });
});

describe('ids', () => {
  it('folds Hungarian accents', () => {
    expect(slugify('Őrült Ügyvéd – 1944. szept.')).toBe('orult-ugyved-1944-szept');
  });

  it('uses the date and the first four words', () => {
    expect(deriveEventId('1903. dec. 27.', 'Maulner Adolf és Társai a VII., Dembinszky')).toBe(
      '1903-dec-27-maulner-adolf-es-tarsai',
    );
  });
});

describe('renderInlineHtml', () => {
  it('escapes text and renders the supported nodes', () => {
    expect(
      renderInlineHtml([
        { type: 'text', value: 'a < b & ' },
        { type: 'strong', children: [{ type: 'text', value: 'c' }] },
        { type: 'emphasis', children: [{ type: 'text', value: 'd' }] },
        { type: 'link', url: 'https://example.org/?q="x"', children: [{ type: 'text', value: 'e' }] },
      ]),
    ).toBe(
      'a &lt; b &amp; <strong>c</strong><em>d</em><a href="https://example.org/?q=&quot;x&quot;" rel="noopener noreferrer">e</a>',
    );
  });

  it('rejects unsupported nodes such as raw HTML', () => {
    expect(() => renderInlineHtml([{ type: 'html', value: '<script>' }])).toThrow(/unsupported/);
  });

  it('escapes quotes', () => {
    expect(escapeHtml(`"'`)).toBe('&quot;&#39;');
  });
});
