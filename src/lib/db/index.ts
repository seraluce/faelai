// src/lib/db/index.ts
// 功能：数据库客户端初始化 — Turso/libSQL 连接 + Drizzle ORM 实例
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

const client = createClient({
  url: import.meta.env.TURSO_DATABASE_URL,
  authToken: import.meta.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });

export { schema };
