// src/lib/auth/password.ts
// 功能：密码哈希 — Argon2 哈希与验证（memoryCost: 19456, timeCost: 2, parallelism: 1）
import { hash, verify } from '@node-rs/argon2';

const ARGON_OPTIONS = {
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
};

export async function hashPassword(password: string): Promise<string> {
  return hash(password, ARGON_OPTIONS);
}

export async function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  return verify(passwordHash, password, ARGON_OPTIONS);
}
