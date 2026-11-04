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
