// src/pages/api/auth/register.ts
// 功能：注册 API — POST 校验验证码、创建用户账号、密码哈希、自动登录
import type { APIRoute } from 'astro';
import { db, schema } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { verifyCode } from '@/lib/auth/email';
import { eq } from 'drizzle-orm';
import { createSession, setSessionCookie } from '@/lib/auth/session';
import { generateId } from '@/lib/utils';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { email, username, password, code } = body;

    if (!email || !username || !password || !code) {
      return new Response(JSON.stringify({ error: '请填写所有必填字段' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (password.length < 8) {
      return new Response(JSON.stringify({ error: '密码至少需要 8 个字符' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Verify email code
    if (!verifyCode(email, code)) {
      return new Response(JSON.stringify({ error: '验证码无效或已过期' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if email or username already exists
    const existingUser = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return new Response(JSON.stringify({ error: '该邮箱已被注册' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const existingUsername = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.username, username))
      .limit(1);

    if (existingUsername.length > 0) {
      return new Response(JSON.stringify({ error: '该用户名已被使用' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const userId = generateId();
    const passwordHash = await hashPassword(password);

    await db.insert(schema.users).values({
      id: userId,
      email,
      username,
      role: 'user',
      emailVerified: true,
    });

    await db.insert(schema.userPasswords).values({
      userId,
      passwordHash,
    });

    const { token } = await createSession(userId);

    return new Response(JSON.stringify({ success: true, userId }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': setSessionCookie(token),
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    return new Response(JSON.stringify({ error: '注册失败，请稍后重试' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
