// src/pages/api/auth/update-profile.ts
// 功能：更新个人资料 API — POST 修改全名、用户名，校验用户名唯一性
import type { APIRoute } from 'astro';
import { db, schema } from '@/lib/db';
import { eq, and, ne } from 'drizzle-orm';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const user = locals.user;
    if (!user) {
      return new Response(JSON.stringify({ error: '未登录' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    const { fullName, username } = body;

    if (username !== undefined && (!username || username.length < 3)) {
      return new Response(JSON.stringify({ error: '用户名至少需要 3 个字符' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (username && username !== user.username) {
      const existing = await db
        .select()
        .from(schema.users)
        .where(and(eq(schema.users.username, username), ne(schema.users.id, user.id)))
        .limit(1);

      if (existing.length > 0) {
        return new Response(JSON.stringify({ error: '该用户名已被使用' }), {
          status: 409,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (fullName !== undefined) updateData.fullName = fullName;
    if (username !== undefined) updateData.username = username;

    await db.update(schema.users).set(updateData).where(eq(schema.users.id, user.id));

    const updatedUsers = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, user.id))
      .limit(1);

    const updated = updatedUsers[0];

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: updated.id,
          email: updated.email,
          username: updated.username,
          fullName: updated.fullName,
          avatarUrl: updated.avatarUrl,
          role: updated.role,
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Update profile error:', error);
    return new Response(JSON.stringify({ error: '更新资料失败，请稍后重试' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
