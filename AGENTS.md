# FaelAI — 开发者指南

## 开发前必读

**每次继续开发前，必须先阅读以下文件：**

1. **`docs/DEVELOPMENT.md`** — 完整开发文档（数据结构、文件目录、表结构、路由规则、认证流程）
2. **`docs/TODO.md`** — 待办事项列表（所有待完成任务、已完成标记）

未阅读以上文件不得开始新功能开发。

---

## 项目概述

FaelAI 是一个模块化的 AI 新闻聚合与发布网站，基于 Astro 7、React 19、Tailwind CSS v4、shadcn/ui、Turso (SQLite)、Cloudflare R2 和 Drizzle ORM 构建。支持多语言（中/英）、深浅模式、RSS 聚合、用户系统和文章发布。

## 常用命令

- `pnpm install` — 安装依赖
- `pnpm run dev` — 启动开发服务器（端口 8081）
- `pnpm run build` — 生产构建
- `pnpm run preview` — 预览生产构建
- `pnpm run db:generate` — 生成数据库迁移
- `pnpm run db:migrate` — 执行数据库迁移
- `pnpm run db:studio` — 打开 Drizzle Studio
- `npx tsx scripts/seed-admin.ts` — 创建管理员账号

## 项目结构

- `src/pages/` — 中文页面（默认语言，无前缀）
- `src/pages/en/` — 英文页面（`/en` 前缀）
- `src/pages/admin/` — 管理后台（无语言前缀）
- `src/pages/api/` — API 端点（无语言前缀）
- `src/components/ui/` — shadcn/ui 组件
- `src/components/layout/` — 布局组件（Header、Footer）
- `src/components/news/` — 新闻卡片组件
- `src/lib/db/` — 数据库模型与客户端（Turso + Drizzle）
- `src/lib/auth/` — 认证工具（Session、密码、邮箱）
- `src/lib/rss/` — RSS 抓取与解析
- `src/lib/utils/` — 工具函数
- `src/i18n/` — 国际化文案
- `src/content/` — 内容集合（预留，当前为空）
- `src/config/site.ts` — 站点集中配置
- `src/styles/` — 全局样式
- `docs/` — 项目文档

## 多语言路由

- 中文（zh）：默认语言，路由无前缀 → `/news`、`/about`
- 英文（en）：非默认语言，路由带前缀 → `/en/news`、`/en/about`
- 配置：`astro.config.mjs` 中 `i18n.prefixDefaultLocale: true`
- 管理后台和 API 路由无语言前缀

## 代码风格

- TypeScript 严格模式
- Astro 组件（.astro）用于静态内容
- React 组件（.tsx）用于交互式岛屿
- Tailwind CSS v4 工具类（CSS 优先配置，通过 @theme）
- shadcn/ui 组件位于 src/components/ui/
- 路径别名：`@/` 映射到 `src/`
- 按需渲染的 API 路由使用 `export const prerender = false`
- 交互式 React 使用 `client:load`
- 禁止使用 emoji，全部使用 lucide-react 图标
- **每个源文件最顶端必须添加注释**，标注文件路径和实现的功能（见下方格式）

### 文件头注释格式

每个 `.astro`、`.ts`、`.tsx`、`.css` 源文件的最顶端必须包含注释：

```astro
---
// src/pages/index.astro
// 功能：首页 — 展示精选文章、最新资讯、热门排行、热门话题、分类导航
---
```

```typescript
// src/lib/auth/session.ts
// 功能：Session 管理 — 创建、验证、失效 Session，Cookie 读写
```

```css
/* src/styles/global.css */
/* 功能：全局样式 — Tailwind v4 主题配置、表单验证、排版、动画 */
```

注释规则：
- 路径为相对于项目根目录的完整路径
- 功能描述简洁明了，说明该文件的核心职责
- `.astro` 文件使用 `---` 包裹的 frontmatter 注释
- `.ts`/`.tsx` 文件使用 `//` 单行注释
- `.css` 文件使用 `/* */` 块注释

## 数据库

- Turso (libSQL/SQLite) 存储数据
- Drizzle ORM 实现类型安全查询
- 必须使用参数化查询（禁止字符串拼接）
- 生成迁移：`pnpm run db:generate`
- 执行迁移：`pnpm run db:migrate`

## 认证

- 基于 Session 的认证（Lucia 模式，从零实现）
- 密码哈希：`@node-rs/argon2`（memoryCost: 19456, timeCost: 2, parallelism: 1）
- Session Token：20 个随机字节，base32 编码
- Session ID 存储在数据库中：Token 的 SHA-256 哈希
- OAuth：使用 Arctic 库对接 GitHub/Google
- 受保护路由：通过中间件校验 Session

## 对象存储

- Cloudflare R2（兼容 S3 协议）
- 客户端通过预签名 URL 直接上传
- 使用 `@aws-sdk/client-s3` 和 `@aws-sdk/s3-request-presigner`
- 公开访问地址使用自定义域名：`media.faelai.com`

## 测试

- 暂未配置测试框架
- 后续添加测试后使用 `pnpm test` 运行

## Git 工作流

- 从 main 分支拉取，前缀使用 `feat/`、`fix/` 或 `chore/`
- 约定式提交：`feat: add user auth`、`fix: resolve RSS parsing`
- 不自动提交 — 仅在明确要求时提交

## 禁止修改

- `package-lock.json` — 仅通过 `pnpm install` 更新
- `.env` — 包含敏感信息，禁止提交
- `src/db/migrations/` — 通过 drizzle-kit 生成，禁止手动编辑

## 注意事项

- 所有响应和注释使用中文
- 不得改变主题色（accent color）
- 后台导航与前台导航完全分离
- 用户头像默认本地存储，需兼容 S3 协议
- 邮箱修改需重新验证
