// drizzle.config.ts
// 功能：Drizzle Kit 配置 — SQLite 方言、schema 路径、迁移输出目录、数据库连接
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  schema: './src/lib/db/schema.ts',
  out: './src/db/migrations',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  },
});
