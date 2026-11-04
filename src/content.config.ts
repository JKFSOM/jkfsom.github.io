import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const topics = ['Applied AI', 'Engineering', 'Growth', 'Business'] as const;

/**
 * Astro bundles every interactive component it finds, even in unpublished
 * content, so production builds must not load the drafts folders at all.
 */
const isProductionBuild = process.argv.includes('build');
const pattern = ['**/*.{md,mdx}', ...(isProductionBuild ? ['!drafts/**'] : [])];

const writing = defineCollection({
  loader: glob({ pattern, base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    topic: z.enum(topics),
    draft: z.boolean().default(false),
    /** Exact published path for articles that predate /writing/. */
    legacyPath: z.string().startsWith('/').endsWith('.html').optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern, base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    kind: z.enum(['Interactive demo', 'Open source']),
    topic: z.enum(topics),
    status: z.string().optional(),
    order: z.number().default(100),
    draft: z.boolean().default(false),
    /** Source code link, shown in the rail of the project page. */
    repo: z.string().url().optional(),
    /** Main language of the repository, for structured data. */
    language: z.string().optional(),
  }),
});

export const collections = { writing, projects };
