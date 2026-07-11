// src/pages/sitemap.xml.ts
// 功能：Sitemap 生成 — 动态页面 + 文章页面
import type { APIRoute } from 'astro';
import { db, schema } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { siteConfig } from '@/config/site';

export const GET: APIRoute = async () => {
  const siteUrl = siteConfig.url;

  // Static pages
  const staticPages = [
    '',
    '/news',
    '/trending',
    '/hot',
    '/search',
    '/about',
    '/privacy',
    '/terms',
    '/disclaimer',
    '/en',
    '/en/news',
    '/en/trending',
    '/en/hot',
    '/en/search',
    '/en/about',
    '/en/privacy',
    '/en/terms',
    '/en/disclaimer',
  ];

  // Published articles
  const articles = await db
    .select({
      slug: schema.articles.slug,
      lang: schema.articles.lang,
      updatedAt: schema.articles.updatedAt,
    })
    .from(schema.articles)
    .where(eq(schema.articles.status, 'published'));

  const urls = [
    ...staticPages.map(
      (page) => `
    <url>
      <loc>${siteUrl}${page}</loc>
      <changefreq>daily</changefreq>
      <priority>${page === '' ? '1.0' : '0.8'}</priority>
    </url>`
    ),
    ...articles.map(
      (article) => `
    <url>
      <loc>${siteUrl}/news/${article.slug}</loc>
      <lastmod>${article.updatedAt ? new Date(article.updatedAt).toISOString() : ''}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.6</priority>
    </url>`
    ),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.join('')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
