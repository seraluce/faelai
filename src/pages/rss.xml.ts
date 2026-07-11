// src/pages/rss.xml.ts
// 功能：RSS Feed 生成 — 从数据库读取已发布文章，生成标准 RSS 2.0 XML
import type { APIRoute } from 'astro';
import { db, schema } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';
import { siteConfig } from '@/config/site';

export const prerender = false;

export const GET: APIRoute = async () => {
  const articles = await db
    .select()
    .from(schema.articles)
    .where(eq(schema.articles.status, 'published'))
    .orderBy(desc(schema.articles.publishedAt))
    .limit(50);

  const siteUrl = siteConfig.url;

  const items = articles
    .map(
      (article) => `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${siteUrl}/news/${article.slug}</link>
      <description><![CDATA[${article.excerpt || article.description || ''}]]></description>
      <pubDate>${article.publishedAt ? new Date(article.publishedAt).toUTCString() : ''}</pubDate>
      <guid isPermaLink="true">${siteUrl}/news/${article.slug}</guid>
      ${article.coverImage ? `<enclosure url="${article.coverImage}" type="image/jpeg" />` : ''}
    </item>`
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteConfig.name}</title>
    <link>${siteUrl}</link>
    <description>${siteConfig.description}</description>
    <language>zh-CN</language>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};
