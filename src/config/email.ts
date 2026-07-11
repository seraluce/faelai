// src/config/email.ts
// 功能：邮件配置 — SMTP 连接、发件人信息、验证码邮件模板、缓存控制

import { siteConfig } from './site';

export const emailConfig = {
  // SMTP 连接
  smtp: {
    host: import.meta.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(import.meta.env.SMTP_PORT || '587'),
    secure: import.meta.env.SMTP_SECURE === 'true',
    auth: {
      user: import.meta.env.SMTP_USER || '',
      pass: import.meta.env.SMTP_PASS || '',
    },
  },

  // 发件人
  from: {
    name: siteConfig.name,
    address: import.meta.env.SMTP_USER || `noreply@${new URL(siteConfig.url).hostname}`,
  },

  // 邮件主题
  subjects: {
    verification: `${siteConfig.name} - 邮箱验证码`,
    welcome: `欢迎加入 ${siteConfig.name}`,
    passwordReset: `${siteConfig.name} - 密码重置`,
  },

  // 邮件模板颜色（与主题色保持一致）
  templateColors: {
    primary: '#0070f3',
    background: '#f5f5f5',
    text: '#666666',
  },
};

export type EmailConfig = typeof emailConfig;
