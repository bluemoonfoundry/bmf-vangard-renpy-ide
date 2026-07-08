import React from 'react';
import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';

beforeAll(() => {
  // jsdom does not implement scrollIntoView
  Element.prototype.scrollIntoView = vi.fn();
});
import userEvent from '@testing-library/user-event';
import { installElectronAPI } from '@/test/mocks/electronAPI';

import AboutModal from '@/components/AboutModal';
import GoToLabelModal from '@/components/GoToLabelModal';
import LegacyMigrationModal from '@/components/LegacyMigrationModal';
import ConfigureRenpyModal from '@/components/ConfigureRenpyModal';
import KeyboardShortcutsModal from '@/components/KeyboardShortcutsModal';

// ─── AboutModal ───────────────────────────────────────────────────────────────

describe('AboutModal', () => {
  it('renders null when closed', () => {
    const { container } = render(<AboutModal isOpen={false} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the app name when open', () => {
    render(<AboutModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText('Vangard Studio')).toBeTruthy();
  });

  it('calls onClose when Close button is clicked', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<AboutModal isOpen={true} onClose={onClose} />);
    await user.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when backdrop is clicked', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<AboutModal isOpen={true} onClose={onClose} />);
    // click the outermost overlay div
    await user.click(document.querySelector('.fixed.inset-0')!);
    expect(onClose).toHaveBeenCalled();
  });

  it('shows the version number', () => {
    render(<AboutModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText(/v\d+\.\d+\.\d+/)).toBeTruthy();
  });
});

// ─── GoToLabelModal ──────────────────────────────────────────────────────────

const ITEMS = [
  { label: 'scene_intro', id: 'block-1' },
  { label: 'scene_ending', id: 'block-2' },
  { label: 'credits', id: 'block-3' },
];

describe('GoToLabelModal', () => {
  it('renders null when closed', () => {
    render(
      <GoToLabelModal isOpen={false} items={ITEMS} canvasName="Story" onSelect={vi.fn()} onClose={vi.fn()} />,
    );
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders the dialog when open', () => {
    render(
      <GoToLabelModal isOpen={true} items={ITEMS} canvasName="Story" onSelect={vi.fn()} onClose={vi.fn()} />,
    );
    expect(screen.getByRole('dialog')).toBeTruthy();
  });

  it('shows all items initially (up to 10)', () => {
    render(
      <GoToLabelModal isOpen={true} items={ITEMS} canvasName="Story" onSelect={vi.fn()} onClose={vi.fn()} />,
    );
    expect(screen.getByText('scene_intro')).toBeTruthy();
    expect(screen.getByText('scene_ending')).toBeTruthy();
    expect(screen.getByText('credits')).toBeTruthy();
  });

  it('filters items as query is typed', async () => {
    const user = userEvent.setup();
    render(
      <GoToLabelModal isOpen={true} items={ITEMS} canvasName="Story" onSelect={vi.fn()} onClose={vi.fn()} />,
    );
    await user.type(screen.getByRole('textbox'), 'scene');
    expect(screen.getByText('scene_intro')).toBeTruthy();
    expect(screen.getByText('scene_ending')).toBeTruthy();
    expect(screen.queryByText('credits')).toBeNull();
  });

  it('calls onSelect when an item is clicked', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(
      <GoToLabelModal isOpen={true} items={ITEMS} canvasName="Story" onSelect={onSelect} onClose={vi.fn()} />,
    );
    await user.click(screen.getByText('credits'));
    expect(onSelect).toHaveBeenCalledWith('block-3');
  });

  it('shows empty state text when no items match', async () => {
    const user = userEvent.setup();
    render(
      <GoToLabelModal isOpen={true} items={ITEMS} canvasName="Story" onSelect={vi.fn()} onClose={vi.fn()} emptyStateText="Nothing found" />,
    );
    await user.type(screen.getByRole('textbox'), 'zzz');
    expect(screen.getByText('Nothing found')).toBeTruthy();
  });

  it('calls onClose on Escape key', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <GoToLabelModal isOpen={true} items={ITEMS} canvasName="Story" onSelect={vi.fn()} onClose={onClose} />,
    );
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });
});

// ─── LegacyMigrationModal ────────────────────────────────────────────────────

