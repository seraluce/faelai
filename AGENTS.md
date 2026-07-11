# FaelAI — 开发者指南

> **本文件是项目的入口文档。任何 AI 工具接手开发前，必须先阅读本文件、`docs/DEVELOPMENT.md` 和 `docs/TODO.md`。**

---

## 项目背景

FaelAI 是一个 **AI 新闻聚合与发布平台**，目标是实时追踪人工智能领域最新动态。项目从零构建，已完成基础架构，正在逐步完善功能。

**GitHub 仓库**: https://github.com/seraluce/faelai

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Astro | ^7.0 | 主框架（SSR 模式，`output: 'server'`） |
| React | ^19.0 | 交互式岛屿组件 |
| Tailwind CSS | ^4.0 | 样式系统（CSS 优先配置，通过 `@theme`） |
| shadcn/ui | latest | UI 组件库（位于 `src/components/ui/`） |
| Drizzle ORM | ^0.44 | 类型安全的数据库查询 |
| Turso/libSQL | ^0.17 | 数据库（本地开发用 SQLite `file:local.db`） |
| Cloudflare R2 | ^3.700 | 对象存储（兼容 S3 协议） |
| Arctic | ^3.0 | OAuth（GitHub/Google） |
| nodemailer | ^9.0 | 邮箱验证码发送 |
| @node-rs/argon2 | ^2.0 | 密码哈希 |
| rss-parser | ^3.13 | RSS 抓取与解析 |
| Tiptap | ^2.0 | 富文本编辑器（已安装，待集成） |

## 常用命令

```bash
pnpm install              # 安装依赖
pnpm run dev              # 开发服务器（端口 8081）
pnpm run build            # 生产构建
pnpm run preview          # 预览生产构建
pnpm run db:generate      # 生成数据库迁移
pnpm run db:migrate       # 执行数据库迁移
pnpm run db:studio        # 打开 Drizzle Studio
npx tsx scripts/seed-admin.ts  # 创建管理员账号
```

### 管理员账号

| 项目 | 值 |
|------|-----|
| 邮箱 | `admin@faelai.com` |
| 用户名 | `admin` |
| 密码 | `Admin@123456` |

## 核心约束（必须遵守）

1. **全程使用中文**，包括思考过程、回答、询问、代码注释、提交信息、文档等，一律使用中文（响应中的标题、正文、说明文字均用中文，仅代码和专有名词保持英文）
2. **禁止使用 emoji**，全部使用 lucide-react 图标或内联 SVG
3. **不得改变主题色**（accent color: `#0070f3`）
4. **每个源文件最顶端必须添加注释**（路径 + 功能描述）
5. **URL 不写死**，全部从 `siteConfig.url` 或环境变量读取
6. **后台导航与前台导航完全分离**
7. **用户头像默认本地存储**，需兼容 S3 协议
8. **邮箱修改需重新验证**
9. **必须使用参数化查询**（禁止字符串拼接 SQL）
10. **不自动提交 Git** — 仅在明确要求时提交

## 项目结构速览

```
FaelAI/
├── public/                    # 静态资源（favicon.svg、robots.txt、site.webmanifest）
├── scripts/
│   └── seed-admin.ts          # 管理员种子脚本
├── src/
│   ├── components/
│   │   ├── layout/            # Header.astro、Footer.astro
│   │   ├── news/              # NewsCard.astro
│   │   └── ui/                # shadcn/ui 组件（预留）
│   ├── config/                # 配置文件（5个，按相关性分类）
│   │   ├── site.ts            # 站点信息、导航、分类、社交
│   │   ├── auth.ts            # 认证（Session、密码、验证码、角色）
│   │   ├── email.ts           # 邮件（SMTP、发件人、模板）
│   │   ├── rss.ts             # RSS（超时、UA、阅读速度、缓存）
│   │   └── api.ts             # API（分页、默认值、时间阈值）
│   ├── db/migrations/         # 数据库迁移文件
│   ├── i18n/                  # 国际化（ui.ts 翻译文案、utils.ts 工具）
│   ├── layouts/
│   │   ├── BaseLayout.astro   # 基础布局（head SEO、Header/Footer）
│   │   └── AdminLayout.astro  # 后台布局（左侧导航、返回前台）
│   ├── lib/
│   │   ├── auth/              # 认证（session.ts、password.ts、email.ts）
│   │   ├── db/                # 数据库（index.ts 客户端、schema.ts 12张表）
│   │   ├── rss/               # RSS 抓取
│   │   └── utils/             # 工具函数
│   ├── middleware.ts           # 路由保护中间件
│   ├── pages/                 # 页面路由
│   │   ├── index.astro        # 首页
│   │   ├── 404.astro          # 404（中文）
│   │   ├── en/                # 英文页面（/en 前缀）
│   │   ├── admin/             # 管理后台
│   │   └── api/               # API 路由
│   └── styles/global.css      # 全局样式
├── docs/
│   ├── DEVELOPMENT.md         # 完整开发文档
│   └── TODO.md                # 待办事项
├── .env                       # 环境变量（不提交）
├── .env.example               # 环境变量模板
├── astro.config.mjs           # Astro 配置
├── drizzle.config.ts          # Drizzle 配置
├── local.db                   # 本地 SQLite 数据库
└── package.json
```

## Git 工作流

- 分支：从 main 分支拉取，前缀 `feat/`、`fix/`、`chore/`
- 提交：约定式提交 `feat: add user auth`、`fix: resolve RSS parsing`
- **不自动提交** — 仅在用户明确要求时提交和推送

## 禁止修改

- `package-lock.json` — 仅通过 `pnpm install` 更新
- `.env` — 包含敏感信息，禁止提交
- `src/db/migrations/` — 通过 drizzle-kit 生成，禁止手动编辑
