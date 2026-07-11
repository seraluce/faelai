// src/pages/api/categories/index.ts
// 功能：分类列表 API — GET 获取所有分类、POST 创建分类
import type { APIRoute } from 'astro';
import { db, schema } from '@/lib/db';
import { asc } from 'drizzle-orm';
import { generateId } from '@/lib/utils';

export const GET: APIRoute = async () => {
  try {
    const categories = await db
      .select()
      .from(schema.categories)
      .orderBy(asc(schema.categories.sortOrder));

    return new Response(JSON.stringify({ categories }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Categories list error:', error);
    return new Response(JSON.stringify({ error: '获取分类列表失败' }), {
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
    const { name, nameEn, slug, description, icon, color, sortOrder } = body;

    if (!name || !slug) {
      return new Response(JSON.stringify({ error: '名称和标识不能为空' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const id = generateId();
    await db.insert(schema.categories).values({
      id,
      name,
      nameEn,
      slug,
      description,
      icon,
      color,
      sortOrder: sortOrder || 0,
    });

    return new Response(JSON.stringify({ success: true, id }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Create category error:', error);
    return new Response(JSON.stringify({ error: '创建分类失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
