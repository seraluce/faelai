// src/lib/email/sender.ts
// 功能：邮件发送服务 — Resend API 优先、SMTP 降级、验证码存储、验证令牌数据库持久化

import nodemailer from 'nodemailer';
import { verificationTemplate, welcomeTemplate, passwordResetTemplate } from './templates';
import { db, schema } from '@/lib/db';

// ---------------------------------------------------------------------------
// 传输配置
// ---------------------------------------------------------------------------

const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
const FROM_EMAIL = import.meta.env.SMTP_USER || 'noreply@faelai.com';
const FROM_NAME = 'FaelAI';

const transporter = nodemailer.createTransport({
  host: import.meta.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(import.meta.env.SMTP_PORT || '587'),
  secure: import.meta.env.SMTP_SECURE === 'true',
  auth: {
    user: import.meta.env.SMTP_USER,
    pass: import.meta.env.SMTP_PASS,
  },
});

// ---------------------------------------------------------------------------
// 验证码存储（内存，生产环境应使用 Redis）
// ---------------------------------------------------------------------------

const codeStore = new Map<string, { code: string; expiresAt: number }>();
const CODE_EXPIRY_MS = 10 * 60 * 1000; // 10 分钟

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ---------------------------------------------------------------------------
// 核心发送函数
// ---------------------------------------------------------------------------

export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<{ success: boolean; error?: string }> {
  // 开发模式：无 SMTP_USER 也无 RESEND_API_KEY，直接返回成功（不发真实邮件）
  if (!RESEND_API_KEY && !import.meta.env.SMTP_USER) {
    console.log(`[DEV] Email to ${to} — subject: ${subject}`);
    return { success: true };
  }

  // 优先使用 Resend API
  if (RESEND_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `${FROM_NAME} <${FROM_EMAIL}>`,
          to: [to],
          subject,
          html,
        }),
      });

      if (!res.ok) {
        const body = await res.text();
        console.error('Resend API error:', res.status, body);
        return { success: false, error: '发送邮件失败，请稍后重试' };
      }

      return { success: true };
    } catch (err) {
      console.error('Resend API request failed:', err);
      return { success: false, error: '发送邮件失败，请稍后重试' };
    }
  }

  // 降级：使用 nodemailer SMTP
  try {
    await transporter.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to,
      subject,
      html,
    });
    return { success: true };
  } catch (err) {
    console.error('SMTP send error:', err);
    return { success: false, error: '发送邮件失败，请稍后重试' };
  }
}

// ---------------------------------------------------------------------------
// 业务邮件函数
// ---------------------------------------------------------------------------

export async function sendVerificationEmail(
  email: string,
  userId?: string
): Promise<{ success: boolean; error?: string; devCode?: string; verificationToken?: string }> {
  const code = generateVerificationCode();
  codeStore.set(email, { code, expiresAt: Date.now() + CODE_EXPIRY_MS });

  let verificationToken: string | undefined;

  if (userId) {
    verificationToken = crypto.randomUUID();
    const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await db.insert(schema.emailVerifications).values({
      token: verificationToken,
      userId,
      expiresAt: tokenExpiresAt,
    });
  }

  // 开发模式：返回验证码到调用方
  if (!RESEND_API_KEY && !import.meta.env.SMTP_USER) {
    console.log(`[DEV] Verification code for ${email}: ${code}`);
    if (verificationToken) {
      console.log(`[DEV] Verification token for ${email}: ${verificationToken}`);
    }
    return { success: true, devCode: code, verificationToken };
  }

  const result = await sendEmail(email, 'FaelAI - 邮箱验证码', verificationTemplate(code));

  return { ...result, verificationToken };
}

export async function sendWelcomeEmail(
  email: string,
  username: string
): Promise<{ success: boolean; error?: string }> {
  return sendEmail(email, `欢迎加入 FaelAI`, welcomeTemplate(username));
}

export async function sendPasswordResetEmail(
  email: string,
  resetUrl: string
): Promise<{ success: boolean; error?: string }> {
  return sendEmail(email, 'FaelAI - 密码重置', passwordResetTemplate(resetUrl));
}

// ---------------------------------------------------------------------------
// 验证码校验
// ---------------------------------------------------------------------------

export function verifyCode(email: string, code: string): boolean {
  const stored = codeStore.get(email);
  if (!stored) return false;

  if (Date.now() > stored.expiresAt) {
    codeStore.delete(email);
    return false;
  }

  if (stored.code !== code) return false;

  codeStore.delete(email);
  return true;
}
