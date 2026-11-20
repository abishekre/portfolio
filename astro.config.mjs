// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.abishekre.in',
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  devToolbar: { enabled: false },
});
