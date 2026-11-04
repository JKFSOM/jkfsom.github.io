import rss from '@astrojs/rss';
import type { APIContext } from 'astro';

import { articleHref, getArticles, site } from '../lib/content';

export async function GET(context: APIContext) {
  const articles = await getArticles();
  return rss({
    title: site.name,
    description: site.description,
    site: context.site!,
    customData: '<language>en-gb</language>',
    items: articles.map((article) => ({
      title: article.data.title,
      description: article.data.summary,
      pubDate: article.data.date,
      link: articleHref(article),
    })),
  });
}
