import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useModalState } from '@/hooks/useModalState';

describe('useModalState', () => {
  // ── Initial state ─────────────────────────────────────────────────────────

  it('initializes all boolean flags to false', () => {
    const { result } = renderHook(() => useModalState());
    expect(result.current.createBlockModalOpen).toBe(false);
    expect(result.current.settingsModalOpen).toBe(false);
    expect(result.current.shortcutsModalOpen).toBe(false);
    expect(result.current.aboutModalOpen).toBe(false);
    expect(result.current.showConfigureRenpyModal).toBe(false);
    expect(result.current.wizardModalOpen).toBe(false);
    expect(result.current.showTutorial).toBe(false);
    expect(result.current.isGoToLabelOpen).toBe(false);
    expect(result.current.isWarpToLabelOpen).toBe(false);
    expect(result.current.isWarpVariablesOpen).toBe(false);
    expect(result.current.userSnippetModalOpen).toBe(false);
    expect(result.current.menuConstructorModalOpen).toBe(false);
  });

  it('initializes nullable state to null', () => {
    const { result } = renderHook(() => useModalState());
    expect(result.current.deleteConfirmInfo).toBeNull();
    expect(result.current.unsavedChangesModalInfo).toBeNull();
    expect(result.current.contextMenuInfo).toBeNull();
    expect(result.current.editingSnippet).toBeNull();
    expect(result.current.editingMenuTemplate).toBeNull();
  });

  // ── Simple toggle modals ──────────────────────────────────────────────────

  it.each([
    ['settings', 'settingsModalOpen', 'openSettingsModal', 'closeSettingsModal'],
    ['shortcuts', 'shortcutsModalOpen', 'openShortcutsModal', 'closeShortcutsModal'],
    ['about', 'aboutModalOpen', 'openAboutModal', 'closeAboutModal'],
    ['configureRenpy', 'showConfigureRenpyModal', 'openConfigureRenpyModal', 'closeConfigureRenpyModal'],
    ['wizard', 'wizardModalOpen', 'openWizardModal', 'closeWizardModal'],
    ['tutorial', 'showTutorial', 'openTutorial', 'closeTutorial'],
    ['goToLabel', 'isGoToLabelOpen', 'openGoToLabelModal', 'closeGoToLabelModal'],
    ['warpToLabel', 'isWarpToLabelOpen', 'openWarpToLabelModal', 'closeWarpToLabelModal'],
    ['warpVariables', 'isWarpVariablesOpen', 'openWarpVariablesModal', 'closeWarpVariablesModal'],
  ] as const)('toggles %s modal open then closed', (_, flag, opener, closer) => {
    const { result } = renderHook(() => useModalState());
    act(() => (result.current[opener] as () => void)());
    expect(result.current[flag]).toBe(true);
    act(() => (result.current[closer] as () => void)());
    expect(result.current[flag]).toBe(false);
  });

  // ── Create block modal ────────────────────────────────────────────────────

  it('openCreateBlockModal sets type, position, folderPath, and open flag', () => {
    const { result } = renderHook(() => useModalState());
    act(() => result.current.openCreateBlockModal('screen', { x: 10, y: 20 }, 'game/ui'));
    expect(result.current.createBlockModalOpen).toBe(true);
    expect(result.current.createBlockModalType).toBe('screen');
    expect(result.current.createBlockModalPosition).toEqual({ x: 10, y: 20 });
    expect(result.current.createBlockModalFolderPath).toBe('game/ui');
  });

  it('closeCreateBlockModal clears position and folderPath', () => {
    const { result } = renderHook(() => useModalState());
    act(() => result.current.openCreateBlockModal('story', { x: 5, y: 5 }, 'game'));
    act(() => result.current.closeCreateBlockModal());
    expect(result.current.createBlockModalOpen).toBe(false);
    expect(result.current.createBlockModalPosition).toBeUndefined();
    expect(result.current.createBlockModalFolderPath).toBe('');
  });

  it('openCreateBlockModal without position defaults to undefined', () => {
    const { result } = renderHook(() => useModalState());
    act(() => result.current.openCreateBlockModal('story'));
    expect(result.current.createBlockModalPosition).toBeUndefined();
    expect(result.current.createBlockModalFolderPath).toBe('');
  });

  // ── Delete confirm modal ──────────────────────────────────────────────────

  it('openDeleteConfirmModal stores paths and onConfirm callback', () => {
    const onConfirm = vi.fn();
    const { result } = renderHook(() => useModalState());
    act(() => result.current.openDeleteConfirmModal(['a.rpy', 'b.rpy'], onConfirm));
    expect(result.current.deleteConfirmInfo?.paths).toEqual(['a.rpy', 'b.rpy']);
    expect(result.current.deleteConfirmInfo?.onConfirm).toBe(onConfirm);
  });

  it('closeDeleteConfirmModal resets to null', () => {
    const { result } = renderHook(() => useModalState());
    act(() => result.current.openDeleteConfirmModal(['x.rpy'], vi.fn()));
    act(() => result.current.closeDeleteConfirmModal());
    expect(result.current.deleteConfirmInfo).toBeNull();
  });

  // ── Unsaved changes modal ─────────────────────────────────────────────────

  it('openUnsavedChangesModal stores full info object', () => {
    const info = {
      title: 'Unsaved',
      message: 'You have unsaved changes',
      confirmText: 'Save',
      dontSaveText: "Don't Save",
      onConfirm: vi.fn(),
      onDontSave: vi.fn(),
      onCancel: vi.fn(),
    };
    const { result } = renderHook(() => useModalState());
    act(() => result.current.openUnsavedChangesModal(info));
    expect(result.current.unsavedChangesModalInfo?.title).toBe('Unsaved');
    expect(result.current.unsavedChangesModalInfo?.onConfirm).toBe(info.onConfirm);
  });

  it('closeUnsavedChangesModal resets to null', () => {
    const { result } = renderHook(() => useModalState());
    act(() => result.current.openUnsavedChangesModal({
      title: '', message: '', confirmText: '', dontSaveText: '',
      onConfirm: vi.fn(), onDontSave: vi.fn(), onCancel: vi.fn(),
    }));
    act(() => result.current.closeUnsavedChangesModal());
    expect(result.current.unsavedChangesModalInfo).toBeNull();
  });

  // ── Context menu ──────────────────────────────────────────────────────────

  it('openContextMenu stores coordinates, tabId, and paneId', () => {
    const { result } = renderHook(() => useModalState());
    act(() => result.current.openContextMenu(100, 200, 'block-1', 'secondary'));
    expect(result.current.contextMenuInfo).toEqual({ x: 100, y: 200, tabId: 'block-1', paneId: 'secondary' });
  });

  it('closeContextMenu resets to null', () => {
    const { result } = renderHook(() => useModalState());
    act(() => result.current.openContextMenu(0, 0, 'canvas', 'primary'));
    act(() => result.current.closeContextMenu());
    expect(result.current.contextMenuInfo).toBeNull();
  });

  // ── User snippet modal ────────────────────────────────────────────────────

  it('openUserSnippetModal without argument sets editingSnippet to null', () => {
    const { result } = renderHook(() => useModalState());
    act(() => result.current.openUserSnippetModal());
    expect(result.current.userSnippetModalOpen).toBe(true);
    expect(result.current.editingSnippet).toBeNull();
  });

  it('openUserSnippetModal with snippet stores it', () => {
    const snippet = { id: 's1', name: 'My Snippet', content: 'jump start', tags: [] };
    const { result } = renderHook(() => useModalState());
    act(() => result.current.openUserSnippetModal(snippet as never));
    expect(result.current.editingSnippet).toBe(snippet);
  });

  it('closeUserSnippetModal clears editingSnippet', () => {
    const snippet = { id: 's1', name: 'My Snippet', content: 'jump start', tags: [] };
    const { result } = renderHook(() => useModalState());
    act(() => result.current.openUserSnippetModal(snippet as never));
    act(() => result.current.closeUserSnippetModal());
    expect(result.current.userSnippetModalOpen).toBe(false);
    expect(result.current.editingSnippet).toBeNull();
  });

  // ── Menu constructor modal ────────────────────────────────────────────────

  it('openMenuConstructorModal without argument sets editingMenuTemplate to null', () => {
    const { result } = renderHook(() => useModalState());
    act(() => result.current.openMenuConstructorModal());
    expect(result.current.menuConstructorModalOpen).toBe(true);
    expect(result.current.editingMenuTemplate).toBeNull();
  });

  it('openMenuConstructorModal with template stores it', () => {
    const template = { id: 't1', name: 'Choice', content: 'menu:' };
    const { result } = renderHook(() => useModalState());
    act(() => result.current.openMenuConstructorModal(template as never));
    expect(result.current.editingMenuTemplate).toBe(template);
  });

  it('closeMenuConstructorModal clears template', () => {
    const { result } = renderHook(() => useModalState());
    act(() => result.current.openMenuConstructorModal({ id: 't1', name: 'T', content: '' } as never));
    act(() => result.current.closeMenuConstructorModal());
    expect(result.current.menuConstructorModalOpen).toBe(false);
    expect(result.current.editingMenuTemplate).toBeNull();
  });
});
