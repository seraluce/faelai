# FaelAI — 开发者指南

> **本文件是项目的入口文档。任何 AI 工具接手开发前，必须先阅读本文件、`docs/DEVELOPMENT.md` 和 `docs/TODO.md`。**

---

## 项目背景

FaelAI 是一个 **AI 新闻聚合与发布平台**，目标是实时追踪人工智能领域最新动态。项目从零构建，已完成基础架构，正在逐步完善功能。

**GitHub 仓库**: https://github.com/seraluce/faelai

## 技术栈

| 技术            | 版本   | 用途                                        |
| --------------- | ------ | ------------------------------------------- |
| Astro           | ^7.0   | 主框架（SSR 模式，`output: 'server'`）      |
| React           | ^19.0  | 交互式岛屿组件                              |
| Tailwind CSS    | ^4.0   | 样式系统（CSS 优先配置，通过 `@theme`）     |
| shadcn/ui       | latest | UI 组件库（位于 `src/components/ui/`）      |
| Drizzle ORM     | ^0.44  | 类型安全的数据库查询                        |
| Turso/libSQL    | ^0.17  | 数据库（本地开发用 SQLite `file:local.db`） |
| Cloudflare R2   | ^3.700 | 对象存储（兼容 S3 协议）                    |
| Arctic          | ^3.0   | OAuth（GitHub/Google）                      |
| nodemailer      | ^9.0   | 邮箱验证码发送                              |
| @node-rs/argon2 | ^2.0   | 密码哈希                                    |
| rss-parser      | ^3.13  | RSS 抓取与解析                              |
| Tiptap          | ^2.0   | 富文本编辑器（已安装，待集成）              |

## 常用命令

```bash
pnpm install              # 安装依赖
pnpm run dev              # 开发服务器（端口 8081）
pnpm run build            # 生产构建
pnpm run preview          # 预览生产构建
pnpm run lint             # ESLint 代码检查
pnpm run lint:fix         # ESLint 自动修复
pnpm run format           # Prettier 格式化全部文件
pnpm run format:check     # 检查格式是否符合规范
pnpm run typecheck        # TypeScript 类型检查
pnpm run check:all        # 一键执行全部检查（格式 + Lint + 类型）
pnpm run test             # 运行测试
pnpm run test:watch       # 监听模式运行测试
pnpm run deps:check       # 检查依赖更新
pnpm run deps:update      # 更新所有依赖
pnpm run db:generate      # 生成数据库迁移
pnpm run db:migrate       # 执行数据库迁移
pnpm run db:studio        # 打开 Drizzle Studio
npx tsx scripts/seed-admin.ts  # 创建管理员账号
```

### 管理员账号

| 项目   | 值                 |
| ------ | ------------------ |
| 邮箱   | `admin@faelai.com` |
| 用户名 | `admin`            |
| 密码   | `Admin@123456`     |

## 核心约束（必须遵守）

1. **全程使用中文**，包括思考过程、回答、询问、代码注释、提交信息、文档等，一律使用中文（响应中的标题、正文、说明文字均用中文，仅代码和专有名词保持英文）
2. **禁止使用 emoji**，全部使用 lucide-react 图标或内联 SVG
3. **禁止使用标点符号字符**，全站所有输出的文本内容（包括 HTML、模板、JS 中的文字）中，禁止直接使用 `©`、`|`、`·`、`—`、`–`、`'`、`"`、`!`、`?` 等标点符号的原始字符，必须替换为对应的 HTML 实体编码。详见「标点符号 HTML 实体规则」
4. **不得改变主题色**（accent color: `#0070f3`）
5. **每个源文件最顶端必须添加注释**（路径 + 功能描述）
6. **URL 不写死**，全部从 `siteConfig.url` 或环境变量读取
7. **后台导航与前台导航完全分离**
8. **用户头像默认本地存储**，需兼容 S3 协议
9. **邮箱修改需重新验证**
10. **必须使用参数化查询**（禁止字符串拼接 SQL）
11. **不自动提交 Git** — 仅在明确要求时提交
12. **UI 设计严格对齐 Geist Design System** — 参考 Vercel Geist 的色彩系统、字体排版、圆角、阴影、间距规范，详见「Geist 设计系统规范」

## Geist 设计系统规范

本项目的 UI 设计参考 Vercel Geist Design System，所有前端界面必须遵循以下规范：

### 色彩系统

使用 10 级灰度色阶（gray-100 ~ gray-1000），每个级别有明确用途：

