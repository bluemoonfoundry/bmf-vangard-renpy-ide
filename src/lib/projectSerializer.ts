import { migratePunchlistToTasks } from '@/hooks/useDiagnostics';
import { getStoryLayoutVersion } from '@/lib/storyCanvasLayout';
import { getRouteCanvasLayoutVersion } from '@/lib/routeCanvasLayout';
import { isSerializedSceneComposition, isSerializedImageMapComposition } from '@/lib/typeGuards';
import { logger } from '@/lib/logger';
import type {
  Block, ProjectImage, RenpyAudio, EditorTab, DiagnosticsTask,
  SceneComposition, SceneSprite, ImageMapComposition, Position,
  ProjectLoadResult, ProjectSnapshot, PendingStoryLayoutRefresh, PendingRouteLayoutRefresh,
  SerializedSprite, ProjectSettings, ProjectSettingsMeta, PunchlistMetadata,
} from '@/types';

// ---------------------------------------------------------------------------
// project.ide.json schema versioning
//
// Every file written by this build carries `schemaVersion`. Files without it
// are version 0 (everything written before versioning existed). On load the
// raw JSON is walked forward through PROJECT_SETTINGS_MIGRATIONS one step at a
// time; each step must be pure, must not drop data it doesn't understand, and
// must tolerate partially-populated input. To change the on-disk shape: bump
// PROJECT_SETTINGS_SCHEMA_VERSION, append a `{ from: N, to: N + 1 }` step, and
// add a fixture under src/test/fixtures/projectSettings/.
// ---------------------------------------------------------------------------

export const PROJECT_SETTINGS_SCHEMA_VERSION = 1;

type RawProjectSettings = Record<string, unknown>;

export interface ProjectSettingsMigration {
  from: number;
  to: number;
  description: string;
  migrate: (raw: RawProjectSettings) => RawProjectSettings;
}

const isPlainObject = (v: unknown): v is RawProjectSettings =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

/** v0 -> v1: folds the ad-hoc, field-sniffing migrations that used to run inside deserialization into one versioned step. */
function migrateV0ToV1(raw: RawProjectSettings): RawProjectSettings {
  const next: RawProjectSettings = { ...raw };

  // Legacy single-scene `sceneComposition` -> keyed `sceneCompositions` map.
  // Only consumed when the new map is absent; otherwise the legacy key is left
  // alone and survives as an unknown field rather than being discarded.
  if (next.sceneCompositions === undefined && isSerializedSceneComposition(next.sceneComposition)) {
    next.sceneCompositions = { 'scene-default': next.sceneComposition };
    next.sceneNames = { 'scene-default': 'Default Scene', ...(isPlainObject(next.sceneNames) ? next.sceneNames : {}) };
    delete next.sceneComposition;
  }

  // Punchlist -> Diagnostics tasks. punchlistMetadata itself is kept.
  if (next.diagnosticsTasks === undefined && isPlainObject(next.punchlistMetadata)) {
    next.diagnosticsTasks = migratePunchlistToTasks(next.punchlistMetadata as Record<string, PunchlistMetadata>);
  }

  // Punchlist tab -> Diagnostics tab, in both panes, de-duplicating by id.
  const renameTabs = (tabs: unknown): unknown => {
    if (!Array.isArray(tabs)) return tabs;
    const seen = new Set<unknown>();
    return tabs
      .map(t => (isPlainObject(t) && (t.type === 'punchlist' || t.id === 'punchlist'))
        ? { ...t, type: 'diagnostics', id: 'diagnostics' }
        : t)
      .filter(t => {
        if (!isPlainObject(t)) return true;
        if (seen.has(t.id)) return false;
        seen.add(t.id);
        return true;
      });
  };
  if (next.openTabs !== undefined) next.openTabs = renameTabs(next.openTabs);
  if (next.secondaryOpenTabs !== undefined) next.secondaryOpenTabs = renameTabs(next.secondaryOpenTabs);
  if (next.activeTabId === 'punchlist') next.activeTabId = 'diagnostics';
  if (next.secondaryActiveTabId === 'punchlist') next.secondaryActiveTabId = 'diagnostics';

  return next;
}

export const PROJECT_SETTINGS_MIGRATIONS: readonly ProjectSettingsMigration[] = [
  { from: 0, to: 1, description: 'v0 -> v1: legacy scene, punchlist and tab formats', migrate: migrateV0ToV1 },
];

/**
 * Every top-level key this build understands. Typed as a Record over
 * `keyof ProjectSettings` so adding a field to ProjectSettings without listing
 * it here is a compile error -- otherwise the new field would be mistaken for
 * an unknown one and written back twice on save.
 */
