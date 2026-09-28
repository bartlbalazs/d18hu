// @ts-check
import { defineConfig } from 'astro/config';
import { resolveSiteUrl } from './src/lib/build-mode.ts';

export default defineConfig({
  site: resolveSiteUrl(),
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'always' },
  devToolbar: { enabled: false },
  // Pre-bundle the viewer up front: it is imported lazily, and a dependency Vite only discovers
  // on the first click makes the dev server re-bundle and answer the stale request with 504.
  vite: { optimizeDeps: { include: ['photoswipe', 'photoswipe/lightbox'] } },
});
