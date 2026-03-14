// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://toanc2.pages.dev',
  integrations: [
    react(),
    mdx({
      remarkPlugins: [[remarkMath, { 
        singleDollarTextMath: true,
        inlineMathDouble: false
      }]],
      rehypePlugins: [[rehypeKatex, {
        strict: "ignore",
        throwOnError: false
      }]],
    }),
    sitemap(),
  ],
  markdown: {
    remarkPlugins: [[remarkMath, { 
      singleDollarTextMath: true,
      inlineMathDouble: false
    }]],
    rehypePlugins: [[rehypeKatex, {
      strict: "ignore",
      throwOnError: false
    }]],
  },
});
