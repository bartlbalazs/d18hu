import type { APIRoute } from 'astro';
import { loadSiteData } from '../lib/site-data.ts';

export const GET: APIRoute = ({ site }) => {
  const { site: editorial } = loadSiteData();
  const paths = ['/', '/irasok/', '/impresszum/', ...editorial.articles.map((article) => `/irasok/${article.slug}/`)];
  const urls = paths.map((path) => `  <url><loc>${new URL(path, site).href}</loc></url>`).join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
