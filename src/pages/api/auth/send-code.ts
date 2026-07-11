import type { APIRoute } from 'astro';
import { sendVerificationEmail } from '@/lib/auth/email';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: '请输入有效的邮箱地址' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const result = await sendVerificationEmail(email);

    if (!result.success) {
      return new Response(JSON.stringify({ error: result.error }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: '验证码已发送到你的邮箱',
      devCode: result.devCode,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Send code error:', error);
    return new Response(JSON.stringify({ error: '发送验证码失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
