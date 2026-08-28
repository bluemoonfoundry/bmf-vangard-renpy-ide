import { describe, it, expect } from 'vitest';
import { renderSanitizedMarkdown } from '@/lib/renderSanitizedMarkdown';

describe('renderSanitizedMarkdown', () => {
  it('renders basic markdown to HTML', () => {
    expect(renderSanitizedMarkdown('**bold** and *em*')).toContain('<strong>bold</strong>');
  });

  it('strips event handler attributes from raw HTML', () => {
    const html = renderSanitizedMarkdown('<img src=x onerror="alert(1)">');
    expect(html).not.toContain('onerror');
    expect(html).not.toContain('alert(1)');
  });

  it('strips script tags entirely', () => {
    const html = renderSanitizedMarkdown('<script>alert(document.cookie)</script>');
    expect(html).not.toContain('<script');
    expect(html).not.toContain('alert(document.cookie)');
  });

  it('strips javascript: URLs from links', () => {
    const html = renderSanitizedMarkdown('[click me](javascript:alert(1))');
    expect(html).not.toContain('javascript:');
  });

  it('keeps allow-listed tags like links and code blocks', () => {
    const html = renderSanitizedMarkdown('[a link](https://example.com) and `code`');
    expect(html).toContain('<a href="https://example.com">a link</a>');
    expect(html).toContain('<code>code</code>');
  });
});
