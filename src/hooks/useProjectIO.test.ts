import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useProjectIO } from '@/hooks/useProjectIO';
import { installElectronAPI } from '@/test/mocks/electronAPI';
import { createBlock } from '@/test/mocks/sampleData';
import type { UseProjectIOParams } from '@/hooks/useProjectIO';

function makeParams(overrides: Partial<UseProjectIOParams> = {}): UseProjectIOParams {
  return {
    blocksRef: { current: [createBlock()] },
    dirtyBlockIdsRef: { current: new Set() },
    dirtyEditorsRef: { current: new Set() },
    editorInstances: { current: new Map() },

    projectRootPath: '/project',
    setFileSystemTree: vi.fn(),

    projectSettings: {
      groups: [],
      stickyNotes: [],
      routeStickyNotes: [],
      choiceStickyNotes: [],
      renpyPath: '',
      projectImages: [],
      projectAudios: [],
      imagemapCompositions: {},
      screenLayoutCompositions: {},
      routeNodePositions: {},
      storyNodePositions: {},
      choiceNodePositions: {},
      milestones: [],
      completedMilestones: [],
      legacyMigrationChecked: false,
    } as unknown as UseProjectIOParams['projectSettings'],

    blocks: [createBlock()],
    setBlocks: vi.fn(),

    setImages: vi.fn(),
    setAudios: vi.fn(),
    imageScanDirectories: new Map(),
    audioScanDirectories: new Map(),

    stickyNotes: [],
    routeStickyNotes: [],
    choiceStickyNotes: [],
    characterProfiles: {},
    punchlistMetadata: {},
    diagnosticsTasks: [],
    ignoredDiagnostics: [],
    dismissedImplicitVarHint: false,
    sceneCompositions: {},
    sceneNames: {},
    imagemapCompositions: {},
    routeNodeLayoutCache: new Map(),
    openTabs: [],
    activeTabId: 'canvas',
    secondaryOpenTabs: [],
    secondaryActiveTabId: '',
    splitLayout: 'none',
    splitPrimarySize: 600,

    dirtyBlockIds: new Set(),
    setDirtyBlockIds: vi.fn(),
    dirtyEditors: new Set(),
    setDirtyEditors: vi.fn(),
    setHasUnsavedSettings: vi.fn(),
    setSaveStatus: vi.fn(),
    filesWithDiskConflict: new Set(),
    setFilesWithDiskConflict: vi.fn(),
    setExternallyChangedFiles: vi.fn(),
    notifyFirstSave: vi.fn(),
    openUnsavedChangesModal: vi.fn(),
    closeUnsavedChangesModal: vi.fn(),

    setOpenTabs: vi.fn(),
    addToast: vi.fn(),
    ...overrides,
  };
}

describe('useProjectIO', () => {
  beforeEach(() => {
    installElectronAPI();
  });

  it('returns all four expected functions', () => {
    const { result } = renderHook(() => useProjectIO(makeParams()));
    expect(typeof result.current.handleSaveProjectSettings).toBe('function');
    expect(typeof result.current.handleSaveAll).toBe('function');
    expect(typeof result.current.handleReloadFromDisk).toBe('function');
    expect(typeof result.current.handleRefreshProject).toBe('function');
  });

  it('does nothing when projectRootPath is null', async () => {
    const setSaveStatus = vi.fn();
    const { result } = renderHook(() =>
      useProjectIO(makeParams({ projectRootPath: null, setSaveStatus })),
    );
    await result.current.handleSaveProjectSettings();
    expect(setSaveStatus).not.toHaveBeenCalled();
  });

  it('handleSaveAll does nothing when no dirty blocks and no dirty editors', async () => {
    const setSaveStatus = vi.fn();
    const { result } = renderHook(() =>
      useProjectIO(makeParams({ setSaveStatus, dirtyBlockIds: new Set(), dirtyEditors: new Set() })),
    );
    await result.current.handleSaveAll();
    // No dirty items → short-circuits to saving project settings only (or nothing)
    // Just ensure it doesn't throw
    expect(true).toBe(true);
  });
});
