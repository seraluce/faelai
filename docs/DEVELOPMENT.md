# FaelAI 开发文档

## 一、项目概述

FaelAI 是一个模块化的 AI 新闻聚合与发布平台，支持 RSS 聚合、文章发布、多语言（中/英）、深浅模式、用户系统和管理后台。

---

## 二、技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Astro | ^7.0 | 主框架（SSR 模式） |
| React | ^19.0 | 交互式岛屿组件 |
| Tailwind CSS | ^4.0 | 样式系统（CSS 优先配置） |
| shadcn/ui | latest | UI 组件库 |
| Drizzle ORM | ^0.44 | 类型安全的数据库查询 |
| Turso/libSQL | ^0.17 | 数据库（本地开发用 SQLite） |
| Cloudflare R2 | ^3.700 | 对象存储（图片/媒体） |
| Lucia 模式认证 | - | Session + Argon2 密码哈希 |
| Arctic | ^3.0 | OAuth（GitHub/Google） |
| nodemailer | ^9.0 | 邮箱验证码发送 |

---

## 三、环境变量

所有环境变量定义在 `.env` 文件中（已加入 `.gitignore`），参考 `.env.example`。

```bash
# 数据库
TURSO_DATABASE_URL=file:local.db          # 本地 SQLite 文件
TURSO_AUTH_TOKEN=                          # Turso 远程连接时需要

# 对象存储（Cloudflare R2）
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=faelai-media
R2_PUBLIC_URL=https://media.faelai.com

# 认证
JWT_SECRET=your_jwt_secret                 # Session token 加密密钥

# OAuth（可选）
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_REDIRECT_URI=http://localhost:8081/api/auth/github/callback
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:8081/api/auth/google/callback

# 邮箱验证码（SMTP）
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# 评论系统（Giscus）
GISCUS_REPO=your-username/your-repo
GISCUS_REPO_ID=
GISCUS_CATEGORY=Comments
GISCUS_CATEGORY_ID=

# 站点
PUBLIC_SITE_URL=http://localhost:8081
PUBLIC_SITE_NAME=FaelAI
PUBLIC_DEFAULT_LOCALE=zh
```

> **注意**：SMTP 未配置时，验证码会在 API 响应中直接返回（仅限开发模式）。

---

## 四、文件目录结构

```
FaelAI/
├── public/                          # 静态资源
├── scripts/
│   └── seed-admin.ts                # 管理员账号种子脚本
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.astro         # 网站头部（导航、认证、移动端菜单）
│   │   │   └── Footer.astro         # 网站底部（链接、社交、版权）
│   │   ├── news/
│   │   │   └── NewsCard.astro       # 文章卡片组件（可复用）
│   │   └── ui/                      # shadcn/ui 组件（预留）
│   ├── config/
│   │   └── site.ts                  # 站点配置（导航、分类、话题、社交链接等）
│   ├── content/                     # 内容集合目录（预留，当前为空）
│   ├── db/
│   │   └── migrations/
│   │       ├── 0000_huge_nicolaos.sql   # 初始迁移（创建所有表）
│   │       └── meta/
│   │           ├── _journal.json        # 迁移日志
│   │           └── 0000_snapshot.json   # 迁移快照
│   ├── env.d.ts                     # 类型声明（Env、Locals）
│   ├── i18n/
│   │   ├── ui.ts                    # 翻译文案（zh/en，67 个 key）
│   │   └── utils.ts                 # i18n 工具函数
│   ├── layouts/
│   │   └── BaseLayout.astro         # 基础 HTML 布局
│   ├── lib/
│   │   ├── auth/
│   │   │   ├── index.ts             # 认证模块导出
│   │   │   ├── session.ts           # Session 管理（创建、验证、失效）
│   │   │   ├── password.ts          # Argon2 密码哈希
│   │   │   └── email.ts             # SMTP 邮箱验证码
│   │   ├── db/
│   │   │   ├── index.ts             # Drizzle 客户端初始化
│   │   │   └── schema.ts            # 数据库表结构（12 张表）
│   │   ├── rss/
│   │   │   └── index.ts             # RSS 抓取与解析
│   │   └── utils/
│   │       └── index.ts             # 工具函数（cn、formatDate 等）
│   ├── middleware.ts                 # Astro 中间件（Session 验证、路由保护）
│   ├── pages/                       # 页面路由（见下方）
│   └── styles/
│       └── global.css               # 全局样式（Tailwind v4 @theme）
├── .env                             # 环境变量（不提交）
├── .env.example                     # 环境变量模板
├── astro.config.mjs                 # Astro 配置
├── drizzle.config.ts                # Drizzle 配置
├── local.db                         # 本地 SQLite 数据库文件
├── package.json
├── tsconfig.json
└── README.md
```