const KNOWN_PROJECT_SETTINGS_KEYS: Record<keyof ProjectSettings, true> = {
  schemaVersion: true, draftingMode: true,
  storyCanvasLayoutMode: true, storyCanvasGroupingMode: true, storyCanvasLayoutFingerprint: true,
  storyCanvasLayoutVersion: true, storyCanvasLayoutWasUserAdjusted: true, storyBlockLayouts: true,
  storyCanvasHasAutocentered: true,
  routeCanvasLayoutMode: true, routeCanvasGroupingMode: true, routeCanvasLayoutFingerprint: true,
  routeCanvasLayoutVersion: true, routeCanvasLayoutWasUserAdjusted: true, routeNodeLayouts: true,
  routeCanvasHasAutocentered: true,
  choiceCanvasLayoutMode: true, choiceCanvasGroupingMode: true, choiceCanvasHasAutocentered: true,
  openTabs: true, activeTabId: true, splitLayout: true, splitPrimarySize: true,
  secondaryOpenTabs: true, secondaryActiveTabId: true,
  stickyNotes: true, routeStickyNotes: true, choiceStickyNotes: true,
  notecards: true, notecardLinks: true, notecardTimeline: true,
  characterProfiles: true, characterPortraits: true,
  punchlistMetadata: true, diagnosticsTasks: true, ignoredDiagnostics: true,
  sceneCompositions: true, sceneNames: true, imagemapCompositions: true,
  scannedImagePaths: true, scannedAudioPaths: true,
  storyElementsTabState: true, dismissedImplicitVariableHint: true, completedMilestones: true,
};

function readSchemaVersion(raw: RawProjectSettings): number {
  const v = raw.schemaVersion;
  if (v === undefined) return 0;
  if (typeof v === 'number' && Number.isInteger(v) && v >= 0) return v;
  logger.warn('project.ide.json has an invalid schemaVersion; treating it as unversioned', { schemaVersion: v });
  return 0;
}

/** Default meta for a project whose settings haven't been loaded (or were unreadable). */
export function createDefaultProjectSettingsMeta(): ProjectSettingsMeta {
  return {
    schemaVersion: PROJECT_SETTINGS_SCHEMA_VERSION,
    loadedVersion: null,
    appliedMigrations: [],
    newerThanSupported: false,
    unknownFields: {},
  };
}

export interface ProjectSettingsMigrationResult {
  /** Migrated settings, or null when there were none (or they were not a JSON object). */
  settings: ProjectSettings | null;
  meta: ProjectSettingsMeta;
}

/**
 * Walks raw project.ide.json content forward to `targetVersion`. Pure; does not
 * throw on bad input (only on a gap in the registry itself). Files from a newer
 * build are passed through unmigrated, with `newerThanSupported` set, so their
 * version isn't downgraded on save.
 */
export function migrateProjectSettings(
  raw: unknown,
  migrations: readonly ProjectSettingsMigration[] = PROJECT_SETTINGS_MIGRATIONS,
  targetVersion: number = PROJECT_SETTINGS_SCHEMA_VERSION,
): ProjectSettingsMigrationResult {
  if (!isPlainObject(raw)) {
    if (raw !== null && raw !== undefined) {
      logger.warn('project.ide.json root is not a JSON object; ignoring it', { type: Array.isArray(raw) ? 'array' : typeof raw });
    }
    return { settings: null, meta: { ...createDefaultProjectSettingsMeta(), schemaVersion: targetVersion } };
  }

  const loadedVersion = readSchemaVersion(raw);
  let current: RawProjectSettings = raw;
  let version = loadedVersion;
  const appliedMigrations: string[] = [];

  while (version < targetVersion) {
    const step = migrations.find(m => m.from === version);
    if (!step || step.to <= version) {
      throw new Error(`No project settings migration registered from schema version ${version}`);
    }
    current = step.migrate(current);
    version = step.to;
    appliedMigrations.push(step.description);
  }

  const newerThanSupported = loadedVersion > targetVersion;
  const schemaVersion = Math.max(loadedVersion, targetVersion);
  const unknownFields: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(current)) {
    if (!Object.prototype.hasOwnProperty.call(KNOWN_PROJECT_SETTINGS_KEYS, key)) unknownFields[key] = value;
  }

  if (appliedMigrations.length > 0 && Object.keys(raw).length > 0) {
    logger.info(`Migrated project.ide.json from schema v${loadedVersion} to v${schemaVersion}`, { appliedMigrations });
  }
  if (newerThanSupported) {
    logger.warn(`project.ide.json uses schema v${loadedVersion}, newer than supported v${targetVersion}`);
  }

  return {
    settings: { ...current, schemaVersion } as unknown as ProjectSettings,
    meta: { schemaVersion, loadedVersion, appliedMigrations, newerThanSupported, unknownFields },
  };
}

