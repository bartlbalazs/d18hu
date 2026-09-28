// Assertions over the built site in dist/ (run after a build: pnpm build:draft && pnpm test:site).
import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(`dist/${path}`, 'utf8');
const count = (html: string, pattern: RegExp) => (html.match(pattern) ?? []).length;

describe('built timeline page', () => {
  const html = read('index.html');

  it('contains every event exactly once with the documented distribution', () => {
    expect(count(html, /data-event-id="/g)).toBe(108);
    expect(count(html, /data-category="house"/g)).toBe(33);
    expect(count(html, /data-category="area"/g)).toBe(14);
    expect(count(html, /data-category="hungary"/g)).toBe(28);
    expect(count(html, /data-category="world"/g)).toBe(33);
    expect(count(html, /data-confidence="none"/g)).toBe(61);
    expect(count(html, /class="confidence"/g)).toBe(47);
  });

  it('has four era openers and working anchor targets for every era link', () => {
    expect(count(html, /class="era-opener era-opener--\d"/g)).toBe(4);
    for (const era of ['1873-1913', '1914-1938', '1939-1945', '1946-1968']) {
      expect(html).toContain(`id="korszak-${era}"`);
      expect(html).toContain(`id="esemenyek-${era}"`);
      expect(html).toContain(`href="/#korszak-${era}"`);
    }
  });

  it('shows figures with visible captions and only local image files', () => {
    expect(count(html, /<figure class="evidence/g)).toBe(6);
    expect(count(html, /<figcaption>/g)).toBe(6);
    expect(html).not.toMatch(/<(img|source)[^>]+(src|srcset)="https?:/);
    expect(html).not.toMatch(/data-pswp-width[^>]*href="https?:/);
    for (const match of html.matchAll(/href="([^"]+)"\s+data-pswp-width/g)) {
      expect(existsSync(`dist${match[1]}`)).toBe(true);
    }
  });

  it('never renders empty elements for "—" values or internal research references', () => {
    expect(html).not.toContain('>—<');
    expect(html).not.toMatch(/class="event__sources">\s*<span class="visually-hidden">Forrás:<\/span>\s*<\/p>/);
    expect(html).not.toMatch(/kutatási blokk|blokk-PDF/i);
    expect(html).not.toMatch(/href="(?!https?:)[^"]*\.pdf"/);
    expect(html).not.toContain('Cikkötlet');
  });

  it('keeps uncertain date labels verbatim', () => {
    expect(html).toContain('1945. jan. 15. <strong>vagy</strong> 17.');
    expect(html).toContain('1945 után, pontos év nélkül');
  });

  it('has valid, parseable structured data', () => {
    const blocks = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)];
    expect(blocks).toHaveLength(1);
    const data = JSON.parse(blocks[0][1]);
    const types = data['@graph'].map((node: { '@type': string }) => node['@type']);
    expect(types).toEqual(expect.arrayContaining(['WebSite', 'BreadcrumbList', 'ApartmentComplex', 'ImageObject']));
    const building = data['@graph'].find((node: { '@type': string }) => node['@type'] === 'ApartmentComplex');
    expect(building.event.length).toBeGreaterThan(0);
    expect(building.event.every((event: { startDate?: string }) => event.startDate)).toBe(true);
  });
});

describe('every page', () => {
  for (const page of ['index.html', 'irasok/index.html', 'impresszum/index.html']) {
    it(`${page} carries the required metadata`, () => {
      const html = read(page);
      expect(html).toContain('<html lang="hu">');
      expect(count(html, /<h1[\s>]/g)).toBe(1);
      const title = /<title>(.*?)<\/title>/.exec(html)?.[1] ?? '';
      expect(title.length).toBeGreaterThan(0);
      expect(title.length).toBeLessThanOrEqual(60);
      const description = /<meta name="description" content="([^"]*)"/.exec(html)?.[1] ?? '';
      expect(description.length).toBeGreaterThanOrEqual(50);
      expect(description.length).toBeLessThanOrEqual(160);
      for (const tag of ['rel="canonical"', 'og:title', 'og:description', 'og:image', 'og:url', 'og:type', 'og:locale', 'twitter:card']) {
        expect(html).toContain(tag);
      }
      expect(html).toContain('href="/impresszum/"');
      expect(html).not.toMatch(/position:\s*(sticky|fixed)/);
    });
  }

  it('publishes sitemap, robots and manifest', () => {
    expect(read('sitemap.xml')).toContain('<loc>');
    expect(read('robots.txt')).toMatch(/User-agent/);
    expect(JSON.parse(read('site.webmanifest')).icons).toHaveLength(2);
  });
});
