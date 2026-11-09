/**
 * Gives every article table its own horizontal scroll.
 *
 * A table cannot be narrower than its columns need, so a wide one pushes the
 * whole page sideways on a phone and the reader drags the article about to
 * read a paragraph. Wrapped, the table scrolls within the measure and the page
 * holds still. The wrapper is focusable and named, because a region that
 * scrolls is no use to anyone who cannot reach it with a keyboard.
 *
 * Runs before rehypeSections, so the wrapper rather than the table is what the
 * section layout places.
 */
const element = (tagName, properties = {}, children = []) => ({
  type: 'element',
  tagName,
  properties,
  children,
});

const isTable = (node) => node.type === 'element' && node.tagName === 'table';

/** The caption names the region when an author wrote one. */
const textOf = (node) =>
  node.type === 'text' ? node.value : (node.children ?? []).map(textOf).join('');

const captionOf = (table) => {
  const caption = table.children.find(
    (child) => child.type === 'element' && child.tagName === 'caption',
  );
  return caption ? textOf(caption).trim() : '';
};

const wrap = (table) =>
  element(
    'div',
    {
      className: ['table-scroll'],
      role: 'region',
      tabIndex: 0,
      'aria-label': captionOf(table) || 'Table',
    },
    [table],
  );

export function rehypeTableScroll() {
  return (tree) => {
    /** Disclosures and the like hold tables too, so every parent is visited. */
    const visit = (node) => {
      if (!node.children) return;

      node.children = node.children.map((child) => {
        visit(child);
        return isTable(child) ? wrap(child) : child;
      });
    };

    visit(tree);
  };
}