/**
 * Produces the object to write to project.ide.json: `schemaVersion` first,
 * then any unknown fields carried over from load, then the current settings
 * (which win over an unknown field of the same name).
 */
export function buildProjectSettingsForSave(
  settings: ProjectSettings,
  meta: ProjectSettingsMeta,
): ProjectSettings {
  const out: Record<string, unknown> = { schemaVersion: meta.schemaVersion };
  Object.assign(out, meta.unknownFields, settings);
  out.schemaVersion = meta.schemaVersion;
  return out as unknown as ProjectSettings;
}

function rehydrateSprite(s: SerializedSprite, imgMap: Map<string, ProjectImage>): SceneSprite {
  const img = imgMap.get(s.image.filePath) ?? {
    filePath: s.image.filePath,
    fileName: s.image.filePath.split(/[/\\]/).pop() ?? 'unknown',
    isInProject: false,
    fileHandle: null,
    dataUrl: '',
  };
  return { ...s, image: img };
}

function deserializeSceneCompositions(
  settings: ProjectLoadResult['settings'],
  imgMap: Map<string, ProjectImage>,
): { sceneCompositions: Record<string, SceneComposition>; sceneNames: Record<string, string> } {
  if (!settings) return { sceneCompositions: {}, sceneNames: {} };

  if (settings.sceneCompositions) {
    const sceneCompositions: Record<string, SceneComposition> = {};
    Object.entries(settings.sceneCompositions).forEach(([id, sc]) => {
      if (isSerializedSceneComposition(sc)) {
        sceneCompositions[id] = {
          background: sc.background ? rehydrateSprite(sc.background, imgMap) : null,
          sprites: sc.sprites.map(s => rehydrateSprite(s, imgMap)),
          resolution: sc.resolution,
          animations: sc.animations,
        };
      } else {
        logger.warn('Skipping malformed scene composition entry', { id, sc });
      }
    });
    return { sceneCompositions, sceneNames: settings.sceneNames ?? {} };
  }

  return { sceneCompositions: {}, sceneNames: {} };
}

function deserializeImagemapCompositions(
  settings: ProjectLoadResult['settings'],
  imgMap: Map<string, ProjectImage>,
): Record<string, ImageMapComposition> {
  if (!settings?.imagemapCompositions) return {};

  const result: Record<string, ImageMapComposition> = {};
  Object.entries(settings.imagemapCompositions).forEach(([id, im]) => {
    if (isSerializedImageMapComposition(im)) {
      result[id] = {
        screenName: im.screenName,
        groundImage: im.groundImage ? (imgMap.get(im.groundImage.filePath) ?? null) : null,
        hoverImage: im.hoverImage ? (imgMap.get(im.hoverImage.filePath) ?? null) : null,
        hotspots: im.hotspots,
      };
    } else {
      logger.warn('Skipping malformed imagemap composition entry', { id, im });
    }
  });
  return result;
}

