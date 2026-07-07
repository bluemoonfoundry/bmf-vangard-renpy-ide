/**
 * @file hooks/useCompositionState.test.ts
 * @description Tests for useCompositionState — scene/imagemap composition CRUD and open/close state transitions.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCompositionState } from '@/hooks/useCompositionState';
import type { UseCompositionStateIntegration } from '@/hooks/useCompositionState';
import type { SceneComposition, ImageMapComposition } from '@/types';

function makeIntegration(overrides: Partial<UseCompositionStateIntegration> = {}): UseCompositionStateIntegration {
  return {
    activeTabId: 'canvas',
    setOpenTabs: vi.fn(),
    setActiveTabId: vi.fn(),
    setHasUnsavedSettings: vi.fn(),
    ...overrides,
  };
}

const emptyScene: SceneComposition = { background: null, sprites: [] };
const emptyImagemap: ImageMapComposition = {
  screenName: 'my_map',
  groundImage: null,
  hoverImage: null,
  hotspots: [],
};

// ============================================================================
// Low-level scene CRUD
// ============================================================================

describe('useCompositionState — low-level scene operations', () => {
  it('initialises with empty compositions', () => {
    const { result } = renderHook(() => useCompositionState(makeIntegration()));
    expect(result.current.sceneCompositions).toEqual({});
    expect(result.current.sceneNames).toEqual({});
    expect(result.current.imagemapCompositions).toEqual({});
  });

  it('addScene stores composition and optional name', () => {
    const { result } = renderHook(() => useCompositionState(makeIntegration()));
    act(() => result.current.addScene('s1', emptyScene, 'Opening Scene'));
    expect(result.current.sceneCompositions['s1']).toEqual(emptyScene);
    expect(result.current.sceneNames['s1']).toBe('Opening Scene');
  });

  it('addScene without a name does not set a name', () => {
    const { result } = renderHook(() => useCompositionState(makeIntegration()));
    act(() => result.current.addScene('s1', emptyScene));
    expect(result.current.sceneNames['s1']).toBeUndefined();
  });

  it('updateScene merges partial updates into existing composition', () => {
    const { result } = renderHook(() => useCompositionState(makeIntegration()));
    act(() => result.current.addScene('s1', emptyScene));
    act(() => result.current.updateScene('s1', { resolution: { width: 1280, height: 720 } }));
    expect(result.current.sceneCompositions['s1'].resolution).toEqual({ width: 1280, height: 720 });
  });

  it('updateScene is a no-op for a missing scene', () => {
    const { result } = renderHook(() => useCompositionState(makeIntegration()));
    act(() => result.current.updateScene('nonexistent', { resolution: { width: 1920, height: 1080 } }));
    expect(result.current.sceneCompositions['nonexistent']).toBeUndefined();
  });

  it('removeScene deletes composition and name', () => {
    const { result } = renderHook(() => useCompositionState(makeIntegration()));
    act(() => result.current.addScene('s1', emptyScene, 'Scene One'));
    act(() => result.current.removeScene('s1'));
    expect(result.current.sceneCompositions['s1']).toBeUndefined();
    expect(result.current.sceneNames['s1']).toBeUndefined();
  });

  it('renameScene updates the name without touching composition', () => {
    const { result } = renderHook(() => useCompositionState(makeIntegration()));
    act(() => result.current.addScene('s1', emptyScene, 'Old Name'));
    act(() => result.current.renameScene('s1', 'New Name'));
    expect(result.current.sceneNames['s1']).toBe('New Name');
    expect(result.current.sceneCompositions['s1']).toEqual(emptyScene);
  });
});

// ============================================================================
// Low-level imagemap CRUD
// ============================================================================

describe('useCompositionState — low-level imagemap operations', () => {
  it('addImagemap stores composition', () => {
    const { result } = renderHook(() => useCompositionState(makeIntegration()));
    act(() => result.current.addImagemap('im1', emptyImagemap));
    expect(result.current.imagemapCompositions['im1']).toEqual(emptyImagemap);
  });

  it('updateImagemap merges partial updates', () => {
    const { result } = renderHook(() => useCompositionState(makeIntegration()));
    act(() => result.current.addImagemap('im1', emptyImagemap));
    act(() => result.current.updateImagemap('im1', { screenName: 'renamed_map' }));
    expect(result.current.imagemapCompositions['im1'].screenName).toBe('renamed_map');
  });

  it('updateImagemap is a no-op for missing imagemap', () => {
    const { result } = renderHook(() => useCompositionState(makeIntegration()));
    act(() => result.current.updateImagemap('nonexistent', { screenName: 'x' }));
    expect(result.current.imagemapCompositions['nonexistent']).toBeUndefined();
  });

  it('removeImagemap deletes the imagemap', () => {
    const { result } = renderHook(() => useCompositionState(makeIntegration()));
    act(() => result.current.addImagemap('im1', emptyImagemap));
    act(() => result.current.removeImagemap('im1'));
    expect(result.current.imagemapCompositions['im1']).toBeUndefined();
  });
});

// ============================================================================
// clearAllCompositions
// ============================================================================

describe('useCompositionState — clearAllCompositions', () => {
  it('clears all scenes, names, and imagemaps', () => {
    const { result } = renderHook(() => useCompositionState(makeIntegration()));
    act(() => {
      result.current.addScene('s1', emptyScene, 'Scene A');
      result.current.addImagemap('im1', emptyImagemap);
    });
    act(() => result.current.clearAllCompositions());
    expect(result.current.sceneCompositions).toEqual({});
    expect(result.current.sceneNames).toEqual({});
    expect(result.current.imagemapCompositions).toEqual({});
  });
});

// ============================================================================
// High-level scene handlers
// ============================================================================

describe('useCompositionState — handleCreateScene', () => {
  it('adds a new scene, opens a tab, and marks settings dirty', () => {
    const setOpenTabs = vi.fn();
    const setActiveTabId = vi.fn();
    const setHasUnsavedSettings = vi.fn();
    const { result } = renderHook(() =>
      useCompositionState(makeIntegration({ setOpenTabs, setActiveTabId, setHasUnsavedSettings }))
    );
    act(() => result.current.handleCreateScene('Intro'));
    expect(Object.keys(result.current.sceneCompositions).length).toBe(1);
    expect(setOpenTabs).toHaveBeenCalled();
    expect(setActiveTabId).toHaveBeenCalled();
    expect(setHasUnsavedSettings).toHaveBeenCalledWith(true);
  });

  it('auto-names the scene if no name is given', () => {
    const { result } = renderHook(() => useCompositionState(makeIntegration()));
    act(() => result.current.handleCreateScene());
    const names = Object.values(result.current.sceneNames);
    expect(names.length).toBe(1);
    expect(typeof names[0]).toBe('string');
  });
});

describe('useCompositionState — handleOpenScene', () => {
  it('opens a new tab when the scene tab is not already open', () => {
    const setOpenTabs = vi.fn();
    const setActiveTabId = vi.fn();
    const { result } = renderHook(() =>
      useCompositionState(makeIntegration({ setOpenTabs, setActiveTabId }))
    );
    act(() => result.current.handleOpenScene('s1'));
    expect(setOpenTabs).toHaveBeenCalled();
    expect(setActiveTabId).toHaveBeenCalledWith('s1');
  });
});

describe('useCompositionState — handleSceneUpdate', () => {
  it('updates composition and marks dirty when content changes', () => {
    const setHasUnsavedSettings = vi.fn();
    const { result } = renderHook(() =>
      useCompositionState(makeIntegration({ setHasUnsavedSettings }))
    );
    act(() => result.current.addScene('s1', emptyScene));
    act(() =>
      result.current.handleSceneUpdate('s1', {
        background: null,
        sprites: [{ id: 'sp1', tag: 'eileen', transforms: [], position: { x: 0, y: 0 }, scale: 1, zOrder: 0 }],
      })
    );
    expect(setHasUnsavedSettings).toHaveBeenCalledWith(true);
    expect(result.current.sceneCompositions['s1'].sprites.length).toBe(1);
  });

  it('does not mark dirty when content is unchanged', () => {
    const setHasUnsavedSettings = vi.fn();
    const { result } = renderHook(() =>
      useCompositionState(makeIntegration({ setHasUnsavedSettings }))
    );
    act(() => result.current.addScene('s1', emptyScene));
    setHasUnsavedSettings.mockClear();
    act(() => result.current.handleSceneUpdate('s1', { background: null, sprites: [] }));
    expect(setHasUnsavedSettings).not.toHaveBeenCalled();
  });
});

describe('useCompositionState — handleRenameScene', () => {
  it('renames and marks dirty', () => {
    const setHasUnsavedSettings = vi.fn();
    const { result } = renderHook(() =>
      useCompositionState(makeIntegration({ setHasUnsavedSettings }))
    );
    act(() => result.current.addScene('s1', emptyScene, 'Old'));
    setHasUnsavedSettings.mockClear();
    act(() => result.current.handleRenameScene('s1', 'New'));
    expect(result.current.sceneNames['s1']).toBe('New');
    expect(setHasUnsavedSettings).toHaveBeenCalledWith(true);
  });

  it('does not mark dirty when name is unchanged', () => {
    const setHasUnsavedSettings = vi.fn();
    const { result } = renderHook(() =>
      useCompositionState(makeIntegration({ setHasUnsavedSettings }))
    );
    act(() => result.current.addScene('s1', emptyScene, 'Same'));
    setHasUnsavedSettings.mockClear();
    act(() => result.current.handleRenameScene('s1', 'Same'));
    expect(setHasUnsavedSettings).not.toHaveBeenCalled();
  });
});

describe('useCompositionState — handleDeleteScene', () => {
  it('removes scene, closes its tab, resets active tab to canvas when it was active', () => {
    const setOpenTabs = vi.fn();
    const setActiveTabId = vi.fn();
    const setHasUnsavedSettings = vi.fn();
    const { result } = renderHook(() =>
      useCompositionState(
        makeIntegration({ activeTabId: 's1', setOpenTabs, setActiveTabId, setHasUnsavedSettings })
      )
    );
    act(() => result.current.addScene('s1', emptyScene, 'S1'));
    act(() => result.current.handleDeleteScene('s1'));
    expect(result.current.sceneCompositions['s1']).toBeUndefined();
    expect(setActiveTabId).toHaveBeenCalledWith('canvas');
    expect(setHasUnsavedSettings).toHaveBeenCalledWith(true);
  });
});

// ============================================================================
// High-level imagemap handlers
// ============================================================================

describe('useCompositionState — handleCreateImageMap', () => {
  it('creates an imagemap, opens a tab, marks dirty', () => {
    const setOpenTabs = vi.fn();
    const setActiveTabId = vi.fn();
    const setHasUnsavedSettings = vi.fn();
    const { result } = renderHook(() =>
      useCompositionState(makeIntegration({ setOpenTabs, setActiveTabId, setHasUnsavedSettings }))
    );
    act(() => result.current.handleCreateImageMap('custom_map'));
    expect(Object.keys(result.current.imagemapCompositions).length).toBe(1);
    expect(setOpenTabs).toHaveBeenCalled();
    expect(setHasUnsavedSettings).toHaveBeenCalledWith(true);
  });
});

describe('useCompositionState — handleOpenImageMap', () => {
  it('adds the tab and activates it', () => {
    const setOpenTabs = vi.fn();
    const setActiveTabId = vi.fn();
    const { result } = renderHook(() =>
      useCompositionState(makeIntegration({ setOpenTabs, setActiveTabId }))
    );
    act(() => result.current.handleOpenImageMap('im1'));
    expect(setOpenTabs).toHaveBeenCalled();
    expect(setActiveTabId).toHaveBeenCalledWith('im1');
  });
});

describe('useCompositionState — handleImageMapUpdate', () => {
  it('updates composition and marks dirty when content changes', () => {
    const setHasUnsavedSettings = vi.fn();
    const { result } = renderHook(() =>
      useCompositionState(makeIntegration({ setHasUnsavedSettings }))
    );
    act(() => result.current.addImagemap('im1', emptyImagemap));
    setHasUnsavedSettings.mockClear();
    act(() =>
      result.current.handleImageMapUpdate('im1', { ...emptyImagemap, screenName: 'updated_map' })
    );
    expect(setHasUnsavedSettings).toHaveBeenCalledWith(true);
    expect(result.current.imagemapCompositions['im1'].screenName).toBe('updated_map');
  });
});

describe('useCompositionState — handleRenameImageMap', () => {
  it('updates screenName and marks dirty', () => {
    const setHasUnsavedSettings = vi.fn();
    const { result } = renderHook(() =>
      useCompositionState(makeIntegration({ setHasUnsavedSettings }))
    );
    act(() => result.current.addImagemap('im1', emptyImagemap));
    setHasUnsavedSettings.mockClear();
    act(() => result.current.handleRenameImageMap('im1', 'renamed_map'));
    expect(result.current.imagemapCompositions['im1'].screenName).toBe('renamed_map');
    expect(setHasUnsavedSettings).toHaveBeenCalledWith(true);
  });
});

describe('useCompositionState — handleDeleteImageMap', () => {
  it('removes imagemap, closes its tab, resets active tab when it was active', () => {
    const setOpenTabs = vi.fn();
    const setActiveTabId = vi.fn();
    const setHasUnsavedSettings = vi.fn();
    const { result } = renderHook(() =>
      useCompositionState(
        makeIntegration({ activeTabId: 'im1', setOpenTabs, setActiveTabId, setHasUnsavedSettings })
      )
    );
    act(() => result.current.addImagemap('im1', emptyImagemap));
    act(() => result.current.handleDeleteImageMap('im1'));
    expect(result.current.imagemapCompositions['im1']).toBeUndefined();
    expect(setActiveTabId).toHaveBeenCalledWith('canvas');
    expect(setHasUnsavedSettings).toHaveBeenCalledWith(true);
  });
});
