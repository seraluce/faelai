// src/pages/api/feeds/index.ts
// 功能：RSS 源管理 API — GET 获取列表、POST 创建、PUT 更新、DELETE 删除
import type { APIRoute } from 'astro';
import { db, schema } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { generateId } from '@/lib/utils';

export const GET: APIRoute = async () => {
  try {
    const feeds = await db.select().from(schema.feeds);
    return new Response(JSON.stringify({ feeds }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Feeds list error:', error);
    return new Response(JSON.stringify({ error: '获取 RSS 源列表失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const user = locals.user;
    if (!user || user.role !== 'admin') {
      return new Response(JSON.stringify({ error: '权限不足' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const body = await request.json();
    const { name, url, siteUrl, description, lang, categoryId, fetchInterval } = body;
    if (!name || !url) {
      return new Response(JSON.stringify({ error: '名称和 URL 不能为空' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const id = generateId();
    await db.insert(schema.feeds).values({
      id,
      name,
      url,
      siteUrl,
      description,
      lang,
      categoryId,
      fetchInterval: fetchInterval || 3600,
    });
    return new Response(JSON.stringify({ success: true, id }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Create feed error:', error);
    return new Response(JSON.stringify({ error: '创建 RSS 源失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const PUT: APIRoute = async ({ request, locals }) => {
  try {
    const user = locals.user;
    if (!user || user.role !== 'admin') {
      return new Response(JSON.stringify({ error: '权限不足' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const body = await request.json();
    const { id, name, url, siteUrl, description, lang, categoryId, isActive, fetchInterval } = body;
    if (!id) {
      return new Response(JSON.stringify({ error: '缺少 RSS 源 ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const updateData: Record<string, any> = {};
    if (name !== undefined) updateData.name = name;
    if (url !== undefined) updateData.url = url;
    if (siteUrl !== undefined) updateData.siteUrl = siteUrl;
    if (description !== undefined) updateData.description = description;
    if (lang !== undefined) updateData.lang = lang;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (fetchInterval !== undefined) updateData.fetchInterval = fetchInterval;
    await db.update(schema.feeds).set(updateData).where(eq(schema.feeds.id, id));
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Update feed error:', error);
    return new Response(JSON.stringify({ error: '更新 RSS 源失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const DELETE: APIRoute = async ({ request, locals }) => {
  try {
    const user = locals.user;
    if (!user || user.role !== 'admin') {
      return new Response(JSON.stringify({ error: '权限不足' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const body = await request.json();
    const { id } = body;
    if (!id) {
      return new Response(JSON.stringify({ error: '缺少 RSS 源 ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    await db.delete(schema.feeds).where(eq(schema.feeds.id, id));
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Delete feed error:', error);
    return new Response(JSON.stringify({ error: '删除 RSS 源失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
