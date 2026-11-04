/**
 * Turns flat article HTML into the site's ruled layout, so authors only write
 * Markdown. Each `##` heading opens a numbered section with its title in the
 * rail. Contents appear once an article has three or more sections.
 */
const MIN_SECTIONS_FOR_CONTENTS = 3;

const element = (tagName, properties = {}, children = []) => ({
  type: 'element',
  tagName,
  properties,
  children,
});
const text = (value) => ({ type: 'text', value });

const textOf = (node) =>
  node.type === 'text' ? node.value : (node.children ?? []).map(textOf).join('');

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const rules = () =>
  element('div', { className: ['doc-rules'], ariaHidden: 'true' }, [
    element('i'),
    element('i'),
    element('i'),
  ]);

const contents = (sections) =>
  element('nav', { className: ['doc-contents'], ariaLabel: 'On this page' }, [
    element('p', {}, [text('On this page')]),
    element(
      'ol',
      {},
      sections.map(({ heading }) =>
        element('li', {}, [
          element('a', { href: `#${heading.properties.id}` }, [text(textOf(heading))]),
        ]),
      ),
    ),
  ]);

const isBlank = (node) => node.type === 'text' && !node.value.trim();

export function rehypeSections() {
  return (tree) => {
    const hoisted = [];
    const intro = [];
    const sections = [];

    for (const node of tree.children) {
      if (node.type === 'mdxjsEsm') {
        hoisted.push(node);
      } else if (node.type === 'element' && node.tagName === 'h2') {
        node.properties.id ??= slugify(textOf(node));
        sections.push({ heading: node, body: [] });
      } else if (!isBlank(node)) {
        (sections.at(-1)?.body ?? intro).push(node);
      }
    }

    const introRail =
      sections.length >= MIN_SECTIONS_FOR_CONTENTS
        ? [element('div', { className: ['doc-rail'] }, [contents(sections)])]
        : [];

    tree.children = [
      ...hoisted,
      ...(intro.length
        ? [element('section', { className: ['doc-section', 'doc-intro'] }, [...introRail, ...intro])]
        : []),
      ...sections.map(({ heading, body }, index) =>
        element('section', { className: ['doc-section'] }, [
          rules(),
          element('div', { className: ['doc-rail'] }, [
            element('span', { className: ['doc-number'] }, [text(String(index + 1))]),
            heading,
          ]),
          ...body,
        ]),
      ),
    ];
  };
}
