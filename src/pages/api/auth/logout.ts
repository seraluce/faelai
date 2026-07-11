// src/pages/api/auth/logout.ts
// 功能：登出 API — POST 销毁 Session，清除 Cookie
import type { APIRoute } from 'astro';
import { getSessionTokenFromRequest, invalidateSession, hashSessionToken, deleteSessionCookie } from '@/lib/auth';

export const POST: APIRoute = async ({ request }) => {
  try {
    const token = getSessionTokenFromRequest(request);
    if (token) {
      const sessionId = hashSessionToken(token);
      await invalidateSession(sessionId);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': deleteSessionCookie(),
      },
    });
  } catch (error) {
    console.error('Logout error:', error);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': deleteSessionCookie(),
      },
    });
  }
};
