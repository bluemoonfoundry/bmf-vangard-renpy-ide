import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DualPaneContext, useDualPane } from '@/contexts/DualPaneContext';
import type { DualPaneContextValue } from '@/contexts/DualPaneContext';

function mockValue(partial: Partial<DualPaneContextValue> = {}): DualPaneContextValue {
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
    ...partial,
  } as unknown as DualPaneContextValue;
}

function ConsumerComponent() {
  const ctx = useDualPane();
  return <div data-testid="pane">{ctx.activePaneId}</div>;
}

describe('DualPaneContext', () => {
  it('provides context value to consumers', () => {
    render(
      <DualPaneContext.Provider value={mockValue()}>
        <ConsumerComponent />
      </DualPaneContext.Provider>,
    );
    expect(screen.getByTestId('pane').textContent).toBe('primary');
  });

  it('renders children', () => {
    render(
      <DualPaneContext.Provider value={mockValue()}>
        <span data-testid="child">hello</span>
      </DualPaneContext.Provider>,
    );
    expect(screen.getByTestId('child')).toBeTruthy();
  });

  it('useDualPane throws when used outside provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<ConsumerComponent />)).toThrow('useDualPane must be used within a DualPaneContext.Provider');
    spy.mockRestore();
  });

  it('consumer reflects updated activePaneId', () => {
    render(
      <DualPaneContext.Provider value={mockValue({ activePaneId: 'secondary' })}>
        <ConsumerComponent />
      </DualPaneContext.Provider>,
    );
    expect(screen.getByTestId('pane').textContent).toBe('secondary');
  });
});
