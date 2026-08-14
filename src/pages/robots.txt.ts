import type { APIRoute } from 'astro';

// Generované, nie statické: doména prichádza z PUBLIC_SITE_URL, takže sitemap
// URL sa nedá napísať natvrdo. Pozri PLAN.md §6.
export const GET: APIRoute = ({ site }) => {
  const lines = ['User-agent: *', 'Allow: /'];

  if (site) {
    lines.push('', `Sitemap: ${new URL('sitemap-index.xml', site).href}`);
  }

  return new Response(`${lines.join('\n')}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
