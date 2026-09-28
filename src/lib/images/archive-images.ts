import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';

const archiveModules = import.meta.glob<{ default: ImageMetadata }>('/src/assets/archive/*.{jpg,png,webp}', {
  eager: true,
});

export function archiveImageMetadata(file: string): ImageMetadata {
  const module = archiveModules[`/src/assets/archive/${file}`];
  if (!module) throw new Error(`archive image ${file} is in manifest.json but not in src/assets/archive/`);
  return module.default;
}

/** Locally served large version for the zoom viewer and the no-JS link; never upscaled. */
export async function fullSizeImage(src: ImageMetadata, maxEdge = 2400) {
  const scale = Math.min(1, maxEdge / Math.max(src.width, src.height));
  const width = Math.round(src.width * scale);
  const height = Math.round(src.height * scale);
  const image = await getImage({ src, width, height, format: 'webp', quality: 82 });
  return { src: image.src, width, height };
}
