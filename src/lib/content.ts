import { getCollection, type CollectionEntry } from 'astro:content';

export type Article = CollectionEntry<'writing'>;
export type Project = CollectionEntry<'projects'>;

export const site = {
  name: 'jkfsom',
  description: 'Writing on applied AI, online marketplaces and software engineering.',
  github: 'https://github.com/JKFSOM',
  email: 'hello@jkfsom.com',
};

export const topicColours = {
  'Applied AI': 'var(--coral)',
  Engineering: 'var(--cobalt)',
  Growth: 'var(--ochre)',
  Business: 'var(--sea)',
} as const;

/** Drafts appear in `npm run dev` and are never included in a production build. */
const isPublishable = ({ data }: { data: { draft: boolean } }) =>
  !data.draft || import.meta.env.DEV;

export async function getArticles(): Promise<Article[]> {
  const articles = await getCollection('writing', isPublishable);
  return articles.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function getProjects(): Promise<Project[]> {
  const projects = await getCollection('projects', isPublishable);
  return projects.sort((a, b) => a.data.order - b.data.order);
}

export const articleHref = (article: Article) =>
  article.data.legacyPath ?? `/writing/${article.id}/`;

export const projectHref = (project: Project) => `/projects/${project.id}/`;

export const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);

const WORDS_PER_MINUTE = 200;

export const readingMinutes = (body = '') =>
  Math.max(1, Math.round(body.split(/\s+/).filter(Boolean).length / WORDS_PER_MINUTE));
