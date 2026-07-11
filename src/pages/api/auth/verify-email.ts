// src/pages/api/auth/verify-email.ts
// 功能：邮箱验证 API — POST 根据令牌查找验证记录、标记邮箱为已验证、删除令牌
import type { APIRoute } from 'astro';
import { db, schema } from '@/lib/db';
import { eq } from 'drizzle-orm';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return new Response(JSON.stringify({ error: '请提供验证令牌' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const records = await db
      .select()
      .from(schema.emailVerifications)
      .where(eq(schema.emailVerifications.token, token))
      .limit(1);

    if (records.length === 0) {
      return new Response(JSON.stringify({ error: '验证令牌无效' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const record = records[0];

    if (Date.now() > record.expiresAt.getTime()) {
      await db.delete(schema.emailVerifications).where(eq(schema.emailVerifications.token, token));
      return new Response(JSON.stringify({ error: '验证令牌已过期' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const users = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, record.userId))
      .limit(1);

    if (users.length === 0) {
      await db.delete(schema.emailVerifications).where(eq(schema.emailVerifications.token, token));
      return new Response(JSON.stringify({ error: '用户不存在' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (users[0].emailVerified) {
      await db.delete(schema.emailVerifications).where(eq(schema.emailVerifications.token, token));
      return new Response(JSON.stringify({ success: true, message: '邮箱已经验证过' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await db
      .update(schema.users)
      .set({ emailVerified: true, updatedAt: new Date() })
      .where(eq(schema.users.id, record.userId));

    await db.delete(schema.emailVerifications).where(eq(schema.emailVerifications.token, token));

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Verify email error:', error);
    return new Response(JSON.stringify({ error: '邮箱验证失败，请稍后重试' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
