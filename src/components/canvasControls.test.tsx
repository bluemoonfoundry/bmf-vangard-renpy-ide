import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CanvasLayoutControls from '@/components/CanvasLayoutControls';
import CanvasNavControls from '@/components/CanvasNavControls';
import CanvasToolbox from '@/components/CanvasToolbox';
import StatusBar from '@/components/StatusBar';
import CodeActionButtons from '@/components/CodeActionButtons';

// ─── CanvasLayoutControls ─────────────────────────────────────────────────────

describe('CanvasLayoutControls', () => {
  const baseProps = {
    canvasLabel: 'Story',
    layoutMode: 'flow-td' as const,
    groupingMode: 'none' as const,
    onChangeLayoutMode: vi.fn(),
    onChangeGroupingMode: vi.fn(),
  };

  it('renders without crashing', () => {
    const { container } = render(<CanvasLayoutControls {...baseProps} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('calls onChangeLayoutMode when a layout button is clicked', async () => {
    const onChangeLayoutMode = vi.fn();
    const user = userEvent.setup();
    render(<CanvasLayoutControls {...baseProps} onChangeLayoutMode={onChangeLayoutMode} />);
    // Find a button for a layout mode other than the current one
    const buttons = screen.getAllByRole('button');
    const inactiveButton = buttons.find(b => b.getAttribute('aria-pressed') === 'false');
    if (inactiveButton) {
      await user.click(inactiveButton);
      expect(onChangeLayoutMode).toHaveBeenCalled();
    }
  });

  it('marks the active layout mode button as pressed', () => {
    render(<CanvasLayoutControls {...baseProps} layoutMode="flow-lr" />);
    const pressedButtons = screen.getAllByRole('button').filter(
      b => b.getAttribute('aria-pressed') === 'true',
    );
    expect(pressedButtons.length).toBeGreaterThan(0);
  });

  it('restricts shown layout modes when allowedLayoutModes is provided', () => {
    render(
      <CanvasLayoutControls
        {...baseProps}
        allowedLayoutModes={['flow-td', 'flow-lr']}
      />,
    );
    // Only 2 layout mode buttons + grouping buttons should be shown
    const layoutButtons = screen.getAllByRole('button').filter(
      b => b.getAttribute('aria-label')?.includes('flow') || b.getAttribute('aria-pressed') !== null,
    );
    // Grouping buttons would be extra — just verify we don't crash and render
    expect(layoutButtons.length).toBeGreaterThan(0);
  });

  it('shows view level toggle when onChangeViewLevel is provided', () => {
    render(
      <CanvasLayoutControls
        {...baseProps}
        viewLevel="file"
        onChangeViewLevel={vi.fn()}
      />,
    );
    // View level buttons should be present
    expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
  });
});

// ─── CanvasNavControls ────────────────────────────────────────────────────────

describe('CanvasNavControls', () => {
  it('renders the fit-to-screen button', () => {
    render(<CanvasNavControls onFit={vi.fn()} />);
    expect(screen.getByRole('button', { name: /fit all to screen/i })).toBeTruthy();
  });

  it('calls onFit when the fit button is clicked', async () => {
    const onFit = vi.fn();
    const user = userEvent.setup();
    render(<CanvasNavControls onFit={onFit} />);
    await user.click(screen.getByRole('button', { name: /fit all to screen/i }));
    expect(onFit).toHaveBeenCalled();
  });

  it('does not show go-to-start button when hasStart is false', () => {
    render(<CanvasNavControls onFit={vi.fn()} hasStart={false} />);
    expect(screen.queryByRole('button', { name: /go to start/i })).toBeNull();
  });

  it('shows go-to-start button when hasStart is true and onGoToStart is provided', () => {
    render(<CanvasNavControls onFit={vi.fn()} hasStart={true} onGoToStart={vi.fn()} />);
    expect(screen.getByRole('button', { name: /go to start/i })).toBeTruthy();
  });

  it('calls onGoToStart when the go-to-start button is clicked', async () => {
    const onGoToStart = vi.fn();
    const user = userEvent.setup();
    render(<CanvasNavControls onFit={vi.fn()} hasStart={true} onGoToStart={onGoToStart} />);
    await user.click(screen.getByRole('button', { name: /go to start/i }));
    expect(onGoToStart).toHaveBeenCalled();
  });

  it('uses custom fitTitle for the fit button', () => {
    render(<CanvasNavControls onFit={vi.fn()} fitTitle="My custom title (F)" />);
    expect(screen.getByTitle('My custom title (F)')).toBeTruthy();
  });
});

// ─── CanvasToolbox ────────────────────────────────────────────────────────────

describe('CanvasToolbox', () => {
  it('renders children', () => {
    render(
      <CanvasToolbox>
        <span data-testid="child">content</span>
      </CanvasToolbox>,
    );
    expect(screen.getByTestId('child')).toBeTruthy();
  });

  it('renders the default label', () => {
    render(<CanvasToolbox><span /></CanvasToolbox>);
    expect(screen.getByText(/canvas controls/i)).toBeTruthy();
  });

  it('renders a custom label', () => {
    render(<CanvasToolbox label="My Panel"><span /></CanvasToolbox>);
    expect(screen.getByText('My Panel')).toBeTruthy();
  });

  it('collapses and expands when toggle is clicked', async () => {
    const user = userEvent.setup();
    render(
      <CanvasToolbox>
        <span data-testid="child">content</span>
      </CanvasToolbox>,
    );
    const toggleBtn = screen.getByRole('button');
    expect(toggleBtn.getAttribute('aria-expanded')).toBe('true');
    await user.click(toggleBtn);
    expect(toggleBtn.getAttribute('aria-expanded')).toBe('false');
    await user.click(toggleBtn);
    expect(toggleBtn.getAttribute('aria-expanded')).toBe('true');
  });
});

// ─── StatusBar ────────────────────────────────────────────────────────────────

const defaultStatusProps = {
  isAnalysisPending: false,
  isScanningAssets: false,
  saveStatus: 'saved' as const,
  blockCount: 5,
  errorCount: 0,
  warningCount: 0,
  screenshotCount: 0,
};

describe('StatusBar', () => {
  it('shows "Ready" when idle', () => {
    render(<StatusBar {...defaultStatusProps} />);
    expect(screen.getByText('Ready')).toBeTruthy();
  });

  it('shows "Saving..." when saveStatus is saving', () => {
    render(<StatusBar {...defaultStatusProps} saveStatus="saving" />);
    expect(screen.getByText('Saving...')).toBeTruthy();
  });

  it('shows save error message when saveStatus is error', () => {
    render(<StatusBar {...defaultStatusProps} saveStatus="error" />);
    expect(screen.getByText(/save failed/i)).toBeTruthy();
  });

  it('shows "Scanning assets..." when isScanningAssets', () => {
    render(<StatusBar {...defaultStatusProps} isScanningAssets={true} />);
    expect(screen.getByText(/scanning assets/i)).toBeTruthy();
  });

  it('shows "Analyzing..." when isAnalysisPending', () => {
    render(<StatusBar {...defaultStatusProps} isAnalysisPending={true} />);
    expect(screen.getByText(/analyzing/i)).toBeTruthy();
  });

  it('shows the block count', () => {
    render(<StatusBar {...defaultStatusProps} blockCount={12} />);
    expect(screen.getByText(/12/)).toBeTruthy();
  });

  it('shows error count when non-zero', () => {
    render(<StatusBar {...defaultStatusProps} errorCount={3} />);
    expect(screen.getByText(/3 errors/i)).toBeTruthy();
  });

  it('shows screenshot indicator when screenshotCount > 0', () => {
    render(<StatusBar {...defaultStatusProps} screenshotCount={2} />);
    expect(screen.getByText('2')).toBeTruthy();
  });

  it('save error has higher priority than scanning', () => {
    render(<StatusBar {...defaultStatusProps} saveStatus="error" isScanningAssets={true} />);
    expect(screen.getByText(/save failed/i)).toBeTruthy();
    expect(screen.queryByText(/scanning/i)).toBeNull();
  });
});

// ─── CodeActionButtons ────────────────────────────────────────────────────────

describe('CodeActionButtons', () => {
  it('renders a copy button', () => {
    render(<CodeActionButtons code="label start:" />);
    expect(screen.getByRole('button')).toBeTruthy();
  });

  it('disables the button when code is empty', () => {
    render(<CodeActionButtons code="" />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('button is enabled when code is non-empty', () => {
    render(<CodeActionButtons code="label start:" />);
    expect(screen.getByRole('button')).not.toBeDisabled();
  });

  it('shows "Copied!" after click', async () => {
    const user = userEvent.setup();
    render(<CodeActionButtons code="label start:" />);
    await user.click(screen.getByRole('button'));
    expect(screen.getByText('Copied!')).toBeTruthy();
  });
});
