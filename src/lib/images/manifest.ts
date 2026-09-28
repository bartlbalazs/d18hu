import { readFileSync } from 'node:fs';

export const ARCHIVE_DIR = 'src/assets/archive';
export const MANIFEST_PATH = `${ARCHIVE_DIR}/manifest.json`;

export type ArchiveImage = {
  originalUrl: string;
  file: string;
  sha256: string;
  width: number;
  height: number;
  contentType: string;
  fetchedAt: string;
};

export type ArchiveManifest = { images: ArchiveImage[] };

export function readManifest(path = MANIFEST_PATH): ArchiveManifest {
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as ArchiveManifest;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return { images: [] };
    throw error;
  }
}
