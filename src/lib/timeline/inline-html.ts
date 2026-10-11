import type { PhrasingContent, Root } from 'mdast';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import { unified } from 'unified';

export class InlineRenderError extends Error {}

export function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export type InlineRenderOptions = {
  /** Also allow links to the site's own pages ("/epulet/#…"); the link checker verifies them. */
  allowSitePaths?: boolean;
};

/** Renders the small set of inline Markdown the timeline uses; anything else is a source error. */
export function renderInlineHtml(nodes: PhrasingContent[], options: InlineRenderOptions = {}): string {
  return nodes.map((node) => renderNode(node, options)).join('');
}

/** Renders text that must be exactly one paragraph of inline Markdown, e.g. one source-criticism paragraph. */
export function renderInlineMarkdown(text: string, options: InlineRenderOptions = {}): string {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(text) as Root;
  const [paragraph] = tree.children;
  if (tree.children.length !== 1 || paragraph.type !== 'paragraph') {
    throw new InlineRenderError('must be a single paragraph of inline Markdown');
  }
  return renderInlineHtml(paragraph.children, options);
}

function renderNode(node: PhrasingContent, options: InlineRenderOptions): string {
  switch (node.type) {
    case 'text':
      return escapeHtml(node.value);
    case 'strong':
      return `<strong>${renderInlineHtml(node.children, options)}</strong>`;
    case 'emphasis':
      return `<em>${renderInlineHtml(node.children, options)}</em>`;
    case 'inlineCode':
      return `<code>${escapeHtml(node.value)}</code>`;
    case 'link':
      if (options.allowSitePaths && isSitePath(node.url)) {
        return `<a href="${escapeHtml(node.url)}">${renderInlineHtml(node.children, options)}</a>`;
      }
      assertHttpsUrl(node.url);
      return `<a href="${escapeHtml(node.url)}" rel="noopener noreferrer">${renderInlineHtml(node.children, options)}</a>`;
    case 'html':
      // Table cells cannot hold Markdown line breaks, so a bare <br> is the one raw HTML allowed.
      if (isLineBreak(node.value)) return '<br>';
      throw new InlineRenderError(`unsupported inline HTML "${node.value}"`);
    default:
      throw new InlineRenderError(`unsupported inline Markdown "${node.type}"`);
  }
}

export function toPlainText(nodes: PhrasingContent[]): string {
  return nodes
    .map((node) => {
      if (node.type === 'text' || node.type === 'inlineCode') return node.value;
      if (node.type === 'html' && isLineBreak(node.value)) return ' ';
      if ('children' in node) return toPlainText(node.children as PhrasingContent[]);
      return '';
    })
    .join('');
}

function isLineBreak(html: string): boolean {
  return /^<br\s*\/?>$/i.test(html);
}

export function assertHttpsUrl(url: string): void {
  if (!/^https:\/\/[^\s]+$/.test(url)) {
    throw new InlineRenderError(`link must be an https:// URL, got "${url}"`);
  }
}

/** A site path such as "/epulet/#erkely": one leading slash, so never a protocol-relative "//host". */
export function isSitePath(url: string): boolean {
  return /^\/(?!\/)[^\s]*$/.test(url);
}

/** Sources may also point to the site's own pages, where the link checker verifies them. */
export function assertSourceUrl(url: string): void {
  if (isSitePath(url)) return;
  if (!/^https:\/\/[^\s]+$/.test(url)) {
    throw new InlineRenderError(`source link must be an https:// URL or a site path starting with "/", got "${url}"`);
  }
}
