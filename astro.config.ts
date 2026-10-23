import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkCallouts from './src/plugins/remark-callouts.mjs';
import rehypeFigure from './src/plugins/rehype-figure.mjs';
import { SITE } from './src/site.config';

export default defineConfig({
  site: SITE.url,
  trailingSlash: 'ignore',

  // Old URLs from the hand-written site keep working (links on LinkedIn, Google results).
  // '/docs/x' also covers '/docs/x/' and '/docs/x/index.html'.
  redirects: {
    '/docs/dualformer': '/writing/dualformer/',
    '/docs/matformer': '/writing/matformer/',
    '/docs/software3': '/writing/software-3/',
    '/docs/async_api': '/writing/async-ai-systems/',
    '/docs/light': '/writing/a-collection-of-light/',
  },

  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/docs/') && !page.endsWith('/404/'),
    }),
  ],

  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath, remarkCallouts],
      rehypePlugins: [rehypeKatex, rehypeFigure],
    }),
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark-dimmed' },
      wrap: false,
    },
  },

  image: {
    // Article images are capped at the reading column width (2x for retina).
    layout: 'constrained',
  },
});
