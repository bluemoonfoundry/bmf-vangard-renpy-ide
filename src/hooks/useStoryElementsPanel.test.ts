import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useStoryElementsPanel } from '@/hooks/useStoryElementsPanel';
import { createBlock, createEmptyAnalysisResult, createSampleAnalysisResult } from '@/test/mocks/sampleData';
import { installElectronAPI } from '@/test/mocks/electronAPI';

function makeParams(overrides: Partial<Parameters<typeof useStoryElementsPanel>[0]> = {}) {
  return {
    blocks: [createBlock()],
    analysisResult: createEmptyAnalysisResult(),
    updateBlock: vi.fn(),
    addBlock: vi.fn(),
    setFileSystemTree: vi.fn(),
    setHoverHighlightIds: vi.fn(),
    projectRootPath: '/project',
    addToast: vi.fn(),
    handleOpenEditor: vi.fn(),
    ...overrides,
  };
}

describe('useStoryElementsPanel', () => {
  beforeEach(() => {
    installElectronAPI();
  });

  // ── handleAddVariable ─────────────────────────────────────────────────────

  it('appends variable content to existing variables.rpy block', async () => {
    const existingBlock = createBlock({
      id: 'vars',
      filePath: 'game/variables.rpy',
      content: 'default x = 0\n',
    });
    const updateBlock = vi.fn();
    const addToast = vi.fn();
    const { result } = renderHook(() =>
      useStoryElementsPanel(makeParams({ blocks: [existingBlock], updateBlock, addToast })),
    );
    await act(async () => {
      await result.current.handleAddVariable({ name: 'score', initialValue: '0' });
    });
    expect(updateBlock).toHaveBeenCalledWith('vars', expect.objectContaining({
      content: expect.stringContaining('default score = 0'),
    }));
    expect(addToast).toHaveBeenCalledWith(expect.stringContaining('score'), 'success');
  });

  it('creates variables.rpy on disk and adds a non-dirty block since content is already saved', async () => {
    const addBlock = vi.fn();
    const addToast = vi.fn();
    const { result } = renderHook(() =>
      useStoryElementsPanel(makeParams({ blocks: [], addBlock, addToast })),
    );
    await act(async () => {
      await result.current.handleAddVariable({ name: 'points', initialValue: '10' });
    });
    expect(addBlock).toHaveBeenCalledWith(
      'game/variables.rpy',
      expect.stringContaining('default points = 10'),
      undefined,
      { markDirty: false },
    );
  });

  it('calls addBlock when no variables.rpy exists and no electronAPI', async () => {
    // Remove electronAPI to trigger the fallback path
    Object.defineProperty(window, 'electronAPI', { value: undefined, configurable: true });
    const addBlock = vi.fn();
    const addToast = vi.fn();
    const { result } = renderHook(() =>
      useStoryElementsPanel(makeParams({ blocks: [], addBlock, addToast })),
    );
    await act(async () => {
      await result.current.handleAddVariable({ name: 'points', initialValue: '10' });
    });
    expect(addBlock).toHaveBeenCalledWith('game/variables.rpy', expect.stringContaining('default points = 10'));
    expect(addToast).toHaveBeenCalledWith(expect.stringContaining('points'), 'success');
    // Restore
    installElectronAPI();
  });

  // ── handleEditVariable ────────────────────────────────────────────────────

  it('shows error toast when variable not found in analysis', () => {
    const addToast = vi.fn();
    const { result } = renderHook(() =>
      useStoryElementsPanel(makeParams({ addToast })),
    );
    act(() => result.current.handleEditVariable('nonexistent', { name: 'x', type: 'default', initialValue: '0' }));
    expect(addToast).toHaveBeenCalledWith(expect.stringContaining('nonexistent'), 'error');
  });

  it('updates the block content when renaming a variable', () => {
    const analysisResult = createSampleAnalysisResult();
    const block = createBlock({ id: 'block-1', content: 'default player_name = "Player"\n' });
    const updateBlock = vi.fn();
    const addToast = vi.fn();
    const { result } = renderHook(() =>
      useStoryElementsPanel(makeParams({ blocks: [block], analysisResult, updateBlock, addToast })),
    );
    act(() => result.current.handleEditVariable('player_name', {
      name: 'hero_name',
      type: 'default',
      initialValue: '"Hero"',
    }));
    expect(updateBlock).toHaveBeenCalled();
    expect(addToast).toHaveBeenCalledWith(expect.stringContaining('hero_name'), 'success');
  });

  it('updates the block without renaming when name is unchanged', () => {
    const analysisResult = createSampleAnalysisResult();
    const block = createBlock({ id: 'block-1', content: 'default player_name = "Player"\n' });
    const updateBlock = vi.fn();
    const addToast = vi.fn();
    const { result } = renderHook(() =>
      useStoryElementsPanel(makeParams({ blocks: [block], analysisResult, updateBlock, addToast })),
    );
    act(() => result.current.handleEditVariable('player_name', {
      name: 'player_name',
      type: 'default',
      initialValue: '"NewDefault"',
    }));
    expect(updateBlock).toHaveBeenCalled();
    expect(addToast).toHaveBeenCalledWith(expect.stringContaining('updated'), 'success');
  });

  // ── handleFindScreenDefinition ────────────────────────────────────────────

  it('calls handleOpenEditor when screen is found', () => {
    const handleOpenEditor = vi.fn();
    const analysisResult = createEmptyAnalysisResult({
      screens: new Map([['main_menu', { name: 'main_menu', parameters: '', definedInBlockId: 'block-1', line: 5 }]]),
    });
    const { result } = renderHook(() =>
      useStoryElementsPanel(makeParams({ analysisResult, handleOpenEditor })),
    );
    act(() => result.current.handleFindScreenDefinition('main_menu'));
    expect(handleOpenEditor).toHaveBeenCalledWith('block-1', 5);
  });

  it('does nothing when screen is not found', () => {
    const handleOpenEditor = vi.fn();
    const { result } = renderHook(() =>
      useStoryElementsPanel(makeParams({ handleOpenEditor })),
    );
    act(() => result.current.handleFindScreenDefinition('nonexistent'));
    expect(handleOpenEditor).not.toHaveBeenCalled();
  });

  // ── handleHoverHighlight ──────────────────────────────────────────────────

  it('handleHoverHighlightStart for character sets blockIds with matching dialogue', () => {
    const setHoverHighlightIds = vi.fn();
    const analysisResult = createEmptyAnalysisResult({
      dialogueLines: new Map([['block-1', [{ line: 2, tag: 'e' }]]]),
    });
    const { result } = renderHook(() =>
      useStoryElementsPanel(makeParams({ analysisResult, setHoverHighlightIds })),
    );
    act(() => result.current.handleHoverHighlightStart('e', 'character'));
    expect(setHoverHighlightIds).toHaveBeenCalledWith(new Set(['block-1']));
  });

  it('handleHoverHighlightStart for variable uses variableUsages', () => {
    const setHoverHighlightIds = vi.fn();
    const analysisResult = createEmptyAnalysisResult({
      variableUsages: new Map([['score', [{ blockId: 'block-2', line: 5, column: 10 }]]]),
    });
    const { result } = renderHook(() =>
      useStoryElementsPanel(makeParams({ analysisResult, setHoverHighlightIds })),
    );
    act(() => result.current.handleHoverHighlightStart('score', 'variable'));
    expect(setHoverHighlightIds).toHaveBeenCalledWith(new Set(['block-2']));
  });

  it('handleHoverHighlightEnd sets highlight to null', () => {
    const setHoverHighlightIds = vi.fn();
    const { result } = renderHook(() =>
      useStoryElementsPanel(makeParams({ setHoverHighlightIds })),
    );
    act(() => result.current.handleHoverHighlightEnd());
    expect(setHoverHighlightIds).toHaveBeenCalledWith(null);
  });
});
