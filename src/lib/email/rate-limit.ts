// src/lib/email/rate-limit.ts
// 功能：邮件发送频率限制 — 内存存储、每小时 5 次上限

const DEFAULT_MAX_PER_HOUR = 5;
const HOUR_MS = 60 * 60 * 1000;

const store = new Map<string, { count: number; resetAt: number }>();

export function checkEmailRateLimit(
  email: string,
  maxPerHour: number = DEFAULT_MAX_PER_HOUR
): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = store.get(email);

  if (!entry || now > entry.resetAt) {
    return { allowed: true };
  }

  if (entry.count >= maxPerHour) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }

  return { allowed: true };
}

export function recordEmailSend(email: string): void {
  const now = Date.now();
  const entry = store.get(email);

  if (!entry || now > entry.resetAt) {
    store.set(email, { count: 1, resetAt: now + HOUR_MS });
    return;
  }

  entry.count += 1;
}

export function cleanupRateLimits(): void {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
}
