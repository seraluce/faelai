// src/config/api.ts
// 功能：API 配置 — 分页默认值、文章默认状态、排序、时间格式阈值

export const apiConfig = {
  // 分页
  pagination: {
    /** 默认页码 */
    defaultPage: 1,
    /** 默认每页条数 */
    defaultLimit: 20,
    /** 最大每页条数 */
    maxLimit: 100,
  },

  // 文章
  articles: {
    /** 默认文章状态 */
    defaultStatus: 'published' as const,
    /** 默认语言 */
    defaultLang: 'zh',
  },

  // 时间格式化阈值（毫秒）
  time: {
    /** 1 分钟 */
    minute: 60 * 1000,
    /** 1 小时 */
    hour: 60 * 60 * 1000,
    /** 1 天 */
    day: 24 * 60 * 60 * 1000,
    /** 超过此天数（30天）不再显示"X天前"，改为显示日期 */
    relativeDays: 30,
  },

  // 缓存
  cache: {
    /** RSS/Sitemap 缓存（秒） */
    xmlMaxAge: 3600,
  },
};

export type ApiConfig = typeof apiConfig;
