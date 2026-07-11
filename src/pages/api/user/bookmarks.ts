// src/pages/api/user/bookmarks.ts
// 功能：用户收藏列表 API — GET 获取当前用户收藏的文章，支持分页
import type { APIRoute } from 'astro';
import { db, schema } from '@/lib/db';
import { eq, desc, sql } from 'drizzle-orm';

export const GET: APIRoute = async ({ url, locals }) => {
  try {
    const user = locals.user;
    if (!user) {
      return new Response(JSON.stringify({ error: '未登录' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    const articles = await db
      .select({
        id: schema.articles.id,
        slug: schema.articles.slug,
        title: schema.articles.title,
        description: schema.articles.description,
        excerpt: schema.articles.excerpt,
        coverImage: schema.articles.coverImage,
        author: schema.articles.author,
        sourceName: schema.articles.sourceName,
        sourceUrl: schema.articles.sourceUrl,
        lang: schema.articles.lang,
        status: schema.articles.status,
        isFeatured: schema.articles.isFeatured,
        isBreaking: schema.articles.isBreaking,
        viewCount: schema.articles.viewCount,
        likeCount: schema.articles.likeCount,
        commentCount: schema.articles.commentCount,
        readingTime: schema.articles.readingTime,
        publishedAt: schema.articles.publishedAt,
        createdAt: schema.articles.createdAt,
        categoryId: schema.articles.categoryId,
        bookmarkedAt: schema.userBookmarks.createdAt,
      })
      .from(schema.userBookmarks)
      .innerJoin(schema.articles, eq(schema.userBookmarks.articleId, schema.articles.id))
      .where(eq(schema.userBookmarks.userId, user.id))
      .orderBy(desc(schema.userBookmarks.createdAt))
      .limit(limit)
      .offset(offset);

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(schema.userBookmarks)
      .where(eq(schema.userBookmarks.userId, user.id));

    const total = countResult[0]?.count || 0;

    return new Response(
      JSON.stringify({
        articles,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Bookmarks list error:', error);
    return new Response(JSON.stringify({ error: '获取收藏列表失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
