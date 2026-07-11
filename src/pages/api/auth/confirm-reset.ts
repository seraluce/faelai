// src/pages/api/auth/confirm-reset.ts
// 功能：密码重置确认 API — POST 使用 token 验证并设置新密码（数据库存储）
import type { APIRoute } from 'astro';
import { db, schema } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { hashPassword } from '@/lib/auth';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return new Response(JSON.stringify({ error: '缺少令牌或密码' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (password.length < 8) {
      return new Response(JSON.stringify({ error: '密码长度不能少于8位' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const records = await db
      .select()
      .from(schema.passwordResets)
      .where(eq(schema.passwordResets.token, token))
      .limit(1);

    if (records.length === 0) {
      return new Response(JSON.stringify({ error: '无效的重置令牌' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const stored = records[0];

    if (Date.now() > stored.expiresAt.getTime()) {
      await db.delete(schema.passwordResets).where(eq(schema.passwordResets.token, token));
      return new Response(JSON.stringify({ error: '令牌已过期，请重新申请' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const passwordHash = await hashPassword(password);
    await db
      .update(schema.userPasswords)
      .set({ passwordHash })
      .where(eq(schema.userPasswords.userId, stored.userId));

    await db.delete(schema.passwordResets).where(eq(schema.passwordResets.token, token));

    return new Response(JSON.stringify({ success: true, message: '密码已重置成功' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Confirm reset error:', error);
    return new Response(JSON.stringify({ error: '重置失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
