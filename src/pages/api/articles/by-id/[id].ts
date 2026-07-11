// src/pages/api/articles/by-id/[id].ts
// 功能：文章详情 API（按 ID） — GET 获取文章、PUT 更新、DELETE 删除
import type { APIRoute } from 'astro';
import { db, schema } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { calculateReadingTime } from '@/lib/utils';

export const GET: APIRoute = async ({ params }) => {
  try {
    const id = params?.id;
    if (!id) {
      return new Response(JSON.stringify({ error: '缺少文章 ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const articles = await db
      .select()
      .from(schema.articles)
      .where(eq(schema.articles.id, id))
      .limit(1);

    if (articles.length === 0) {
      return new Response(JSON.stringify({ error: '文章不存在' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ article: articles[0] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Article detail by id error:', error);
    return new Response(JSON.stringify({ error: '获取文章失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const PUT: APIRoute = async ({ request, locals, params }) => {
  try {
    const user = locals.user;
    if (!user) {
      return new Response(JSON.stringify({ error: '请先登录' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const id = params?.id;
    if (!id) {
      return new Response(JSON.stringify({ error: '缺少文章 ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    const { title, content, excerpt, coverImage, categoryId, lang, status } = body;

    const updateData: Record<string, any> = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) {
      updateData.content = content;
      updateData.readingTime = calculateReadingTime(content);
    }
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (coverImage !== undefined) updateData.coverImage = coverImage;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (lang !== undefined) updateData.lang = lang;
    if (status !== undefined) {
      updateData.status = status;
      if (status === 'published') {
        const existing = await db
          .select()
          .from(schema.articles)
          .where(eq(schema.articles.id, id))
          .limit(1);
        if (existing.length > 0 && !existing[0].publishedAt) {
          updateData.publishedAt = new Date();
        }
      }
    }
    updateData.updatedAt = new Date();

    await db.update(schema.articles).set(updateData).where(eq(schema.articles.id, id));

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Update article by id error:', error);
    return new Response(JSON.stringify({ error: '更新文章失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const DELETE: APIRoute = async ({ params, locals }) => {
  try {
    const user = locals.user;
    if (!user || (user.role !== 'admin' && user.role !== 'editor')) {
      return new Response(JSON.stringify({ error: '权限不足' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const id = params?.id;
    if (!id) {
      return new Response(JSON.stringify({ error: '缺少文章 ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await db.delete(schema.articles).where(eq(schema.articles.id, id));

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Delete article by id error:', error);
    return new Response(JSON.stringify({ error: '删除文章失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
