// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { withSuppressedKatexMetricWarnings } from './src/lib/katex-silence.mjs';

function rehypeKatexWithoutMetricWarnings(options) {
  const transform = rehypeKatex(options);

  return (tree, file) => withSuppressedKatexMetricWarnings(() => transform(tree, file));
}

export default defineConfig({
  site: 'https://toan.booktoan.com',
  markdown: {
    remarkPlugins: [
      [remarkMath, {
        singleDollarTextMath: true,
        inlineMathDouble: false,
      }],
    ],
    rehypePlugins: [
      [rehypeKatexWithoutMetricWarnings, {
        strict: false,
        throwOnError: false,
        errorColor: 'transparent',
        output: 'html',
        trust: false,
        globalGroup: true,
      }],
    ],
  },
  integrations: [
    react(),
    mdx(),
    sitemap(),
  ],
  vite: {
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-dom/client'],
    },
    server: {
      hmr: {
        timeout: 120000,
      },
    },
  },
});
