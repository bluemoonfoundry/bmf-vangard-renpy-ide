/**
 * @file hooks/useDraftingArtifacts.test.ts
 * @description Tests for useDraftingArtifacts — toggle, cleanup, and artifact generation.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useDraftingArtifacts } from '@/hooks/useDraftingArtifacts';
import type { UseDraftingArtifactsParams } from '@/hooks/useDraftingArtifacts';
import { createMockElectronAPI, installElectronAPI, uninstallElectronAPI } from '@/test/mocks/electronAPI';
import { createBlock } from '@/test/mocks/sampleData';

function makeParams(overrides: Partial<UseDraftingArtifactsParams> = {}): UseDraftingArtifactsParams {
  return {
    projectRootPath: '/project',
    blocks: [createBlock()],
    draftingMode: false,
    definedImages: new Set(),
    definedVariables: new Map(),
    existingImageTags: new Set(),
    existingAudioPaths: new Set(),
    updateProjectSettings: vi.fn(),
    setHasUnsavedSettings: vi.fn(),
    addToast: vi.fn(),
    ...overrides,
  };
}

describe('useDraftingArtifacts — handleToggleDraftingMode', () => {
  let api: ReturnType<typeof createMockElectronAPI>;

  beforeEach(() => {
    api = createMockElectronAPI();
    installElectronAPI(api);
  });

  afterEach(() => {
    uninstallElectronAPI();
  });

  it('enables drafting mode: calls updateProjectSettings and shows info toast', async () => {
    const updateProjectSettings = vi.fn();
    const addToast = vi.fn();
    const { result } = renderHook(() =>
      useDraftingArtifacts(makeParams({ updateProjectSettings, addToast }))
    );
    await act(async () => {
      await result.current.handleToggleDraftingMode(true);
    });
    expect(updateProjectSettings).toHaveBeenCalled();
    expect(addToast).toHaveBeenCalledWith(expect.stringContaining('Enabled'), 'info');
  });

  it('disables drafting mode: calls updateProjectSettings, shows info toast, and cleans up', async () => {
    const updateProjectSettings = vi.fn();
    const setHasUnsavedSettings = vi.fn();
    const addToast = vi.fn();
    const { result } = renderHook(() =>
      useDraftingArtifacts(makeParams({ updateProjectSettings, setHasUnsavedSettings, addToast }))
    );
    await act(async () => {
      await result.current.handleToggleDraftingMode(false);
    });
    expect(updateProjectSettings).toHaveBeenCalled();
    expect(setHasUnsavedSettings).toHaveBeenCalledWith(true);
    expect(addToast).toHaveBeenCalledWith(expect.stringContaining('Disabled'), 'info');
    // cleanup attempts to remove the placeholder file
    expect(api.path.join).toHaveBeenCalled();
  });

  it('marks settings dirty when toggling', async () => {
    const setHasUnsavedSettings = vi.fn();
    const { result } = renderHook(() =>
      useDraftingArtifacts(makeParams({ setHasUnsavedSettings }))
    );
    await act(async () => {
      await result.current.handleToggleDraftingMode(true);
    });
    expect(setHasUnsavedSettings).toHaveBeenCalledWith(true);
  });
});

describe('useDraftingArtifacts — cleanupDraftingArtifacts', () => {
  let api: ReturnType<typeof createMockElectronAPI>;

  beforeEach(() => {
    api = createMockElectronAPI();
    installElectronAPI(api);
  });

  afterEach(() => {
    uninstallElectronAPI();
  });

  it('calls removeEntry for .rpy and .rpyc paths', async () => {
    const { result } = renderHook(() =>
      useDraftingArtifacts(makeParams({ projectRootPath: '/project' }))
    );
    await act(async () => {
      await result.current.cleanupDraftingArtifacts();
    });
    expect(api.removeEntry).toHaveBeenCalledTimes(2);
  });

  it('is a no-op when projectRootPath is null', async () => {
    const { result } = renderHook(() =>
      useDraftingArtifacts(makeParams({ projectRootPath: null }))
    );
    await act(async () => {
      await result.current.cleanupDraftingArtifacts();
    });
    expect(api.removeEntry).not.toHaveBeenCalled();
  });

  it('is a no-op when electronAPI is absent', async () => {
    uninstallElectronAPI(); // remove global
    const { result } = renderHook(() =>
      useDraftingArtifacts(makeParams({ projectRootPath: '/project' }))
    );
    await act(async () => {
      await result.current.cleanupDraftingArtifacts();
    });
    // Should not throw; electronAPI is undefined
    expect(api.removeEntry).not.toHaveBeenCalled();
  });
});

describe('useDraftingArtifacts — updateDraftingArtifacts', () => {
  let api: ReturnType<typeof createMockElectronAPI>;

  beforeEach(() => {
    api = createMockElectronAPI();
    installElectronAPI(api);
  });

  afterEach(() => {
    uninstallElectronAPI();
  });

  it('writes debug_placeholders.rpy when draftingMode is true', async () => {
    const { result } = renderHook(() =>
      useDraftingArtifacts(makeParams({ draftingMode: true }))
    );
    await act(async () => {
      await result.current.updateDraftingArtifacts();
    });
    expect(api.writeFile).toHaveBeenCalledWith(
      expect.stringContaining('debug_placeholders.rpy'),
      expect.any(String)
    );
  });

  it('is a no-op when draftingMode is false', async () => {
    const { result } = renderHook(() =>
      useDraftingArtifacts(makeParams({ draftingMode: false }))
    );
    await act(async () => {
      await result.current.updateDraftingArtifacts();
    });
    expect(api.writeFile).not.toHaveBeenCalled();
  });

  it('is a no-op when projectRootPath is null', async () => {
    const { result } = renderHook(() =>
      useDraftingArtifacts(makeParams({ draftingMode: true, projectRootPath: null }))
    );
    await act(async () => {
      await result.current.updateDraftingArtifacts();
    });
    expect(api.writeFile).not.toHaveBeenCalled();
  });

  it('generates image placeholders for missing show/scene commands', async () => {
    const block = createBlock({ content: 'label start:\n    show eileen happy\n    return\n' });
    const { result } = renderHook(() =>
      useDraftingArtifacts(makeParams({
        draftingMode: true,
        blocks: [block],
        definedImages: new Set(), // eileen not defined
        existingImageTags: new Set(),
      }))
    );
    await act(async () => {
      await result.current.updateDraftingArtifacts();
    });
    const writtenContent = (api.writeFile as ReturnType<typeof vi.fn>).mock.calls
      .find((call: string[]) => call[0].includes('debug_placeholders'))?.[1] as string;
    expect(writtenContent).toContain('image eileen');
  });

  it('skips missing images when tag is already defined', async () => {
    const block = createBlock({ content: 'label start:\n    show eileen\n    return\n' });
    const { result } = renderHook(() =>
      useDraftingArtifacts(makeParams({
        draftingMode: true,
        blocks: [block],
        definedImages: new Set(['eileen']),
        existingImageTags: new Set(),
      }))
    );
    await act(async () => {
      await result.current.updateDraftingArtifacts();
    });
    const writtenContent = (api.writeFile as ReturnType<typeof vi.fn>).mock.calls
      .find((call: string[]) => call[0].includes('debug_placeholders'))?.[1] as string;
    expect(writtenContent).not.toContain('image eileen');
  });

  it('does not scan the placeholder file itself', async () => {
    const block = createBlock({
      filePath: 'game/debug_placeholders.rpy',
      content: 'image eileen = Placeholder("text", text="eileen")\n',
    });
    const { result } = renderHook(() =>
      useDraftingArtifacts(makeParams({
        draftingMode: true,
        blocks: [block],
        definedImages: new Set(),
      }))
    );
    await act(async () => {
      await result.current.updateDraftingArtifacts();
    });
    // The placeholder file content should only have the header comment, no eileen placeholder
    const writtenContent = (api.writeFile as ReturnType<typeof vi.fn>).mock.calls
      .find((call: string[]) => call[0].includes('debug_placeholders'))?.[1] as string;
    // eileen would appear if scanned — it should NOT
    const lines = writtenContent.split('\n').filter(l => l.includes('image eileen'));
    expect(lines.length).toBe(0);
  });
});

describe('useDraftingArtifacts — effect: auto-updates when draftingMode is true', () => {
  let api: ReturnType<typeof createMockElectronAPI>;

  beforeEach(() => {
    api = createMockElectronAPI();
    installElectronAPI(api);
  });

  afterEach(() => {
    uninstallElectronAPI();
  });

  it('calls updateDraftingArtifacts on mount when draftingMode starts as true', async () => {
    renderHook(() =>
      useDraftingArtifacts(makeParams({ draftingMode: true }))
    );
    await waitFor(() => {
      expect(api.writeFile).toHaveBeenCalled();
    });
  });

  it('does not call updateDraftingArtifacts on mount when draftingMode starts as false', async () => {
    renderHook(() =>
      useDraftingArtifacts(makeParams({ draftingMode: false }))
    );
    // Give it a tick to ensure no async writes happened
    await new Promise(r => setTimeout(r, 10));
    expect(api.writeFile).not.toHaveBeenCalled();
  });
});