---

## 五、页面路由

### 中文页面（默认语言，无前缀）

```
src/pages/
├── index.astro                      # 首页（英雄区、精选、最新、趋势、热门、分类）
├── news/
│   ├── index.astro                  # 新闻列表（分类筛选 + 分页）
│   └── [slug].astro                 # 文章详情
├── trending/
│   └── index.astro                  # 热门排行
├── hot/
│   └── index.astro                  # 热门话题
├── about/
│   └── index.astro                  # 关于页面
├── search/
│   └── index.astro                  # 搜索页面
├── login/
│   └── index.astro                  # 登录
├── register/
│   └── index.astro                  # 注册（含邮箱验证码）
├── dashboard/
│   └── index.astro                  # 用户仪表盘
├── admin/
│   └── index.astro                  # 管理后台（需 admin/editor 角色）
├── rss.xml.ts                       # RSS 输出端点（按需渲染）
└── api/                             # API 路由（见下方）
```

### 英文页面（`/en` 前缀）

```
src/pages/en/                        # 与中文页面结构一致，内容为英文
├── index.astro
├── news/index.astro
├── news/[slug].astro
├── trending/index.astro
├── hot/index.astro
├── about/index.astro
├── search/index.astro
├── login/index.astro
├── register/index.astro
└── dashboard/index.astro
```

### API 路由（无语言前缀）

```
src/pages/api/
├── auth/
│   ├── login.ts                     # POST  登录（邮箱+密码，创建 Session）
│   ├── logout.ts                    # POST  登出（销毁 Session）
│   ├── register.ts                  # POST  注册（需验证码，创建账号）
│   ├── send-code.ts                 # POST  发送邮箱验证码
│   └── me.ts                        # GET   获取当前用户信息
└── articles/
    ├── index.ts                     # GET   文章列表（分页、分类、标签、状态筛选）
    └── [slug].ts                    # GET/POST/PUT/DELETE  文章 CRUD
```

---

## 六、数据库表结构

数据库使用 Turso（libSQL/SQLite），通过 Drizzle ORM 操作。共 **12 张表**。

### 6.1 用户相关

#### `users` — 用户表
| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| `id` | text | PK | 用户 ID（UUID） |
| `email` | text | UNIQUE, NOT NULL | 邮箱 |
| `username` | text | UNIQUE, NOT NULL | 用户名 |
| `full_name` | text | | 显示名称 |
| `avatar_url` | text | | 头像 URL |
| `bio` | text | | 个人简介 |
| `role` | text | NOT NULL, 默认 `'user'` | 角色：`user` / `editor` / `admin` |
| `email_verified` | integer | 默认 `false` | 邮箱是否已验证 |
| `is_blocked` | integer | 默认 `false` | 是否被封禁 |
| `created_at` | integer | 默认当前时间 | 创建时间（Unix 时间戳） |
| `updated_at` | integer | 默认当前时间 | 更新时间（Unix 时间戳） |

#### `user_passwords` — 用户密码表
| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| `user_id` | text | PK, FK → `users.id` (CASCADE) | 用户 ID |
| `password_hash` | text | NOT NULL | Argon2 密码哈希 |

> 密码单独存表，查询用户信息时不携带哈希。

#### `sessions` — Session 表
| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| `id` | text | PK | Token 的 SHA-256 哈希 |
| `user_id` | text | NOT NULL, FK → `users.id` (CASCADE) | 用户 ID |
| `expires_at` | integer | NOT NULL | 过期时间（30 天） |
| `created_at` | integer | 默认当前时间 | 创建时间 |

> Session Token = 20 随机字节 Base32 编码，存储在 HttpOnly Cookie 中。

#### `oauth_accounts` — OAuth 账号关联表
| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| `id` | text | PK | 记录 ID |
| `user_id` | text | NOT NULL, FK → `users.id` (CASCADE) | 用户 ID |
| `provider` | text | NOT NULL | 提供商：`github` / `google` |
| `provider_user_id` | text | NOT NULL | 第三方平台用户 ID |
| `email` | text | | 第三方平台邮箱 |
| `access_token` | text | | 访问令牌 |
| `refresh_token` | text | | 刷新令牌 |
| `created_at` | integer | 默认当前时间 | 创建时间 |

