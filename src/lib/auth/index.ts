// src/lib/auth/index.ts
// 功能：认证模块统一导出 — Session 管理、密码哈希等工具函数

export {
  createSession,
  validateSession,
  invalidateSession,
  setSessionCookie,
  deleteSessionCookie,
  getSessionTokenFromRequest,
  hashSessionToken,
} from './session';
export { hashPassword, verifyPassword } from './password';
