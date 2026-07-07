/**
 * @file hooks/useCharacterManagement.test.ts
 * @description Tests for useCharacterManagement — tab opening and character update/rename.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCharacterManagement } from '@/hooks/useCharacterManagement';
import type { UseCharacterManagementProps } from '@/hooks/useCharacterManagement';
import { createMockElectronAPI, installElectronAPI, uninstallElectronAPI } from '@/test/mocks/electronAPI';
import { createBlock, createCharacter, createEmptyAnalysisResult } from '@/test/mocks/sampleData';
import type { Character } from '@/types';

function makeProps(overrides: Partial<UseCharacterManagementProps> = {}): UseCharacterManagementProps {
  const block = createBlock({ content: 'define e = Character("Eileen")\n' });
  const eileen = createCharacter({ tag: 'e', name: 'Eileen', definedInBlockId: block.id });
  const analysisResult = createEmptyAnalysisResult({
    characters: new Map([['e', eileen]]),
  });

  return {
    blocks: [block],
    analysisResult,
    projectRootPath: '/project',
    updateBlock: vi.fn(),
    addBlock: vi.fn(),
    setFileSystemTree: vi.fn(),
    setCharacterProfiles: vi.fn(),
    setHasUnsavedSettings: vi.fn(),
    addToast: vi.fn(),
    pendingTagRenameRef: { current: null },
    openTabs: [],
    secondaryOpenTabs: [],
    activePaneId: 'primary',
    splitLayout: 'none',
    setOpenTabs: vi.fn(),
    setActiveTabId: vi.fn(),
    setSecondaryOpenTabs: vi.fn(),
    setSecondaryActiveTabId: vi.fn(),
    setActivePaneId: vi.fn(),
    ...overrides,
  };
}

// ============================================================================
// handleOpenCharacterEditor
// ============================================================================

describe('useCharacterManagement — handleOpenCharacterEditor', () => {
  it('opens a new primary tab when the tab does not exist', () => {
    const setOpenTabs = vi.fn();
    const setActiveTabId = vi.fn();
    const { result } = renderHook(() =>
      useCharacterManagement(makeProps({ setOpenTabs, setActiveTabId }))
    );
    act(() => result.current.handleOpenCharacterEditor('e'));
    expect(setOpenTabs).toHaveBeenCalled();
    expect(setActiveTabId).toHaveBeenCalledWith('char-e');
  });

  it('activates existing primary tab without adding duplicates', () => {
    const existingTab = { id: 'char-e', type: 'character' as const, characterTag: 'e' };
    const setOpenTabs = vi.fn();
    const setActiveTabId = vi.fn();
    const { result } = renderHook(() =>
      useCharacterManagement(
        makeProps({ openTabs: [existingTab], setOpenTabs, setActiveTabId })
      )
    );
    act(() => result.current.handleOpenCharacterEditor('e'));
    expect(setActiveTabId).toHaveBeenCalledWith('char-e');
    expect(setOpenTabs).not.toHaveBeenCalled();
  });

  it('activates existing secondary tab and switches active pane', () => {
    const existingTab = { id: 'char-e', type: 'character' as const, characterTag: 'e' };
    const setSecondaryActiveTabId = vi.fn();
    const setActivePaneId = vi.fn();
    const { result } = renderHook(() =>
      useCharacterManagement(
        makeProps({
          secondaryOpenTabs: [existingTab],
          setSecondaryActiveTabId,
          setActivePaneId,
        })
      )
    );
    act(() => result.current.handleOpenCharacterEditor('e'));
    expect(setSecondaryActiveTabId).toHaveBeenCalledWith('char-e');
    expect(setActivePaneId).toHaveBeenCalledWith('secondary');
  });

  it('opens in secondary pane when activePaneId is secondary and splitLayout is set', () => {
    const setSecondaryOpenTabs = vi.fn();
    const setSecondaryActiveTabId = vi.fn();
    const { result } = renderHook(() =>
      useCharacterManagement(
        makeProps({
          activePaneId: 'secondary',
          splitLayout: 'right',
          setSecondaryOpenTabs,
          setSecondaryActiveTabId,
        })
      )
    );
    act(() => result.current.handleOpenCharacterEditor('e'));
    expect(setSecondaryOpenTabs).toHaveBeenCalled();
    expect(setSecondaryActiveTabId).toHaveBeenCalledWith('char-e');
  });
});

// ============================================================================
// handleUpdateCharacter — new character (no oldTag)
// ============================================================================

describe('useCharacterManagement — handleUpdateCharacter (new character)', () => {
  let api: ReturnType<typeof createMockElectronAPI>;

  beforeEach(() => {
    api = createMockElectronAPI();
    installElectronAPI(api);
  });

  afterEach(() => {
    uninstallElectronAPI();
  });

  it('appends to existing characters.rpy block when it exists', async () => {
    const charsBlock = createBlock({ id: 'chars-block', filePath: 'game/characters.rpy', content: '# chars\n' });
    const updateBlock = vi.fn();
    const setHasUnsavedSettings = vi.fn();
    const { result } = renderHook(() =>
      useCharacterManagement(makeProps({ blocks: [charsBlock], updateBlock, setHasUnsavedSettings }))
    );
    const newChar: Character = { tag: 'k', name: 'Kira', definedInBlockId: '' };
    await act(async () => {
      await result.current.handleUpdateCharacter(newChar);
    });
    expect(updateBlock).toHaveBeenCalledWith('chars-block', expect.objectContaining({ content: expect.stringContaining('define k') }));
  });

  it('updates characterProfiles when profile is provided', async () => {
    const charsBlock = createBlock({ id: 'chars-block', filePath: 'game/characters.rpy', content: '# chars\n' });
    const setCharacterProfiles = vi.fn();
    const { result } = renderHook(() =>
      useCharacterManagement(makeProps({ blocks: [charsBlock], setCharacterProfiles }))
    );
    const newChar: Character = { tag: 'k', name: 'Kira', definedInBlockId: '', profile: 'Kira profile text' };
    await act(async () => {
      await result.current.handleUpdateCharacter(newChar);
    });
    expect(setCharacterProfiles).toHaveBeenCalled();
  });

  it('shows success toast after saving', async () => {
    const charsBlock = createBlock({ id: 'chars-block', filePath: 'game/characters.rpy', content: '# chars\n' });
    const addToast = vi.fn();
    const { result } = renderHook(() =>
      useCharacterManagement(makeProps({ blocks: [charsBlock], addToast }))
    );
    const newChar: Character = { tag: 'k', name: 'Kira', definedInBlockId: '' };
    await act(async () => {
      await result.current.handleUpdateCharacter(newChar);
    });
    expect(addToast).toHaveBeenCalledWith(expect.stringContaining('Kira'), 'success');
  });
});

// ============================================================================
// handleUpdateCharacter — updating existing character (with oldTag)
// ============================================================================

describe('useCharacterManagement — handleUpdateCharacter (update existing)', () => {
  it('updates block content with new character definition', async () => {
    const block = createBlock({
      id: 'block-1',
      content: 'define e = Character("Eileen")\n',
    });
    const eileen = createCharacter({ tag: 'e', name: 'Eileen', definedInBlockId: 'block-1' });
    const analysisResult = createEmptyAnalysisResult({
      characters: new Map([['e', eileen]]),
    });
    const updateBlock = vi.fn();
    const { result } = renderHook(() =>
      useCharacterManagement(makeProps({ blocks: [block], analysisResult, updateBlock }))
    );
    const updatedChar: Character = { tag: 'e', name: 'Eileen Updated', color: '#ff0000', definedInBlockId: 'block-1' };
    await act(async () => {
      await result.current.handleUpdateCharacter(updatedChar, 'e');
    });
    expect(updateBlock).toHaveBeenCalledWith('block-1', expect.objectContaining({ content: expect.stringContaining('define e') }));
  });

  it('shows error toast when original character definition cannot be found', async () => {
    const addToast = vi.fn();
    const analysisResult = createEmptyAnalysisResult({
      characters: new Map(), // 'e' not in the map
    });
    const { result } = renderHook(() =>
      useCharacterManagement(makeProps({ analysisResult, addToast }))
    );
    const char: Character = { tag: 'e', name: 'Eileen', definedInBlockId: 'block-1' };
    await act(async () => {
      await result.current.handleUpdateCharacter(char, 'e');
    });
    expect(addToast).toHaveBeenCalledWith(expect.stringContaining('Cannot find'), 'error');
  });

  it('shows error toast when block cannot be found for the character', async () => {
    const addToast = vi.fn();
    const eileen = createCharacter({ tag: 'e', name: 'Eileen', definedInBlockId: 'missing-block' });
    const analysisResult = createEmptyAnalysisResult({
      characters: new Map([['e', eileen]]),
    });
    const { result } = renderHook(() =>
      useCharacterManagement(makeProps({
        blocks: [], // empty blocks — 'missing-block' not found
        analysisResult,
        addToast,
      }))
    );
    const char: Character = { tag: 'e', name: 'Eileen', definedInBlockId: 'missing-block' };
    await act(async () => {
      await result.current.handleUpdateCharacter(char, 'e');
    });
    expect(addToast).toHaveBeenCalledWith(expect.stringContaining('Cannot find file'), 'error');
  });
});

// ============================================================================
// handleUpdateCharacter — rename (oldTag !== newTag)
// ============================================================================

describe('useCharacterManagement — handleUpdateCharacter (rename tag)', () => {
  it('renames tag in the define block and dialogue blocks', async () => {
    const defineBlock = createBlock({
      id: 'block-1',
      content: 'define e = Character("Eileen")\n',
    });
    const dialogueBlock = createBlock({
      id: 'block-2',
      content: 'label start:\n    e "Hello!"\n    return\n',
    });
    const eileen = createCharacter({ tag: 'e', name: 'Eileen', definedInBlockId: 'block-1' });
    const analysisResult = createEmptyAnalysisResult({
      characters: new Map([['e', eileen]]),
    });
    const updateBlock = vi.fn();
    const pendingTagRenameRef = { current: null as { oldTag: string; newTag: string } | null };
    const { result } = renderHook(() =>
      useCharacterManagement(makeProps({
        blocks: [defineBlock, dialogueBlock],
        analysisResult,
        updateBlock,
        pendingTagRenameRef,
      }))
    );
    const renamedChar: Character = { tag: 'eileen', name: 'Eileen', definedInBlockId: 'block-1' };
    await act(async () => {
      await result.current.handleUpdateCharacter(renamedChar, 'e');
    });
    // pendingTagRenameRef should be set
    expect(pendingTagRenameRef.current).toEqual({ oldTag: 'e', newTag: 'eileen' });
    // updateBlock should have been called for files that had matches
    expect(updateBlock).toHaveBeenCalled();
  });
});
