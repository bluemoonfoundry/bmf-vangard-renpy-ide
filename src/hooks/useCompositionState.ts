/**
 * @file useCompositionState.ts
 * @description Custom hook for managing visual composer state
 *
 * Handles state for two visual composition tools:
 * - Scene Composer: Visual scene builder with sprites, effects, transitions
 * - ImageMap Composer: Interactive image map with clickable hotspots
 *
 * Each composition type has its own collection stored as a Record<id, composition>.
 */

import { useImmer } from 'use-immer';
import type { SceneComposition, ImageMapComposition } from '@/types';

export interface UseCompositionStateReturn {
  // Scene Composer state
  sceneCompositions: Record<string, SceneComposition>;
  sceneNames: Record<string, string>;
  setSceneCompositions: (update: Record<string, SceneComposition> | ((draft: Record<string, SceneComposition>) => void)) => void;
  setSceneNames: (update: Record<string, string> | ((draft: Record<string, string>) => void)) => void;

  // ImageMap Composer state
  imagemapCompositions: Record<string, ImageMapComposition>;
  setImagemapCompositions: (update: Record<string, ImageMapComposition> | ((draft: Record<string, ImageMapComposition>) => void)) => void;

  // High-level operations
  addScene: (sceneId: string, composition: SceneComposition, name?: string) => void;
  updateScene: (sceneId: string, updates: Partial<SceneComposition>) => void;
  removeScene: (sceneId: string) => void;
  renameScene: (sceneId: string, newName: string) => void;

  addImagemap: (imagemapId: string, composition: ImageMapComposition) => void;
  updateImagemap: (imagemapId: string, updates: Partial<ImageMapComposition>) => void;
  removeImagemap: (imagemapId: string) => void;

  clearAllCompositions: () => void;
}

export function useCompositionState(): UseCompositionStateReturn {
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
  };
}
