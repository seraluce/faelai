// src/pages/api/articles/[slug].ts
// 功能：文章详情 API — GET 获取文章（浏览量+1）、PUT 更新、DELETE 删除
import type { APIRoute } from 'astro';
import { db, schema } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { generateId, calculateReadingTime } from '@/lib/utils';

export const GET: APIRoute = async ({ params }) => {
  try {
    const slug = params?.slug;
    if (!slug) {
      return new Response(JSON.stringify({ error: '缺少文章 slug' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const articles = await db
      .select()
      .from(schema.articles)
      .where(eq(schema.articles.slug, slug))
      .limit(1);

    if (articles.length === 0) {
      return new Response(JSON.stringify({ error: '文章不存在' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const article = articles[0];

    // Increment view count
    await db
      .update(schema.articles)
      .set({ viewCount: (article.viewCount || 0) + 1 })
      .where(eq(schema.articles.id, article.id));

    return new Response(
      JSON.stringify({ article: { ...article, viewCount: (article.viewCount || 0) + 1 } }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Article detail error:', error);
    return new Response(JSON.stringify({ error: '获取文章失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const user = locals.user;
    if (!user) {
      return new Response(JSON.stringify({ error: '请先登录' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    const { title, content, excerpt, coverImage, categoryId, lang, status } = body;

    if (!title) {
      return new Response(JSON.stringify({ error: '标题不能为空' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const id = generateId();
    const slug =
      title
        .toLowerCase()
        .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
        .replace(/^-+|-+$/g, '') +
      '-' +
      id.slice(0, 8);
    const readingTime = content ? calculateReadingTime(content) : undefined;

    await db.insert(schema.articles).values({
      id,
      slug,
      title,
      content,
      excerpt,
      coverImage,
      authorId: user.id,
      author: user.fullName || user.username,
      categoryId,
      lang: lang || 'zh',
      status: status || 'draft',
      readingTime,
      publishedAt: status === 'published' ? new Date() : null,
    });

    return new Response(JSON.stringify({ success: true, id, slug }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Create article error:', error);
    return new Response(JSON.stringify({ error: '创建文章失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const PUT: APIRoute = async ({ request, locals, params: _params }) => {
  try {
    const user = locals.user;
    if (!user) {
      return new Response(JSON.stringify({ error: '请先登录' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    const { id, title, content, excerpt, coverImage, categoryId, lang, status } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: '缺少文章 ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

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
      if (status === 'published' && !updateData.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }
    updateData.updatedAt = new Date();

    await db.update(schema.articles).set(updateData).where(eq(schema.articles.id, id));

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Update article error:', error);
    return new Response(JSON.stringify({ error: '更新文章失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const DELETE: APIRoute = async ({ request, locals }) => {
  try {
    const user = locals.user;
    if (!user || (user.role !== 'admin' && user.role !== 'editor')) {
      return new Response(JSON.stringify({ error: '权限不足' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    const { id } = body;

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
    console.error('Delete article error:', error);
    return new Response(JSON.stringify({ error: '删除文章失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
