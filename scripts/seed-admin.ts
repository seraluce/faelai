/**
 * scripts/seed-admin.ts
 * 功能：管理员账号种子脚本 — 创建默认管理员（admin@faelai.com / Admin@123456）
 * 运行方式: npx tsx scripts/seed-admin.ts
 */
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { eq } from 'drizzle-orm';
import { hash } from '@node-rs/argon2';

// 本地 SQLite（与 drizzle.config.ts 一致）
const client = createClient({ url: 'file:local.db' });

// 简化 schema 引用，避免 import.meta.env 问题
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').unique().notNull(),
  username: text('username').unique().notNull(),
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),
  bio: text('bio'),
  role: text('role').default('user').notNull(),
  emailVerified: integer('email_verified', { mode: 'boolean' }).default(false),
  isBlocked: integer('is_blocked', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

const userPasswords = sqliteTable('user_passwords', {
  userId: text('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  passwordHash: text('password_hash').notNull(),
});

const db = drizzle(client);

function generateId(): string {
  return crypto.randomUUID();
}

async function seedAdmin() {
  const adminEmail = 'admin@faelai.com';
  const adminUsername = 'admin';
  const adminPassword = 'Admin@123456';

  // 检查是否已存在
  const existing = await db.select().from(users).where(eq(users.email, adminEmail)).limit(1);
  if (existing.length > 0) {
    console.log('✅ 管理员账号已存在：');
    console.log(`   邮箱:   ${adminEmail}`);
    console.log(`   用户名: ${adminUsername}`);
    console.log(`   密码:   ${adminPassword}`);
    return;
  }

  const userId = generateId();
  const passwordHash = await hash(adminPassword, {
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  });

  await db.insert(users).values({
    id: userId,
    email: adminEmail,
    username: adminUsername,
    fullName: '管理员',
    role: 'admin',
    emailVerified: true,
  });

  await db.insert(userPasswords).values({ userId, passwordHash });

  console.log('✅ 管理员账号创建成功：');
  console.log(`   邮箱:   ${adminEmail}`);
  console.log(`   用户名: ${adminUsername}`);
  console.log(`   密码:   ${adminPassword}`);
  console.log(`   角色:   admin`);
}

seedAdmin().catch(console.error);
