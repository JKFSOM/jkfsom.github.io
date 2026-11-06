/** Syntax theme matching the code tokens in the design system. */
export const codeTheme = {
  name: 'jkfsom',
  type: 'dark',
  colors: { 'editor.background': '#0B2733', 'editor.foreground': '#EAF2EE' },
  settings: [
    { settings: { foreground: '#EAF2EE' } },
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: '#8FA9B0' } },
    {
      scope: ['keyword', 'storage', 'storage.type', 'keyword.control', 'keyword.operator.logical'],
      settings: { foreground: '#F2B84B' },
    },
    { scope: ['string', 'punctuation.definition.string'], settings: { foreground: '#7FD1BC' } },
    {
      scope: ['constant.numeric', 'constant.language', 'support.type.property-name.json'],
      settings: { foreground: '#F39A7C' },
    },
  ],
};

/** Reads title="file.py" from a code fence and exposes it for the header. */
export const codeTitle = {
  name: 'code-title',
  pre(node) {
    const title = /title="([^"]+)"/.exec(this.options.meta?.__raw ?? '')?.[1];
    if (title) node.properties['data-title'] = title;
  },
};

/**
 * Flags listings short enough to keep whole on a printed page.
 *
 * Chrome honours `break-inside: avoid` by moving a block to a fresh sheet
 * before fragmenting it, so applying it to a listing taller than a page wastes
 * most of the preceding one and splits it regardless. Only short blocks get it.
 *
 * A printed page holds roughly 60 code lines, and the measure fits about 76
 * characters, so long lines are counted for the rows they will wrap onto.
 */
const MAX_UNBROKEN_ROWS = 30;
const CHARS_PER_ROW = 76;

const textOf = (node) =>
  node.type === 'text' ? node.value : (node.children ?? []).map(textOf).join('');

const isLine = (node) =>
  node.type === 'element' && `${node.properties?.class ?? ''}`.split(/\s+/).includes('line');

export const codeLength = {
  name: 'code-length',
  pre(node) {
    const code = node.children.find((child) => child.tagName === 'code');
    const rows = (code?.children ?? [])
      .filter(isLine)
      .reduce((total, line) => total + Math.max(1, Math.ceil(textOf(line).length / CHARS_PER_ROW)), 0);

    if (rows <= MAX_UNBROKEN_ROWS) node.properties['data-short'] = '';
  },
};
