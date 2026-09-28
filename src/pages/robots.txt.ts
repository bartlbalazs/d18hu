import type { APIRoute } from 'astro';
import { loadSiteData } from '../lib/site-data.ts';

export const GET: APIRoute = ({ site }) => {
  const body = loadSiteData().isDraft
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap.xml', site).href}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
