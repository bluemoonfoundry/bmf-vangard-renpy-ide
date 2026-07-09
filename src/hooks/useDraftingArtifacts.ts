/**
 * @file useDraftingArtifacts.ts
 * @description Custom hook for managing Drafting Mode placeholder artifacts
 *
 * Scans blocks for missing image/audio references and generates a
 * `game/debug_placeholders.rpy` file with placeholder definitions so the
 * project can run in Ren'Py without missing-asset errors. Cleans up the
 * generated file when Drafting Mode is disabled.
 */

import { useCallback, useEffect } from 'react';
import type { Block, PersistedProjectSettings, Variable } from '@/types';
import { logger } from '@/lib/logger';

const SILENT_WAV_BASE64 = 'UklGRigAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQQAAAAAAA==';

type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface UseDraftingArtifactsParams {
  projectRootPath: string | null;
  blocks: Block[];
  draftingMode: boolean;
  definedImages: Set<string>;
  definedVariables: Map<string, Variable>;
  existingImageTags: Set<string>;
  existingAudioPaths: Set<string>;
  updateProjectSettings: (recipe: (draft: PersistedProjectSettings) => void) => void;
  setHasUnsavedSettings: React.Dispatch<React.SetStateAction<boolean>>;
  addToast: (message: string, type?: ToastType) => void;
}

export interface UseDraftingArtifactsReturn {
  updateDraftingArtifacts: () => Promise<void>;
  cleanupDraftingArtifacts: () => Promise<void>;
  handleToggleDraftingMode: (enabled: boolean) => Promise<void>;
}

/**
 * Hook for managing Drafting Mode placeholder generation/cleanup
 */
