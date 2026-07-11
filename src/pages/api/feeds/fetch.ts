// src/pages/api/feeds/fetch.ts
// 功能：RSS 自动抓取 API -- POST 触发抓取指定或全部 RSS 源并导入文章
import type { APIRoute } from 'astro';
import { db, schema } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { fetchRSSFeed } from '@/lib/rss';
import { generateId, calculateReadingTime } from '@/lib/utils';

async function fetchSingleFeed(feed: typeof schema.feeds.$inferSelect) {
  try {
    const rssFeed = await fetchRSSFeed(feed.url);
    let imported = 0;

    for (const item of rssFeed.items) {
      if (!item.link) continue;

      const existing = await db
        .select({ id: schema.articles.id })
        .from(schema.articles)
        .where(eq(schema.articles.sourceUrl, item.link))
        .limit(1);

      if (existing.length > 0) continue;

      const id = generateId();
      const slug =
        feed.lang === 'zh'
          ? item.title
              .toLowerCase()
              .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
              .replace(/^-+|-+$/g, '') +
            '-' +
            id.slice(0, 8)
          : item.title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-+|-+$/g, '') +
            '-' +
            id.slice(0, 8);

      const content = item.content || item.description || '';
      const readingTime = calculateReadingTime(content);
      const pubDate = item.pubDate ? new Date(item.pubDate) : new Date();

      await db.insert(schema.articles).values({
        id,
        slug,
        title: item.title,
        description: item.description,
        content,
        excerpt: item.description?.slice(0, 200),
        author: item.author || feed.name,
        sourceName: feed.name,
        sourceUrl: item.link,
        sourceFeedId: feed.id,
        categoryId: feed.categoryId,
        lang: feed.lang || 'en',
        status: 'published',
        readingTime,
        publishedAt: pubDate,
      });

      imported++;
    }

    await db
      .update(schema.feeds)
      .set({ lastFetchedAt: new Date(), lastError: null })
      .where(eq(schema.feeds.id, feed.id));

    return { success: true, feedName: feed.name, imported };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await db
      .update(schema.feeds)
      .set({ lastFetchedAt: new Date(), lastError: message })
      .where(eq(schema.feeds.id, feed.id));

    return { success: false, feedName: feed.name, imported: 0, error: message };
  }
}

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const user = locals.user;
    if (!user || (user.role !== 'admin' && user.role !== 'editor')) {
      return new Response(JSON.stringify({ error: '权限不足' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json().catch(() => ({}));
    const { feedId } = body as { feedId?: string };

    if (feedId) {
      const feeds = await db
        .select()
        .from(schema.feeds)
        .where(eq(schema.feeds.id, feedId))
        .limit(1);

      if (feeds.length === 0) {
        return new Response(JSON.stringify({ error: 'RSS 源不存在' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const result = await fetchSingleFeed(feeds[0]);
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const feeds = await db.select().from(schema.feeds).where(eq(schema.feeds.isActive, true));

    if (feeds.length === 0) {
      return new Response(JSON.stringify({ success: true, results: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const results = await Promise.all(feeds.map((feed) => fetchSingleFeed(feed)));

    return new Response(JSON.stringify({ success: true, results }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('RSS fetch error:', error);
    return new Response(JSON.stringify({ error: 'RSS 抓取失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
