import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  schema: './src/lib/db/schema.ts',
  out: './src/db/migrations',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  },
});
