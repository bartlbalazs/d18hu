// Downloads new or changed "Kép URL" images into the repository (run: pnpm images:fetch).
// Regular builds never touch the network; they only read the committed files and manifest.
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';
import {
  ARCHIVE_DIR,
  MANIFEST_PATH,
  readManifest,
  type ArchiveImage,
} from '../src/lib/images/manifest.ts';
import { parseTimeline } from '../src/lib/timeline/parse.ts';
import { TIMELINE_PATH } from '../src/lib/site-data.ts';

const EXTENSION_BY_FORMAT: Record<string, { ext: string; contentType: string }> = {
  jpeg: { ext: 'jpg', contentType: 'image/jpeg' },
  png: { ext: 'png', contentType: 'image/png' },
  webp: { ext: 'webp', contentType: 'image/webp' },
};

class ImageFetchError extends Error {
  constructor(eventId: string, url: string, reason: string) {
    super(`${eventId}  ${url}\n    ${reason}`);
    this.name = 'ImageFetchError';
  }
}

function sha256(data: Buffer | string): string {
  return createHash('sha256').update(data).digest('hex');
}

/** e.g. https://…/fortepan_82508.jpg → fortepan-82508-<hash8>.jpg */
function fileNameFor(url: string, ext: string): string {
  const urlHash = sha256(url).slice(0, 8);
  const archiveMatch = /\/([a-z]+)_(\d+)\.[a-z]+$/i.exec(new URL(url).pathname);
  const stem = archiveMatch ? `${archiveMatch[1].toLowerCase()}-${archiveMatch[2]}` : 'img';
  return `${stem}-${urlHash}.${ext}`;
}

async function download(eventId: string, url: string): Promise<{ bytes: Buffer; format: string; width: number; height: number }> {
  let response: Response;
  try {
    response = await fetch(url, { redirect: 'follow' });
  } catch (error) {
    throw new ImageFetchError(eventId, url, `request failed: ${(error as Error).message}`);
  }
  if (response.status !== 200) throw new ImageFetchError(eventId, url, `HTTP ${response.status}`);
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.startsWith('image/')) {
    throw new ImageFetchError(eventId, url, `not an image (content-type "${contentType}")`);
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  const metadata = await sharp(bytes)
    .metadata()
    .catch((error: Error) => {
      throw new ImageFetchError(eventId, url, `file does not decode as an image: ${error.message}`);
    });
  if (!metadata.format || !EXTENSION_BY_FORMAT[metadata.format] || !metadata.width || !metadata.height) {
    throw new ImageFetchError(eventId, url, `unsupported image format "${metadata.format}"`);
  }
  return { bytes, format: metadata.format, width: metadata.width, height: metadata.height };
}

async function main(): Promise<void> {
  const { events } = parseTimeline(readFileSync(TIMELINE_PATH, 'utf8'));
  const manifest = readManifest();
  const byUrl = new Map(manifest.images.map((image) => [image.originalUrl, image]));
  const byContentHash = new Map(manifest.images.map((image) => [image.sha256, image]));
  mkdirSync(ARCHIVE_DIR, { recursive: true });

  const wanted = new Map<string, string>();
  for (const event of events) {
    if (event.originalImageUrl && !wanted.has(event.originalImageUrl)) {
      wanted.set(event.originalImageUrl, event.id);
    }
  }

  const failures: ImageFetchError[] = [];
  let added = 0;
  for (const [url, eventId] of wanted) {
    const existing = byUrl.get(url);
    if (existing && existsSync(`${ARCHIVE_DIR}/${existing.file}`)) continue;
    try {
      const image = await download(eventId, url);
      const contentHash = sha256(image.bytes);
      const { ext, contentType } = EXTENSION_BY_FORMAT[image.format];
      const sameContent = byContentHash.get(contentHash);
      const file = sameContent?.file ?? fileNameFor(url, ext);
      if (!sameContent) writeFileSync(`${ARCHIVE_DIR}/${file}`, image.bytes);
      const entry: ArchiveImage = {
        originalUrl: url,
        file,
        sha256: contentHash,
        width: image.width,
        height: image.height,
        contentType,
        fetchedAt: new Date().toISOString(),
      };
      byUrl.set(url, entry);
      byContentHash.set(contentHash, entry);
      added += 1;
      console.log(`fetched  ${eventId}  → ${file} (${image.width}×${image.height})`);
    } catch (error) {
      if (error instanceof ImageFetchError) failures.push(error);
      else throw error;
    }
  }

  const images = [...byUrl.values()]
    .filter((image) => wanted.has(image.originalUrl))
    .sort((a, b) => a.file.localeCompare(b.file));
  writeFileSync(MANIFEST_PATH, `${JSON.stringify({ images }, null, 2)}\n`);

  const referencedFiles = new Set(images.map((image) => image.file));
  const unreferenced = readdirSync(ARCHIVE_DIR).filter(
    (file) => file !== 'manifest.json' && !referencedFiles.has(file),
  );
  for (const file of unreferenced) {
    console.warn(`unreferenced  ${ARCHIVE_DIR}/${file}  (no Kép URL uses it any more; delete it)`);
  }

  console.log(`${added} image(s) fetched, ${images.length} in manifest.`);
  if (failures.length > 0) {
    console.error(`\n${failures.length} image(s) could not be fetched:\n  ${failures.map((f) => f.message).join('\n  ')}`);
    process.exitCode = 1;
  }
}

await main();
