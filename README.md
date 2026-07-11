# FaelAI

AI 新闻聚合与发布平台 — Built with Astro 7

## 功能特性

- **RSS 聚合** — 自动抓取 10+ AI 新闻源，全文提取
- **文章发布** — 富文本编辑器，支持 Markdown
- **多用户系统** — 注册/登录，GitHub/Google OAuth
- **多语言** — 中文/英文
- **深浅模式** — 跟随系统或手动切换
- **评论区** — Giscus (GitHub Discussions)
- **响应式** — 自适应移动端到桌面端
- **搜索** — Cmd+K 快捷搜索
- **热度排行** — 智能热度算法
- **对象存储** — Cloudflare R2 图片存储
- **管理后台** — 文章、RSS 源、分类、用户管理

## 技术栈

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Astro | 7.x |
| UI Framework | React | 19.x |
| Styling | Tailwind CSS | v4.x |
| Component Library | shadcn/ui | latest |
| Database | Turso (libSQL/SQLite) | edge |
| ORM | Drizzle ORM | latest |
| Object Storage | Cloudflare R2 | S3-compatible |
| Auth | Session-based (Lucia pattern) | - |
| OAuth | Arctic (GitHub/Google) | latest |
| Password Hashing | @node-rs/argon2 | latest |
| i18n | Astro native routing | built-in |
| Comments | Giscus | latest |
| RSS Parsing | rss-parser | 3.x |
| Content Extraction | @mozilla/readability | latest |
| Icons | Lucide React | latest |
| Editor | Tiptap | latest |

## 快速开始

### 环境要求

- Node.js 22.12.0 or higher
- npm or pnpm
- Turso account (free tier)
- Cloudflare account with R2 enabled

### 安装步骤

```bash
# 克隆仓库
git clone https://github.com/your-username/FaelAI.git
cd FaelAI

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 填入你的配置

# 生成并执行数据库迁移
npx drizzle-kit generate
npx drizzle-kit migrate

# 启动开发服务器
npm run dev
```

### 环境变量

```env
# Turso 数据库
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your_token

# Cloudflare R2
R2_ACCOUNT_ID=xxx
R2_ACCESS_KEY_ID=xxx
R2_SECRET_ACCESS_KEY=xxx
R2_BUCKET_NAME=faelai-media
R2_PUBLIC_URL=https://media.faelai.com

# 认证
JWT_SECRET=your_jwt_secret

# OAuth（可选）
GITHUB_CLIENT_ID=xxx
GITHUB_CLIENT_SECRET=xxx
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx

# Giscus 评论
GISCUS_REPO=your-username/your-repo
GISCUS_REPO_ID=xxx
GISCUS_CATEGORY=Comments
GISCUS_CATEGORY_ID=xxx

# 站点
PUBLIC_SITE_URL=http://localhost:4321
PUBLIC_SITE_NAME=FaelAI
```

## 项目结构

```
FaelAI/
├── src/
│   ├── pages/
│   │   ├── zh/                    # 中文页面
│   │   ├── en/                    # 英文页面
│   │   ├── admin/                 # 管理后台
│   │   └── api/                   # API 端点
│   ├── components/
│   │   ├── ui/                    # shadcn/ui 组件
│   │   ├── layout/                # 布局组件
│   │   ├── home/                  # 首页区块
│   │   ├── news/                  # 新闻卡片组件
│   │   └── admin/                 # 管理后台组件
│   ├── lib/
│   │   ├── db/                    # 数据库 (Turso + Drizzle)
│   │   ├── rss/                   # RSS 抓取
│   │   ├── auth/                  # 认证
│   │   ├── storage/               # 对象存储 (R2)
│   │   └── utils/                 # 工具函数
│   ├── i18n/                      # 国际化文案
│   ├── styles/                    # 全局样式
│   └── content/                   # 内容集合
├── public/                        # 静态资源
├── astro.config.mjs               # Astro 配置
├── drizzle.config.ts              # Drizzle 配置
├── AGENTS.md                      # 开发者指南
└── README.md
```

## RSS 源

### 英文

| Source | Category |
|--------|----------|
| OpenAI Blog | AI Companies |
| Anthropic | AI Companies |
| The Verge AI | Tech News |
| TechCrunch AI | Tech News |
| Hacker News | Tech Community |
| MIT Tech Review | Research |
| ArXiv AI | Research |
| Hugging Face | AI Companies |
| The Rundown AI | AI Newsletter |
| Ars Technica | Tech News |

### 中文

| Source | Category |
|--------|----------|
| 机器之心 | AI Media |
| 量子位 | AI Media |
| InfoQ 中文 | Tech Media |

## URL 结构

```
/zh/                          → 中文首页
/en/                          → 英文首页
/zh/news                      → 中文资讯
/zh/news/{slug}               → 文章详情
/zh/category/{slug}           → 分类页
/zh/tag/{tag}                 → 标签页
/zh/trending                  → 热门
/zh/hot                       → 热点
/zh/search?q=xxx              → 搜索
/zh/user/{username}           → 用户主页
/zh/dashboard                 → 用户后台
/admin                        → 管理后台
/api/*                        → API 接口
/rss.xml                      → RSS 订阅
/sitemap.xml                  → 站点地图
```

## 部署

### Vercel

```bash
npm run build
# 部署到 Vercel
```

### Cloudflare Pages

```bash
npx astro build
# 部署到 Cloudflare Pages
```

## 许可证

MIT
