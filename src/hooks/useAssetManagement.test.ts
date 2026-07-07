/**
 * @file hooks/useAssetManagement.test.ts
 * @description Tests for useAssetManagement — image/audio CRUD operations and state management.
 */

import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAssetManagement } from '@/hooks/useAssetManagement';
import type { UseAssetManagementParams } from '@/hooks/useAssetManagement';
import type { ProjectImage, RenpyAudio, ImageMetadata, AudioMetadata } from '@/types';

function makeParams(overrides: Partial<UseAssetManagementParams> = {}): UseAssetManagementParams {
  return {
    projectRootPath: '/project',
    perfRecorders: {
      recordScanStart: vi.fn(),
      recordScanEnd: vi.fn(),
    } as unknown as UseAssetManagementParams['perfRecorders'],
    setIsScanningAssets: vi.fn(),
    setHasUnsavedSettings: vi.fn(),
    setFileSystemTree: vi.fn(),
    addToast: vi.fn(),
    setOpenTabs: vi.fn(),
    setSecondaryOpenTabs: vi.fn(),
    setActiveTabId: vi.fn(),
    setSecondaryActiveTabId: vi.fn(),
    ...overrides,
  };
}

function makeImage(path = 'game/images/bg.png'): ProjectImage {
  return {
    path,
    filePath: path,
    isInProject: true,
    naturalWidth: 1920,
    naturalHeight: 1080,
    fileHandle: null,
  } as unknown as ProjectImage;
}

function makeAudio(path = 'game/audio/bgm.ogg'): RenpyAudio {
  return {
    path,
    filePath: path,
    isInProject: true,
    fileHandle: null,
  } as unknown as RenpyAudio;
}

// ============================================================================
// Initial state
// ============================================================================

describe('useAssetManagement — initial state', () => {
  it('starts with empty images and audios Maps', () => {
    const { result } = renderHook(() => useAssetManagement(makeParams()));
    expect(result.current.images.size).toBe(0);
    expect(result.current.audios.size).toBe(0);
  });

  it('starts with empty metadata Maps', () => {
    const { result } = renderHook(() => useAssetManagement(makeParams()));
    expect(result.current.imageMetadata.size).toBe(0);
    expect(result.current.audioMetadata.size).toBe(0);
  });

  it('starts with null timestamps', () => {
    const { result } = renderHook(() => useAssetManagement(makeParams()));
    expect(result.current.imagesLastScanned).toBeNull();
    expect(result.current.audiosLastScanned).toBeNull();
  });

  it('starts with refreshing flags as false', () => {
    const { result } = renderHook(() => useAssetManagement(makeParams()));
    expect(result.current.isRefreshingImages).toBe(false);
    expect(result.current.isRefreshingAudios).toBe(false);
  });
});

// ============================================================================
// Image CRUD
// ============================================================================

describe('useAssetManagement — addImage', () => {
  it('adds an image to the collection', () => {
    const { result } = renderHook(() => useAssetManagement(makeParams()));
    const img = makeImage();
    act(() => result.current.addImage(img.path, img));
    expect(result.current.images.has(img.path)).toBe(true);
    expect(result.current.images.get(img.path)).toEqual(img);
  });

  it('overwrites an existing image at the same path', () => {
    const { result } = renderHook(() => useAssetManagement(makeParams()));
    const img1 = makeImage();
    const img2 = { ...makeImage(), naturalWidth: 800 };
    act(() => result.current.addImage(img1.path, img1));
    act(() => result.current.addImage(img1.path, img2));
    expect(result.current.images.get(img1.path)?.naturalWidth).toBe(800);
  });
});

describe('useAssetManagement — removeImage', () => {
  it('removes image from images and imageMetadata', () => {
    const { result } = renderHook(() => useAssetManagement(makeParams()));
    const img = makeImage();
    const meta: ImageMetadata = { tags: ['bg'], displayName: 'Background' } as ImageMetadata;
    act(() => {
      result.current.addImage(img.path, img);
      result.current.updateImageMetadata(img.path, meta);
    });
    act(() => result.current.removeImage(img.path));
    expect(result.current.images.has(img.path)).toBe(false);
    expect(result.current.imageMetadata.has(img.path)).toBe(false);
  });

  it('is a no-op for unknown path', () => {
    const { result } = renderHook(() => useAssetManagement(makeParams()));
    act(() => result.current.removeImage('nonexistent.png'));
    expect(result.current.images.size).toBe(0);
  });
});