| 级别           | 用途                 | CSS 变量                       |
| -------------- | -------------------- | ------------------------------ |
| background-100 | 默认页面/卡片背景    | `--color-background`           |
| background-200 | 次级背景（微妙区分） | `--color-background-secondary` |
| gray-100       | 组件默认背景         | `--color-card`                 |
| gray-200       | 组件悬浮背景         | `--color-card-hover`           |
| gray-300       | 组件激活背景         | `--color-background-hover`     |
| gray-400       | 默认边框             | `--color-border`               |
| gray-500       | 悬浮边框             | `--color-border-hover`         |
| gray-600       | 激活边框             | `--color-border-strong`        |
| gray-700       | 禁用文字/图标        | `--color-text-disabled`        |
| gray-900       | 次要文字/图标        | `--color-text-secondary`       |
| gray-1000      | 主要文字/图标        | `--color-text-primary`         |

### 字体排版

- 标题：`font-weight: 600`，`letter-spacing` 随字号递减收紧（14px: -0.28px, 20px: -0.4px, 24px: -0.96px, 32px: -1.28px）
- 正文：`font-weight: 400`，`line-height: 1.5` ~ `1.6`
- 按钮文字：`font-weight: 500`
- 单行标签文字使用 Label 样式，多行正文使用 Copy 样式

### 圆角

| 场景                 | 圆角                        |
| -------------------- | --------------------------- |
| 按钮、输入框、小控件 | `6px`（`--radius-sm`）      |
| 卡片、菜单、模态框   | `12px`（`--radius-md`）     |
| 全屏浮层             | `16px`（`--radius-lg`）     |
| 头像、药丸标签       | `9999px`（`--radius-pill`） |

### 阴影层级

| 场景     | 阴影                                                                                              |
| -------- | ------------------------------------------------------------------------------------------------- |
| 抬升卡片 | `0 2px 2px rgba(0,0,0,0.04)`                                                                      |
| 弹出菜单 | `0 1px 1px rgba(0,0,0,0.02), 0 4px 8px -4px rgba(0,0,0,0.04), 0 16px 24px -8px rgba(0,0,0,0.06)`  |
| 模态框   | `0 1px 1px rgba(0,0,0,0.02), 0 8px 16px -4px rgba(0,0,0,0.04), 0 24px 32px -8px rgba(0,0,0,0.06)` |

### 间距

遵循 4px 基准网格：4, 8, 12, 16, 24, 32, 40, 64, 96px。三步节奏：8px 组内间距，16px 组间间距，32~40px 区块间距。卡片内边距 24px。

### 动效

- 大多数交互应感觉即时：0ms 是最佳选择
- 状态变化：150ms，弹出菜单：200ms，覆盖层：300ms
- 缓动函数：`cubic-bezier(0.175, 0.885, 0.32, 1.1)`
- 尊重 `prefers-reduced-motion`

### 按钮

- 主按钮：实心填充（gray-1000 背景 + background-100 文字），高度 40px
- 次按钮：background-100 背景 + 半透明边框，高度 40px
- 三级按钮：透明背景 + gray-1000 文字，高度 40px
- 圆角统一 `6px`

### 焦点环

双层焦点环：`box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px #006bff`

## 标点符号 HTML 实体规则

全站所有输出的文本内容中，禁止直接使用以下标点符号的原始字符，必须替换为 HTML 实体：

| 符号           | HTML 实体                                                                                            | 使用场景           |
| -------------- | ---------------------------------------------------------------------------------------------------- | ------------------ |
| `©`            | `&copy;`                                                                                             | 版权声明           |
| `\|`           | 在 HTML 模板中使用 CSS `border-left/right` 或 `::before/::after` 伪元素替代，或使用 `\|` 的实体 `\|` |
| `·`            | `&middot;`                                                                                           | 分隔符列表         |
| `—`（em dash） | `&mdash;`                                                                                            | 破折号             |
| `–`（en dash） | `&ndash;`                                                                                            | 范围连接           |
| `'`            | `&apos;` 或 `&#39;`                                                                                  | 撇号               |
| `"`            | `&quot;`                                                                                             | 双引号（属性值内） |
| `!`            | `!`                                                                                                  | 感叹号             |
| `?`            | `?`                                                                                                  | 问号               |

**规则细节：**

1. **HTML 模板中**（`.astro` 文件的 HTML 部分）：直接写入 HTML 实体编码
2. **JavaScript 变量/字符串中**：使用对应的 Unicode 转义或 HTML 实体，例如 `'\u00a9'` 或在 innerHTML 赋值时使用实体
3. **CSS content 属性中**：使用 CSS 转义，例如 `content: '\a9'`（版权符号）
4. **优先方案**：对于分隔符（如 `|` 和 `·`），优先使用 CSS 伪元素（`::before` / `::after`）或 border 来实现视觉分隔，而非直接在文本中插入标点符号

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
