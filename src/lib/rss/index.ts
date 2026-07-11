// src/lib/rss/index.ts
// 功能：RSS 抓取与解析 — fetchRSSFeed（rss-parser）、HTML 内容提取、阅读时间估算
import Parser from 'rss-parser';

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'FaelAI/1.0 RSS Aggregator',
  },
});

export interface RSSItem {
  title: string;
  link: string;
  description?: string;
  content?: string;
  pubDate?: Date;
  author?: string;
  categories?: string[];
  enclosure?: {
    url: string;
    type?: string;
  };
}

export interface RSSFeed {
  title: string;
  description?: string;
  link?: string;
  items: RSSItem[];
}

export async function fetchRSSFeed(url: string): Promise<RSSFeed> {
  try {
    const feed = await parser.parseURL(url);

    return {
      title: feed.title || '',
      description: feed.description || '',
      link: feed.link || '',
      items: (feed.items || []).map((item) => ({
        title: item.title || '',
        link: item.link || '',
        description: item.contentSnippet || item.content || '',
        content: item.content || '',
        pubDate: item.pubDate ? new Date(item.pubDate) : undefined,
        author: item.creator || item.author || '',
        categories: item.categories || [],
        enclosure: item.enclosure
          ? {
              url: item.enclosure.url || '',
              type: item.enclosure.type || '',
            }
          : undefined,
      })),
    };
  } catch (error) {
    console.error(`Failed to fetch RSS feed from ${url}:`, error);
    throw new Error(`RSS feed fetch failed: ${url}`, { cause: error });
  }
}

export function extractReadableContent(html: string): string {
  // Simple HTML to text conversion
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}