---

### 6.2 内容相关

#### `articles` — 文章表
| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| `id` | text | PK | 文章 ID（UUID） |
| `slug` | text | UNIQUE, NOT NULL | URL 友好标识 |
| `title` | text | NOT NULL | 标题 |
| `description` | text | | 摘要描述 |
| `content` | text | | 完整 HTML 内容 |
| `excerpt` | text | | 简短摘要 |
| `cover_image` | text | | 封面图片 URL |
| `author` | text | | 作者显示名 |
| `author_id` | text | FK → `users.id` | 作者用户 ID |
| `source_name` | text | | RSS 来源名称 |
| `source_url` | text | | 原文链接 |
| `source_feed_id` | text | FK → `feeds.id` | 来源 RSS 源 ID |
| `category_id` | text | FK → `categories.id` | 分类 ID |
| `lang` | text | NOT NULL, 默认 `'zh'` | 语言 |
| `status` | text | NOT NULL, 默认 `'draft'` | 状态：`draft` / `published` / `archived` |
| `is_featured` | integer | 默认 `false` | 是否精选 |
| `is_breaking` | integer | 默认 `false` | 是否突发 |
| `view_count` | integer | 默认 `0` | 浏览量 |
| `like_count` | integer | 默认 `0` | 点赞数 |
| `comment_count` | integer | 默认 `0` | 评论数 |
| `reading_time` | integer | | 预估阅读时间（分钟） |
| `published_at` | integer | | 发布时间 |
| `created_at` | integer | 默认当前时间 | 创建时间 |
| `updated_at` | integer | 默认当前时间 | 更新时间 |

#### `categories` — 分类表
| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| `id` | text | PK | 分类 ID |
| `name` | text | NOT NULL | 中文名称 |
| `name_en` | text | | 英文名称 |
| `slug` | text | UNIQUE, NOT NULL | URL 标识 |
| `description` | text | | 分类描述 |
| `icon` | text | | 图标（Emoji） |
| `color` | text | | 颜色（Hex） |
| `sort_order` | integer | 默认 `0` | 排序权重 |
| `created_at` | integer | 默认当前时间 | 创建时间 |

#### `tags` — 标签表
| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| `id` | text | PK | 标签 ID |
| `name` | text | UNIQUE, NOT NULL | 标签名 |
| `slug` | text | UNIQUE, NOT NULL | URL 标识 |
| `created_at` | integer | 默认当前时间 | 创建时间 |

#### `article_tags` — 文章-标签关联表（多对多）
| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| `article_id` | text | NOT NULL, FK → `articles.id` (CASCADE) | 文章 ID |
| `tag_id` | text | NOT NULL, FK → `tags.id` (CASCADE) | 标签 ID |

---

### 6.3 RSS 相关

#### `feeds` — RSS 源表
| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| `id` | text | PK | 源 ID |
| `name` | text | NOT NULL | 源名称 |
| `url` | text | NOT NULL | RSS 订阅地址 |
| `site_url` | text | | 网站主页 URL |
| `description` | text | | 源描述 |
| `lang` | text | 默认 `'en'` | 语言 |
| `category_id` | text | FK → `categories.id` | 所属分类 |
| `is_active` | integer | 默认 `true` | 是否启用 |
| `fetch_interval` | integer | 默认 `3600` | 抓取间隔（秒，默认 1 小时） |
| `last_fetched_at` | integer | | 上次抓取时间 |
| `last_error` | text | | 上次抓取错误信息 |
| `created_at` | integer | 默认当前时间 | 创建时间 |

---

### 6.4 互动相关

#### `trending_scores` — 热门评分表
| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| `article_id` | text | PK, FK → `articles.id` (CASCADE) | 文章 ID |
| `score` | real | 默认 `0` | 热门评分 |
| `computed_at` | integer | 默认当前时间 | 计算时间 |

#### `user_bookmarks` — 用户收藏表
| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| `user_id` | text | NOT NULL, FK → `users.id` (CASCADE) | 用户 ID |
| `article_id` | text | NOT NULL, FK → `articles.id` (CASCADE) | 文章 ID |
| `created_at` | integer | 默认当前时间 | 收藏时间 |

