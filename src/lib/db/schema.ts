// src/lib/db/schema.ts
// 功能：数据库表结构 — 13 张表定义（用户、密码、Session、OAuth、文章、分类、标签、RSS源、热门评分、收藏、点赞、站点设置）
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// ============================================================
// Users & Auth
// ============================================================

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').unique().notNull(),
  username: text('username').unique().notNull(),
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),
  bio: text('bio'),
  role: text('role').default('user').notNull(), // 'user' | 'editor' | 'admin'
  emailVerified: integer('email_verified', { mode: 'boolean' }).default(false),
  isBlocked: integer('is_blocked', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const userPasswords = sqliteTable('user_passwords', {
  userId: text('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  passwordHash: text('password_hash').notNull(),
});

export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const oauthAccounts = sqliteTable('oauth_accounts', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  provider: text('provider').notNull(), // 'github' | 'google'
  providerUserId: text('provider_user_id').notNull(),
  email: text('email'),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// ============================================================
// Content
// ============================================================

export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  nameEn: text('name_en'),
  slug: text('slug').unique().notNull(),
  description: text('description'),
  icon: text('icon'),
  color: text('color'),
  sortOrder: integer('sort_order').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const tags = sqliteTable('tags', {
  id: text('id').primaryKey(),
  name: text('name').unique().notNull(),
  slug: text('slug').unique().notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const articles = sqliteTable('articles', {
  id: text('id').primaryKey(),
  slug: text('slug').unique().notNull(),
  title: text('title').notNull(),
  description: text('description'),
  content: text('content'),
  excerpt: text('excerpt'),
  coverImage: text('cover_image'),
  author: text('author'),
  authorId: text('author_id').references(() => users.id),
  sourceName: text('source_name'),
  sourceUrl: text('source_url'),
  sourceFeedId: text('source_feed_id').references(() => feeds.id),
  categoryId: text('category_id').references(() => categories.id),
  lang: text('lang').default('zh').notNull(),
  status: text('status').default('draft').notNull(), // 'draft' | 'published' | 'archived'
  isFeatured: integer('is_featured', { mode: 'boolean' }).default(false),
  isBreaking: integer('is_breaking', { mode: 'boolean' }).default(false),
  viewCount: integer('view_count').default(0),
  likeCount: integer('like_count').default(0),
  commentCount: integer('comment_count').default(0),
  readingTime: integer('reading_time'),
  publishedAt: integer('published_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const articleTags = sqliteTable('article_tags', {
  articleId: text('article_id')
    .notNull()
    .references(() => articles.id, { onDelete: 'cascade' }),
  tagId: text('tag_id')
    .notNull()
    .references(() => tags.id, { onDelete: 'cascade' }),
});

// ============================================================
// RSS Feeds
// ============================================================

export const feeds = sqliteTable('feeds', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  url: text('url').notNull(),
  siteUrl: text('site_url'),
  description: text('description'),
  lang: text('lang').default('en'),
  categoryId: text('category_id').references(() => categories.id),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  fetchInterval: integer('fetch_interval').default(3600),
  lastFetchedAt: integer('last_fetched_at', { mode: 'timestamp' }),
  lastError: text('last_error'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// ============================================================
// Trending & Scores
// ============================================================

export const trendingScores = sqliteTable('trending_scores', {
  articleId: text('article_id')
    .primaryKey()
    .references(() => articles.id, { onDelete: 'cascade' }),
  score: real('score').default(0),
  computedAt: integer('computed_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// ============================================================
// User Interactions
// ============================================================

export const userBookmarks = sqliteTable('user_bookmarks', {
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  articleId: text('article_id')
    .notNull()
    .references(() => articles.id, { onDelete: 'cascade' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const userLikes = sqliteTable('user_likes', {
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  articleId: text('article_id')
    .notNull()
    .references(() => articles.id, { onDelete: 'cascade' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// ============================================================
// Site Settings
// ============================================================

export const siteSettings = sqliteTable('site_settings', {
  key: text('key').primaryKey(),
  value: text('value'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// ============================================================
// Type exports
// ============================================================

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type Tag = typeof tags.$inferSelect;
export type Feed = typeof feeds.$inferSelect;
