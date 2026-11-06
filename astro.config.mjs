import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import { codeLength, codeTheme, codeTitle } from './src/lib/code-theme.mjs';
import { rehypeLinkNotes } from './src/lib/rehype-link-notes.mjs';
import { rehypeSections } from './src/lib/rehype-sections.mjs';

/**
 * The sitemap integration drops `.html` and trailing slashes under the
 * 'preserve' build format, so restore each page's real published URL.
 */
const LEGACY_ARTICLE = /\/\d{4}\/\d{2}\/\d{2}\/[^/]+$/;
const publishedUrl = (url) => {
  const clean = url.replace(/\/$/, '');
  return LEGACY_ARTICLE.test(clean) ? `${clean}.html` : `${clean}/`;
};

export default defineConfig({
  site: 'https://www.jkfsom.com',
  // 'preserve' lets legacy articles keep their exact .html URLs, because
  // GitHub Pages cannot send 301 redirects.
  build: { format: 'preserve' },
  trailingSlash: 'ignore',
  integrations: [
    mdx(),
    react(),
    sitemap({
      filter: (page) => !page.includes('/404'),
      serialize: (item) => ({ ...item, url: publishedUrl(item.url) }),
    }),
  ],
  markdown: {
    shikiConfig: { theme: codeTheme, transformers: [codeTitle, codeLength] },
    rehypePlugins: [rehypeSections, rehypeLinkNotes],
  },
});
