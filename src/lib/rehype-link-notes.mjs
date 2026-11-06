/**
 * Numbers the outbound links in an article and collects them into a list at
 * the end, so a printed page can carry its destinations without the full URLs
 * breaking up the prose. Both the markers and the list are print-only.
 *
 * Runs after rehypeSections, whose sections it appends to.
 */
const element = (tagName, properties = {}, children = []) => ({
  type: 'element',
  tagName,
  properties,
  children,
});
const text = (value) => ({ type: 'text', value });

const isOutbound = (node) =>
  node.type === 'element' &&
  node.tagName === 'a' &&
  typeof node.properties?.href === 'string' &&
  /^(https?:|mailto:)/.test(node.properties.href);

/** The contents nav repeats every heading link; its anchors are internal. */
const isContents = (node) =>
  node.type === 'element' && (node.properties?.className ?? []).includes('doc-contents');

function* walk(node) {
  for (const child of node.children ?? []) {
    if (isContents(child)) continue;
    yield child;
    yield* walk(child);
  }
}

export function rehypeLinkNotes() {
  return (tree) => {
    /** Repeated destinations share one number rather than earning another. */
    const numbers = new Map();

    for (const node of walk(tree)) {
      if (!isOutbound(node)) continue;

      const { href } = node.properties;
      if (!numbers.has(href)) numbers.set(href, numbers.size + 1);

      node.children.push(
        element('sup', { className: ['link-note'] }, [text(String(numbers.get(href)))]),
      );
    }

    if (numbers.size === 0) return;

    tree.children.push(
      element('section', { className: ['doc-section', 'doc-links'] }, [
        element('h2', {}, [text('Links')]),
        element(
          'ol',
          {},
          [...numbers.keys()].map((href) => element('li', {}, [text(href)])),
        ),
      ]),
    );
  };
}
