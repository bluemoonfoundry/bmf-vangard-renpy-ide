import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchProvider, useSearch } from '@/contexts/SearchContext';
import { DualPaneContext } from '@/contexts/DualPaneContext';
import type { DualPaneContextValue } from '@/contexts/DualPaneContext';
import { installElectronAPI } from '@/test/mocks/electronAPI';
import { createBlock } from '@/test/mocks/sampleData';
import type { Block } from '@/types';

function makeDualPaneValue(): DualPaneContextValue {
  return {
    activePaneId: 'primary',
    dirtyBlockIds: new Set(),
    dirtyEditors: new Set(),
    setDirtyBlockIds: vi.fn(),
    setDirtyEditors: vi.fn(),
    dirtyBlockIdsRef: { current: new Set() },
    dirtyEditorsRef: { current: new Set() },
    handleTabContextMenu: vi.fn(),
    handleOpenEditor: vi.fn(),
  } as unknown as DualPaneContextValue;
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <DualPaneContext.Provider value={makeDualPaneValue()}>
      <SearchProvider blocks={[]} setBlocks={vi.fn()} setDirtyBlockIds={vi.fn()} projectRootPath={null} addToast={vi.fn()}>
        {children}
      </SearchProvider>
    </DualPaneContext.Provider>
  );
}

function ConsumerComponent() {
  const { searchQuery, setSearchQuery, replaceQuery, setReplaceQuery, searchResults, isSearching } = useSearch();
  return (
    <div>
      <span data-testid="query">{searchQuery}</span>
      <span data-testid="replace">{replaceQuery}</span>
      <span data-testid="results">{searchResults.length}</span>
      <span data-testid="searching">{String(isSearching)}</span>
      <button onClick={() => setSearchQuery('hello')}>set query</button>
      <button onClick={() => setReplaceQuery('world')}>set replace</button>
    </div>
  );
}

