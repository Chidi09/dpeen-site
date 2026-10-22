import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { generateSW } from 'workbox-build';
import { fileURLToPath } from 'node:url';
import { LEGAL_UPDATED } from './src/data/site';
export default defineConfig({
  site: process.env.SITE_URL || 'https://www.dpeenetwork.com',
  output: 'static',
  markdown: { syntaxHighlight: false },
  security: {
    csp: {
      styleDirective: { resources: ["'self'", 'https://fonts.googleapis.com'] },
      directives: [
        "default-src 'self'",
        "img-src 'self' https://images.unsplash.com data:",
        "font-src 'self' https://fonts.gstatic.com",
        "connect-src 'self'",
        "worker-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ],
    },
  },
  vite: { plugins: [tailwindcss()] },
  integrations: [
    sitemap({
      // Honest dates: the home page changes with each release, and each
      // legal page changes when its "last updated" date does.
      serialize: (item) => ({
        ...item,
        lastmod:
          new URL(item.url).pathname === '/'
            ? new Date().toISOString()
            : `${LEGAL_UPDATED}T00:00:00.000Z`,
      }),
    }),
    {
      name: 'dpeen-offline',
      hooks: {
        'astro:build:done': async ({ dir }) => {
          const dist = fileURLToPath(dir);
          await generateSW({
            globDirectory: dist,
            swDest: `${dist}/sw.js`,
            globPatterns: [
              '**/*.{html,js,css,png,webp,jpg,jpeg,svg,ico,ttf,woff2,webmanifest}',
            ],
            navigateFallback: '/index.html',
            cleanupOutdatedCaches: true,
            clientsClaim: true,
            skipWaiting: true,
          });
        },
      },
    },
  ],
});
