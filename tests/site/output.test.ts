// Assertions over the built site in dist/ (run after a build: pnpm build:draft && pnpm test:site).
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parse as parseYaml } from 'yaml';
import { parseTimeline } from '../../src/lib/timeline/parse.ts';
import { scopeCounts } from '../../src/lib/timeline/scope.ts';

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
const PAGES = ['index.html', 'epitok/index.html', 'lakok/index.html', 'nevado/index.html', 'impresszum/index.html'];

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

  it('does not repeat event titles at the start of descriptions or captions', () => {
    const { events } = parseTimeline(readFileSync('input/timeline.md', 'utf8'));
    const editorial = parseYaml(readFileSync('editorial/events.yaml', 'utf8'));
    const words = (value: string) => (value.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []).join(' ');
    for (const event of events) {
      const metadata = editorial[event.id];
      const title = words(metadata.title);
      expect(words(event.descriptionText).startsWith(title), event.id).toBe(false);
      if (metadata.image) {
        expect(words(metadata.image.caption).startsWith(title), event.id).toBe(false);
      }
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

    it(`${page} lists the pages in the menu as Építők, Lakók, Névadó, Impresszum`, () => {
      const html = read(page);
      const expected = ['/epitok/', '/lakok/', '/nevado/', '/impresszum/'];
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
    expect(sitemap).toMatch(/\/lakok\/<\/loc>/);
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

describe('Lakók page', () => {
  const html = read('lakok/index.html');

  it('is an article that opens with the credited façade photo after the lead', () => {
    expect(html).toContain('<meta property="og:type" content="article"');
    expect(jsonLdTypes(html)).toEqual(expect.arrayContaining(['WebSite', 'BreadcrumbList', 'Article', 'ImageObject']));
    expect(count(html, /<figure class="evidence/g)).toBe(15);
    expect(html).toMatch(/<figure class="evidence[\s\S]*?loading="eager"/);
    expect(html).toContain('Globetrotter19');
    const lead = html.indexOf('class="story__lead"');
    const figure = html.indexOf('<figure class="evidence');
    const firstBand = html.indexOf('class="lakok-band');
    expect(lead).toBeLessThan(figure);
    expect(figure).toBeLessThan(firstBand);
  });

  const at = (stem: string) => html.indexOf(`data-stat-image="${stem}"`);
  const heading = (text: string) => html.indexOf(`<h3>${text}</h3>`);
  const band = (id: string) => html.indexOf(`<h2 id="${id}">`);
  const expectBetween = (stem: string, after: number, before: number) => {
    expect(after, `${stem}: heading before it`).toBeGreaterThan(0);
    expect(at(stem), `${stem}: position`).toBeGreaterThan(after);
    expect(at(stem), `${stem}: position`).toBeLessThan(before);
  };
  const pairs = () => [...html.matchAll(/<div class="lakok-figure-pair">([\s\S]*?)<\/div>/g)].map((match) => match[1]);

  const portraits = {
    armandola: heading('Armandola Aranka: zongoralecke és hangverseny'),
    almassy: heading('Almássy Iza: Mici hercegnő és a cake-walk'),
    kramer: heading('Kramer Lipót A.: fényképnagyító'),
    mautner: heading('Mautner Adolf: fény és géperő egyetlen készülékből'),
    sztankovits: heading('Sztankovits Ödön: térképek és dél-amerikai levelek'),
    szello: heading('Szellő Sándor: mit ér a szépen elmondott vers?'),
    graselly: heading('Graselly Miklós: az iskola és a gazdasági egyesület'),
    petrovits: heading('Petrovits Róbert: húsz év távolságából'),
    takacs: heading('Takács Eberhard Árpád: autóvállalat, telefonkapcsolattal'),
    merenyi: heading('Dr. Merényi József: egy kassai szerkesztőség lehetséges emléke'),
  };

  it('places the portrait images after their paragraphs', () => {
    expectBetween('18-armandola-hangverseny-1902', portraits.armandola, portraits.almassy);
    expectBetween('16-almasi-iza-portre-1900', portraits.almassy, at('17-iza-cake-walk-1903'));
    expectBetween('17-iza-cake-walk-1903', portraits.almassy, portraits.kramer);
    expect(html.slice(at('16-almasi-iza-portre-1900'), at('17-iza-cake-walk-1903'))).toContain('<p>');
    expectBetween('04-mautner-perfector-1899', portraits.mautner, portraits.sztankovits);
    expectBetween('19-szello-cikkkezdet-1900', portraits.szello, at('20-szello-cikkvege-1900'));
    expectBetween('20-szello-cikkvege-1900', portraits.szello, html.indexOf('<p>A ház építtetője, Spitz János Ferencz'));
    expectBetween('21-graselly-lajosmizse-1911', portraits.graselly, portraits.petrovits);
    expectBetween('07-petrovits-1902', portraits.petrovits, at('08-petrovits-1922'));
    expectBetween('08-petrovits-1922', portraits.petrovits, html.indexOf('<p>1922-ben Markovits Ágoston'));
    expectBetween('09-takacs-auto-1922', portraits.takacs, portraits.merenyi);
  });

  it('places the 1944 and 1954 images', () => {
    expectBetween('12-csillagos-hazak-1944', band('csillagos-haz'), band('gepek-1954'));
    const starHouseSection = html.slice(band('csillagos-haz'), band('gepek-1954'));
    expect(count(starHouseSection, /<figure/g)).toBe(1);
    expectBetween('13-gepeszek-1954', band('gepek-1954'), heading('Az 1954-es választói névjegyzék házbeli listája'));
    expectBetween(
      '14-mozigepesz-1954',
      heading('Kovács Jánosné, Ballák Magda: a vetítés mögött'),
      heading('Horváth János: a munka idejének mérője'),
    );
    expectBetween(
      '15-idoelemzes-1949',
      heading('Horváth János: a munka idejének mérője'),
      heading('Lőwy Lipót Pálné, Beer Olga: bedolgozó'),
    );
  });

  it('loads, describes and credits every source image', () => {
    const images = html.match(/<img [^>]*>/g) ?? [];
    expect(images.filter((image) => image.includes('loading="eager"'))).toHaveLength(1);
    for (const image of images.slice(1)) {
      expect(image).toContain('loading="lazy"');
      expect(image).toMatch(/\swidth="\d+"/);
      expect(image).toMatch(/\sheight="\d+"/);
    }
    const figures = [...html.matchAll(/<figure class="evidence[\s\S]*?<\/figure>/g)].map((match) => match[0]);
    for (const figure of figures) {
      expect(figure).toMatch(/alt="[^"]+"/);
      expect(figure).toMatch(/class="evidence__credit">[\s\S]*?<a href="https:\/\//);
    }
    expect(count(html, /eredeti forrás/g)).toBe(14);
    const spares = ['01-armandola-1902', '02-almassy-iza-1902', '03-rothauser-1902', '05-szello-iskola-1914'];
    spares.push('06-spitz-1902', '10-merenyi-1922', '11-adam-szemfedel-1922');
    for (const spare of spares) expect(html).not.toContain(spare);
    expect(jsonLdTypes(html).filter((type) => type === 'ImageObject')).toHaveLength(1);
  });

  it('groups the Szellő and Petrovits clips in labelled pairs', () => {
    const groups = pairs();
    expect(groups).toHaveLength(2);
    for (const group of groups) expect(count(group, /<figure/g)).toBe(2);
    expect(groups[0]).toContain('data-stat-image="19-szello-cikkkezdet-1900"');
    expect(groups[0]).toContain('<span class="evidence__label">Cikkkezdet, 377. oldal</span>');
    expect(groups[0]).toContain('<span class="evidence__label">Zárórész, 379. oldal</span>');
    expect(groups[1]).toContain('data-stat-image="07-petrovits-1902"');
    expect(groups[1]).toContain('data-stat-image="08-petrovits-1922"');
  });

  it('gives the 1944–1945 passage its own section', () => {
    expect(html).toMatch(/<h2[^>]*>1944–1945: csillagos ház<\/h2>/);
  });

  it('links every source marker to one of its 27 numbered sources, and cites each one', () => {
    const ids = [...html.matchAll(/id="forras-(\d+)"/g)].map((match) => Number(match[1]));
    expect(ids).toEqual(Array.from({ length: 27 }, (_, index) => index + 1));
    const markers = [...html.matchAll(/href="#forras-(\d+)"/g)].map((match) => Number(match[1]));
    expect(new Set(markers)).toEqual(new Set(ids));
  });

  it('has clean, relative internal links', () => {
    expect(html).not.toContain('utm_');
    expect(html).not.toContain('<a href="https://www.dembinszky18.hu');
  });

  it('keeps the three name lists closed, labelled with their entry counts', () => {
    const lists = html.match(/<details class="name-list"[^>]*>/g) ?? [];
    expect(lists).toHaveLength(3);
    for (const list of lists) expect(list).not.toMatch(/\sopen[\s=>]/);
    const summaries = [...html.matchAll(/<summary[^>]*>([\s\S]*?)<\/summary>/g)].map((match) => match[1].trim());
    expect(summaries.map((text) => /\((\d+) bejegyzés\)$/.exec(text)?.[1])).toEqual(['67', '35', '107']);
  });

  it('transcribes every row of the three name lists', () => {
    const rowCounts = [...html.matchAll(/<tbody>([\s\S]*?)<\/tbody>/g)].map((match) => count(match[1], /<tr>/g));
    expect(rowCounts).toEqual([67, 35, 107]);
  });

  it('ends with a correction and removal note after the sources', () => {
    expect(html.indexOf('mailto:')).toBeGreaterThan(html.indexOf('id="forras-27"'));
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

  it('names the hosting provider after the contact row', () => {
    const terms = [...html.matchAll(/<dt>([^<]+)<\/dt>/g)].map((match) => match[1]);
    expect(terms.slice(0, 5)).toEqual(['Üzemeltető', 'Szerző', 'Kapcsolat', 'Tárhelyszolgáltató', 'Szerzői jog']);
    expect(html).toContain('Google LLC (Firebase Hosting)');
    expect(html).toContain('1600 Amphitheatre Parkway, Mountain View, CA 94043, Amerikai Egyesült Államok');
    expect(html).toMatch(/<a href="https:\/\/firebase\.google\.com\/support"[^>]*>firebase\.google\.com\/support<\/a>/);
  });

  it('describes the operator as the site publisher', () => {
    const publisher = jsonLdGraph(html).find((node) => node['@type'] === 'Person');
    expect(publisher).toMatchObject({ name: 'Bartl Balázs', email: 'mailto:bartlbalazs@gmail.com' });
    const website = jsonLdGraph(read('index.html')).find((node) => node['@type'] === 'WebSite');
    expect(website?.publisher).toEqual({ '@id': publisher?.['@id'] });
  });
});

describe('resident correction note', () => {
  it('separates the contact email from the preceding word', () => {
    const email: string = parseYaml(readFileSync('editorial/site.yaml', 'utf8')).impresszum.contactEmail;
    const note = /<p class="lakok-note">([\s\S]*?)<\/p>/.exec(read('lakok/index.html'))?.[1] ?? '';
    expect(note).toContain(`írjon a <a href="mailto:${email}">${email}</a> címre.`);
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
      expect(links).toHaveLength(8);
      expect(links.slice(0, 4).every((href) => href.startsWith('/#korszak-'))).toBe(true);
      expect(links.slice(4)).toEqual(['/epitok/', '/lakok/', '/nevado/', '/impresszum/']);
      expect(html).not.toContain('aria-current="location"');
    });
  }

  it('marks the current page in the menu', () => {
    expect(read('nevado/index.html')).toMatch(/<a href="\/nevado\/" aria-current="page"/);
    expect(read('lakok/index.html')).toMatch(/<a href="\/lakok\/" aria-current="page"/);
  });
});

describe('statistics', () => {
  const measurementId: string = parseYaml(readFileSync('editorial/site.yaml', 'utf8')).analytics?.measurementId ?? '';
  const isRelease = !read('index.html').includes('class="draft-banner"');
  const enabled = isRelease && measurementId !== '';
  const allPages = [...PAGES, '404.html'];

  it('loads no third-party script from the static HTML', () => {
    for (const page of allPages) {
      expect(read(page)).not.toMatch(/<script[^>]+src="(https?:)?\/\//);
    }
  });

  it('names every zoomable image by its source file, without the build hash', () => {
    const assetNames = ['src/assets', 'assets']
      .flatMap((dir) => readdirSync(dir, { recursive: true, encoding: 'utf8' }))
      .map((path) => path.split('/').pop()!.split('.')[0]);
    for (const page of PAGES) {
      const links = [...read(page).matchAll(/<a class="evidence__link"[^>]*>/g)].map((match) => match[0]);
      for (const link of links) {
        const name = /data-stat-image="([^"]*)"/.exec(link)?.[1] ?? '';
        expect(name).toMatch(/^[a-z0-9-]+$/);
        expect(assetNames).toContain(name);
      }
    }
  });

  if (!enabled) {
    it('has no trace of analytics without a measurement ID or in a draft build', () => {
      for (const page of allPages) {
        const html = read(page);
        for (const marker of ['id="statisztika"', 'data-consent-settings', 'id="adatkezeles"', 'googletagmanager']) {
          expect(html).not.toContain(marker);
        }
      }
    });
    return;
  }

  for (const page of allPages) {
    it(`${page} has the hidden consent notice and the footer settings button`, () => {
      const html = read(page);
      const notice = /<section[^>]*id="statisztika"[^>]*>/.exec(html)?.[0] ?? '';
      expect(count(html, /id="statisztika"/g)).toBe(1);
      expect(notice).toMatch(/\shidden[\s>]/);
      expect(notice).toContain(`data-measurement-id="${measurementId}"`);
      expect(html).toMatch(/data-consent="granted"[^>]*>Elfogadom</);
      expect(html).toMatch(/data-consent="denied"[^>]*>Nem kérem</);
      const footer = /<footer class="site-footer"[\s\S]*?<\/footer>/.exec(html)?.[0] ?? '';
      expect(count(footer, /data-consent-settings/g)).toBe(1);
    });
  }

  it('explains the data processing on the Impresszum', () => {
    const html = read('impresszum/index.html');
    expect(html).toMatch(/<h2 id="adatkezeles">Adatkezelés<\/h2>/);
    expect(html).toContain('Google Ireland');
  });

  it('says that consent also lets the browser remember the timeline setting', () => {
    for (const page of allPages) expect(read(page)).toContain('megjegyezzük a böngészőjében');
    const section = /<section aria-labelledby="adatkezeles">[\s\S]*?<\/section>/.exec(read('impresszum/index.html'))?.[0] ?? '';
    expect(section).toContain('<dt>Idővonal-beállítás</dt>');
    expect(section).toContain('(d18-idovonal)');
  });
});

describe('timeline closing', () => {
  const html = read('index.html');
  const block = /<section class="container timeline-closing"[\s\S]*?<\/section>/.exec(html)?.[0] ?? '';
  const text = (fragment: string) => fragment.replace(/<[^>]+>/g, '').trim();

  it('closes the home page timeline once, after the last era and before the end of main', () => {
    expect(count(html, /class="container timeline-closing"/g)).toBe(1);
    const position = html.indexOf(block);
    expect(position).toBeGreaterThan(html.lastIndexOf('id="esemenyek-1946-1968"'));
    expect(position).toBeLessThan(html.indexOf('</main>'));
    expect(count(html, /class="timeline timeline--ends"/g)).toBe(1);
    expect(html.indexOf('<ol class="timeline timeline--ends"')).toBeGreaterThan(html.lastIndexOf('id="esemenyek-1946-1968"'));
  });

  it('has no decoration, button or year', () => {
    expect(block).not.toMatch(/<(hr|img|svg|button|time)[\s>]/);
    expect(text(block)).not.toMatch(/\b\d{4}\b/);
  });

  it('shows the owner text verbatim, with only „ossza meg velünk” linking to the Impresszum', () => {
    expect(block).toMatch(/<h2 id="tortenet-folytatodik">A történet folytatódik<\/h2>/);
    const paragraphs = [...block.matchAll(/<p>([\s\S]*?)<\/p>/g)].map((match) => match[1]);
    expect(paragraphs.map(text)).toEqual([
      'A hatvanas évek után jóval kevesebb nyilvános forrás maradt fenn. Az újabb évtizedek történeteit ezért leginkább azok őrzik, akik a házban éltek vagy ma is itt laknak.',
      'Ha Ön vagy családtagja itt lakott, és van régi fényképe, dokumentuma vagy egy megőrzött története a házról, kérem, ossza meg velünk! Minden apró emlék segít továbbírni a ház krónikáját.',
    ]);
    expect([...block.matchAll(/href="([^"]+)"/g)].map((match) => match[1])).toEqual(['/impresszum/']);
    expect(block).toContain('<a href="/impresszum/">ossza meg velünk</a>!');
  });

  it('appears on no other page', () => {
    for (const page of [...PAGES.slice(1), '404.html']) {
      expect(read(page)).not.toContain('class="container timeline-closing"');
    }
  });
});

describe('timeline scope', () => {
  const html = read('index.html');
  const { events } = parseTimeline(readFileSync('input/timeline.md', 'utf8'));
  const panel = /<aside[^>]*id="ido-latomezo"[\s\S]*?<\/aside>/.exec(html)?.[0] ?? '';
  const firstOpener = html.indexOf('class="era-opener');
  const legendIcon = (category: string) =>
    new RegExp(`class="legend__icon legend__icon--${category}">(<svg[\\s\\S]*?</svg>)`).exec(html)?.[1];

  it('keeps every event in the page', () => {
    expect(count(html, /data-event-id="/g)).toBe(events.length);
  });

  it('places one panel between the Jelmagyarázat and the first chapter opener', () => {
    expect(count(html, /id="ido-latomezo"/g)).toBe(1);
    const position = html.indexOf('id="ido-latomezo"');
    expect(position).toBeGreaterThan(html.indexOf('id="jelmagyarazat"'));
    expect(position).toBeLessThan(firstOpener);
    expect(panel).toMatch(/<aside[^>]*popover="auto"/);
  });

  it('has only the question, a labelled four-step range and a live status', () => {
    expect(panel).toMatch(/<p class="scope__question" id="ido-latomezo-kerdes">Milyen messzire nézzünk a háztól\?<\/p>/);
    const range = /<input[^>]*type="range"[^>]*>/.exec(panel)?.[0] ?? '';
    for (const attribute of ['min="0"', 'max="3"', 'step="1"', 'value="1"', 'aria-valuetext="Környék"', 'aria-labelledby="ido-latomezo-kerdes"']) {
      expect(range).toContain(attribute);
    }
    expect(panel).not.toContain('scope__help');
    expect(count(panel, /aria-live="polite"/g)).toBe(1);
  });

  it('labels the four steps in order with the Jelmagyarázat icons', () => {
    const ticks = [...panel.matchAll(/<span class="scope__tick scope__tick--(\w+)" data-scope-step="(\d)">(<svg[\s\S]*?<\/svg>)\s*([^<]+)<\/span>/g)];
    expect(ticks.map((tick) => [tick[1], tick[2], tick[4].replace(/\u00ad|&shy;/g, '').trim()])).toEqual([
      ['house', '0', 'Ház'],
      ['area', '1', 'Környék'],
      ['hungary', '2', 'Magyarország'],
      ['world', '3', 'Világ'],
    ]);
    for (const tick of ticks) expect(tick[3]).toBe(legendIcon(tick[1]));
  });

  it('pre-renders the cumulative count of every era for each scope', () => {
    const eras = [...new Set(events.map((event) => event.era))];
    for (const era of eras) {
      const section = new RegExp(`<section[^>]*id="esemenyek-${era}"[\\s\\S]*?</section>`).exec(html)?.[0] ?? '';
      const rendered = Object.fromEntries(
        [...section.matchAll(/<span data-scope-count="(\w+)">(\d+)<\/span>/g)].map((match) => [match[1], Number(match[2])]),
      );
      expect(rendered).toEqual(scopeCounts(events.filter((event) => event.era === era)));
    }
  });

  it('has a round button that opens the panel and shows the current scope icon', () => {
    const toggle = /<button[^>]*class="scope-toggle"[^>]*>[\s\S]*?<\/button>/.exec(html)?.[0] ?? '';
    expect(toggle).toContain('popovertarget="ido-latomezo"');
    expect(toggle).toContain('aria-label="Milyen messzire nézzünk a háztól?"');
    expect(count(toggle, /class="scope-toggle__icon scope-toggle__icon--/g)).toBe(4);
  });

  it('places the panel beside the timeline from 1100px and as a popover below', () => {
    const css = [...html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)]
      .map((match) => readFileSync(`dist${match[1]}`, 'utf8'))
      .join('')
      .concat([...html.matchAll(/<style>([\s\S]*?)<\/style>/g)].map((match) => match[1]).join(''));
    expect(css).toMatch(/\((min-width:\s*|width\s*>=\s*)1100px\)/);
    expect(css).toContain('.scope:popover-open');
  });

  it('names the categories as the scales of the story in the Jelmagyarázat', () => {
    const legend = /<section[^>]*aria-labelledby="jelmagyarazat"[\s\S]*?<\/section>/.exec(html)?.[0] ?? '';
    expect([...legend.matchAll(/<h3>([^<]+)<\/h3>/g)].map((match) => match[1])).toEqual([
      'A történet léptékei',
      'Bizonyosság',
      'Milyen messzire nézzünk a háztól?',
    ]);
  });

  it('explains the slider at the end of the Jelmagyarázat', () => {
    const legend = /<section[^>]*aria-labelledby="jelmagyarazat"[\s\S]*?<\/section>/.exec(html)?.[0] ?? '';
    const groups = legend.split('class="legend__group');
    const last = groups[groups.length - 1];
    expect(last).toContain('<h3>Milyen messzire nézzünk a háztól?</h3>');
    expect(last).toContain('tágítja a történet látómezejét.');
    expect(last).not.toContain('Környék állással');
  });

  it('sets the scope in an inline script before the first chapter opener', () => {
    const position = html.indexOf('dataset.scope');
    expect(position).toBeGreaterThan(0);
    expect(position).toBeLessThan(firstOpener);
  });

  it('appears on no other page', () => {
    for (const page of [...PAGES.slice(1), '404.html']) {
      const other = read(page);
      for (const marker of ['id="ido-latomezo"', '<span data-scope-count', 'dataset.scope']) expect(other).not.toContain(marker);
    }
  });
});
