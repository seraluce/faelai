// src/middleware.ts
// 功能：Astro 中间件 — Session 验证、用户信息挂载、路由保护（admin/editor 角色校验、登录校验）

import { defineMiddleware } from 'astro:middleware';
import { validateSession, getSessionTokenFromRequest } from '@/lib/auth';

const publicPaths = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/github',
  '/api/auth/google',
];

function isPublicApiPath(pathname: string): boolean {
  return publicPaths.some(p => pathname.startsWith(p));
}

function getLoginRedirect(pathname: string): string {
  if (pathname.startsWith('/en')) return '/en/login';
  return '/login';
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Skip middleware for static assets and public API routes
  if (
    pathname.startsWith('/_astro') ||
    pathname.startsWith('/favicon') ||
    isPublicApiPath(pathname)
  ) {
    return next();
  }

  // Try to validate session
  const token = getSessionTokenFromRequest(context.request);
  let user = null;
  let session = null;

  if (token) {
    const result = await validateSession(token);
    if (result) {
      user = result.user;
      session = result.session;
    }
  }

  context.locals.user = user;
  context.locals.session = session;

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    if (!user || (user.role !== 'admin' && user.role !== 'editor')) {
      return context.redirect(getLoginRedirect(pathname));
    }
  }

  // Protect dashboard routes
  if (pathname.includes('/dashboard')) {
    if (!user) {
      return context.redirect(getLoginRedirect(pathname));
    }
  }

  return next();
});
