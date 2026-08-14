// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Doména ešte nie je známa: PUBLIC_SITE_URL → VERCEL_URL → localhost.
// Rovnaké poradie ako `resolveSiteUrl` v src/data/business.ts.
const site =
  process.env.PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ??
  'http://localhost:4321';

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
