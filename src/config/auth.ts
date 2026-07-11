// src/config/auth.ts
// 功能：认证配置 — Session 有效期、Cookie 名称、Token 长度、Argon2 参数、密码规则、角色列表

export const authConfig = {
  // Session 配置
  session: {
    /** Session 有效期（毫秒），默认 30 天 */
    maxAge: 30 * 24 * 60 * 60 * 1000,
    /** Session 续期阈值（毫秒），剩余不足 15 天时自动续期 */
    renewThreshold: 15 * 24 * 60 * 60 * 1000,
    /** Cookie 名称 */
    cookieName: 'session',
    /** Token 随机字节数 */
    tokenLength: 20,
  },

  // Argon2 密码哈希参数
  password: {
    /** 内存消耗（KiB） */
    memoryCost: 19456,
    /** 时间消耗（迭代次数） */
    timeCost: 2,
    /** 并行度 */
    parallelism: 1,
    /** 最小密码长度 */
    minLength: 8,
  },

  // 邮箱验证码
  verification: {
    /** 验证码位数 */
    codeLength: 6,
    /** 验证码有效期（毫秒），默认 10 分钟 */
    expiryMs: 10 * 60 * 1000,
    /** 验证码重发倒计时（秒） */
    cooldownSeconds: 60,
  },

  // 角色
  roles: {
    admin: 'admin',
    editor: 'editor',
    user: 'user',
  } as const,

  // 受保护的路由前缀
  protectedRoutes: ['/admin', '/dashboard'] as const,

  // 公开的 API 路径（无需登录）
  publicApiPaths: [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/github',
    '/api/auth/google',
  ] as const,

  // 静态资源前缀（跳过 Session 验证）
  staticPrefixes: ['/_astro', '/favicon'] as const,
};

export type AuthConfig = typeof authConfig;
