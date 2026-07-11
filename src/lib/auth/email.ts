// src/lib/auth/email.ts
// 功能：邮箱验证码 — Resend API/SMTP 发送、6位验证码、频率限制、10分钟过期、开发模式返回

import { sendVerificationEmail as sendEmail, verifyCode as verify } from '@/lib/email/sender';
import { checkEmailRateLimit, recordEmailSend } from '@/lib/email/rate-limit';

export { verify as verifyCode };

export async function sendVerificationEmail(
  email: string
): Promise<{ success: boolean; error?: string; devCode?: string }> {
  const rateCheck = checkEmailRateLimit(email);
  if (!rateCheck.allowed) {
    const minutes = Math.ceil((rateCheck.retryAfter || 0) / 60);
    return { success: false, error: `发送过于频繁，请 ${minutes} 分钟后重试` };
  }

  const result = await sendEmail(email);

  if (result.success) {
    recordEmailSend(email);
  }

  return result;
}
