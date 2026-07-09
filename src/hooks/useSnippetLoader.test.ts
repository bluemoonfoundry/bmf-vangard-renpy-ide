import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useSnippetLoader } from '@/hooks/useSnippetLoader';
import { installElectronAPI, uninstallElectronAPI } from '@/test/mocks/electronAPI';

describe('useSnippetLoader', () => {
  let api: ReturnType<typeof installElectronAPI>;

  beforeEach(() => {
    api = installElectronAPI();
    api.path.join.mockImplementation((...parts: string[]) =>
      Promise.resolve(parts.join('/'))
    );
    api.fileExists.mockResolvedValue(false);
    api.readFile.mockResolvedValue('');
    api.readUserGlobalSnippets.mockResolvedValue(null);
  });

  afterEach(() => {
    uninstallElectronAPI();
  });

  it('starts with isLoading=true', () => {
    const { result } = renderHook(() => useSnippetLoader());
    expect(result.current.isLoading).toBe(true);
  });

  it('finishes loading and sets isLoading=false after mount', async () => {
    const { result } = renderHook(() => useSnippetLoader());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
  });

  it('returns built-in categories when no external snippet files exist', async () => {
    api.fileExists.mockResolvedValue(false);
    const { result } = renderHook(() => useSnippetLoader());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    // Built-in snippets always include at least one category
    expect(result.current.categories.length).toBeGreaterThan(0);
    expect(result.current.error).toBeNull();
  });

  it('starts with no error', async () => {
    const { result } = renderHook(() => useSnippetLoader());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBeNull();
  });

  it('merges user global snippets when custom.json exists', async () => {
    const customJson = JSON.stringify({
      version: '1.0',
      categories: [
        { name: 'Custom Category', snippets: [{ title: 'My Snippet', description: 'Desc', code: '# custom' }] },
      ],
    });
    api.readUserGlobalSnippets.mockResolvedValue(customJson);

    const { result } = renderHook(() => useSnippetLoader());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const categoryNames = result.current.categories.map(c => c.name);
    expect(categoryNames).toContain('Custom Category');
  });

  it('merges project-specific snippets when projectRootPath is provided', async () => {
    const projectJson = JSON.stringify({
      version: '1.0',
      categories: [
        { name: 'Project Category', snippets: [{ title: 'Proj Snippet', description: 'Desc', code: '# proj' }] },
      ],
    });
    api.fileExists.mockImplementation((path: string) =>
      Promise.resolve(path.includes('.vangard'))
    );
    api.readFile.mockResolvedValue(projectJson);

    const { result } = renderHook(() =>
      useSnippetLoader({ projectRootPath: '/project/my-vn' })
    );
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const categoryNames = result.current.categories.map(c => c.name);
    expect(categoryNames).toContain('Project Category');
  });

  it('falls back to built-in snippets when readUserGlobalSnippets throws', async () => {
    api.readUserGlobalSnippets.mockRejectedValue(new Error('IPC error'));
    const { result } = renderHook(() => useSnippetLoader());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    // Should still have built-in categories
    expect(result.current.categories.length).toBeGreaterThan(0);
  });

  it('reload() re-triggers loading', async () => {
    const { result } = renderHook(() => useSnippetLoader());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    const callsBefore = api.readUserGlobalSnippets.mock.calls.length;

    await act(async () => {
      await result.current.reload();
    });

    expect(api.readUserGlobalSnippets.mock.calls.length).toBeGreaterThan(callsBefore);
  });

  it('merges same-named categories from multiple sources', async () => {
    const sharedCatJson = JSON.stringify({
      version: '1.0',
      categories: [
        {
          name: 'Dialogue & Narration',
          snippets: [{ title: 'Extra Snippet', description: 'Extra', code: '# extra' }],
        },
      ],
    });
    api.readUserGlobalSnippets.mockResolvedValue(sharedCatJson);

    const { result } = renderHook(() => useSnippetLoader());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const dialogueCat = result.current.categories.find(c => c.name === 'Dialogue & Narration');
    expect(dialogueCat).toBeDefined();
    // Should contain extra snippet merged in (user priority first)
    const titles = dialogueCat!.snippets.map(s => s.title);
    expect(titles).toContain('Extra Snippet');
  });

  it('ignores invalid JSON in a project snippet file gracefully', async () => {
    api.fileExists.mockResolvedValue(true);
    api.readFile.mockResolvedValue('{ not valid json }');

    const { result } = renderHook(() => useSnippetLoader({ projectRootPath: '/project/my-vn' }));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    // Should still return built-in categories
    expect(result.current.categories.length).toBeGreaterThan(0);
  });

  it('surfaces a warning (not a silent failure) when a snippet file has invalid JSON', async () => {
    api.readUserGlobalSnippets.mockResolvedValue('{ not valid json }');

    const { result } = renderHook(() => useSnippetLoader());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.warnings.length).toBeGreaterThan(0);
    expect(result.current.warnings[0]).toContain('invalid JSON');
  });

  it('surfaces a warning with the offending field when a snippet file fails schema validation', async () => {
    api.readUserGlobalSnippets.mockResolvedValue(
      JSON.stringify({ categories: [{ name: 'Broken', snippets: [{ title: '' }] }] })
    );

    const { result } = renderHook(() => useSnippetLoader());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.warnings.some((w) => w.includes('snippets[0].title'))).toBe(true);
    // The malformed file is skipped, but built-ins still load.
    expect(result.current.categories.length).toBeGreaterThan(0);
  });

  it('has no warnings when all snippet files are valid', async () => {
    api.fileExists.mockResolvedValue(false);
    const { result } = renderHook(() => useSnippetLoader());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.warnings).toEqual([]);
  });
});
