// src/config/site.ts
// 功能：站点集中配置 — 导航、分类（SVG图标名）、话题、页脚链接、社交、协议、版权

export const siteConfig = {
  name: 'FaelAI',
  title: 'AI 资讯与工具平台',
  titleEn: 'AI News & Tools Platform',
  description:
    '聚合全球 AI 新闻资讯，追踪人工智能领域最新动态。未来将支持 API Key 购买、AI 工具部署等更多功能。',
  descriptionEn:
    'Aggregating global AI news and tracking the latest developments in artificial intelligence. Future features include API key sales, AI tool deployment, and more.',
  url: import.meta.env.PUBLIC_SITE_URL || 'https://faelai.com',
  locale: {
    default: 'zh',
    supported: ['zh', 'en'],
  },

  // 导航链接
  nav: [
    { path: '/news', labelKey: 'nav.news' },
    { path: '/trending', labelKey: 'nav.trending' },
    { path: '/hot', labelKey: 'nav.hot' },
    { path: '/about', labelKey: 'nav.about' },
  ],

  // 分类（icon 为 lucide 图标名）
  categories: [
    {
      path: '/category/ai-companies',
      zh: 'AI 公司',
      en: 'AI Companies',
      icon: 'building-2',
      color: '#0070f3',
    },
    {
      path: '/category/research',
      zh: '学术研究',
      en: 'Research',
      icon: 'book-open',
      color: '#7928ca',
    },
    {
      path: '/category/ai-products',
      zh: 'AI 产品',
      en: 'AI Products',
      icon: 'rocket',
      color: '#ff0080',
    },
    {
      path: '/category/industry',
      zh: '行业动态',
      en: 'Industry',
      icon: 'bar-chart-3',
      color: '#f5a623',
    },
    {
      path: '/category/open-source',
      zh: '开源项目',
      en: 'Open Source',
      icon: 'code-2',
      color: '#50e3c2',
    },
    {
      path: '/category/ai-ethics',
      zh: 'AI 伦理',
      en: 'AI Ethics',
      icon: 'scale',
      color: '#ee0000',
    },
  ],

  // 热门话题标签
  topics: [
    { path: '/tag/llm', zh: '大语言模型', en: 'LLM' },
    { path: '/tag/computer-vision', zh: '计算机视觉', en: 'Computer Vision' },
    { path: '/tag/robotics', zh: '机器人', en: 'Robotics' },
    { path: '/tag/agi', zh: 'AGI', en: 'AGI' },
    { path: '/tag/ai-tools', zh: 'AI 工具', en: 'AI Tools' },
    { path: '/tag/multimodal', zh: '多模态', en: 'Multimodal' },
  ],

  // 页脚产品链接
  footerProduct: [
    { path: '/news', zh: '资讯', en: 'News' },
    { path: '/trending', zh: '热门', en: 'Trending' },
    { path: '/hot', zh: '热点', en: 'Hot' },
    { path: '/about', zh: '关于', en: 'About' },
  ],

  // 页脚分类链接
  footerCategories: [
    { path: '/category/ai-companies', zh: 'AI 公司', en: 'AI Companies' },
    { path: '/category/research', zh: '学术研究', en: 'Research' },
    { path: '/category/ai-products', zh: 'AI 产品', en: 'AI Products' },
    { path: '/category/industry', zh: '行业动态', en: 'Industry' },
  ],

  // 页脚专题链接
  footerTopics: [
    { path: '/tag/llm', zh: '大语言模型', en: 'LLM' },
    { path: '/tag/computer-vision', zh: '计算机视觉', en: 'Computer Vision' },
    { path: '/tag/robotics', zh: '机器人', en: 'Robotics' },
    { path: '/tag/ai-tools', zh: 'AI 工具', en: 'AI Tools' },
  ],

  // 社交链接
  social: [
    { href: 'https://github.com/faelai', label: 'GitHub', icon: 'github' },
    { href: 'https://twitter.com/faelai', label: 'Twitter', icon: 'twitter' },
  ],

  // 协议链接
  protocols: [
    { path: '/privacy', zh: '隐私政策', en: 'Privacy Policy' },
    { path: '/terms', zh: '服务条款', en: 'Terms of Service' },
    { path: '/disclaimer', zh: '免责声明', en: 'Disclaimer' },
  ],

  // 邮箱
  email: 'contact@faelai.com',

  // 版权
  copyright: {
    holder: 'FaelAI',
    year: new Date().getFullYear(),
  },
};

export type SiteConfig = typeof siteConfig;
