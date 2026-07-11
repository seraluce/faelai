// src/pages/api/og.svg.ts
// 功能：OG 图片自动生成 — 根据查询参数动态生成 SVG 格式的社交分享图（1200x630）
import type { APIRoute } from 'astro';
import { siteConfig } from '@/config/site';

export const prerender = false;

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function wrapText(text: string, maxChars: number): string[] {
  const lines: string[] = [];
  let current = '';
  for (const char of text) {
    current += char;
    if (current.length >= maxChars) {
      lines.push(current);
      current = '';
    }
  }
  if (current) lines.push(current);
  return lines;
}

export const GET: APIRoute = ({ url }) => {
  const title = url.searchParams.get('title') || siteConfig.title;
  const subtitle = url.searchParams.get('subtitle') || siteConfig.description;
  const lang = url.searchParams.get('lang') || 'zh';
  const color = url.searchParams.get('color') || '#0070f3';

  const titleLines = wrapText(title, 18);
  const subtitleLines = wrapText(subtitle, 28);

  const titleY = titleLines.length === 1 ? 280 : titleLines.length === 2 ? 250 : 220;
  const subtitleY = titleY + titleLines.length * 52 + 30;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#000000;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#111111;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${escapeXml(color)};stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0060df;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- 背景 -->
  <rect width="1200" height="630" fill="url(#bg)" />

  <!-- 装饰圆 -->
  <circle cx="1100" cy="80" r="200" fill="${escapeXml(color)}" opacity="0.05" />
  <circle cx="100" cy="550" r="150" fill="${escapeXml(color)}" opacity="0.03" />

  <!-- 顶部装饰线 -->
  <rect x="80" y="80" width="80" height="4" rx="2" fill="url(#accent)" />

  <!-- 品牌名 -->
  <text x="80" y="130" font-family="Inter, system-ui, -apple-system, sans-serif" font-size="28" font-weight="700" fill="#ededed">
    ${escapeXml(siteConfig.name)}
  </text>

  <!-- 标题 -->
  <text x="80" y="${titleY}" font-family="Inter, system-ui, -apple-system, sans-serif" font-size="48" font-weight="700" fill="#ffffff">
    ${titleLines.map((line, i) => `<tspan x="80" dy="${i === 0 ? 0 : 52}">${escapeXml(line)}</tspan>`).join('\n    ')}
  </text>

  <!-- 副标题 -->
  <text x="80" y="${subtitleY}" font-family="Inter, system-ui, -apple-system, sans-serif" font-size="22" fill="#a1a1aa">
    ${subtitleLines.map((line, i) => `<tspan x="80" dy="${i === 0 ? 0 : 34}">${escapeXml(line)}</tspan>`).join('\n    ')}
  </text>

  <!-- 底部装饰线 -->
  <rect x="80" y="560" width="1040" height="1" fill="#1f1f1f" />

  <!-- 底部 URL -->
  <text x="80" y="590" font-family="Inter, system-ui, -apple-system, sans-serif" font-size="16" fill="#71717a">
    ${escapeXml(new URL(siteConfig.url).hostname)}
  </text>

  <!-- 底部颜色装饰 -->
  <rect x="1040" y="580" width="80" height="4" rx="2" fill="url(#accent)" />
</svg>`;

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
