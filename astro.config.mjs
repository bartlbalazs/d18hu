// @ts-check
import { defineConfig } from 'astro/config';
import { resolveSiteUrl } from './src/lib/build-mode.ts';

export default defineConfig({
  site: resolveSiteUrl(),
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'always' },
  devToolbar: { enabled: false },
});
