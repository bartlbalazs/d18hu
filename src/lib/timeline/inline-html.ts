import type { PhrasingContent } from 'mdast';

export class InlineRenderError extends Error {}

export function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/** Renders the small set of inline Markdown the timeline uses; anything else is a source error. */
export function renderInlineHtml(nodes: PhrasingContent[]): string {
  return nodes.map(renderNode).join('');
}

function renderNode(node: PhrasingContent): string {
  switch (node.type) {
    case 'text':
      return escapeHtml(node.value);
    case 'strong':
      return `<strong>${renderInlineHtml(node.children)}</strong>`;
    case 'emphasis':
      return `<em>${renderInlineHtml(node.children)}</em>`;
    case 'inlineCode':
      return `<code>${escapeHtml(node.value)}</code>`;
    case 'link':
      assertHttpsUrl(node.url);
      return `<a href="${escapeHtml(node.url)}" rel="noopener noreferrer">${renderInlineHtml(node.children)}</a>`;
    default:
      throw new InlineRenderError(`unsupported inline Markdown "${node.type}"`);
  }
}

export function toPlainText(nodes: PhrasingContent[]): string {
  return nodes
    .map((node) => {
      if (node.type === 'text' || node.type === 'inlineCode') return node.value;
      if ('children' in node) return toPlainText(node.children as PhrasingContent[]);
      return '';
    })
    .join('');
}

export function assertHttpsUrl(url: string): void {
  if (!/^https:\/\/[^\s]+$/.test(url)) {
    throw new InlineRenderError(`link must be an https:// URL, got "${url}"`);
  }
}
