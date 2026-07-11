// src/pages/sitemap.xml.ts
// 功能：Sitemap 生成 — 按需渲染，生成所有静态页面的 XML Sitemap
import type { APIRoute } from 'astro';
import { siteConfig } from '@/config/site';

const staticPages = ['/', '/news', '/trending', '/hot', '/about', '/search'];

const enPages = staticPages.map((p) => `/en${p}`);

export const GET: APIRoute = () => {
  const urls = [...staticPages, ...enPages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${siteConfig.url}${url}</loc>
    <changefreq>daily</changefreq>
    <priority>${url === '/' ? '1.0' : '0.8'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
