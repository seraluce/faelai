// src/config/rss.ts
// 功能：RSS 配置 — 抓取超时、User-Agent、阅读速度、抓取间隔、缓存时间

export const rssConfig = {
  /** RSS 抓取超时（毫秒） */
  fetchTimeout: 10000,

  /** 请求 User-Agent */
  userAgent: 'FaelAI/1.0 RSS Aggregator',

  /** 阅读速度（词/分钟） */
  wordsPerMinute: 200,

  /** 默认抓取间隔（秒），默认 1 小时 */
  defaultFetchInterval: 3600,

  /** RSS 输出缓存时间（秒） */
  cacheMaxAge: 3600,

  /** Sitemap 输出缓存时间（秒） */
  sitemapCacheMaxAge: 3600,
};

export type RssConfig = typeof rssConfig;
