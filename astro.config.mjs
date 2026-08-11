// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
// GitHub Pages 배포 주소: https://ellencia.github.io/wine_app/
export default defineConfig({
  site: 'https://ellencia.github.io',
  base: '/wine_app',
  integrations: [sitemap()],
});
