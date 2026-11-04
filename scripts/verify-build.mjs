// Checks the built site against the requirements that are easy to break silently.
import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
const failures = [];
const fail = (message) => failures.push(message);

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });

const files = walk(dist);
const htmlFiles = files.filter((file) => file.endsWith('.html'));
const read = (relative) => fs.readFileSync(path.join(dist, relative), 'utf8');
const exists = (relative) => fs.existsSync(path.join(dist, relative));

// URLs that were live before the redesign must keep working.
for (const url of [
  'index.html',
  'about/index.html',
  'feed.xml',
  'c++/python/geospatial/2023/10/15/rewriting-bng-lat-lon-in-cpp.html',
  'fastapi/pydantic/2023/09/18/collecting-errors-with-fastapi.html',
]) {
  if (!exists(url)) fail(`Missing preserved URL: /${url}`);
}

for (const required of ['404.html', 'CNAME', 'robots.txt', 'sitemap-index.xml', 'og.png']) {
  if (!exists(required)) fail(`Missing file: ${required}`);
}
if (exists('CNAME') && read('CNAME').trim() !== 'www.jkfsom.com') fail('CNAME has changed');

// Every internal link and asset must resolve to a built file.
const resolves = (url) => {
  const clean = decodeURI(url.split(/[?#]/)[0]).replace(/^\//, '');
  return [clean, path.join(clean, 'index.html'), `${clean}.html`].some(
    (candidate) => candidate === '' || exists(candidate),
  );
};

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const page = `/${path.relative(dist, file)}`;

  for (const [, url] of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
    if (!url.startsWith('//') && !resolves(url)) fail(`${page}: broken link ${url}`);
  }

  if (!/<html lang="en-GB">/.test(html)) fail(`${page}: wrong language`);
  if (!/<title>[^<]+<\/title>/.test(html)) fail(`${page}: missing title`);
  if (!/<meta name="description" content="[^"]+"/.test(html)) fail(`${page}: missing description`);
  if ((html.match(/<h1[\s>]/g) ?? []).length !== 1) fail(`${page}: needs exactly one h1`);

  const canonical = /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1] ?? '';
  if (!canonical.startsWith('https://www.jkfsom.com/')) fail(`${page}: bad canonical ${canonical}`);

  // Only pages with an interactive island may load React.
  const interactive = html.includes('<astro-island');
  const scripts = [...html.matchAll(/<script[^>]*\ssrc="/g)].length;
  if (!interactive && scripts > 1) fail(`${page}: unexpected scripts on a static page`);
  if (/Write an awesome description|JFKSOM|jfksom\.com/.test(html)) fail(`${page}: stale text`);
}

// The feed must not carry the removed boilerplate post.
const feed = exists('feed.xml') ? read('feed.xml') : '';
if (!feed.includes('<rss')) fail('feed.xml is not RSS');
if (/welcome-to-jekyll|Welcome to Jekyll/.test(feed)) fail('feed.xml contains the Jekyll post');
for (const [, link] of feed.matchAll(/<link>https:\/\/www\.jkfsom\.com(\/[^<]*)<\/link>/g)) {
  if (!resolves(link)) fail(`feed.xml: broken item ${link}`);
}

// Sitemap entries must resolve too, and must omit the 404 page.
for (const file of files.filter((name) => /sitemap-\d+\.xml$/.test(name))) {
  const xml = fs.readFileSync(file, 'utf8');
  for (const [, url] of xml.matchAll(/<loc>https:\/\/www\.jkfsom\.com(\/[^<]*)<\/loc>/g)) {
    if (url.includes('404')) fail('sitemap lists the 404 page');
    if (!resolves(url)) fail(`sitemap: broken entry ${url}`);
  }
}

// Nothing marked as a draft may reach the published site.
const builtText = files
  .filter((file) => /\.(html|xml|js)$/.test(file))
  .map((file) => fs.readFileSync(file, 'utf8'))
  .join('\n');
if (builtText.includes('astro-dev-toolbar')) fail('The dev toolbar is in the build');
const contentFiles = walk(path.resolve('src/content')).filter((file) => /\.mdx?$/.test(file));
let drafts = 0;
for (const file of contentFiles) {
  const source = fs.readFileSync(file, 'utf8');
  const frontmatter = /^---\n([\s\S]*?)\n---/.exec(source)?.[1] ?? '';
  if (!/^draft:\s*true\s*(#.*)?$/m.test(frontmatter)) continue;
  drafts += 1;
  const title = /^title:\s*(.+)$/m.exec(frontmatter)?.[1].trim();
  const slug = path.basename(file).replace(/\.mdx?$/, '');
  if (title && builtText.includes(title)) fail(`Draft published: "${title}"`);
  if (builtText.includes(`/${slug}/`)) fail(`Draft linked: ${slug}`);
}

if (failures.length) {
  console.error(`${failures.length} problem(s):\n${failures.map((item) => `- ${item}`).join('\n')}`);
  process.exit(1);
}
console.log(
  `Verified ${htmlFiles.length} pages: URLs, links, metadata, feed, sitemap and scripts. ${drafts} draft(s) excluded.`,
);
