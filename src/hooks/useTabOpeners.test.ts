import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTabOpeners } from '@/hooks/useTabOpeners';
import type { EditorTab, Block } from '@/types';

function makeBlock(id: string, filePath = `game/${id}.rpy`): Block {
  return { id, filePath, content: '', x: 0, y: 0 } as unknown as Block;
}

function makeProps(overrides: Partial<Parameters<typeof useTabOpeners>[0]> = {}) {
  const blocksRef = { current: [] as Block[] };
  const setOpenTabs = vi.fn();
  const setSecondaryOpenTabs = vi.fn();
  const setActiveTabId = vi.fn();
  const setSecondaryActiveTabId = vi.fn();
  const setActivePaneId = vi.fn();

  return {
    blocksRef,
    openTabs: [] as EditorTab[],
    secondaryOpenTabs: [] as EditorTab[],
    activePaneId: 'primary' as const,
    splitLayout: 'none' as const,
    setOpenTabs,
    setSecondaryOpenTabs,
    setActiveTabId,
    setSecondaryActiveTabId,
    setActivePaneId,
    ...overrides,
  };
}

describe('useTabOpeners', () => {
  describe('handleOpenStaticTab', () => {
    it('adds a new static tab if not already open', () => {
      const props = makeProps();
      const { result } = renderHook(() => useTabOpeners(props));
      act(() => result.current.handleOpenStaticTab('stats'));
      expect(props.setOpenTabs).toHaveBeenCalled();
    });

    it('switches to an existing static tab without adding a duplicate', () => {
      const existingTab: EditorTab = { id: 'stats', type: 'stats' } as EditorTab;
      const props = makeProps({ openTabs: [existingTab] });
      const { result } = renderHook(() => useTabOpeners(props));
      act(() => result.current.handleOpenStaticTab('stats'));
      expect(props.setActiveTabId).toHaveBeenCalledWith('stats');
      expect(props.setOpenTabs).not.toHaveBeenCalled();
    });
  });

  describe('handleOpenRouteCanvasTab', () => {
    it('calls handleOpenStaticTab with route-canvas', () => {
      const props = makeProps();
      const { result } = renderHook(() => useTabOpeners(props));
      act(() => result.current.handleOpenRouteCanvasTab());
      expect(props.setOpenTabs).toHaveBeenCalled();
    });
  });

  describe('handleOpenChoiceCanvasTab', () => {
    it('calls handleOpenStaticTab with choice-canvas', () => {
      const props = makeProps();
      const { result } = renderHook(() => useTabOpeners(props));
      act(() => result.current.handleOpenChoiceCanvasTab());
      expect(props.setOpenTabs).toHaveBeenCalled();
    });
  });

  describe('handleOpenEditor', () => {
    it('does nothing when block is not found', () => {
      const props = makeProps();
      const { result } = renderHook(() => useTabOpeners(props));
      act(() => result.current.handleOpenEditor('nonexistent'));
      expect(props.setOpenTabs).not.toHaveBeenCalled();
    });

    it('opens an editor tab for an existing block', () => {
      const block = makeBlock('block-1');
      const props = makeProps({ blocksRef: { current: [block] } });
      const { result } = renderHook(() => useTabOpeners(props));
      act(() => result.current.handleOpenEditor('block-1'));
      expect(props.setOpenTabs).toHaveBeenCalled();
    });

    it('switches to existing editor tab without adding a duplicate', () => {
      const block = makeBlock('block-1');
      const existingTab: EditorTab = { id: 'block-1', type: 'editor', blockId: 'block-1' } as EditorTab;
      const props = makeProps({
        blocksRef: { current: [block] },
        openTabs: [existingTab],
      });
      const { result } = renderHook(() => useTabOpeners(props));
      act(() => result.current.handleOpenEditor('block-1'));
      expect(props.setActiveTabId).toHaveBeenCalledWith('block-1');
      expect(props.setOpenTabs).not.toHaveBeenCalled();
    });
  });

  describe('handleOpenImageEditorTab', () => {
    it('opens an image tab', () => {
      const props = makeProps();
      const { result } = renderHook(() => useTabOpeners(props));
      act(() => result.current.handleOpenImageEditorTab('/images/bg.png'));
      expect(props.setOpenTabs).toHaveBeenCalled();
    });
  });

  describe('handleOpenMarkdownTab', () => {
    it('opens a markdown tab', () => {
      const props = makeProps();
      const { result } = renderHook(() => useTabOpeners(props));
      act(() => result.current.handleOpenMarkdownTab('/docs/readme.md'));
      expect(props.setOpenTabs).toHaveBeenCalled();
    });
  });

  describe('handleOpenAudioEditorInTab', () => {
    it('opens an audio tab', () => {
      const props = makeProps();
      const { result } = renderHook(() => useTabOpeners(props));
      act(() => result.current.handleOpenAudioEditorInTab('/audio/bgm.ogg'));
      expect(props.setOpenTabs).toHaveBeenCalled();
      expect(props.setActiveTabId).toHaveBeenCalled();
    });
  });

  describe('handlePathDoubleClick', () => {
    it('opens an editor tab for .rpy file when block exists', () => {
      const block = makeBlock('scene', 'game/scene.rpy');
      const props = makeProps({ blocksRef: { current: [block] } });
      const { result } = renderHook(() => useTabOpeners(props));
      act(() => result.current.handlePathDoubleClick('game/scene.rpy'));
      expect(props.setOpenTabs).toHaveBeenCalled();
    });

    it('opens an image tab for .png file', () => {
      const props = makeProps();
      const { result } = renderHook(() => useTabOpeners(props));
      act(() => result.current.handlePathDoubleClick('/images/bg.png'));
      expect(props.setOpenTabs).toHaveBeenCalled();
    });

    it('opens a markdown tab for .md file', () => {
      const props = makeProps();
      const { result } = renderHook(() => useTabOpeners(props));
      act(() => result.current.handlePathDoubleClick('/docs/notes.md'));
      expect(props.setOpenTabs).toHaveBeenCalled();
    });

    it('does nothing for unknown file extension', () => {
      const props = makeProps();
      const { result } = renderHook(() => useTabOpeners(props));
      act(() => result.current.handlePathDoubleClick('/file.txt'));
      expect(props.setOpenTabs).not.toHaveBeenCalled();
    });
  });
});
