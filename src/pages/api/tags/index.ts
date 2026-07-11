// src/pages/api/tags/index.ts
// 功能：标签列表 API — GET 获取所有标签、POST 创建标签、PUT 更新、DELETE 删除
import type { APIRoute } from 'astro';
import { db, schema } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { generateId } from '@/lib/utils';

export const GET: APIRoute = async () => {
  try {
    const tags = await db.select().from(schema.tags);
    return new Response(JSON.stringify({ tags }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Tags list error:', error);
    return new Response(JSON.stringify({ error: '获取标签列表失败' }), {
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
    const { name, slug } = body;
    if (!name || !slug) {
      return new Response(JSON.stringify({ error: '名称和标识不能为空' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const id = generateId();
    await db.insert(schema.tags).values({ id, name, slug });
    return new Response(JSON.stringify({ success: true, id }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Create tag error:', error);
    return new Response(JSON.stringify({ error: '创建标签失败' }), {
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
    const { id, name, slug } = body;
    if (!id) {
      return new Response(JSON.stringify({ error: '缺少标签 ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const updateData: Record<string, any> = {};
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;
    await db.update(schema.tags).set(updateData).where(eq(schema.tags.id, id));
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Update tag error:', error);
    return new Response(JSON.stringify({ error: '更新标签失败' }), {
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
      return new Response(JSON.stringify({ error: '缺少标签 ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    await db.delete(schema.tags).where(eq(schema.tags.id, id));
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Delete tag error:', error);
    return new Response(JSON.stringify({ error: '删除标签失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
