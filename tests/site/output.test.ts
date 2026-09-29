// Assertions over the built site in dist/ (run after a build: pnpm build:draft && pnpm test:site).
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parseTimeline } from '../../src/lib/timeline/parse.ts';

const read = (path: string) => readFileSync(`dist/${path}`, 'utf8');
const count = (html: string, pattern: RegExp) => (html.match(pattern) ?? []).length;
const jsonLdGraph = (html: string): Record<string, unknown>[] => {
  const block = /<script type="application\/ld\+json">(.*?)<\/script>/s.exec(html)?.[1] ?? '{"@graph":[]}';
  return JSON.parse(block)['@graph'];
};
const jsonLdTypes = (html: string) => jsonLdGraph(html).map((node) => node['@type']);
const navLinks = (html: string, label: string) => {
  const nav = new RegExp(`<nav aria-label="${label}">([\\s\\S]*?)</nav>`).exec(html)?.[1] ?? '';
  return [...nav.matchAll(/href="([^"#]+)"/g)].map((match) => match[1]);
};
const PAGES = ['index.html', 'epitok/index.html', 'nevado/index.html', 'impresszum/index.html'];

describe('built timeline page', () => {
  const html = read('index.html');

  it('contains every event of input/timeline.md exactly once, in source order', () => {
    const { events } = parseTimeline(readFileSync('input/timeline.md', 'utf8'));
    const renderedIds = [...html.matchAll(/data-event-id="([^"]+)"/g)].map((match) => match[1]);
    expect(renderedIds).toEqual(events.map((event) => event.id));
    for (const category of ['house', 'area', 'hungary', 'world']) {
      const expected = events.filter((event) => event.category === category).length;
      expect(count(html, new RegExp(`data-category="${category}"`, 'g'))).toBe(expected);
    }
    expect(count(html, /class="confidence"/g)).toBe(events.filter((event) => event.confidence).length);
  });

  it('links each source page at most once per event', () => {
    for (const [event] of html.matchAll(/<li class="event[\s\S]*?<\/li>/g)) {
      const links = [...event.matchAll(/href="(https:\/\/[^"]+)"/g)].map((match) => match[1]);
      expect(links).toEqual([...new Set(links)]);
    }
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
    const { events } = parseTimeline(readFileSync('input/timeline.md', 'utf8'));
    const figures = events.filter((event) => event.originalImageUrl).length + 1; // + facade photo
    expect(count(html, /<figure class="evidence/g)).toBe(figures);
    expect(count(html, /<figcaption>/g)).toBe(figures);
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
  for (const page of PAGES) {
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
      expect(html).toMatch(/\.site-header\{[^}]*position:sticky/);
    });

    it(`${page} lists the pages in the menu as Építők, Névadó, Impresszum`, () => {
      const html = read(page);
      const expected = ['/epitok/', '/nevado/', '/impresszum/'];
      expect(navLinks(html, 'Fő navigáció').filter((href) => href !== '/')).toEqual(expected);
      expect(navLinks(html, 'Lábléc')).toEqual(expected);
    });
  }

  it('no longer publishes or links the Írások page', () => {
    expect(existsSync('dist/irasok')).toBe(false);
    const htmlFiles = readdirSync('dist', { recursive: true, encoding: 'utf8' }).filter((file) => file.endsWith('.html'));
    for (const file of htmlFiles) expect(read(file)).not.toContain('href="/irasok/"');
    const sitemap = read('sitemap.xml');
    expect(sitemap).toMatch(/\/epitok\/<\/loc>/);
    expect(sitemap).toMatch(/\/nevado\/<\/loc>/);
    expect(sitemap).not.toContain('/irasok/');
  });

  it('publishes sitemap, robots and manifest', () => {
    expect(read('sitemap.xml')).toContain('<loc>');
    expect(read('robots.txt')).toMatch(/User-agent/);
    expect(JSON.parse(read('site.webmanifest')).icons).toHaveLength(2);
  });
});

describe('story pages', () => {
  for (const page of ['epitok/index.html', 'nevado/index.html']) {
    it(`${page} is an article with one eager opening figure and clean source links`, () => {
      const html = read(page);
      expect(html).toContain('<meta property="og:type" content="article"');
      expect(jsonLdTypes(html)).toEqual(expect.arrayContaining(['WebSite', 'BreadcrumbList', 'Article', 'ImageObject']));
      expect(count(html, /<figure class="evidence/g)).toBe(1);
      expect(html).toMatch(/<figure class="evidence[\s\S]*?loading="eager"/);
      expect(html).not.toContain('utm_');
    });
  }

  it('Névadó links every source marker to one of its 13 numbered sources', () => {
    const html = read('nevado/index.html');
    const ids = [...html.matchAll(/id="forras-(\d+)"/g)].map((match) => Number(match[1]));
    expect(ids).toEqual(Array.from({ length: 13 }, (_, index) => index + 1));
    const markers = [...html.matchAll(/href="#forras-(\d+)"/g)].map((match) => Number(match[1]));
    expect(new Set(markers)).toEqual(new Set(ids));
    expect(html).not.toContain('Javasolt nyitókép');
  });
});

describe('impresszum page', () => {
  const html = read('impresszum/index.html');

  it('shows the operator, contact and copyright, and invites corrections', () => {
    expect(html).not.toContain('feltöltés alatt');
    expect(html).toContain('Bartl Balázs');
    expect(html).toContain('szabadon idézhetők');
    expect(count(html, /href="mailto:bartlbalazs@gmail\.com"/g)).toBe(2);
    expect(html).toContain('Ha hibát talál');
  });

  it('describes the operator as the site publisher', () => {
    const publisher = jsonLdGraph(html).find((node) => node['@type'] === 'Person');
    expect(publisher).toMatchObject({ name: 'Bartl Balázs', email: 'mailto:bartlbalazs@gmail.com' });
    const website = jsonLdGraph(read('index.html')).find((node) => node['@type'] === 'WebSite');
    expect(website?.publisher).toEqual({ '@id': publisher?.['@id'] });
  });
});

describe('404 page', () => {
  const html = read('404.html');

  it('is a Hungarian not-found page that links home and stays out of search', () => {
    expect(count(html, /<h1[\s>]/g)).toBe(1);
    expect(html).toMatch(/<h1[^>]*>Az oldal nem található<\/h1>/);
    expect(html).toContain('href="/"');
    expect(html).toContain('name="robots" content="noindex');
    expect(html).not.toContain('rel="canonical"');
    expect(read('sitemap.xml')).not.toContain('404');
  });
});

describe('site menu', () => {
  for (const page of [...PAGES, '404.html']) {
    it(`${page} has the Menü popover with the eras and pages in two labelled groups`, () => {
      const html = read(page);
      expect(count(html, /<button[^>]*popovertarget="fomenu"[^>]*>Menü<\/button>/g)).toBe(1);
      expect(html).toMatch(/<div[^>]*id="fomenu"[^>]*popover/);
      expect(html).toMatch(/id="menu-korszakok"[^>]*>Korszakok</);
      expect(html).toMatch(/id="menu-oldalak"[^>]*>Oldalak</);
      expect(html).toContain('aria-labelledby="menu-korszakok"');
      expect(html).toContain('aria-labelledby="menu-oldalak"');
      const menu = /<div[^>]*id="fomenu"[^>]*>([\s\S]*?)<\/div>/.exec(html)?.[1] ?? '';
      const links = [...menu.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);
      expect(links).toHaveLength(7);
      expect(links.slice(0, 4).every((href) => href.startsWith('/#korszak-'))).toBe(true);
      expect(links.slice(4)).toEqual(['/epitok/', '/nevado/', '/impresszum/']);
      expect(html).not.toContain('aria-current="location"');
    });
  }

  it('marks the current page in the menu', () => {
    expect(read('nevado/index.html')).toMatch(/<a href="\/nevado\/" aria-current="page"/);
  });
});
