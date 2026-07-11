// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  integrations: [
    react(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en'],
    prefixDefaultLocale: true,
  },
  trailingSlash: 'never',
  server: {
    port: 8081,
    host: '0.0.0.0',
  },
});
