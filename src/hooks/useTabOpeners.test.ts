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

    it('switches to an existing static tab in the secondary pane', () => {
      const existingTab: EditorTab = { id: 'stats', type: 'stats' } as EditorTab;
      const props = makeProps({ secondaryOpenTabs: [existingTab] });
      const { result } = renderHook(() => useTabOpeners(props));
      act(() => result.current.handleOpenStaticTab('stats'));
      expect(props.setSecondaryActiveTabId).toHaveBeenCalledWith('stats');
      expect(props.setActivePaneId).toHaveBeenCalledWith('secondary');
      expect(props.setSecondaryOpenTabs).not.toHaveBeenCalled();
    });

    it('adds a new static tab to the secondary pane when it is active and split', () => {
      const props = makeProps({ activePaneId: 'secondary', splitLayout: 'right' });
      const { result } = renderHook(() => useTabOpeners(props));
      act(() => result.current.handleOpenStaticTab('diagnostics'));
      expect(props.setSecondaryOpenTabs).toHaveBeenCalled();
      expect(props.setSecondaryActiveTabId).toHaveBeenCalledWith('diagnostics');
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

    it('sends a scroll request to an existing primary editor tab when a line is given', () => {
      const block = makeBlock('block-1');
      const existingTab: EditorTab = { id: 'block-1', type: 'editor', blockId: 'block-1' } as EditorTab;
      const props = makeProps({
        blocksRef: { current: [block] },
        openTabs: [existingTab],
      });
      const { result } = renderHook(() => useTabOpeners(props));
      act(() => result.current.handleOpenEditor('block-1', 42));
      expect(props.setOpenTabs).toHaveBeenCalled();
      expect(props.setActiveTabId).toHaveBeenCalledWith('block-1');
    });

    it('switches to an existing secondary editor tab', () => {
      const block = makeBlock('block-1');
      const existingTab: EditorTab = { id: 'block-1', type: 'editor', blockId: 'block-1' } as EditorTab;
      const props = makeProps({
        blocksRef: { current: [block] },
        secondaryOpenTabs: [existingTab],
      });
      const { result } = renderHook(() => useTabOpeners(props));
      act(() => result.current.handleOpenEditor('block-1', 10));
      expect(props.setSecondaryOpenTabs).toHaveBeenCalled();
      expect(props.setSecondaryActiveTabId).toHaveBeenCalledWith('block-1');
      expect(props.setActivePaneId).toHaveBeenCalledWith('secondary');
    });

    it('opens a new editor tab in the secondary pane when it is active and split', () => {
      const block = makeBlock('block-1');
      const props = makeProps({
        blocksRef: { current: [block] },
        activePaneId: 'secondary',
        splitLayout: 'bottom',
      });
      const { result } = renderHook(() => useTabOpeners(props));
      act(() => result.current.handleOpenEditor('block-1'));
      expect(props.setSecondaryOpenTabs).toHaveBeenCalled();
      expect(props.setSecondaryActiveTabId).toHaveBeenCalledWith('block-1');
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

    it('switches to an existing primary image tab without adding a duplicate', () => {
      const existingTab: EditorTab = { id: 'img-/images/bg.png', type: 'image', filePath: '/images/bg.png' } as EditorTab;
      const props = makeProps({ openTabs: [existingTab] });
      const { result } = renderHook(() => useTabOpeners(props));
      act(() => result.current.handleOpenImageEditorTab('/images/bg.png'));
      expect(props.setActiveTabId).toHaveBeenCalledWith('img-/images/bg.png');
      expect(props.setOpenTabs).not.toHaveBeenCalled();
    });

    it('switches to an existing secondary image tab', () => {
      const existingTab: EditorTab = { id: 'img-/images/bg.png', type: 'image', filePath: '/images/bg.png' } as EditorTab;
      const props = makeProps({ secondaryOpenTabs: [existingTab] });
      const { result } = renderHook(() => useTabOpeners(props));
      act(() => result.current.handleOpenImageEditorTab('/images/bg.png'));
      expect(props.setSecondaryActiveTabId).toHaveBeenCalledWith('img-/images/bg.png');
      expect(props.setActivePaneId).toHaveBeenCalledWith('secondary');
    });

    it('opens a new image tab in the secondary pane when it is active and split', () => {
      const props = makeProps({ activePaneId: 'secondary', splitLayout: 'right' });
      const { result } = renderHook(() => useTabOpeners(props));
      act(() => result.current.handleOpenImageEditorTab('/images/bg.png'));
      expect(props.setSecondaryOpenTabs).toHaveBeenCalled();
      expect(props.setSecondaryActiveTabId).toHaveBeenCalledWith('img-/images/bg.png');
    });
  });

  describe('handleOpenMarkdownTab', () => {
    it('opens a markdown tab', () => {
      const props = makeProps();
      const { result } = renderHook(() => useTabOpeners(props));
      act(() => result.current.handleOpenMarkdownTab('/docs/readme.md'));
      expect(props.setOpenTabs).toHaveBeenCalled();
    });

    it('switches to an existing primary markdown tab without adding a duplicate', () => {
      const existingTab: EditorTab = { id: 'md-/docs/readme.md', type: 'markdown', filePath: '/docs/readme.md' } as EditorTab;
      const props = makeProps({ openTabs: [existingTab] });
      const { result } = renderHook(() => useTabOpeners(props));
      act(() => result.current.handleOpenMarkdownTab('/docs/readme.md'));
      expect(props.setActiveTabId).toHaveBeenCalledWith('md-/docs/readme.md');
      expect(props.setOpenTabs).not.toHaveBeenCalled();
    });

    it('switches to an existing secondary markdown tab', () => {
      const existingTab: EditorTab = { id: 'md-/docs/readme.md', type: 'markdown', filePath: '/docs/readme.md' } as EditorTab;
      const props = makeProps({ secondaryOpenTabs: [existingTab] });
      const { result } = renderHook(() => useTabOpeners(props));
      act(() => result.current.handleOpenMarkdownTab('/docs/readme.md'));
      expect(props.setSecondaryActiveTabId).toHaveBeenCalledWith('md-/docs/readme.md');
      expect(props.setActivePaneId).toHaveBeenCalledWith('secondary');
    });

    it('opens a new markdown tab in the secondary pane when it is active and split', () => {
      const props = makeProps({ activePaneId: 'secondary', splitLayout: 'right' });
      const { result } = renderHook(() => useTabOpeners(props));
      act(() => result.current.handleOpenMarkdownTab('/docs/readme.md'));
      expect(props.setSecondaryOpenTabs).toHaveBeenCalled();
      expect(props.setSecondaryActiveTabId).toHaveBeenCalledWith('md-/docs/readme.md');
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

    it('does not add a duplicate when the audio tab is already open', () => {
      const existingTab: EditorTab = { id: 'aud-/audio/bgm.ogg', type: 'audio', filePath: '/audio/bgm.ogg' } as EditorTab;
      const props = makeProps({ openTabs: [existingTab] });
      const { result } = renderHook(() => useTabOpeners(props));
      act(() => result.current.handleOpenAudioEditorInTab('/audio/bgm.ogg'));
      const updater = props.setOpenTabs.mock.calls[0][0];
      expect(updater([existingTab])).toEqual([existingTab]);
      expect(props.setActiveTabId).toHaveBeenCalledWith('aud-/audio/bgm.ogg');
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
