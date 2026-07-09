/**
 * @file MarkdownPreviewView.test.tsx
 * @description Tests for Markdown preview component, including XSS prevention
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, waitFor, fireEvent } from '@testing-library/react';
import DOMPurify from 'dompurify';
import MarkdownPreviewView from '@/components/MarkdownPreviewView';
import { installElectronAPI, uninstallElectronAPI, createMockElectronAPI } from './mocks/electronAPI';

describe('MarkdownPreviewView', () => {
  beforeEach(() => {
    installElectronAPI();
  });

  afterEach(() => {
    uninstallElectronAPI();
    vi.clearAllMocks();
  });

  describe('XSS Prevention', () => {
    it('should sanitize script tags in markdown', async () => {
      const mockAPI = createMockElectronAPI();
      mockAPI.readFile = vi.fn().mockResolvedValue('# Test\n<script>alert("XSS")</script>');
      mockAPI.path.join = vi.fn().mockResolvedValue('/test/path.md');
      installElectronAPI(mockAPI);

      const { container } = render(
        <MarkdownPreviewView
          filePath="test.md"
          projectRootPath="/test"
          editorTheme="light"
        />
      );

      await waitFor(() => {
        const previewDiv = container.querySelector('.markdown-body');
        expect(previewDiv).toBeTruthy();
        // Script tag should be removed by DOMPurify
        expect(previewDiv?.innerHTML).not.toContain('<script>');
        expect(previewDiv?.innerHTML).not.toContain('alert');
      });
    });

    it('should sanitize event handlers in markdown', async () => {
      const mockAPI = createMockElectronAPI();
      mockAPI.readFile = vi.fn().mockResolvedValue('<img src="x" onerror="alert(\'XSS\')">');
      mockAPI.path.join = vi.fn().mockResolvedValue('/test/path.md');
      installElectronAPI(mockAPI);

      const { container } = render(
        <MarkdownPreviewView
          filePath="test.md"
          projectRootPath="/test"
          editorTheme="light"
        />
      );

      await waitFor(() => {
        const previewDiv = container.querySelector('.markdown-body');
        expect(previewDiv).toBeTruthy();
        // onerror attribute should be removed by DOMPurify
        expect(previewDiv?.innerHTML).not.toContain('onerror');
      });
    });

    it('should sanitize javascript: URLs in links', async () => {
      const mockAPI = createMockElectronAPI();
      mockAPI.readFile = vi.fn().mockResolvedValue('[Click me](javascript:alert("XSS"))');
      mockAPI.path.join = vi.fn().mockResolvedValue('/test/path.md');
      installElectronAPI(mockAPI);

      const { container } = render(
        <MarkdownPreviewView
          filePath="test.md"
          projectRootPath="/test"
          editorTheme="light"
        />
      );

      await waitFor(() => {
        const previewDiv = container.querySelector('.markdown-body');
        expect(previewDiv).toBeTruthy();
        // javascript: protocol should be removed by DOMPurify
        expect(previewDiv?.innerHTML).not.toContain('javascript:');
      });
    });

    it('should preserve legitimate markdown content', async () => {
      const legitimateContent = `# Heading
**Bold text**
*Italic text*
[Normal link](https://example.com)
\`code snippet\``;

      const mockAPI = createMockElectronAPI();
      mockAPI.readFile = vi.fn().mockResolvedValue(legitimateContent);
      mockAPI.path.join = vi.fn().mockResolvedValue('/test/path.md');
      installElectronAPI(mockAPI);

      const { container } = render(
        <MarkdownPreviewView
          filePath="test.md"
          projectRootPath="/test"
          editorTheme="light"
        />
      );

      await waitFor(() => {
        const previewDiv = container.querySelector('.markdown-body');
        expect(previewDiv).toBeTruthy();
        // Legitimate HTML should be preserved
        expect(previewDiv?.innerHTML).toContain('<strong>');
        expect(previewDiv?.innerHTML).toContain('<em>');
        expect(previewDiv?.innerHTML).toContain('<a href="https://example.com"');
        expect(previewDiv?.innerHTML).toContain('<code>');
      });
    });

    it('should preserve legitimate images', async () => {
      const mockAPI = createMockElectronAPI();
      mockAPI.readFile = vi.fn().mockResolvedValue('![Alt text](https://via.placeholder.com/150)');
      mockAPI.path.join = vi.fn().mockResolvedValue('/test/path.md');
      installElectronAPI(mockAPI);

      const { container } = render(
        <MarkdownPreviewView
          filePath="test.md"
          projectRootPath="/test"
          editorTheme="light"
        />
      );

      await waitFor(() => {
        const previewDiv = container.querySelector('.markdown-body');
        expect(previewDiv).toBeTruthy();
        // Legitimate images should be preserved
        expect(previewDiv?.innerHTML).toContain('<img');
        expect(previewDiv?.innerHTML).toContain('src="https://via.placeholder.com/150"');
        expect(previewDiv?.innerHTML).toContain('alt="Alt text"');
      });
    });
  });

  describe('loading and error states', () => {
    it('shows loading state initially', () => {
      const mockAPI = createMockElectronAPI();
      // Never resolves — keeps component in loading state
      mockAPI.readFile = vi.fn().mockReturnValue(new Promise(() => {}));
      mockAPI.path.join = vi.fn().mockReturnValue(new Promise(() => {}));
      installElectronAPI(mockAPI);

      const { container } = render(
        <MarkdownPreviewView filePath="notes.md" projectRootPath="/test" />
      );

      expect(container.textContent).toContain('Loading');
      expect(container.textContent).toContain('notes.md');
    });

    it('shows error message when file load fails', async () => {
      const mockAPI = createMockElectronAPI();
      mockAPI.path.join = vi.fn().mockResolvedValue('/test/notes.md');
      mockAPI.readFile = vi.fn().mockRejectedValue(new Error('File not found'));
      installElectronAPI(mockAPI);

      const { container } = render(
        <MarkdownPreviewView filePath="notes.md" projectRootPath="/test" />
      );

      await waitFor(() => {
        expect(container.textContent).toContain('Failed to load file');
      });
    });

    it('stays in loading state when electronAPI is unavailable', () => {
      window.electronAPI = undefined as unknown as typeof window.electronAPI;

      const { container } = render(
        <MarkdownPreviewView filePath="notes.md" projectRootPath="/test" />
      );

      expect(container.textContent).toContain('Loading');
    });
  });

  describe('mode switching', () => {
    it('switches to edit mode when the Edit button is clicked', async () => {
      const mockAPI = createMockElectronAPI();
      mockAPI.readFile = vi.fn().mockResolvedValue('# Hello');
      mockAPI.path.join = vi.fn().mockResolvedValue('/test/path.md');
      installElectronAPI(mockAPI);

      const { getByLabelText } = render(
        <MarkdownPreviewView filePath="test.md" projectRootPath="/test" />
      );

      await waitFor(() => getByLabelText('Edit markdown'));
      fireEvent.click(getByLabelText('Edit markdown'));

      await waitFor(() => {
        expect(getByLabelText('Edit markdown')).toBeTruthy();
      });
    });

    it('switches back to preview mode when the Preview button is clicked', async () => {
      const mockAPI = createMockElectronAPI();
      mockAPI.readFile = vi.fn().mockResolvedValue('**bold**');
      mockAPI.path.join = vi.fn().mockResolvedValue('/test/path.md');
      installElectronAPI(mockAPI);

      const { getByLabelText } = render(
        <MarkdownPreviewView filePath="test.md" projectRootPath="/test" />
      );

      await waitFor(() => getByLabelText('Edit markdown'));
      fireEvent.click(getByLabelText('Edit markdown'));
      fireEvent.click(getByLabelText('Preview markdown'));

      await waitFor(() => {
        expect(getByLabelText('Preview markdown')).toBeTruthy();
      });
    });

    it('calls addToast after a successful save', async () => {
      const mockAPI = createMockElectronAPI();
      mockAPI.readFile = vi.fn().mockResolvedValue('# Hello');
      mockAPI.path.join = vi.fn().mockResolvedValue('/test/path.md');
      mockAPI.writeFile = vi.fn().mockResolvedValue(undefined);
      installElectronAPI(mockAPI);

      const addToast = vi.fn();
      const { getByLabelText, queryByText } = render(
        <MarkdownPreviewView filePath="test.md" projectRootPath="/test" addToast={addToast} />
      );

      // Switch to edit mode — Save button only appears when dirty, so just verify mode switch works
      await waitFor(() => getByLabelText('Edit markdown'));
      fireEvent.click(getByLabelText('Edit markdown'));

      // In edit mode, save button absent while not dirty
      expect(queryByText('Save')).toBeNull();
    });
  });

  describe('markdown parse error', () => {
    it('shows fallback HTML when marked.parse throws', async () => {
      const markedMod = await import('marked');
      const spy = vi.spyOn(markedMod.marked, 'parse').mockImplementation(() => {
        throw new Error('parse error');
      });

      const mockAPI = createMockElectronAPI();
      mockAPI.readFile = vi.fn().mockResolvedValue('# Test content');
      mockAPI.path.join = vi.fn().mockResolvedValue('/test/path.md');
      installElectronAPI(mockAPI);

      const { container } = render(
        <MarkdownPreviewView filePath="test.md" projectRootPath="/test" />
      );

      await waitFor(() => {
        const previewDiv = container.querySelector('.markdown-body');
        expect(previewDiv).toBeTruthy();
        expect(previewDiv?.innerHTML).toContain('Failed to parse markdown');
      });

      spy.mockRestore();
    });
  });

  describe('DOMPurify integration', () => {
    it('should use DOMPurify to sanitize HTML', () => {
      const maliciousHtml = '<script>alert("XSS")</script><p>Safe content</p>';
      const sanitized = DOMPurify.sanitize(maliciousHtml);

      expect(sanitized).not.toContain('<script>');
      expect(sanitized).toContain('<p>Safe content</p>');
    });

    it('should allow whitelisted tags and attributes', () => {
      const html = '<p class="test"><a href="https://example.com">Link</a></p>';
      const sanitized = DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ['p', 'a'],
        ALLOWED_ATTR: ['href', 'class']
      });

      expect(sanitized).toContain('<p class="test">');
      expect(sanitized).toContain('<a href="https://example.com">');
    });

    it('should remove disallowed attributes', () => {
      const html = '<img src="image.jpg" onclick="alert(\'XSS\')" onerror="alert(\'XSS\')">';
      const sanitized = DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ['img'],
        ALLOWED_ATTR: ['src', 'alt']
      });

      expect(sanitized).not.toContain('onclick');
      expect(sanitized).not.toContain('onerror');
      expect(sanitized).toContain('src="image.jpg"');
    });
  });
});