describe('LegacyMigrationModal', () => {
  it('renders null when closed', () => {
    const { container } = render(
      <LegacyMigrationModal isOpen={false} onImport={vi.fn()} onSkip={vi.fn()} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders the title when open', () => {
    render(<LegacyMigrationModal isOpen={true} onImport={vi.fn()} onSkip={vi.fn()} />);
    expect(screen.getByText(/import settings from ren'ide/i)).toBeTruthy();
  });

  it('calls onImport when Import Settings is clicked', async () => {
    const onImport = vi.fn();
    const user = userEvent.setup();
    render(<LegacyMigrationModal isOpen={true} onImport={onImport} onSkip={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: /import settings/i }));
    expect(onImport).toHaveBeenCalled();
  });

  it('calls onSkip when Skip is clicked', async () => {
    const onSkip = vi.fn();
    const user = userEvent.setup();
    render(<LegacyMigrationModal isOpen={true} onImport={vi.fn()} onSkip={onSkip} />);
    await user.click(screen.getByRole('button', { name: /skip/i }));
    expect(onSkip).toHaveBeenCalled();
  });
});

// ─── ConfigureRenpyModal ─────────────────────────────────────────────────────

describe('ConfigureRenpyModal', () => {
  beforeEach(() => {
    installElectronAPI();
  });

  it('renders null when closed', () => {
    const { container } = render(
      <ConfigureRenpyModal isOpen={false} onClose={vi.fn()} onSave={vi.fn()} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders the title when open', () => {
    render(<ConfigureRenpyModal isOpen={true} onClose={vi.fn()} onSave={vi.fn()} />);
    expect(screen.getByText(/configure ren'py sdk/i)).toBeTruthy();
  });

  it('Save button is disabled when no path is selected', () => {
    render(<ConfigureRenpyModal isOpen={true} onClose={vi.fn()} onSave={vi.fn()} />);
    const saveButton = screen.getByRole('button', { name: /save/i });
    expect(saveButton).toBeDisabled();
  });

  it('calls onSave with the selected path when Browse resolves', async () => {
    const api = installElectronAPI();
    api.selectRenpy.mockResolvedValue('/usr/local/renpy-8');
    const onSave = vi.fn();
    const user = userEvent.setup();
    render(<ConfigureRenpyModal isOpen={true} onClose={vi.fn()} onSave={onSave} />);
    await user.click(screen.getByRole('button', { name: /browse/i }));
    await user.click(screen.getByRole('button', { name: /save/i }));
    expect(onSave).toHaveBeenCalledWith('/usr/local/renpy-8');
  });

  it('calls onClose when backdrop is clicked', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<ConfigureRenpyModal isOpen={true} onClose={onClose} onSave={vi.fn()} />);
    await user.click(document.querySelector('.fixed.inset-0')!);
    expect(onClose).toHaveBeenCalled();
  });
});

// ─── KeyboardShortcutsModal ───────────────────────────────────────────────────

describe('KeyboardShortcutsModal', () => {
  it('renders null when closed', () => {
    const { container } = render(<KeyboardShortcutsModal isOpen={false} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders keyboard shortcut content when open', () => {
    render(<KeyboardShortcutsModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByRole('dialog')).toBeTruthy();
  });

  it('calls onClose when Close button is clicked', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<KeyboardShortcutsModal isOpen={true} onClose={onClose} />);
    // The footer has a "Close" text button (the × icon button uses aria-label)
    await user.click(screen.getByText('Close'));
    expect(onClose).toHaveBeenCalled();
  });

  it('shows Shift as a key modifier by default for pan gesture', () => {
    render(<KeyboardShortcutsModal isOpen={true} onClose={vi.fn()} />);
    // Multiple kbd elements show "Shift" across shortcuts (F5, Ctrl+G, etc.) — just confirm it appears
    expect(screen.getAllByText('Shift').length).toBeGreaterThan(0);
  });

  it('shows middle mouse pan gesture when configured', () => {
    render(
      <KeyboardShortcutsModal
        isOpen={true}
        onClose={vi.fn()}
        mouseGestures={{
          canvasPanGesture: 'middle-drag',
          middleMouseAlwaysPans: false,
          zoomScrollDirection: 'normal',
          zoomScrollSensitivity: 1,
        }}
      />,
    );
    expect(screen.getByText('Middle Mouse')).toBeTruthy();
  });
});
