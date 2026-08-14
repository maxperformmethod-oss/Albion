// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// PUBLIC_SITE_URL → produkčný alias. Rovnako ako `resolveSiteUrl`
// v src/data/business.ts — dôvod, prečo tu nie je VERCEL_URL, je tam.
const site = process.env.PUBLIC_SITE_URL ?? 'https://albion-bf4w.vercel.app';

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'never',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    // Merané: externý štýl pridal render-blocking request a zhoršil FCP o 376 ms
    // aj LCP o ~130 ms. Inline zostáva. Pozri docs/REPORT_faza6_audit.md.
    inlineStylesheets: 'always',
  },
});
