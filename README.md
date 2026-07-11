# FaelAI

AI 资讯与工具平台 — 聚合全球 AI 新闻，未来支持 API Key 购买、AI 工具部署

## 项目简介

FaelAI 是一个 AI 新闻聚合与发布平台，自动采集各大 AI 网站的文章和资讯，提供统一的阅读体验。

**当前功能：**

- 自动抓取并聚合全球 AI 新闻源（RSS）
- 文章浏览、搜索、分类、标签
- 多语言支持（中文/英文）
- 深色/浅色模式
- 用户系统（注册、登录、OAuth）
- 管理后台（文章、分类、RSS 源管理）

**未来规划：**

- AI API Key 购买与管理
- AI 工具/模型部署与在线使用
- 更多内容形式（教程、评测、对比）

## 功能特性

- **RSS 聚合** — 自动抓取 10+ AI 新闻源，全文提取
- **文章发布** — 富文本编辑器，支持 Markdown
- **多用户系统** — 注册/登录，GitHub/Google OAuth
- **多语言** — 中文/英文，URL 前缀路由
- **深浅模式** — 跟随系统或手动切换
- **响应式** — 自适应移动端到桌面端
- **搜索** — 全站搜索
- **热度排行** — 智能热度算法
- **对象存储** — Cloudflare R2 图片存储
- **管理后台** — 文章、RSS 源、分类、用户管理
- **SEO 优化** — OG 标签自动生成、Sitemap、JSON-LD

## 技术栈

| 层         | 技术                       | 版本     |
| ---------- | -------------------------- | -------- |
| 框架       | Astro                      | 7.x      |
| UI 框架    | React                      | 19.x     |
| 样式       | Tailwind CSS               | v4.x     |
| 组件库     | shadcn/ui                  | latest   |
| 数据库     | Turso (libSQL/SQLite)      | edge     |
| ORM        | Drizzle ORM                | latest   |
| 对象存储   | Cloudflare R2              | S3 兼容  |
| 认证       | Session-based (Lucia 模式) | -        |
| OAuth      | Arctic (GitHub/Google)     | latest   |
| 密码哈希   | @node-rs/argon2            | latest   |
| 国际化     | Astro 原生路由             | built-in |
| RSS 解析   | rss-parser                 | 3.x      |
| 富文本编辑 | Tiptap                     | latest   |

## 快速开始

### 环境要求

- Node.js >= 18
- pnpm >= 8

### 安装步骤

```bash
# 克隆仓库
git clone https://github.com/seraluce/faelai.git
cd FaelAI

# 安装依赖
pnpm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 填入你的配置

# 生成并执行数据库迁移
pnpm run db:generate
pnpm run db:migrate

# 创建管理员账号
npx tsx scripts/seed-admin.ts

# 启动开发服务器
pnpm run dev
```

### 环境变量

```env
# Turso 数据库（本地开发用 SQLite）
TURSO_DATABASE_URL=file:local.db
TURSO_AUTH_TOKEN=

# Cloudflare R2
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=faelai-media
R2_PUBLIC_URL=https://media.faelai.com

# 认证
JWT_SECRET=your_jwt_secret

# OAuth（可选）
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# 邮箱验证码（SMTP）
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=

# 站点
PUBLIC_SITE_URL=http://localhost:8081
PUBLIC_SITE_NAME=FaelAI
```

### 管理员账号

| 项目   | 值                 |
| ------ | ------------------ |
| 邮箱   | `admin@faelai.com` |
| 用户名 | `admin`            |
| 密码   | `Admin@123456`     |

## 项目结构

```
FaelAI/
├── public/                        # 静态资源
├── scripts/
│   └── seed-admin.ts              # 管理员种子脚本
├── src/
│   ├── components/
│   │   ├── layout/                # Header、Footer
│   │   ├── news/                  # 文章卡片组件
│   │   └── ui/                    # shadcn/ui 组件
│   ├── config/                    # 配置文件（5 个）
│   │   ├── site.ts                # 站点信息、导航、分类
│   │   ├── auth.ts                # 认证配置
│   │   ├── email.ts               # 邮件配置
│   │   ├── rss.ts                 # RSS 配置
│   │   └── api.ts                 # API 配置
│   ├── db/migrations/             # 数据库迁移
│   ├── i18n/                      # 国际化翻译
│   ├── layouts/                   # BaseLayout、AdminLayout
│   ├── lib/
│   │   ├── auth/                  # 认证（Session、密码、邮箱）
│   │   ├── db/                    # 数据库（Drizzle ORM，12 张表）
│   │   ├── rss/                   # RSS 抓取
│   │   └── utils/                 # 工具函数
│   ├── middleware.ts               # 路由保护
│   ├── pages/                     # 页面路由
│   │   ├── index.astro            # 首页
│   │   ├── news/                  # 新闻列表、详情
│   │   ├── admin/                 # 管理后台
│   │   ├── dashboard/             # 用户仪表盘
│   │   ├── en/                    # 英文页面
│   │   └── api/                   # API 路由
│   └── styles/global.css          # 全局样式
├── docs/
│   ├── DEVELOPMENT.md             # 开发文档
│   └── TODO.md                    # 待办事项
├── .env                           # 环境变量（不提交）
├── .env.example                   # 环境变量模板
├── astro.config.mjs
├── drizzle.config.ts
├── local.db                       # 本地 SQLite 数据库
└── package.json
```

## RSS 源

### 英文

| 来源            | 分类           |
| --------------- | -------------- |
| OpenAI Blog     | AI Companies   |
| Anthropic       | AI Companies   |
| The Verge AI    | Tech News      |
| TechCrunch AI   | Tech News      |
| Hacker News     | Tech Community |
| MIT Tech Review | Research       |
| ArXiv AI        | Research       |
| Hugging Face    | AI Companies   |
| The Rundown AI  | AI Newsletter  |
| Ars Technica    | Tech News      |

### 中文

| 来源       | 分类       |
| ---------- | ---------- |
| 机器之心   | AI Media   |
| 量子位     | AI Media   |
| InfoQ 中文 | Tech Media |

## 开发文档

详细的开发文档请查阅：

- [AGENTS.md](./AGENTS.md) — 开发者入口指南
- [docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md) — 完整开发文档（技术栈、数据库、路由、认证流程等）
- [docs/TODO.md](./docs/TODO.md) — 待办事项追踪

## 许可证

MIT
