// src/pages/api/auth/reset-password.ts
// 功能：密码重置请求 API — POST 生成重置令牌、发送重置邮件、开发模式返回令牌
import type { APIRoute } from 'astro';
import { db, schema } from '@/lib/db';
import { eq } from 'drizzle-orm';
import nodemailer from 'nodemailer';
import { storeResetToken } from './confirm-reset';

const transporter = nodemailer.createTransport({
  host: import.meta.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(import.meta.env.SMTP_PORT || '587'),
  secure: import.meta.env.SMTP_SECURE === 'true',
  auth: {
    user: import.meta.env.SMTP_USER,
    pass: import.meta.env.SMTP_PASS,
  },
});

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

    const users = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1);

    if (users.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: '如果该邮箱已注册，你将收到重置邮件' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const token = crypto.randomUUID();
    const expiresAt = Date.now() + 60 * 60 * 1000;
    storeResetToken(token, users[0].id, expiresAt);

    if (!import.meta.env.SMTP_USER) {
      console.log(`[DEV] Password reset token for ${email}: ${token}`);
      return new Response(
        JSON.stringify({
          success: true,
          message: '如果该邮箱已注册，你将收到重置邮件',
          devToken: token,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    try {
      await transporter.sendMail({
        from: `"FaelAI" <${import.meta.env.SMTP_USER}>`,
        to: email,
        subject: 'FaelAI - 密码重置',
        html: `
          <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #0070f3;">FaelAI 密码重置</h2>
            <p>我们收到了你的密码重置请求。请点击下方链接重置密码：</p>
            <a href="${import.meta.env.SITE_URL || 'http://localhost:8081'}/reset-password?token=${token}"
               style="display: inline-block; padding: 12px 24px; background: #0070f3; color: #fff; text-decoration: none; border-radius: 8px; margin: 16px 0;">
              重置密码
            </a>
            <p style="color: #666; font-size: 14px;">此链接 1 小时内有效。如果这不是你本人的操作，请忽略此邮件。</p>
          </div>
        `,
      });
    } catch (error) {
      console.error('Send reset email error:', error);
    }

    return new Response(
      JSON.stringify({ success: true, message: '如果该邮箱已注册，你将收到重置邮件' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Reset password error:', error);
    return new Response(JSON.stringify({ error: '密码重置失败，请稍后重试' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
