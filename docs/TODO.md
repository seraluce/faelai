# FaelAI 待办事项

> 最后更新: 2026-07-12
> 已完成: 63 / 总计: 63

---

## 一、UI/UX 优化

- [x] 输入框 `required` 未满足时显示红色边框（全局 form 表单）
- [x] 导航栏所有元素垂直居中对齐
- [x] 导航菜单改为卡片式下拉菜单（居中悬浮卡片、圆角、阴影、SVG图标）
- [x] 所有页面统一 padding、margin、border-radius，适配响应式
- [x] 全站禁止使用 emoji，全部替换为 lucide-react 图标
- [x] 404 页面设计与实现（中英文）
- [x] 深色/浅色模式切换不改变主题色（accent color 保持一致）

---

## 二、SEO / Head 标签

- [x] `<head>` 标签内容全面完善（charset、viewport、theme-color、robots、canonical 等）
- [x] OG 标签自动生成（og:title、og:description、og:image、og:url、og:type）
- [x] Twitter Card 标签（twitter:card、twitter:title、twitter:description、twitter:image）
- [x] 结构化数据（JSON-LD：Article、Organization、WebSite）
- [x] RSS 自动发现（`<link rel="alternate" type="application/rss+xml">`）
- [x] Sitemap 自动生成（`/sitemap.xml`）
- [x] robots.txt 配置

---

## 三、管理后台

- [x] 后台独立布局（AdminLayout：左侧导航栏、无前台 Header/Footer）
- [x] 后台导航栏：仅显示后台菜单，不显示前台导航
- [x] 后台导航包含「返回前台」按钮，点击返回前台首页
- [x] 文章发布/编辑页面（富文本编辑器，支持 Markdown 或 Tiptap）
- [x] 文章管理列表（搜索、筛选、批量操作）
- [x] 分类管理页面（CRUD）
- [x] 标签管理页面（CRUD）
- [x] RSS 源管理页面（添加、启用/禁用、手动抓取）
- [x] 用户管理页面（列表、角色修改、封禁）
- [x] 系统设置页面（站点信息、SMTP 配置等）

---

## 四、用户系统

- [x] 用户登录后导航栏按钮变为头像（圆形）
- [x] 头像上传功能（默认本地存储）
- [x] 头像存储兼容 S3 协议（阿里云 OSS、腾讯云 COS、火山引擎 TOS、Cloudflare R2、AWS S3、自建 MinIO）
- [x] 用户个人页面：仅显示个人信息（头像、用户名、昵称、邮箱、角色、注册时间）
- [x] 昵称可修改
- [x] 用户名可修改
- [x] 密码可修改（需验证旧密码）
- [x] 邮箱可修改（需重新验证新邮箱）
- [x] 唯一用户 ID 不可修改

---

## 五、邮件系统

- [x] SMTP 发送支持（已有基础，含验证码/60秒倒计时/开发模式返回）
- [x] Resend API 发送支持（新增）
- [x] 邮件模板设计（验证码、欢迎邮件、密码重置）
- [x] 发送频率限制（防刷）

---

## 六、SEO / 性能

- [x] 页面 meta description 自动生成（BaseLayout Props）
- [x] 图片 lazy loading（`loading="lazy"`）
- [x] HTTP 缓存策略（Cache-Control、ETag）
- [x] 静态资源指纹化（Astro 默认支持）
- [x] 预加载关键资源（`<link rel="preload">`）

---

## 七、内容系统

- [x] 手动发布文章页面（后台，含富文本编辑器）
- [x] 文章草稿/发布/归档状态管理
- [x] 文章封面图上传
- [x] 文章标签关联
- [x] 文章分类关联
- [x] RSS 自动抓取并入库

---

## 八、缺失页面

- [x] 密码重置页面（`/reset-password`）
- [x] 邮箱验证回调页面（`/verify-email`）
- [x] 用户设置页面（`/dashboard/settings`）
- [x] 用户收藏页面（`/dashboard/bookmarks`）
- [x] 用户点赞页面（`/dashboard/likes`）
- [x] 隐私政策页面（`/privacy`）
- [x] 服务条款页面（`/terms`）
- [x] 免责声明页面（`/disclaimer`）

---

## 九、代码规范

- [x] 每个源文件最顶端添加注释（路径 + 功能描述）
- [x] URL 不写死，从 siteConfig.url / 环境变量读取
- [x] 开发文档（docs/DEVELOPMENT.md）
- [x] 待办事项追踪（docs/TODO.md）
- [x] AGENTS.md 强制要求先阅读开发文档和待办

---

## 十、其他

- [x] 生产环境部署文档
- [x] Docker 部署支持

---

> **标记规则**：`[x]` = 已完成，`[ ]` = 待完成
> 每次开发完成后更新此文件的完成状态