#### `user_likes` — 用户点赞表
| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| `user_id` | text | NOT NULL, FK → `users.id` (CASCADE) | 用户 ID |
| `article_id` | text | NOT NULL, FK → `articles.id` (CASCADE) | 文章 ID |
| `created_at` | integer | 默认当前时间 | 点赞时间 |

---

## 七、数据目录

```
FaelAI/
├── local.db                         # 本地 SQLite 数据库文件（开发环境）
├── dist/                            # 生产构建输出
│   ├── client/                      # 客户端打包文件
│   └── server/                      # 服务端打包文件
├── .astro/                          # Astro 生成的类型文件
│   ├── content.d.ts                 # 内容集合类型定义
│   └── types.d.ts                   # 客户端类型引用
└── node_modules/                    # 依赖包
```

### 数据库迁移文件

```
src/db/migrations/
├── 0000_huge_nicolaos.sql           # 初始迁移（创建 12 张表 + 唯一索引）
└── meta/
    ├── _journal.json                # 迁移执行日志
    └── 0000_snapshot.json           # Schema 快照（用于后续迁移比对）
```

---

## 八、常用命令

```bash
# 安装依赖
pnpm install

# 开发服务器（端口 8081）
pnpm run dev

# 生产构建
pnpm run build

# 预览生产构建
pnpm run preview

# 数据库迁移
pnpm run db:generate                # 生成迁移文件
pnpm run db:migrate                 # 执行迁移
pnpm run db:studio                  # 打开 Drizzle Studio（数据库可视化）

# 创建管理员账号
npx tsx scripts/seed-admin.ts
```

### 管理员账号

| 项目 | 值 |
|------|-----|
| 邮箱 | `admin@faelai.com` |
| 用户名 | `admin` |
| 密码 | `Admin@123456` |

---

## 九、多语言路由规则

- **中文（zh）**：默认语言，路由无前缀 → `/news`、`/about`、`/login`
- **英文（en）**：非默认语言，路由带前缀 → `/en/news`、`/en/about`、`/en/login`
- 配置项：`astro.config.mjs` → `i18n.prefixDefaultLocale: true`
- 工具函数：`getLocalizedPath(path, lang)` 根据语言生成 URL
- 管理后台和 API 路由无语言前缀

---

## 十、路由保护规则

| 路由前缀 | 保护规则 |
|----------|----------|
| `/admin` | 仅 `admin` 或 `editor` 角色可访问，否则重定向到首页 |
| `/dashboard` | 需登录，未登录重定向到对应语言的登录页 |
| `/api/auth/login` | 公开 |
| `/api/auth/register` | 公开 |
| `/api/auth/github` | 公开（OAuth 回调） |
| `/api/auth/google` | 公开（OAuth 回调） |
| 其他 `/api/*` | 需登录（通过 Session Cookie 验证） |

---

## 十一、认证流程

```
用户登录 → POST /api/auth/login
  → 验证邮箱和密码（Argon2）
  → 创建 Session（Token = 20 字节随机 Base32）
  → Session ID = SHA-256(Token)
  → 存入数据库
  → Set-Cookie: session=<token>; HttpOnly; SameSite=Lax

请求受保护资源 → 中间件读取 Cookie
  → SHA-256(Token) 匹配数据库 Session
  → 检查过期时间（30 天）
  → 将 user 挂载到 context.locals

用户登出 → POST /api/auth/logout
  → 从数据库删除 Session
  → Set-Cookie: session=; Max-Age=0
```

---

## 十二、站点配置

集中管理在 `src/config/site.ts`，包含：

- **站点信息**：名称、标题（中/英）、描述、URL
- **导航链接**：新闻、趋势、热门、关于
- **分类**：大模型、AI 应用、机器人、芯片、前沿研究、行业动态
- **话题标签**：GPT、Claude、Gemini、Llama、Copilot、Sora
- **底部链接**：产品、分类、话题
- **社交链接**：GitHub、Twitter/X
- **协议页面**：隐私政策、服务条款、免责声明

---

## 十三、部署

### 环境要求

- Node.js >= 18
- pnpm >= 8

### 生产环境配置

1. 设置所有环境变量（参考 `.env.example`）
2. 配置 Turso 远程数据库 URL
3. 配置 Cloudflare R2 凭据
4. 配置 SMTP 凭据（邮箱验证码）
5. 配置 OAuth 凭据（可选）

```bash
pnpm install
pnpm run db:migrate
pnpm run build
pnpm run preview        # 或 node dist/server/entry.mjs
```
