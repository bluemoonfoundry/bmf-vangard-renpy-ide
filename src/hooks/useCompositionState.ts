import { useCallback } from 'react';
import { useImmer } from 'use-immer';
import type { Dispatch, SetStateAction } from 'react';
import type { SceneComposition, ImageMapComposition, EditorTab } from '@/types';

export interface UseCompositionStateReturn {
  // Scene Composer state
  sceneCompositions: Record<string, SceneComposition>;
  sceneNames: Record<string, string>;
  setSceneCompositions: (update: Record<string, SceneComposition> | ((draft: Record<string, SceneComposition>) => void)) => void;
  setSceneNames: (update: Record<string, string> | ((draft: Record<string, string>) => void)) => void;

  // ImageMap Composer state
  imagemapCompositions: Record<string, ImageMapComposition>;
  setImagemapCompositions: (update: Record<string, ImageMapComposition> | ((draft: Record<string, ImageMapComposition>) => void)) => void;

  // Low-level operations (used by useProjectIO for hydration)
  addScene: (sceneId: string, composition: SceneComposition, name?: string) => void;
  updateScene: (sceneId: string, updates: Partial<SceneComposition>) => void;
  removeScene: (sceneId: string) => void;
  renameScene: (sceneId: string, newName: string) => void;

  addImagemap: (imagemapId: string, composition: ImageMapComposition) => void;
  updateImagemap: (imagemapId: string, updates: Partial<ImageMapComposition>) => void;
  removeImagemap: (imagemapId: string) => void;

  clearAllCompositions: () => void;

  // High-level handlers (exposed when integration props are provided)
  handleCreateScene: (initialName?: string) => void;
  handleOpenScene: (sceneId: string) => void;
  handleSceneUpdate: (sceneId: string, value: React.SetStateAction<SceneComposition>) => void;
  handleRenameScene: (sceneId: string, newName: string) => void;
  handleDeleteScene: (sceneId: string) => void;

  handleCreateImageMap: (initialName?: string) => void;
  handleOpenImageMap: (imagemapId: string) => void;
  handleImageMapUpdate: (imagemapId: string, value: React.SetStateAction<ImageMapComposition>) => void;
  handleRenameImageMap: (imagemapId: string, newName: string) => void;
  handleDeleteImageMap: (imagemapId: string) => void;
}

export interface UseCompositionStateIntegration {
  activeTabId: string;
  setOpenTabs: Dispatch<SetStateAction<EditorTab[]>>;
  setActiveTabId: Dispatch<SetStateAction<string>>;
  setHasUnsavedSettings: Dispatch<SetStateAction<boolean>>;
}

