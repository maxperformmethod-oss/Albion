// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Doména príde od klienta. Kým nie je, staviame na localhost, aby sitemap
// a absolútne OG URL mali z čoho vychádzať. Pozri PLAN.md §5.
const site = process.env.PUBLIC_SITE_URL ?? 'http://localhost:4321';

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'never',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    inlineStylesheets: 'always',
  },
});
