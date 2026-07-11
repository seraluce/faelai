// src/i18n/utils.ts
// 功能：i18n 工具函数 — 语言提取、翻译函数、本地化路径生成、多语言路径切换

import { ui, defaultLang, type UIKeys } from './ui';

export function getLangFromUrl(url: URL): string {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang;
  return defaultLang;
}

export function useTranslations(lang: string) {
  const localizedUI = ui[lang as keyof typeof ui] || ui[defaultLang];
  return function t(key: UIKeys): string {
    return key in localizedUI ? localizedUI[key as keyof typeof localizedUI] : ui[defaultLang][key];
  };
}

export function getLocalizedPath(path: string, lang: string): string {
  if (lang === defaultLang) {
    return path;
  }
  return `/${lang}${path}`;
}

export function getAlternateLanguagePath(currentPath: string, targetLang: string): string {
  const segments = currentPath.split('/');

  // Check if first segment is a locale
  const firstSegment = segments[1];
  const isCurrentLangNonDefault = firstSegment in ui && firstSegment !== defaultLang;

  if (targetLang === defaultLang) {
    // Going to default locale: remove locale prefix
    if (isCurrentLangNonDefault) {
      segments.splice(1, 1);
      return segments.join('/') || '/';
    }
    return currentPath;
  }

  // Going to non-default locale
  if (isCurrentLangNonDefault) {
    // Already has a locale prefix, replace it
    segments[1] = targetLang;
    return segments.join('/');
  }

  // Currently at default locale (no prefix), add target locale prefix
  return `/${targetLang}${currentPath}`;
}
