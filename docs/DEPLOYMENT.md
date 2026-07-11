<!-- 功能：生产环境部署文档 — 环境变量配置、数据库迁移、构建部署、Cloudflare Pages/Vercel/Docker 部署方案 -->

# FaelAI 生产环境部署指南

## 环境要求

- Node.js 18+
- pnpm 8+
- Turso 数据库（或兼容 SQLite 的托管服务）

## 环境变量

| 变量名               | 必填 | 说明                                            |
| -------------------- | ---- | ----------------------------------------------- |
| TURSO_DATABASE_URL   | 是   | Turso 数据库 URL（格式：libsql://xxx.turso.io） |
| TURSO_AUTH_TOKEN     | 是   | Turso 认证令牌                                  |
| PUBLIC_SITE_URL      | 是   | 站点完整 URL（如 https://faelai.com）           |
| SMTP_HOST            | 否   | SMTP 服务器地址                                 |
| SMTP_PORT            | 否   | SMTP 端口（默认 587）                           |
| SMTP_USER            | 否   | SMTP 用户名                                     |
| SMTP_PASS            | 否   | SMTP 密码                                       |
| RESEND_API_KEY       | 否   | Resend API 密钥（优先于 SMTP）                  |
| R2_ACCOUNT_ID        | 否   | Cloudflare R2 账户 ID                           |
| R2_ACCESS_KEY_ID     | 否   | R2 访问密钥                                     |
| R2_SECRET_ACCESS_KEY | 否   | R2 密钥                                         |
| R2_BUCKET_NAME       | 否   | R2 存储桶名称                                   |
| R2_PUBLIC_URL        | 否   | R2 公开访问 URL                                 |
| GITHUB_CLIENT_ID     | 否   | GitHub OAuth Client ID                          |
| GITHUB_CLIENT_SECRET | 否   | GitHub OAuth Client Secret                      |
| GOOGLE_CLIENT_ID     | 否   | Google OAuth Client ID                          |
| GOOGLE_CLIENT_SECRET | 否   | Google OAuth Client Secret                      |

## 部署步骤

### 1. 准备

1. 克隆仓库
2. 复制 `.env.example` 为 `.env` 并填写环境变量
3. 安装依赖：`pnpm install`

### 2. 数据库

1. 生成迁移：`pnpm run db:generate`
2. 执行迁移：`pnpm run db:migrate`
3. 创建管理员：`npx tsx scripts/seed-admin.ts`

### 3. 构建与启动

```bash
pnpm run build
pnpm run preview  # 预览生产构建
```

## 部署方案

### Cloudflare Pages

1. 连接 GitHub 仓库
2. 构建命令：`pnpm run build`
3. 输出目录：`dist`
4. 在 Cloudflare Dashboard 配置环境变量
5. 需要启用 Node.js 兼容性（Wrangler 设置中添加 `nodejs_compat`）

### Vercel

1. 导入 GitHub 仓库
2. 框架预设：Astro
3. 构建命令：`pnpm run build`
4. 输出目录：`dist`
5. 在 Vercel Dashboard 配置环境变量

### Node.js 服务器

```bash
pnpm run build
node dist/server/entry.mjs
```

### Docker

见下方 Docker 章节。

### Docker Compose 部署

```bash
# 构建并启动
docker compose up -d --build

# 查看日志
docker compose logs -f faelai

# 停止服务
docker compose down

# 重建并重启
docker compose up -d --build --force-recreate
```

## 性能优化建议

- 启用 Cloudflare CDN 加速静态资源
- 配置 Cloudflare R2 存储用户上传文件，减轻服务器负担
- 使用 Turso 的边缘复制功能，降低数据库延迟
- 定期清理过期 RSS 缓存数据

## 注意事项

- 确保 `PUBLIC_SITE_URL` 使用 HTTPS
- 生产环境必须配置 SMTP 或 Resend API 以发送邮件
- R2 配置为可选，不配置则使用本地存储
- Turso 免费套餐适合小规模部署
- Docker 部署时，数据库文件默认存储在容器内部，建议使用外部卷挂载或切换到 Turso 远程数据库
