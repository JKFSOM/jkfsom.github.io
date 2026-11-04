# jkfsom.com

The source for [www.jkfsom.com](https://www.jkfsom.com): a static Astro site with MDX content and optional React demos, hosted on GitHub Pages.

## Get started

```bash
npm install
npm run dev    # Preview at http://localhost:4321, including drafts
npm test       # Type check, build and verify. Run this before committing
```

Pushing to `dev` publishes the site. There is no CMS, database or backend.

| To change | Edit |
| --------- | ---- |
| Articles | `src/content/writing/` |
| Projects | `src/content/projects/` |
| Page layouts | `src/pages/`, `src/layouts/` |
| Shared components | `src/components/` |
| Interactive demos | `src/components/demos/` |
| Colours and type | `src/styles/global.css` |

**Rules that matter:**

- **New content is a draft.** Use `draft: true`, and only publish when the owner approves it.
- **Keep private things out.** This repository is public, including its drafts. Do not name employers or private projects.
- **Never move a live URL.** GitHub Pages cannot redirect, so `legacyPath` keeps older articles at their original addresses.
- **Dashed plum means a model produced it.** Solid means measured. Do not use that styling for anything else.
- **Write in British English.**

The approved designs are in the [Figma file](https://www.figma.com/design/xrcS1TPryUWVFR7f22jPkH).

## Publish an article

1. Copy `templates/article.mdx` to `src/content/writing/your-slug.mdx`.
2. Fill in the frontmatter. `topic` must be Applied AI, Engineering, Growth or Business.
3. Write Markdown. Text before the first `##` is the introduction, and each `##` becomes a numbered section.
4. Preview it with `npm run dev`.
5. Remove `draft: true` once it is approved. It will appear at `/writing/your-slug/`.
6. Commit and push to `dev`.

Contents appear automatically from three sections. Add `title="file.py"` to a code fence to show a filename above the code.

## Drafts

Drafts appear in `npm run dev` and are left out of production builds. `npm test` fails if one reaches the built site.

Keep any draft containing an interactive demo in a `drafts/` folder, such as `src/content/projects/drafts/`, and give it a `slug` in its frontmatter. Astro bundles demos from every content file it loads, and production builds skip these folders.

## Add an interactive demo

Create a React component in `src/components/demos/`, then import it in an MDX file:

```mdx
import Band from '../../components/Band.astro';
import CostCalculator from '../../components/demos/CostCalculator';

<Band>
  <CostCalculator client:visible />
</Band>
```

`client:visible` loads the JavaScript only when the demo scrolls into view, on pages that use it. Render meaningful HTML before hydration, and label any synthetic data. `src/components/demos/OpportunityExplorer.tsx` is the worked example.

## Add a project

Add an MDX file to `src/content/projects/`. Set `repo` to show a source link. `bnglatlon-cpp.mdx` is the example.

## Images and diagrams

Put article images in `src/assets/` and import them in MDX, so that Astro can optimise them. Put files that need a fixed URL in `public/`.

Build diagrams as Astro components with real text, and derive their dimensions from data. `src/components/PipelineFigure.astro` is the example.

## Test

`npm test` runs `scripts/verify-build.mjs` after the build. It checks preserved URLs, internal links, metadata, the sitemap, script use on static pages, and that no draft is published.

## Deploy

Pull requests into `dev` run `.github/workflows/test.yml`, which only tests the site. Pushing to `dev` runs `.github/workflows/deploy.yml`, which tests the site and publishes `dist/`.

The Pages source must be set to **GitHub Actions** under Settings, Pages. `public/CNAME` keeps the custom domain.
