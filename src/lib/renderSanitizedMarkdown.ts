/**
 * @file renderSanitizedMarkdown.ts
 * @description Single choke point for turning user/project-authored Markdown into HTML
 * safe for `dangerouslySetInnerHTML`. `marked` passes raw inline HTML through by default,
 * so every call site MUST go through DOMPurify — never call `marked.parse()` directly
 * for content that ends up in the DOM.
 */
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'em', 'a', 'code', 'pre', 'ul', 'ol', 'li',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'table', 'thead', 'tbody',
  'tr', 'th', 'td', 'blockquote', 'hr', 'img', 'span', 'div', 'del',
  'input',
];

const ALLOWED_ATTR = ['href', 'class', 'src', 'alt', 'title', 'id', 'type', 'checked', 'disabled'];

export function renderSanitizedMarkdown(content: string, markedOptions?: Parameters<typeof marked.parse>[1]): string {
  const parsed = marked.parse(content, { async: false, ...markedOptions }) as string;
  return DOMPurify.sanitize(parsed, { ALLOWED_TAGS, ALLOWED_ATTR });
}
