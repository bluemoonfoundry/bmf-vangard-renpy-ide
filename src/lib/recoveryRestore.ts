/**
 * @file recoveryRestore.ts
 * @description Applies a crash-recovery snapshot to in-memory state as UNSAVED
 * changes (bmf-vangard-renpy-ide-b70a.2.3). Never writes to disk; the user saves
 * through the normal flow. Workspace changes go first so later layout hydration
 * can't overwrite restored file text. Each item is applied independently and
 * failures are collected rather than aborting the restore.
 */
import { deserializeProjectData } from '@/lib/projectSerializer';
import type {
  Block, FileSystemTreeNode, PendingRecovery, ProjectImage, ProjectLoadResult, ProjectSnapshot,
  RecoverySelection, RenpyAudio, SceneSprite,
} from '@/types';

export interface RecoveryRestoreDeps {
  rootPath: string;
  tree: FileSystemTreeNode | null;
  blocksRef: React.MutableRefObject<Block[]>;
  editorInstances: React.MutableRefObject<Map<string, { getModel(): { getValue(): string; setValue(v: string): void } | null }>>;
  images: Map<string, ProjectImage>;
  audios: Map<string, RenpyAudio>;
  setBlocks: React.Dispatch<React.SetStateAction<Block[]>>;
  setDirtyBlockIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  setHasUnsavedSettings: (v: boolean) => void;
  createRecoveredUntitledFile: (title: string, content: string) => string;
  applySettingsSnapshot: (snapshot: ProjectSnapshot) => void;
}

const toScanned = (a: { filePath: string; fileName?: string; dataUrl?: string; lastModified?: number; size?: number }) => ({
  path: a.filePath,
  fileName: a.fileName ?? a.filePath.split('/').pop() ?? a.filePath,
  dataUrl: a.dataUrl ?? '',
  lastModified: a.lastModified ?? 0,
  size: a.size ?? 0,
});

/** deserializeProjectData marks every image isInProject; point compositions back at the live objects. */
function relinkImages(snapshot: ProjectSnapshot, images: Map<string, ProjectImage>): ProjectSnapshot {
  const relinkSprite = (s: SceneSprite): SceneSprite => ({ ...s, image: images.get(s.image.filePath) ?? s.image });
  const sceneCompositions = Object.fromEntries(Object.entries(snapshot.sceneCompositions).map(([id, sc]) => [id, {
    ...sc,
    background: sc.background ? relinkSprite(sc.background) : null,
    sprites: sc.sprites.map(relinkSprite),
  }]));
  const relinkImage = (img: ProjectImage | null) => (img ? images.get(img.filePath) ?? img : null);
  const imagemapCompositions = Object.fromEntries(Object.entries(snapshot.imagemapCompositions).map(([id, im]) => [id, {
    ...im,
    groundImage: relinkImage(im.groundImage),
    hoverImage: relinkImage(im.hoverImage),
  }]));
  return { ...snapshot, sceneCompositions, imagemapCompositions };
}

const recoveredTitle = (relativePath: string) => `${relativePath.split('/').pop() ?? relativePath} (recovered)`;

export function applyRecoverySnapshot(
  pending: PendingRecovery,
  selection: RecoverySelection,
  deps: RecoveryRestoreDeps,
): { restored: number; failures: { item: string; error: string }[] } {
  let restored = 0;
  const failures: { item: string; error: string }[] = [];
  const attempt = (item: string, fn: () => void) => {
    try {
      fn();
      restored++;
    } catch (err) {
      failures.push({ item, error: err instanceof Error ? err.message : String(err) });
    }
  };

  // 1. Workspace changes first.
  if (selection.settings && pending.settings) {
    attempt('Workspace changes', () => {
      const data: ProjectLoadResult = {
        rootPath: deps.rootPath,
        files: deps.blocksRef.current.filter(b => b.filePath).map(b => ({ path: b.filePath!, content: b.content })),
        images: [...deps.images.values()].map(toScanned),
        audios: [...deps.audios.values()].map(toScanned),
        settings: pending.settings,
        tree: deps.tree ?? { name: '', path: '', children: [] },
      };
      const snapshot = relinkImages(deserializeProjectData(data, deps.blocksRef.current), deps.images);
      deps.applySettingsSnapshot(snapshot);
      deps.setHasUnsavedSettings(true);
    });
  }

  // 2-3. Script files.
  const selectedFiles = new Set(selection.files);
  for (const file of pending.files) {
    if (!selectedFiles.has(file.relativePath)) continue;
    attempt(file.relativePath, () => {
      const block = file.status === 'deleted'
        ? undefined
        : deps.blocksRef.current.find(b => b.filePath === file.relativePath);
      if (!block) {
        deps.createRecoveredUntitledFile(recoveredTitle(file.relativePath), file.content);
        return;
      }
      deps.setBlocks(prev => prev.map(b => (b.id === block.id ? { ...b, content: file.content } : b)));
      const model = deps.editorInstances.current.get(block.id)?.getModel();
      if (model && model.getValue() !== file.content) model.setValue(file.content);
      deps.setDirtyBlockIds(prev => new Set(prev).add(block.id));
    });
  }

  // 4. Untitled drafts.
  const selectedUntitled = new Set(selection.untitled);
  for (const draft of pending.untitled) {
    if (!selectedUntitled.has(draft.id)) continue;
    attempt(draft.title, () => { deps.createRecoveredUntitledFile(draft.title, draft.content); });
  }

  return { restored, failures };
}