export function useDraftingArtifacts({
  projectRootPath, blocks, draftingMode, definedImages, definedVariables,
  existingImageTags, existingAudioPaths, updateProjectSettings, setHasUnsavedSettings, addToast,
}: UseDraftingArtifactsParams): UseDraftingArtifactsReturn {
  const updateDraftingArtifacts = useCallback(async () => {
    if (!projectRootPath || !window.electronAPI || !draftingMode) return;

    try {
      const missingImages = new Set<string>();
      const missingAudioFiles = new Set<string>();
      const missingAudioVariables = new Set<string>();

      // 1. Scan Blocks for missing references
      blocks.forEach(block => {
        // Do not parse the placeholder file itself
        if (block.filePath && (block.filePath.endsWith('debug_placeholders.rpy') || block.filePath === 'game/debug_placeholders.rpy')) return;

        const lines = block.content.split('\n');
        lines.forEach(line => {
          const trimmed = line.trim();
          if (trimmed.startsWith('#')) return;

          // Images: show/scene <tag>
          const showMatch = trimmed.match(/^\s*(?:show|scene)\s+(.+)/);
          if (showMatch) {
            const rest = showMatch[1];
            const parts = rest.split(/\s+/);

            if (parts[0] !== 'expression') {
              const tagParts: string[] = [];
              for (const part of parts) {
                if (['with', 'at', 'as', 'behind', 'zorder', 'on', ':', 'fade', 'in', 'out', 'dissolve', 'zoom', 'alpha', 'rotate', 'align', 'pos', 'anchor', 'xpos', 'ypos', 'xanchor', 'yanchor'].includes(part)) break;
                if (part.endsWith(':')) {
                  tagParts.push(part.slice(0, -1));
                  break;
                }
                tagParts.push(part);
              }

              if (tagParts.length > 0) {
                const tag = tagParts.join(' ');
                const firstWord = tagParts[0];

                const isDefined =
                  definedImages.has(firstWord) ||
                  existingImageTags.has(tag) ||
                  existingImageTags.has(firstWord);

                if (!isDefined) missingImages.add(tag);
              }
            }
          }

          // Audio: play/queue <channel> <file>
          const audioLineRegex = /^\s*(?:play|queue)\s+\w+\s+(.+)/;
          const audMatch = trimmed.match(audioLineRegex);

          if (audMatch) {
            const content = audMatch[1].trim();

            // Case A: Quoted string -> explicit file path
            const quotedMatch = content.match(/^["']([^"']+)["']/);
            if (quotedMatch) {
              const path = quotedMatch[1];
              let found = false;
              if (existingAudioPaths.has(path)) found = true;
              else {
                // Check fuzzy match against known audio
                for (const existing of existingAudioPaths) {
                  if (existing.endsWith(path)) { found = true; break; }
                }
              }
              if (!found) missingAudioFiles.add(path);
            }
            // Case B: Unquoted -> variable or identifier
            else {
              // Grab the first token, stop before keywords like 'fadein', 'loop', etc.
              const firstToken = content.split(/\s+/)[0];

              if (firstToken !== 'expression') {
                // It's likely a variable. Check if it's a valid identifier.
                if (/^[a-zA-Z0-9_]+$/.test(firstToken)) {
                  // If it's not defined in the project, mark as missing variable
                  let isDefined = definedVariables.has(firstToken);
                  // Also check if it happens to be an auto-defined audio file (Ren'Py does this for audio/ directory)
                  if (existingAudioPaths.has(firstToken)) isDefined = true;

                  if (!isDefined) {
                    missingAudioVariables.add(firstToken);
                  }
                }
              }
            }
          }
        });
      });

      // 2. Generate Content
      let rpyContent: string = `# Auto-generated by Vangard Studio Drafting Mode\n# This file provides placeholders for missing assets.\n\n`;

      missingImages.forEach(tag => {
        rpyContent += `image ${tag} = Placeholder("text", text="${tag}")\n`;
      });

      // Generate default variable definitions for missing audio variables
      missingAudioVariables.forEach(varName => {
        rpyContent += `default ${varName} = "renide_assets/placeholder_audio.wav"\n`;
      });

      // Ensure dummy audio file exists if we have ANY audio issues
      if (missingAudioFiles.size > 0 || missingAudioVariables.size > 0) {
        const audioDir = await window.electronAPI.path.join(projectRootPath, 'game/renide_assets');
        await window.electronAPI.createDirectory(audioDir);
        const audioPath = await window.electronAPI.path.join(audioDir, 'placeholder_audio.wav');
        await window.electronAPI.writeFile(audioPath, SILENT_WAV_BASE64, 'base64');

        // Injecting a callback to handle missing audio files (QUOTED STRINGS)
        // This callback intercepts file paths that Ren'Py fails to load.
        rpyContent += `\ninit python:\n`;
        rpyContent += `    if not hasattr(store, 'renide_audio_callback_installed'):\n`;
        rpyContent += `        store.renide_audio_callback_installed = True\n`;
        rpyContent += `        def renide_audio_filter(fn):\n`;
        rpyContent += `            if fn and renpy.loadable(fn):\n`;
        rpyContent += `                return fn\n`;
        rpyContent += `            # If missing, return placeholder\n`;
        rpyContent += `            return "renide_assets/placeholder_audio.wav"\n`;
        rpyContent += `        config.audio_filename_callback = renide_audio_filter\n`;
      }

      // 3. Write File
      const rpyPath = await window.electronAPI.path.join(projectRootPath as string, 'game/debug_placeholders.rpy');
      await window.electronAPI.writeFile(rpyPath, rpyContent);

    } catch (err) {
      logger.error('Failed to update drafting artifacts:', err);
    }
  }, [blocks, projectRootPath, draftingMode, definedImages, definedVariables, existingImageTags, existingAudioPaths]);

  const cleanupDraftingArtifacts = useCallback(async () => {
    if (!projectRootPath || !window.electronAPI) return;

    try {
      const rpyPath = await window.electronAPI.path.join(String(projectRootPath), 'game/debug_placeholders.rpy') as string;
      await window.electronAPI.removeEntry(rpyPath);

      const rpycPath = await window.electronAPI.path.join(String(projectRootPath), 'game/debug_placeholders.rpyc') as string;
      await window.electronAPI.removeEntry(rpycPath);
    } catch (err) {
      logger.error('Failed to clean up drafting artifacts:', err);
    }
    // We leave the renide_assets folder as it might contain valid cache or be reused
  }, [projectRootPath]);

  const handleToggleDraftingMode = useCallback(async (enabled: boolean) => {
    updateProjectSettings(draft => { draft.draftingMode = enabled; });
    setHasUnsavedSettings(true); // Persist this choice

    if (enabled) {
      addToast('Drafting Mode Enabled: Placeholders will be generated.', 'info');
    } else {
      addToast('Drafting Mode Disabled: Placeholders removed.', 'info');
      await cleanupDraftingArtifacts();
    }
  }, [updateProjectSettings, setHasUnsavedSettings, addToast, cleanupDraftingArtifacts]);

  // React to Drafting Mode changes or Block saves to update placeholders
  useEffect(() => {
    if (draftingMode) {
      updateDraftingArtifacts();
    }
  }, [draftingMode, blocks, updateDraftingArtifacts]);

  return {
    updateDraftingArtifacts,
    cleanupDraftingArtifacts,
    handleToggleDraftingMode,
  };
}
