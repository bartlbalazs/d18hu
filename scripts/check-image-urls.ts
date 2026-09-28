// Reports whether the original archive image URLs still respond (run: pnpm images:check).
// Report only: builds use the committed copies and never depend on this check.
import { readManifest } from '../src/lib/images/manifest.ts';

const { images } = readManifest();
let unreachable = 0;

for (const image of images) {
  let status: string;
  try {
    const response = await fetch(image.originalUrl, { method: 'HEAD', redirect: 'follow' });
    const contentType = response.headers.get('content-type') ?? '';
    const ok = response.ok && contentType.startsWith('image/');
    status = ok ? 'ok' : `HTTP ${response.status} ${contentType}`;
    if (!ok) unreachable += 1;
  } catch (error) {
    status = `failed: ${(error as Error).message}`;
    unreachable += 1;
  }
  console.log(`${status.padEnd(12)} ${image.originalUrl}`);
}

console.log(`\n${images.length - unreachable}/${images.length} original image URLs reachable.`);
if (unreachable > 0) process.exitCode = 1;
