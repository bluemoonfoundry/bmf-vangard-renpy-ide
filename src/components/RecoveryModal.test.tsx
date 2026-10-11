import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RecoveryModal from '@/components/RecoveryModal';
import type { PendingRecovery } from '@/types';

const pending: PendingRecovery = {
  sessionId: '11111111-1111-4111-8111-111111111111',
  projectRoot: '/proj',
  updatedAt: new Date(Date.now() - 5 * 60_000).toISOString(),
  files: [
    { relativePath: 'game/script.rpy', content: 'a', status: 'unchanged' },
    { relativePath: 'game/other.rpy', content: 'b', status: 'changed' },
    { relativePath: 'game/gone.rpy', content: 'c', status: 'deleted' },
  ],
  untitled: [{ id: 'u1', title: 'Untitled-1', content: 'draft' }],
  settings: { draftingMode: false, openTabs: [], activeTabId: 'canvas' },
  settingsStatus: 'changed',
};

function setup(p: PendingRecovery = pending) {
  const handlers = { onRestore: vi.fn(), onDiscard: vi.fn(), onDecideLater: vi.fn() };
  render(<RecoveryModal isOpen pending={p} {...handlers} />);
  return handlers;
}

describe('RecoveryModal', () => {
  it('renders nothing when closed', () => {
    const { container } = render(<RecoveryModal isOpen={false} pending={pending} onRestore={vi.fn()} onDiscard={vi.fn()} onDecideLater={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('checks unchanged files and drafts by default; leaves changed/deleted and changed workspace unchecked', () => {
    setup();
    expect(screen.getByRole('checkbox', { name: /game\/script\.rpy/ })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: /game\/other\.rpy/ })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: /game\/gone\.rpy/ })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: /Untitled-1/ })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: /Workspace changes/ })).not.toBeChecked();
    expect(screen.getByText('changed on disk since', { selector: '[data-badge="file"]' })).toBeInTheDocument();
    expect(screen.getByText(/deleted from disk/)).toBeInTheDocument();
  });

  it('checks workspace changes by default when unchanged on disk', () => {
    setup({ ...pending, settingsStatus: 'unchanged' });
    expect(screen.getByRole('checkbox', { name: /Workspace changes/ })).toBeChecked();
  });

  it('Restore selected passes only the checked items', () => {
    const h = setup();
    fireEvent.click(screen.getByRole('checkbox', { name: /game\/other\.rpy/ }));
    fireEvent.click(screen.getByRole('checkbox', { name: /Untitled-1/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Restore selected' }));
    expect(h.onRestore).toHaveBeenCalledWith({ files: ['game/script.rpy', 'game/other.rpy'], untitled: [], settings: false });
  });

  it('disables Restore selected when nothing is checked', () => {
    setup({ ...pending, files: [pending.files[1]], untitled: [], settings: null, settingsStatus: null });
    expect(screen.getByRole('button', { name: 'Restore selected' })).toBeDisabled();
  });

  it('Discard requires confirmation', () => {
    const h = setup();
    fireEvent.click(screen.getByRole('button', { name: 'Discard…' }));
    expect(h.onDiscard).not.toHaveBeenCalled();
    expect(screen.getByText(/permanently deletes the recovered work/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Discard recovered work' }));
    expect(h.onDiscard).toHaveBeenCalledTimes(1);
  });

  it('Decide later, Escape and the backdrop all defer without discarding', () => {
    const h = setup();
    fireEvent.click(screen.getByRole('button', { name: 'Decide later' }));
    fireEvent.keyDown(document, { key: 'Escape' });
    fireEvent.click(screen.getByTestId('recovery-backdrop'));
    expect(h.onDecideLater).toHaveBeenCalledTimes(3);
    expect(h.onDiscard).not.toHaveBeenCalled();
  });
});
