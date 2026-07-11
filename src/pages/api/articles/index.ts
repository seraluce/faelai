import type { APIRoute } from 'astro';
import { db, schema } from '@/lib/db';
import { eq, desc, and, sql } from 'drizzle-orm';

export const GET: APIRoute = async ({ url }) => {
  try {
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const category = url.searchParams.get('category');
    const tag = url.searchParams.get('tag');
    const status = url.searchParams.get('status') || 'published';
    const lang = url.searchParams.get('lang');
    const search = url.searchParams.get('search');
    const offset = (page - 1) * limit;

    let query = db
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
      })
      .from(schema.articles)
      .orderBy(desc(schema.articles.publishedAt))
      .limit(limit)
      .offset(offset);

    const conditions = [];

    if (status) {
      conditions.push(eq(schema.articles.status, status));
    }
    if (lang) {
      conditions.push(eq(schema.articles.lang, lang));
    }
    if (category) {
      conditions.push(eq(schema.articles.categoryId, category));
    }
    if (search) {
      conditions.push(sql`${schema.articles.title} LIKE ${'%' + search + '%'}`);
    }

    if (conditions.length > 0) {
      query = db
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
        })
        .from(schema.articles)
        .where(and(...conditions))
        .orderBy(desc(schema.articles.publishedAt))
        .limit(limit)
        .offset(offset);
    }

    const articles = await query;

    // Get total count
    const countConditions = [...conditions];
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(schema.articles)
      .where(countConditions.length > 0 ? and(...countConditions) : undefined);

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
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Articles list error:', error);
    return new Response(JSON.stringify({ error: '获取文章列表失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
