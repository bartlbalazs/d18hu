import { describe, expect, it } from 'vitest';
import { resolveConsent } from '../../src/lib/statistics/consent.ts';
import { statisticsEventFor } from '../../src/lib/statistics/events.ts';

describe('resolveConsent', () => {
  it('treats unavailable storage as a refusal', () => {
    expect(resolveConsent(new Error('blocked'), {})).toBe('denied');
  });

  it('treats Global Privacy Control as a refusal', () => {
    expect(resolveConsent(null, { gpc: true })).toBe('denied');
  });

  it('treats Do Not Track as a refusal', () => {
    expect(resolveConsent(null, { dnt: '1' })).toBe('denied');
  });

  it('lets a browser signal override an earlier acceptance', () => {
    expect(resolveConsent('granted', { gpc: true })).toBe('denied');
  });

  it('returns a stored choice', () => {
    expect(resolveConsent('granted', { gpc: false, dnt: '0' })).toBe('granted');
    expect(resolveConsent('denied', {})).toBe('denied');
  });

  it('asks when nothing valid is stored', () => {
    expect(resolveConsent(null, {})).toBe('ask');
    expect(resolveConsent('yes', { dnt: null })).toBe('ask');
  });
});

describe('statisticsEventFor', () => {
  const base = { dataset: {}, inMenu: false, inContent: false, pagePath: '/', siteOrigin: 'https://www.dembinszky18.hu' };

  it('reports an archive source with the timeline event it belongs to', () => {
    const link = { ...base, href: 'https://fortepan.hu/hu/photos/?id=1', inContent: true, eventId: 'e-1908' };
    expect(statisticsEventFor(link)).toEqual({
      name: 'archive_source_click',
      params: { source_url: 'https://fortepan.hu/hu/photos/?id=1', timeline_event: 'e-1908' },
    });
  });

  it('uses the page path for a source on a story page', () => {
    const link = { ...base, href: 'https://library.hungaricana.hu/x', inContent: true, pagePath: '/nevado/' };
    expect(statisticsEventFor(link)?.params.timeline_event).toBe('/nevado/');
  });

  it('reports a zoomed image by its name', () => {
    const link = {
      ...base,
      href: 'https://www.dembinszky18.hu/_astro/a.jpg',
      dataset: { statImage: 'fortepan-1' },
      inContent: true,
    };
    expect(statisticsEventFor(link)).toEqual({ name: 'image_zoom', params: { image_name: 'fortepan-1' } });
  });

  it('reports an era chosen in the menu', () => {
    const link = { ...base, href: 'https://www.dembinszky18.hu/#korszak-1914-1938', inMenu: true };
    expect(statisticsEventFor(link)).toEqual({ name: 'era_select', params: { era: '1914-1938' } });
  });

  it('ignores page links in the menu, internal and mail links, and links outside the content', () => {
    expect(statisticsEventFor({ ...base, href: 'https://www.dembinszky18.hu/nevado/', inMenu: true })).toBeNull();
    expect(statisticsEventFor({ ...base, href: 'https://www.dembinszky18.hu/#korszak-1914-1938' })).toBeNull();
    expect(statisticsEventFor({ ...base, href: 'https://example.org/' })).toBeNull();
    expect(statisticsEventFor({ ...base, href: 'https://www.dembinszky18.hu/nevado/', inContent: true })).toBeNull();
    expect(statisticsEventFor({ ...base, href: 'mailto:someone@example.org', inContent: true })).toBeNull();
  });
});