export function useCompositionState(integration: UseCompositionStateIntegration): UseCompositionStateReturn {
  const { activeTabId, setOpenTabs, setActiveTabId, setHasUnsavedSettings } = integration;

  // --- Scene Composer state ---
  const [sceneCompositions, setSceneCompositions] = useImmer<Record<string, SceneComposition>>({});
  const [sceneNames, setSceneNames] = useImmer<Record<string, string>>({});

  // --- ImageMap Composer state ---
  const [imagemapCompositions, setImagemapCompositions] = useImmer<Record<string, ImageMapComposition>>({});

  const addScene = (sceneId: string, composition: SceneComposition, name?: string) => {
    setSceneCompositions(draft => {
      draft[sceneId] = composition;
    });
    if (name) {
      setSceneNames(draft => {
        draft[sceneId] = name;
      });
    }
  };

  const updateScene = (sceneId: string, updates: Partial<SceneComposition>) => {
    setSceneCompositions(draft => {
      if (draft[sceneId]) {
        Object.assign(draft[sceneId], updates);
      }
    });
  };

  const removeScene = (sceneId: string) => {
    setSceneCompositions(draft => {
      delete draft[sceneId];
    });
    setSceneNames(draft => {
      delete draft[sceneId];
    });
  };

  const renameScene = (sceneId: string, newName: string) => {
    setSceneNames(draft => {
      draft[sceneId] = newName;
    });
  };

  const addImagemap = (imagemapId: string, composition: ImageMapComposition) => {
    setImagemapCompositions(draft => {
      draft[imagemapId] = composition;
    });
  };

  const updateImagemap = (imagemapId: string, updates: Partial<ImageMapComposition>) => {
    setImagemapCompositions(draft => {
      if (draft[imagemapId]) {
        Object.assign(draft[imagemapId], updates);
      }
    });
  };

  const removeImagemap = (imagemapId: string) => {
    setImagemapCompositions(draft => {
      delete draft[imagemapId];
    });
  };

  const clearAllCompositions = () => {
    setSceneCompositions({});
    setSceneNames({});
    setImagemapCompositions({});
  };

  // --- High-level Scene handlers ---

  const handleCreateScene = useCallback((initialName?: string) => {
    const id = `scene-${Date.now()}`;
    const name = initialName || `Scene ${Object.keys(sceneCompositions).length + 1}`;
    setSceneCompositions(draft => { draft[id] = { background: null, sprites: [] }; });
    setSceneNames(draft => { draft[id] = name; });
    setOpenTabs(prev => [...prev, { id, type: 'scene-composer', sceneId: id }]);
    setActiveTabId(id);
    setHasUnsavedSettings(true);
  }, [sceneCompositions, setSceneCompositions, setSceneNames, setOpenTabs, setActiveTabId, setHasUnsavedSettings]);

  const handleOpenScene = useCallback((sceneId: string) => {
    setOpenTabs(prev => {
      if (!prev.find(t => t.id === sceneId)) {
        return [...prev, { id: sceneId, type: 'scene-composer', sceneId }];
      }
      return prev;
    });
    setActiveTabId(sceneId);
  }, [setOpenTabs, setActiveTabId]);

  const handleSceneUpdate = useCallback((sceneId: string, value: React.SetStateAction<SceneComposition>) => {
    setSceneCompositions(draft => {
      const prev = draft[sceneId] || { background: null, sprites: [] };
      const next = typeof value === 'function' ? (value as (prevState: SceneComposition) => SceneComposition)(prev) : value;
      if (JSON.stringify(prev) !== JSON.stringify(next)) {
        draft[sceneId] = next;
        setHasUnsavedSettings(true);
      }
    });
  }, [setSceneCompositions, setHasUnsavedSettings]);

  const handleRenameScene = useCallback((sceneId: string, newName: string) => {
    setSceneNames(draft => {
      if (draft[sceneId] !== newName) {
        draft[sceneId] = newName;
        setHasUnsavedSettings(true);
      }
    });
  }, [setSceneNames, setHasUnsavedSettings]);

  const handleDeleteScene = useCallback((sceneId: string) => {
    setSceneCompositions(draft => { delete draft[sceneId]; });
    setSceneNames(draft => { delete draft[sceneId]; });
    setOpenTabs(prev => prev.filter(t => t.id !== sceneId));
    if (activeTabId === sceneId) setActiveTabId('canvas');
    setHasUnsavedSettings(true);
  }, [activeTabId, setSceneCompositions, setSceneNames, setOpenTabs, setActiveTabId, setHasUnsavedSettings]);

  // --- High-level ImageMap handlers ---

  const handleCreateImageMap = useCallback((initialName?: string) => {
    const id = `imagemap-${Date.now()}`;
    const name = initialName || `imagemap_${Object.keys(imagemapCompositions).length + 1}`;
    setImagemapCompositions(draft => {
      draft[id] = { screenName: name, groundImage: null, hoverImage: null, hotspots: [] };
    });
    setOpenTabs(prev => [...prev, { id, type: 'imagemap-composer', imagemapId: id }]);
    setActiveTabId(id);
    setHasUnsavedSettings(true);
  }, [imagemapCompositions, setImagemapCompositions, setOpenTabs, setActiveTabId, setHasUnsavedSettings]);

  const handleOpenImageMap = useCallback((imagemapId: string) => {
    setOpenTabs(prev => {
      if (!prev.find(t => t.id === imagemapId)) {
        return [...prev, { id: imagemapId, type: 'imagemap-composer', imagemapId }];
      }
      return prev;
    });
    setActiveTabId(imagemapId);
  }, [setOpenTabs, setActiveTabId]);

  const handleImageMapUpdate = useCallback((imagemapId: string, value: React.SetStateAction<ImageMapComposition>) => {
    setImagemapCompositions(draft => {
      const prev = draft[imagemapId] || { screenName: '', groundImage: null, hoverImage: null, hotspots: [] };
      const next = typeof value === 'function' ? (value as (prevState: ImageMapComposition) => ImageMapComposition)(prev) : value;
      if (JSON.stringify(prev) !== JSON.stringify(next)) {
        draft[imagemapId] = next;
        setHasUnsavedSettings(true);
      }
    });
  }, [setImagemapCompositions, setHasUnsavedSettings]);

  const handleRenameImageMap = useCallback((imagemapId: string, newName: string) => {
    setImagemapCompositions(draft => {
      if (draft[imagemapId] && draft[imagemapId].screenName !== newName) {
        draft[imagemapId].screenName = newName;
        setHasUnsavedSettings(true);
      }
    });
  }, [setImagemapCompositions, setHasUnsavedSettings]);

  const handleDeleteImageMap = useCallback((imagemapId: string) => {
    setImagemapCompositions(draft => { delete draft[imagemapId]; });
    setOpenTabs(prev => prev.filter(t => t.id !== imagemapId));
    if (activeTabId === imagemapId) setActiveTabId('canvas');
    setHasUnsavedSettings(true);
  }, [activeTabId, setImagemapCompositions, setOpenTabs, setActiveTabId, setHasUnsavedSettings]);

  return {
    sceneCompositions,
    sceneNames,
    setSceneCompositions,
    setSceneNames,
    imagemapCompositions,
    setImagemapCompositions,
    addScene,
    updateScene,
    removeScene,
    renameScene,
    addImagemap,
    updateImagemap,
    removeImagemap,
    clearAllCompositions,
    handleCreateScene,
    handleOpenScene,
    handleSceneUpdate,
    handleRenameScene,
    handleDeleteScene,
    handleCreateImageMap,
    handleOpenImageMap,
    handleImageMapUpdate,
    handleRenameImageMap,
    handleDeleteImageMap,
  };
}