describe('useAssetManagement — updateImageMetadata', () => {
  it('stores metadata keyed by path', () => {
    const { result } = renderHook(() => useAssetManagement(makeParams()));
    const img = makeImage();
    const meta: ImageMetadata = { tags: ['background', 'day'], displayName: 'Day BG' } as ImageMetadata;
    act(() => result.current.updateImageMetadata(img.path, meta));
    expect(result.current.imageMetadata.get(img.path)).toEqual(meta);
  });

  it('overwrites existing metadata', () => {
    const { result } = renderHook(() => useAssetManagement(makeParams()));
    const img = makeImage();
    const meta1: ImageMetadata = { tags: ['bg'], displayName: 'Old' } as ImageMetadata;
    const meta2: ImageMetadata = { tags: ['background'], displayName: 'New' } as ImageMetadata;
    act(() => result.current.updateImageMetadata(img.path, meta1));
    act(() => result.current.updateImageMetadata(img.path, meta2));
    expect(result.current.imageMetadata.get(img.path)?.displayName).toBe('New');
  });
});

// ============================================================================
// Audio CRUD
// ============================================================================

describe('useAssetManagement — addAudio', () => {
  it('adds an audio to the collection', () => {
    const { result } = renderHook(() => useAssetManagement(makeParams()));
    const audio = makeAudio();
    act(() => result.current.addAudio(audio.path, audio));
    expect(result.current.audios.has(audio.path)).toBe(true);
  });

  it('overwrites an existing audio at the same path', () => {
    const { result } = renderHook(() => useAssetManagement(makeParams()));
    const audio1 = makeAudio();
    const audio2 = { ...makeAudio(), isInProject: false };
    act(() => result.current.addAudio(audio1.path, audio1));
    act(() => result.current.addAudio(audio1.path, audio2));
    expect(result.current.audios.get(audio1.path)?.isInProject).toBe(false);
  });
});

describe('useAssetManagement — removeAudio', () => {
  it('removes audio from audios and audioMetadata', () => {
    const { result } = renderHook(() => useAssetManagement(makeParams()));
    const audio = makeAudio();
    const meta: AudioMetadata = { displayName: 'BGM', tags: [] } as AudioMetadata;
    act(() => {
      result.current.addAudio(audio.path, audio);
      result.current.updateAudioMetadata(audio.path, meta);
    });
    act(() => result.current.removeAudio(audio.path));
    expect(result.current.audios.has(audio.path)).toBe(false);
    expect(result.current.audioMetadata.has(audio.path)).toBe(false);
  });
});

describe('useAssetManagement — updateAudioMetadata', () => {
  it('stores audio metadata keyed by path', () => {
    const { result } = renderHook(() => useAssetManagement(makeParams()));
    const audio = makeAudio();
    const meta: AudioMetadata = { displayName: 'Main Theme', tags: ['bgm'] } as AudioMetadata;
    act(() => result.current.updateAudioMetadata(audio.path, meta));
    expect(result.current.audioMetadata.get(audio.path)).toEqual(meta);
  });
});

// ============================================================================
// clearImages / clearAudios
// ============================================================================

describe('useAssetManagement — clearImages', () => {
  it('clears images, imageMetadata, scanDirectories, and timestamp', () => {
    const { result } = renderHook(() => useAssetManagement(makeParams()));
    const img = makeImage();
    act(() => {
      result.current.addImage(img.path, img);
      result.current.updateImageMetadata(img.path, { tags: [], displayName: 'x' } as ImageMetadata);
      result.current.setImagesLastScanned(Date.now());
    });
    act(() => result.current.clearImages());
    expect(result.current.images.size).toBe(0);
    expect(result.current.imageMetadata.size).toBe(0);
    expect(result.current.imagesLastScanned).toBeNull();
  });
});

describe('useAssetManagement — clearAudios', () => {
  it('clears audios, audioMetadata, scanDirectories, and timestamp', () => {
    const { result } = renderHook(() => useAssetManagement(makeParams()));
    const audio = makeAudio();
    act(() => {
      result.current.addAudio(audio.path, audio);
      result.current.updateAudioMetadata(audio.path, { tags: [], displayName: 'y' } as AudioMetadata);
      result.current.setAudiosLastScanned(Date.now());
    });
    act(() => result.current.clearAudios());
    expect(result.current.audios.size).toBe(0);
    expect(result.current.audioMetadata.size).toBe(0);
    expect(result.current.audiosLastScanned).toBeNull();
  });
});

// ============================================================================
// State setters exposed from the hook
// ============================================================================

describe('useAssetManagement — setImages / setAudios direct setters', () => {
  it('setImages replaces the images map', () => {
    const { result } = renderHook(() => useAssetManagement(makeParams()));
    const img = makeImage('game/images/test.png');
    const newMap = new Map([[img.path, img]]);
    act(() => result.current.setImages(newMap));
    expect(result.current.images.size).toBe(1);
    expect(result.current.images.has(img.path)).toBe(true);
  });

  it('setAudios replaces the audios map', () => {
    const { result } = renderHook(() => useAssetManagement(makeParams()));
    const audio = makeAudio('game/audio/sfx.ogg');
    const newMap = new Map([[audio.path, audio]]);
    act(() => result.current.setAudios(newMap));
    expect(result.current.audios.size).toBe(1);
  });
});
