// src/pages/rss.xml.ts
// 功能：RSS 输出端点 — 按需渲染，生成最新文章的 RSS XML 格式
import type { APIRoute } from 'astro';
import { siteConfig } from '@/config/site';

export const prerender = false;

export const GET: APIRoute = async () => {
  const baseUrl = siteConfig.url;
  // Placeholder RSS feed - will be populated with real data
  const rssItems = [
    {
      title: 'OpenAI 发布 GPT-5，推理能力大幅提升',
      link: `${baseUrl}/zh/news/openai-releases-gpt-5-with-reasoning-capabilities`,
      description: 'OpenAI 今日正式发布了 GPT-5 模型，在数学推理、代码生成和多语言理解方面取得了显著突破。',
      pubDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toUTCString(),
      author: 'FaelAI',
    },
    {
      title: 'Anthropic 发布 Claude 4 安全研究报告',
      link: `${baseUrl}/zh/news/anthropic-claude-4-safety-research`,
      description: 'Anthropic 发布了关于 Claude 4 安全性的深度研究报告。',
      pubDate: new Date(Date.now() - 4 * 60 * 60 * 1000).toUTCString(),
      author: 'FaelAI',
    },
    {
      title: 'Google DeepMind 在蛋白质折叠领域取得新突破',
      link: `${baseUrl}/zh/news/google-deepmind-protein-folding-breakthrough`,
      description: 'DeepMind 的 AlphaFold 3 在蛋白质结构预测方面取得了新的里程碑式成果。',
      pubDate: new Date(Date.now() - 6 * 60 * 60 * 1000).toUTCString(),
      author: 'FaelAI',
    },
  ];

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>FaelAI - AI News Aggregator</title>
    <description>实时追踪人工智能领域最新动态</description>
    <link>${baseUrl}</link>
    <language>zh-cn</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    ${rssItems
      .map(
        item => `    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${item.link}</link>
      <description><![CDATA[${item.description}]]></description>
      <pubDate>${item.pubDate}</pubDate>
      <author>${item.author}</author>
    </item>`
      )
      .join('\n')}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
