import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import { codeTheme, codeTitle } from './src/lib/code-theme.mjs';
import { rehypeSections } from './src/lib/rehype-sections.mjs';

export default defineConfig({
  site: 'https://www.jkfsom.com',
  // 'preserve' lets legacy articles keep their exact .html URLs, because
  // GitHub Pages cannot send 301 redirects.
  build: { format: 'preserve' },
  trailingSlash: 'ignore',
  integrations: [mdx(), react(), sitemap({ filter: (page) => !page.includes('/404') })],
  markdown: {
    shikiConfig: { theme: codeTheme, transformers: [codeTitle] },
    rehypePlugins: [rehypeSections],
  },
});
