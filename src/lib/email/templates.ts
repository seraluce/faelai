// src/lib/email/templates.ts
// 功能：邮件 HTML 模板 — 验证码、欢迎邮件、密码重置

const PRIMARY_COLOR = '#0070f3';
const TEXT_COLOR = '#333333';
const TEXT_LIGHT = '#666666';
const BG_COLOR = '#f5f5f5';
const BORDER_COLOR = '#e5e5e5';

function baseLayout(title: string, content: string): string {
  return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${BG_COLOR}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: ${BG_COLOR};">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width: 480px; width: 100%; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
          <tr>
            <td style="background-color: ${PRIMARY_COLOR}; padding: 24px 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 600; letter-spacing: 0.5px;">FaelAI</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px;">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="padding: 16px 32px; border-top: 1px solid ${BORDER_COLOR}; text-align: center;">
              <p style="margin: 0; color: ${TEXT_LIGHT}; font-size: 12px; line-height: 1.6;">
                此邮件由 FaelAI 系统自动发送，请勿直接回复。<br>
                如果你没有执行此操作，请忽略此邮件。
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function verificationTemplate(code: string): string {
  const content = `
<h2 style="margin: 0 0 16px 0; color: ${TEXT_COLOR}; font-size: 18px; font-weight: 600;">邮箱验证码</h2>
<p style="margin: 0 0 24px 0; color: ${TEXT_LIGHT}; font-size: 14px; line-height: 1.6;">
  你好，你的邮箱验证码如下：
</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <td style="background-color: ${BG_COLOR}; border-radius: 8px; padding: 20px; text-align: center; border: 1px dashed ${BORDER_COLOR};">
      <span style="font-size: 36px; font-weight: 700; color: ${PRIMARY_COLOR}; letter-spacing: 8px; font-family: 'Courier New', monospace;">${code}</span>
    </td>
  </tr>
</table>
<p style="margin: 24px 0 0 0; color: ${TEXT_LIGHT}; font-size: 13px; line-height: 1.6;">
  验证码在 <strong>10 分钟</strong>内有效。请勿将此验证码分享给任何人。
</p>`;

  return baseLayout('FaelAI - 邮箱验证码', content);
}

export function welcomeTemplate(username: string): string {
  const content = `
<h2 style="margin: 0 0 16px 0; color: ${TEXT_COLOR}; font-size: 18px; font-weight: 600;">欢迎加入 FaelAI</h2>
<p style="margin: 0 0 16px 0; color: ${TEXT_LIGHT}; font-size: 14px; line-height: 1.6;">
  你好 ${username}，
</p>
<p style="margin: 0 0 16px 0; color: ${TEXT_LIGHT}; font-size: 14px; line-height: 1.6;">
  感谢注册 FaelAI！我们是一个专注于人工智能领域最新动态的新闻聚合平台，致力于为你提供最前沿的 AI 资讯。
</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <td style="background-color: ${BG_COLOR}; border-radius: 8px; padding: 20px; margin-bottom: 16px;">
      <p style="margin: 0 0 12px 0; color: ${TEXT_COLOR}; font-size: 14px; font-weight: 600;">你可以在这里：</p>
      <table role="presentation" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding: 4px 0; color: ${TEXT_LIGHT}; font-size: 14px; line-height: 1.6;">
            <span style="color: ${PRIMARY_COLOR}; font-weight: bold;">&#8226;</span>&nbsp;&nbsp;浏览最新 AI 新闻与深度报道
          </td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: ${TEXT_LIGHT}; font-size: 14px; line-height: 1.6;">
            <span style="color: ${PRIMARY_COLOR}; font-weight: bold;">&#8226;</span>&nbsp;&nbsp;按分类筛选感兴趣的内容
          </td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: ${TEXT_LIGHT}; font-size: 14px; line-height: 1.6;">
            <span style="color: ${PRIMARY_COLOR}; font-weight: bold;">&#8226;</span>&nbsp;&nbsp;关注你喜爱的话题和领域
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
<p style="margin: 16px 0 0 0; color: ${TEXT_LIGHT}; font-size: 14px; line-height: 1.6;">
  如有任何问题或建议，欢迎随时联系我们。
</p>`;

  return baseLayout('欢迎加入 FaelAI', content);
}

export function passwordResetTemplate(resetUrl: string): string {
  const content = `
<h2 style="margin: 0 0 16px 0; color: ${TEXT_COLOR}; font-size: 18px; font-weight: 600;">密码重置</h2>
<p style="margin: 0 0 16px 0; color: ${TEXT_LIGHT}; font-size: 14px; line-height: 1.6;">
  你好，我们收到了你的密码重置请求。请点击下方按钮设置新密码：
</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <td style="padding: 8px 0;">
      <a href="${resetUrl}" target="_blank" style="display: inline-block; background-color: ${PRIMARY_COLOR}; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; padding: 12px 32px; border-radius: 6px; text-align: center; mso-padding-alt: 0;">
        重置密码
      </a>
    </td>
  </tr>
</table>
<p style="margin: 24px 0 0 0; color: ${TEXT_LIGHT}; font-size: 13px; line-height: 1.6;">
  此链接在 <strong>1 小时</strong>内有效。如果你没有请求重置密码，请忽略此邮件，你的密码将保持不变。
</p>
<p style="margin: 8px 0 0 0; color: ${TEXT_LIGHT}; font-size: 13px; line-height: 1.6;">
  如果按钮无法点击，请复制以下链接到浏览器地址栏：<br>
  <span style="color: ${PRIMARY_COLOR}; word-break: break-all;">${resetUrl}</span>
</p>`;

  return baseLayout('FaelAI - 密码重置', content);
}