function deserializeTabs(
  settings: ProjectLoadResult['settings'],
  blockFilePathMap: Map<string, Block>,
  imgMap: Map<string, ProjectImage>,
  audioMap: Map<string, RenpyAudio>,
): {
  primaryTabs: EditorTab[];
  primaryActiveTabId: string;
  secondaryTabs: EditorTab[];
  secondaryActiveTabId: string;
  splitLayout: 'none' | 'right' | 'bottom';
  splitPrimarySize: number;
} {
  if (!settings) {
    return {
      primaryTabs: [{ id: 'canvas', type: 'canvas' }],
      primaryActiveTabId: 'canvas',
      secondaryTabs: [],
      secondaryActiveTabId: '',
      splitLayout: 'none',
      splitPrimarySize: 600,
    };
  }

  const isValidTab = (tab: EditorTab, bfMap: Map<string, Block>, iMap: Map<string, ProjectImage>, aMap: Map<string, RenpyAudio>): boolean => {
    if (tab.type === 'editor' && tab.filePath) return bfMap.has(tab.filePath);
    if (tab.type === 'image' && tab.filePath) return iMap.has(tab.filePath);
    if (tab.type === 'audio' && tab.filePath) return aMap.has(tab.filePath);
    if (tab.type === 'character' && tab.characterTag) return true;
    if (tab.type === 'scene-composer' && tab.sceneId) return true;
    if (tab.type === 'markdown' && tab.filePath) return true;
    return ['canvas', 'route-canvas', 'choice-canvas', 'notecard-canvas', 'punchlist', 'diagnostics', 'stats', 'translations', 'screen-preview'].includes(tab.type);
  };

  const migrateTab = (tab: EditorTab): EditorTab => {
    if (tab.type === 'editor' && tab.filePath) {
      const block = blockFilePathMap.get(tab.filePath);
      if (block) return { ...tab, id: block.id, blockId: block.id };
    }
    if (tab.type === 'scene-composer' && !tab.sceneId) {
      return { ...tab, sceneId: 'scene-default' };
    }
    return tab;
  };

  const savedTabs: EditorTab[] = settings.openTabs ?? [{ id: 'canvas', type: 'canvas' }];
  const primaryTabs = savedTabs
    .filter(t => isValidTab(t, blockFilePathMap, imgMap, audioMap))
    .map(migrateTab);

  const activeTabIsValid = primaryTabs.some(t => t.id === settings.activeTabId);
  const primaryActiveTabId = activeTabIsValid ? settings.activeTabId : 'canvas';

  const savedSecondary: EditorTab[] = settings.secondaryOpenTabs ?? [];
  const secondaryTabs = savedSecondary.filter(t => isValidTab(t, blockFilePathMap, imgMap, audioMap));
  const savedSecondaryActive = settings.secondaryActiveTabId ?? '';
  const secondaryActiveTabId = secondaryTabs.some(t => t.id === savedSecondaryActive)
    ? savedSecondaryActive
    : (secondaryTabs[0]?.id ?? '');

  const splitLayout = secondaryTabs.length > 0 ? (settings.splitLayout ?? 'none') : 'none';
  const splitPrimarySize = settings.splitPrimarySize ?? 600;

  return { primaryTabs, primaryActiveTabId, secondaryTabs, secondaryActiveTabId, splitLayout, splitPrimarySize };
}

/**
 * Pure function: maps a raw `ProjectLoadResult` + the current in-memory blocks
 * into a `ProjectSnapshot` value object.
 *
 * No React state, no IPC calls. Safe to call from unit tests with plain objects.
 * When `snapshot.defaultScriptBlock` is non-null the caller must write that file
 * via IPC before passing the snapshot to `hydrateFromProjectData`.
 */
