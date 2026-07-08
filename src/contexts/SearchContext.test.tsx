import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchProvider, useSearch } from '@/contexts/SearchContext';
import { DualPaneContext } from '@/contexts/DualPaneContext';
import type { DualPaneContextValue } from '@/contexts/DualPaneContext';
import { installElectronAPI } from '@/test/mocks/electronAPI';

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
      <SearchProvider blocks={[]} projectRootPath={null} addToast={vi.fn()}>
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
    api.searchInProject.mockResolvedValue([]);

    function WithPath({ children }: { children: React.ReactNode }) {
      return (
        <DualPaneContext.Provider value={makeDualPaneValue()}>
          <SearchProvider blocks={[]} projectRootPath="/project" addToast={vi.fn()}>
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
});
