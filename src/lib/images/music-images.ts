import type { ImageMetadata } from 'astro';

const musicModules = import.meta.glob<{ default: ImageMetadata }>('/src/assets/music/*.{jpg,jpeg,png,webp}', {
  eager: true,
});

export function musicImageMetadata(file: string): ImageMetadata {
  const module = musicModules[`/src/assets/music/${file}`];
  if (!module) throw new Error(`music image ${file} is named in editorial/music.yaml but not in src/assets/music/`);
  return module.default;
}