export function deserializeProjectData(
  rawData: ProjectLoadResult,
  currentBlocks: Block[],
): ProjectSnapshot {
  const { settings: migratedSettings, meta: settingsMeta } = migrateProjectSettings(rawData.settings);
  const data: ProjectLoadResult = { ...rawData, settings: migratedSettings };

  const savedStoryBlockLayouts = data.settings?.storyBlockLayouts ?? {};
  const savedRouteNodeLayouts = data.settings?.routeNodeLayouts ?? {};

  const existingBlocksMap = new Map<string, Block>();
  currentBlocks.forEach(b => { if (b.filePath) existingBlocksMap.set(b.filePath, b); });

  const blocks: Block[] = data.files.map((f, index) => {
    const existing = existingBlocksMap.get(f.path);
    const saved = savedStoryBlockLayouts[f.path];
    return {
      id: existing?.id ?? `block-${index}-${Date.now()}`,
      content: f.content,
      filePath: f.path,
      position: saved?.position ?? existing?.position ?? { x: (index % 5) * 350, y: Math.floor(index / 5) * 250 },
      width: saved?.width ?? existing?.width ?? 320,
      height: saved?.height ?? existing?.height ?? 200,
      title: f.path.split('/').pop(),
      color: saved?.color ?? existing?.color ?? undefined,
    };
  });

  let defaultScriptBlock: Block | null = null;
  if (blocks.length === 0) {
    defaultScriptBlock = {
      id: `block-${Date.now()}`,
      content: `label start:\n    "Welcome to your new project!"\n    return\n`,
      filePath: 'script.rpy',
      position: { x: 50, y: 50 },
      width: 320,
      height: 200,
      title: 'script.rpy',
    };
    blocks.push(defaultScriptBlock);
  }

  const blockFilePathMap = new Map(blocks.map(b => [b.filePath, b]));

  const images = new Map<string, ProjectImage>();
  data.images.forEach(img => {
    images.set(img.path, {
      ...img,
      filePath: img.path,
      fileName: img.path.split('/').pop(),
      isInProject: true,
      fileHandle: null,
    });
  });

  const audios = new Map<string, RenpyAudio>();
  data.audios.forEach(aud => {
    audios.set(aud.path, {
      ...aud,
      filePath: aud.path,
      fileName: aud.path.split('/').pop(),
      isInProject: true,
      fileHandle: null,
    });
  });

  const { sceneCompositions, sceneNames } = deserializeSceneCompositions(data.settings, images);
  const imagemapCompositions = deserializeImagemapCompositions(data.settings, images);

  const routeNodeLayoutCache: Map<string, Position> = new Map(
    Object.entries(savedRouteNodeLayouts).map(([id, layout]) => [id, layout.position]),
  );

  const { primaryTabs, primaryActiveTabId, secondaryTabs, secondaryActiveTabId, splitLayout, splitPrimarySize } =
    deserializeTabs(data.settings, blockFilePathMap, images, audios);

  const diagnosticsTasks: DiagnosticsTask[] = data.settings?.diagnosticsTasks ?? [];

  const pendingStoryLayoutRefresh: PendingStoryLayoutRefresh = {
    hasSavedLayouts: Object.keys(savedStoryBlockLayouts).length > 0,
    savedFingerprint: data.settings?.storyCanvasLayoutFingerprint,
    savedVersion: data.settings?.storyCanvasLayoutVersion,
    savedWasUserAdjusted: data.settings?.storyCanvasLayoutWasUserAdjusted ?? false,
  };

  const pendingRouteLayoutRefresh: PendingRouteLayoutRefresh = {
    hasSavedLayouts: Object.keys(savedRouteNodeLayouts).length > 0,
    savedFingerprint: data.settings?.routeCanvasLayoutFingerprint,
    savedVersion: data.settings?.routeCanvasLayoutVersion,
    savedWasUserAdjusted: data.settings?.routeCanvasLayoutWasUserAdjusted ?? false,
  };

  return {
    rootPath: data.rootPath,
    tree: data.tree,
    blocks,
    defaultScriptBlock,
    settingsMeta,
    images,
    audios,
    imageScanPaths: data.settings?.scannedImagePaths ?? [],
    audioScanPaths: data.settings?.scannedAudioPaths ?? [],
    stickyNotes: data.settings?.stickyNotes ?? [],
    routeStickyNotes: data.settings?.routeStickyNotes ?? [],
    choiceStickyNotes: data.settings?.choiceStickyNotes ?? [],
    notecards: data.settings?.notecards ?? [],
    notecardLinks: data.settings?.notecardLinks ?? [],
    notecardTimeline: data.settings?.notecardTimeline ?? { slotLabels: {} },
    characterProfiles: data.settings?.characterProfiles ?? {},
    characterPortraits: data.settings?.characterPortraits ?? {},
    punchlistMetadata: data.settings?.punchlistMetadata ?? {},
    diagnosticsTasks,
    ignoredDiagnostics: data.settings?.ignoredDiagnostics ?? [],
    dismissedImplicitVariableHint: data.settings?.dismissedImplicitVariableHint ?? false,
    sceneCompositions,
    sceneNames,
    imagemapCompositions,
    routeNodeLayoutCache,
    primaryTabs,
    primaryActiveTabId,
    secondaryTabs,
    secondaryActiveTabId,
    splitLayout,
    splitPrimarySize,
    pendingStoryLayoutRefresh,
    pendingRouteLayoutRefresh,
    canvasSettings: {
      draftingMode: data.settings?.draftingMode ?? false,
      storyCanvasLayoutMode: data.settings?.storyCanvasLayoutMode ?? 'flow-lr',
      storyCanvasGroupingMode: data.settings?.storyCanvasGroupingMode ?? 'none',
      storyCanvasLayoutFingerprint: data.settings?.storyCanvasLayoutFingerprint,
      storyCanvasLayoutVersion: data.settings?.storyCanvasLayoutVersion ?? getStoryLayoutVersion(),
      storyCanvasLayoutWasUserAdjusted: data.settings?.storyCanvasLayoutWasUserAdjusted ?? false,
      routeCanvasLayoutMode: data.settings?.routeCanvasLayoutMode ?? 'flow-lr',
      routeCanvasGroupingMode: data.settings?.routeCanvasGroupingMode ?? 'none',
      routeCanvasLayoutFingerprint: data.settings?.routeCanvasLayoutFingerprint,
      routeCanvasLayoutVersion: data.settings?.routeCanvasLayoutVersion ?? getRouteCanvasLayoutVersion(),
      routeCanvasLayoutWasUserAdjusted: data.settings?.routeCanvasLayoutWasUserAdjusted ?? false,
      completedMilestones: data.settings?.completedMilestones ?? [],
    },
  };
}
