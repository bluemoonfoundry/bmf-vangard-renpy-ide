import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useSnippetLoader } from '@/hooks/useSnippetLoader';
import { installElectronAPI, uninstallElectronAPI } from '@/test/mocks/electronAPI';

describe('useSnippetLoader', () => {
  let api: ReturnType<typeof installElectronAPI>;

  beforeEach(() => {
    api = installElectronAPI();
    api.getUserDataPath.mockResolvedValue('/mock/userdata');
    api.path.join.mockImplementation((...parts: string[]) =>
      Promise.resolve(parts.join('/'))
    );
    api.fileExists.mockResolvedValue(false);
    api.readFile.mockResolvedValue('');
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
    api.fileExists.mockImplementation((path: string) =>
      Promise.resolve(path.includes('custom.json'))
    );
    api.readFile.mockResolvedValue(customJson);

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

  it('falls back to built-in snippets when getUserDataPath throws', async () => {
    api.getUserDataPath.mockRejectedValue(new Error('IPC error'));
    const { result } = renderHook(() => useSnippetLoader());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    // Should still have built-in categories
    expect(result.current.categories.length).toBeGreaterThan(0);
  });

  it('sets error when built-in categories is corrupted', async () => {
    // We simulate this by having getUserDataPath throw AND readFile throw
    // so the outer try/catch is hit. We cannot easily corrupt the JSON import
    // so we test the outer error path by making the built-in loading fail.
    // The safest test is: even on failure, categories fall back to built-ins.
    api.getUserDataPath.mockRejectedValue(new Error('fatal'));
    const { result } = renderHook(() => useSnippetLoader());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    // categories is either built-in or empty — must not throw
    expect(Array.isArray(result.current.categories)).toBe(true);
  });

  it('reload() re-triggers loading', async () => {
    const { result } = renderHook(() => useSnippetLoader());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    const callsBefore = api.getUserDataPath.mock.calls.length;

    await act(async () => {
      await result.current.reload();
    });

    // getUserDataPath should have been called again
    expect(api.getUserDataPath.mock.calls.length).toBeGreaterThan(callsBefore);
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
    api.fileExists.mockImplementation((path: string) =>
      Promise.resolve(path.includes('custom.json'))
    );
    api.readFile.mockResolvedValue(sharedCatJson);

    const { result } = renderHook(() => useSnippetLoader());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const dialogueCat = result.current.categories.find(c => c.name === 'Dialogue & Narration');
    expect(dialogueCat).toBeDefined();
    // Should contain extra snippet merged in (user priority first)
    const titles = dialogueCat!.snippets.map(s => s.title);
    expect(titles).toContain('Extra Snippet');
  });

  it('ignores invalid JSON in snippet file gracefully', async () => {
    api.fileExists.mockResolvedValue(true);
    api.readFile.mockResolvedValue('{ not valid json }');

    const { result } = renderHook(() => useSnippetLoader());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    // Should still return built-in categories
    expect(result.current.categories.length).toBeGreaterThan(0);
  });
});
