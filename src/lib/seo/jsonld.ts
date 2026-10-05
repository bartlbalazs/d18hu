import type { TimelineEvent } from '../editorial/assemble.ts';
import { isMissingValue } from '../editorial/audit.ts';
import type { SiteEditorial } from '../editorial/schema.ts';

type JsonLd = Record<string, unknown>;

export function absoluteUrl(path: string, site: URL): string {
  return new URL(path, site).href;
}

const PUBLISHER_ID = '/impresszum/#publisher';

/** Names the Impresszum operator as publisher once the operator is filled in. */
export function websiteNode(site: URL, editorial: SiteEditorial): JsonLd {
  return {
    '@type': 'WebSite',
    '@id': absoluteUrl('/#website', site),
    url: site.href,
    name: editorial.building.name,
    inLanguage: 'hu',
    ...(isMissingValue(editorial.impresszum.operator) ? {} : { publisher: { '@id': absoluteUrl(PUBLISHER_ID, site) } }),
  };
}

export function publisherNode(site: URL, impresszum: SiteEditorial['impresszum']): JsonLd {
  return {
    '@type': 'Person',
    '@id': absoluteUrl(PUBLISHER_ID, site),
    name: impresszum.operator,
    email: `mailto:${impresszum.contactEmail}`,
    url: absoluteUrl('/impresszum/', site),
  };
}

export function breadcrumbNode(site: URL, trail: { name: string; path: string }[]): JsonLd {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path, site),
    })),
  };
}

export function buildingNode(
  site: URL,
  building: SiteEditorial['building'],
  imageUrl: string,
  events: TimelineEvent[],
): JsonLd {
  const { latitude, longitude } = building.geo;
  return {
    '@type': 'ApartmentComplex',
    '@id': absoluteUrl('/#building', site),
    name: building.name,
    image: imageUrl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: building.streetAddress,
      ...(building.postalCode ? { postalCode: building.postalCode } : {}),
      addressLocality: building.addressLocality,
      ...(building.addressRegion ? { addressRegion: building.addressRegion } : {}),
      addressCountry: building.addressCountry,
    },
    ...(latitude !== null && longitude !== null
      ? { geo: { '@type': 'GeoCoordinates', latitude, longitude } }
      : {}),
    // Only the building's own history with a derivable date: background events are not the house's.
    event: events
      .filter((event) => event.category === 'house' && event.sortStart)
      .map((event) => ({
        '@type': 'Event',
        '@id': absoluteUrl(`/#${event.id}`, site),
        name: event.title ?? event.dateLabel,
        startDate: event.sortStart,
        ...(event.sortEnd ? { endDate: event.sortEnd } : {}),
        location: { '@id': absoluteUrl('/#building', site) },
        url: absoluteUrl(`/#${event.id}`, site),
      })),
  };
}

export function imageNode(
  site: URL,
  image: { contentUrl: string; caption: string; credit: string; license?: string; sourceUrl?: string; path: string },
): JsonLd {
  return {
    '@type': 'ImageObject',
    contentUrl: absoluteUrl(image.contentUrl, site),
    caption: image.caption,
    ...(image.credit ? { creditText: image.credit } : {}),
    ...(image.license ? { license: image.license } : {}),
    ...(image.sourceUrl ? { acquireLicensePage: image.sourceUrl } : {}),
    url: absoluteUrl(image.path, site),
  };
}

export function articleNode(
  site: URL,
  article: { headline: string; description: string; path: string; imageUrl?: string },
): JsonLd {
  return {
    '@type': 'Article',
    '@id': absoluteUrl(`${article.path}#article`, site),
    headline: article.headline,
    description: article.description,
    ...(article.imageUrl ? { image: article.imageUrl } : {}),
    inLanguage: 'hu',
    mainEntityOfPage: absoluteUrl(article.path, site),
    isPartOf: { '@id': absoluteUrl('/#website', site) },
  };
}

export function graph(nodes: JsonLd[]): string {
  // "<" is escaped so the JSON can never close the surrounding <script> element.
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes }).replace(/</g, '\\u003c');
}
