// src/env.d.ts
// 功能：类型声明 — 环境变量接口、App.Locals（user/session）类型扩展

/// <reference types="astro/client" />

interface Env {
  TURSO_DATABASE_URL: string;
  TURSO_AUTH_TOKEN: string;
  R2_ACCOUNT_ID: string;
  R2_ACCESS_KEY_ID: string;
  R2_SECRET_ACCESS_KEY: string;
  R2_BUCKET_NAME: string;
  R2_PUBLIC_URL: string;
  JWT_SECRET: string;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  GITHUB_REDIRECT_URI: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_REDIRECT_URI: string;
  SMTP_HOST: string;
  SMTP_PORT: string;
  SMTP_SECURE: string;
  SMTP_USER: string;
  SMTP_PASS: string;
  GISCUS_REPO: string;
  GISCUS_REPO_ID: string;
  GISCUS_CATEGORY: string;
  GISCUS_CATEGORY_ID: string;
}

declare namespace App {
  interface Locals {
    user: import('./lib/db/schema').User | null;
    session: import('./lib/db/schema').Session | null;
  }
}
