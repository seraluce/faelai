// src/pages/api/auth/login.ts
// 功能：登录 API — POST 邮箱+密码登录，验证凭据，创建 Session，返回用户信息
import type { APIRoute } from 'astro';
import { db, schema } from '@/lib/db';
import { verifyPassword } from '@/lib/auth';
import { createSession, setSessionCookie } from '@/lib/auth/session';
import { eq } from 'drizzle-orm';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response(JSON.stringify({ error: '请输入邮箱和密码' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Find user by email
    const users = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1);

    if (users.length === 0) {
      return new Response(JSON.stringify({ error: '邮箱或密码错误' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const user = users[0];

    if (user.isBlocked) {
      return new Response(JSON.stringify({ error: '账号已被封禁' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Verify password
    const passwords = await db
      .select()
      .from(schema.userPasswords)
      .where(eq(schema.userPasswords.userId, user.id))
      .limit(1);

    if (passwords.length === 0) {
      return new Response(JSON.stringify({ error: '邮箱或密码错误' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const valid = await verifyPassword(password, passwords[0].passwordHash);
    if (!valid) {
      return new Response(JSON.stringify({ error: '邮箱或密码错误' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { token } = await createSession(user.id);

    return new Response(JSON.stringify({ success: true, user: { id: user.id, username: user.username, role: user.role } }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': setSessionCookie(token),
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ error: '登录失败，请稍后重试' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
