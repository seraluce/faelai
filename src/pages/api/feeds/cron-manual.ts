// src/pages/api/feeds/cron-manual.ts
// 功能：RSS 手动触发定时抓取 — POST 管理员从后台面板触发全量抓取
import type { APIRoute } from 'astro';
import { db, schema } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { fetchRSSFeed } from '@/lib/rss';
import { generateId, calculateReadingTime } from '@/lib/utils';

let lastRun = 0;

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

export const POST: APIRoute = async ({ locals }) => {
  const user = locals.user;
  if (!user || user.role !== 'admin') {
    return new Response(JSON.stringify({ error: '权限不足，仅管理员可操作' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const now = Date.now();
  if (now - lastRun < 60_000) {
    return new Response(JSON.stringify({ error: '过于频繁，每分钟最多执行一次' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  lastRun = now;

  try {
    const feeds = await db.select().from(schema.feeds).where(eq(schema.feeds.isActive, true));

    const nowMs = Date.now();
    const pending = feeds.filter((feed) => {
      if (!feed.lastFetchedAt) return true;
      return nowMs - feed.lastFetchedAt.getTime() > (feed.fetchInterval ?? 3600) * 1000;
    });

    if (pending.length === 0) {
      return new Response(
        JSON.stringify({
          fetched: 0,
          failed: 0,
          skipped: feeds.length,
          details: [],
          message: '所有 RSS 源尚未到期，无需抓取',
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const results = await Promise.allSettled(pending.map((feed) => fetchSingleFeed(feed)));

    let fetched = 0;
    let failed = 0;
    const details: { feedName: string; success: boolean; imported?: number; error?: string }[] = [];

    for (const result of results) {
      if (result.status === 'fulfilled') {
        const r = result.value;
        if (r.success) {
          fetched++;
          details.push({ feedName: r.feedName, success: true, imported: r.imported });
        } else {
          failed++;
          details.push({ feedName: r.feedName, success: false, error: r.error });
        }
      } else {
        failed++;
        details.push({
          feedName: '未知',
          success: false,
          error: result.reason?.message ?? String(result.reason),
        });
      }
    }

    return new Response(
      JSON.stringify({
        fetched,
        failed,
        skipped: feeds.length - pending.length,
        details,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('RSS manual cron error:', error);
    return new Response(JSON.stringify({ error: '手动触发抓取失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
