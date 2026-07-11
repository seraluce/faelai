// src/pages/api/auth/update-email.ts
// 功能：修改邮箱 API — POST 验证密码后更新用户邮箱
import type { APIRoute } from 'astro';
import { db, schema } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { verifyPassword } from '@/lib/auth';

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
    const { newEmail, password } = body;

    if (!newEmail || !password) {
      return new Response(JSON.stringify({ error: '请填写新邮箱和当前密码' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      return new Response(JSON.stringify({ error: '邮箱格式不正确' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (newEmail === user.email) {
      return new Response(JSON.stringify({ error: '新邮箱不能与当前邮箱相同' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const existing = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, newEmail))
      .limit(1);

    if (existing.length > 0) {
      return new Response(JSON.stringify({ error: '该邮箱已被其他账号使用' }), {
        status: 409,
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

    const valid = await verifyPassword(password, passwords[0].passwordHash);
    if (!valid) {
      return new Response(JSON.stringify({ error: '当前密码错误' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await db
      .update(schema.users)
      .set({ email: newEmail, updatedAt: new Date() })
      .where(eq(schema.users.id, user.id));

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Update email error:', error);
    return new Response(JSON.stringify({ error: '修改邮箱失败，请稍后重试' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