describe('SearchContext', () => {
  beforeEach(() => {
    installElectronAPI();
  });

  it('provides default empty state to consumers', () => {
    render(<ConsumerComponent />, { wrapper: Wrapper });
    expect(screen.getByTestId('query').textContent).toBe('');
    expect(screen.getByTestId('replace').textContent).toBe('');
    expect(screen.getByTestId('results').textContent).toBe('0');
    expect(screen.getByTestId('searching').textContent).toBe('false');
  });

  it('setSearchQuery updates searchQuery for consumers', async () => {
    const user = userEvent.setup();
    render(<ConsumerComponent />, { wrapper: Wrapper });
    await user.click(screen.getByText('set query'));
    expect(screen.getByTestId('query').textContent).toBe('hello');
  });

  it('setReplaceQuery updates replaceQuery for consumers', async () => {
    const user = userEvent.setup();
    render(<ConsumerComponent />, { wrapper: Wrapper });
    await user.click(screen.getByText('set replace'));
    expect(screen.getByTestId('replace').textContent).toBe('world');
  });

  it('renders children', () => {
    render(
      <Wrapper>
        <span data-testid="child">child content</span>
      </Wrapper>,
    );
    expect(screen.getByTestId('child')).toBeTruthy();
  });

  it('executeSearch calls electronAPI.searchInProject when projectRootPath is set', async () => {
    const api = installElectronAPI();
    api.searchInProject.mockResolvedValue({ results: [], truncated: false, cancelled: false, skipped: [], regexError: null });

    function WithPath({ children }: { children: React.ReactNode }) {
      return (
        <DualPaneContext.Provider value={makeDualPaneValue()}>
          <SearchProvider blocks={[]} setBlocks={vi.fn()} setDirtyBlockIds={vi.fn()} projectRootPath="/project" addToast={vi.fn()}>
            {children}
          </SearchProvider>
        </DualPaneContext.Provider>
      );
    }

    function SearchTrigger() {
      const { executeSearch } = useSearch();
      return <button onClick={() => executeSearch()}>search</button>;
    }

    const user = userEvent.setup();
    render(<SearchTrigger />, { wrapper: WithPath });
    await user.click(screen.getByText('search'));
    expect(api.searchInProject).toHaveBeenCalled();
  });

  describe('executeReplaceAll', () => {
    const blocks: Block[] = [
      createBlock({ id: 'block-1', filePath: 'game/script.rpy', content: 'label start:\n    "hello world"\n    "hello again"\n' }),
    ];

    function renderReplaceHarness() {
      const setBlocks = vi.fn();
      const setDirtyBlockIds = vi.fn();
      const addToast = vi.fn();

      function Harness() {
        const { setSearchQuery, setReplaceQuery, executeSearch, executeReplaceAll } = useSearch();
        return (
          <div>
            <button onClick={() => setSearchQuery('hello')}>set query</button>
            <button onClick={() => setReplaceQuery('hi')}>set replace</button>
            <button onClick={() => executeSearch()}>search</button>
            <button onClick={() => executeReplaceAll()}>replace all</button>
          </div>
        );
      }

      render(
        <DualPaneContext.Provider value={makeDualPaneValue()}>
          <SearchProvider blocks={blocks} setBlocks={setBlocks} setDirtyBlockIds={setDirtyBlockIds} projectRootPath="/project" addToast={addToast}>
            <Harness />
          </SearchProvider>
        </DualPaneContext.Provider>,
      );

      return { setBlocks, setDirtyBlockIds, addToast };
    }

    it('replaces all matches in affected blocks and marks them dirty after confirmation', async () => {
      const api = installElectronAPI();
      api.searchInProject.mockResolvedValue({
        results: [
          { filePath: 'game/script.rpy', matches: [
            { lineNumber: 2, lineContent: '    "hello world"', startColumn: 6, endColumn: 11 },
            { lineNumber: 3, lineContent: '    "hello again"', startColumn: 6, endColumn: 11 },
          ] },
        ],
        truncated: false, cancelled: false, skipped: [], regexError: null,
      });
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
      const { setBlocks, setDirtyBlockIds, addToast } = renderReplaceHarness();
      const user = userEvent.setup();

      await user.click(screen.getByText('set query'));
      await user.click(screen.getByText('set replace'));
      await user.click(screen.getByText('search'));
      await user.click(screen.getByText('replace all'));

      expect(confirmSpy).toHaveBeenCalled();
      expect(setBlocks).toHaveBeenCalledTimes(1);
      const updated = setBlocks.mock.calls[0][0](blocks);
      expect(updated[0].content).toBe('label start:\n    "hi world"\n    "hi again"\n');
      expect(setDirtyBlockIds).toHaveBeenCalledTimes(1);
      const dirty = setDirtyBlockIds.mock.calls[0][0](new Set<string>());
      expect(dirty.has('block-1')).toBe(true);
      expect(addToast).toHaveBeenCalledWith(expect.stringContaining('Replaced 2 occurrences in 1 file'), 'success');

      confirmSpy.mockRestore();
    });

    it('does not replace when the user cancels the confirmation', async () => {
      const api = installElectronAPI();
      api.searchInProject.mockResolvedValue({
        results: [
          { filePath: 'game/script.rpy', matches: [
            { lineNumber: 2, lineContent: '    "hello world"', startColumn: 6, endColumn: 11 },
          ] },
        ],
        truncated: false, cancelled: false, skipped: [], regexError: null,
      });
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
      const { setBlocks } = renderReplaceHarness();
      const user = userEvent.setup();

      await user.click(screen.getByText('set query'));
      await user.click(screen.getByText('set replace'));
      await user.click(screen.getByText('search'));
      await user.click(screen.getByText('replace all'));

      expect(confirmSpy).toHaveBeenCalled();
      expect(setBlocks).not.toHaveBeenCalled();

      confirmSpy.mockRestore();
    });
  });
});
