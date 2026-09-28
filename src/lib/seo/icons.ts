import { readFileSync } from 'node:fs';
import sharp from 'sharp';

/** PNG app icons rendered at build time from the committed SVG favicon. */
export async function renderIconPng(size: number): Promise<Response> {
  const png = await sharp(readFileSync('public/favicon.svg'), { density: 72 * (size / 64) })
    .resize(size, size)
    .png()
    .toBuffer();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
}
