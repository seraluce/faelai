// src/pages/api/auth/update-password.ts
// 功能：修改密码 API — POST 验证当前密码后更新为新密码
import type { APIRoute } from 'astro';
import { db, schema } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { verifyPassword, hashPassword } from '@/lib/auth';

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
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return new Response(JSON.stringify({ error: '请填写当前密码和新密码' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (newPassword.length < 8) {
      return new Response(JSON.stringify({ error: '新密码至少需要 8 个字符' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const passwords = await db
      .select()
      .from(schema.userPasswords)
      .where(eq(schema.userPasswords.userId, user.id))
      .limit(1);

    if (passwords.length === 0) {
      return new Response(JSON.stringify({ error: '未设置密码，请联系管理员' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const valid = await verifyPassword(currentPassword, passwords[0].passwordHash);
    if (!valid) {
      return new Response(JSON.stringify({ error: '当前密码错误' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const newHash = await hashPassword(newPassword);
    await db
      .update(schema.userPasswords)
      .set({ passwordHash: newHash })
      .where(eq(schema.userPasswords.userId, user.id));

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Update password error:', error);
    return new Response(JSON.stringify({ error: '修改密码失败，请稍后重试' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
