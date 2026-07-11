// src/pages/api/users/index.ts
// 功能：用户管理 API — GET 获取用户列表、PUT 更新用户角色/封禁状态
import type { APIRoute } from 'astro';
import { db, schema } from '@/lib/db';
import { eq, sql } from 'drizzle-orm';

export const GET: APIRoute = async ({ url, locals }) => {
  try {
    const user = locals.user;
    if (!user || user.role !== 'admin') {
      return new Response(JSON.stringify({ error: '权限不足' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    const users = await db
      .select({
        id: schema.users.id,
        email: schema.users.email,
        username: schema.users.username,
        fullName: schema.users.fullName,
        avatarUrl: schema.users.avatarUrl,
        role: schema.users.role,
        emailVerified: schema.users.emailVerified,
        isBlocked: schema.users.isBlocked,
        createdAt: schema.users.createdAt,
      })
      .from(schema.users)
      .limit(limit)
      .offset(offset);

    const countResult = await db.select({ count: sql<number>`count(*)` }).from(schema.users);
    const total = countResult[0]?.count || 0;

    return new Response(
      JSON.stringify({
        users,
        pagination: { page, limit, total, totalPages: Math.ceil(Number(total) / limit) },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Users list error:', error);
    return new Response(JSON.stringify({ error: '获取用户列表失败' }), {
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
    const { id, role, isBlocked } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: '缺少用户 ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const updateData: Record<string, any> = {};
    if (role !== undefined) updateData.role = role;
    if (isBlocked !== undefined) updateData.isBlocked = isBlocked;
    updateData.updatedAt = new Date();

    await db.update(schema.users).set(updateData).where(eq(schema.users.id, id));

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Update user error:', error);
    return new Response(JSON.stringify({ error: '更新用户失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
