import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: import.meta.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(import.meta.env.SMTP_PORT || '587'),
  secure: import.meta.env.SMTP_SECURE === 'true',
  auth: {
    user: import.meta.env.SMTP_USER,
    pass: import.meta.env.SMTP_PASS,
  },
});

// 验证码存储 (内存，生产环境应使用 Redis)
const codeStore = new Map<string, { code: string; expiresAt: number }>();

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendVerificationEmail(email: string): Promise<{ success: boolean; error?: string; devCode?: string }> {
  const code = generateVerificationCode();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  codeStore.set(email, { code, expiresAt });

  // 开发模式：不发送真实邮件，返回验证码
  if (!import.meta.env.SMTP_USER) {
    console.log(`[DEV] Verification code for ${email}: ${code}`);
    return { success: true, devCode: code };
  }

  try {
    await transporter.sendMail({
      from: `"FaelAI" <${import.meta.env.SMTP_USER}>`,
      to: email,
      subject: 'FaelAI - 邮箱验证码',
      html: `
        <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #0070f3;">FaelAI 邮箱验证</h2>
          <p>你的验证码是：</p>
          <div style="font-size: 32px; font-weight: bold; color: #0070f3; text-align: center; padding: 20px; background: #f5f5f5; border-radius: 8px; letter-spacing: 8px;">
            ${code}
          </div>
          <p style="color: #666; font-size: 14px;">验证码 10 分钟内有效，请勿泄露给他人。</p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Send email error:', error);
    return { success: false, error: '发送验证码失败，请稍后重试' };
  }
}

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
