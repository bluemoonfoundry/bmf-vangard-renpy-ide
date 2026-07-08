import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useMilestones } from './useMilestones';
import { createBlock, createEmptyAnalysisResult } from '@/test/mocks/sampleData';
import type { RenpyAnalysisResult, ProjectImage } from '@/types';

interface MilestoneSettings {
  completedMilestones?: string[];
}

function makeParams(overrides: {
  blocks?: ReturnType<typeof createBlock>[];
  analysisResult?: RenpyAnalysisResult;
  images?: Map<string, ProjectImage>;
  projectSettings?: MilestoneSettings;
} = {}) {
  const addToast = vi.fn();
  const settings: MilestoneSettings = overrides.projectSettings ?? { completedMilestones: [] };
  const updateProjectSettings = vi.fn().mockImplementation((updater: (draft: MilestoneSettings) => void) => {
    updater(settings);
  });
  return {
    blocks: overrides.blocks ?? [],
    analysisResult: overrides.analysisResult ?? createEmptyAnalysisResult(),
    images: overrides.images ?? new Map(),
    projectSettings: settings,
    updateProjectSettings,
    addToast,
  };
}

describe('useMilestones', () => {
  describe('first-block milestone', () => {
    it('fires toast when blocks.length reaches 1 for the first time', () => {
      const params = makeParams({ blocks: [createBlock()] });
      renderHook(() => useMilestones(params));
      expect(params.addToast).toHaveBeenCalledOnce();
      expect(params.addToast).toHaveBeenCalledWith(expect.stringContaining('story begins'), 'success');
    });

    it('does not fire toast when milestone already in completedMilestones', () => {
      const params = makeParams({
        blocks: [createBlock()],
        projectSettings: { completedMilestones: ['first-block'] },
      });
      renderHook(() => useMilestones(params));
      expect(params.addToast).not.toHaveBeenCalled();
    });

    it('adds milestone id to completedMilestones via updateProjectSettings', () => {
      const params = makeParams({ blocks: [createBlock()] });
      renderHook(() => useMilestones(params));
      expect(params.updateProjectSettings).toHaveBeenCalled();
      expect(params.projectSettings.completedMilestones).toContain('first-block');
    });
  });

  describe('block-count milestones', () => {
    it('fires scenes-10 when blocks reach 10', () => {
      const blocks = Array.from({ length: 10 }, (_, i) => createBlock({ id: `b${i}`, filePath: `game/s${i}.rpy` }));
      const params = makeParams({ blocks });
      renderHook(() => useMilestones(params));
      expect(params.addToast).toHaveBeenCalledWith(expect.stringContaining('10 scenes'), 'success');
    });

    it('fires scenes-25 when blocks reach 25', () => {
      const blocks = Array.from({ length: 25 }, (_, i) => createBlock({ id: `b${i}`, filePath: `game/s${i}.rpy` }));
      const params = makeParams({ blocks });
      renderHook(() => useMilestones(params));
      expect(params.addToast).toHaveBeenCalledWith(expect.stringContaining('25 scenes'), 'success');
    });

    it('fires scenes-50 when blocks reach 50', () => {
      const blocks = Array.from({ length: 50 }, (_, i) => createBlock({ id: `b${i}`, filePath: `game/s${i}.rpy` }));
      const params = makeParams({ blocks });
      renderHook(() => useMilestones(params));
      expect(params.addToast).toHaveBeenCalledWith(expect.stringContaining('50 scenes'), 'success');
    });
  });

  describe('analysis-derived milestones', () => {
    it('fires first-connection when analysis has at least one link', () => {
      const params = makeParams({
        analysisResult: createEmptyAnalysisResult({
          links: [{ sourceId: 'b1', targetId: 'b2', targetLabel: 'ch1' }],
        }),
      });
      renderHook(() => useMilestones(params));
      expect(params.addToast).toHaveBeenCalledWith(expect.stringContaining('Connected'), 'success');
    });

    it('fires first-character when analysis has at least one character', () => {
      const params = makeParams({
        analysisResult: createEmptyAnalysisResult({
          characters: new Map([['e', { name: 'Eileen', tag: 'e', color: '#c60', definedInBlockId: 'b1' }]]),
        }),
      });
      renderHook(() => useMilestones(params));
      expect(params.addToast).toHaveBeenCalledWith(expect.stringContaining('Characters'), 'success');
    });

    it('fires first-branch when branchingBlockIds has at least one entry', () => {
      const params = makeParams({
        analysisResult: createEmptyAnalysisResult({
          branchingBlockIds: new Set(['b1']),
        }),
      });
      renderHook(() => useMilestones(params));
      expect(params.addToast).toHaveBeenCalledWith(expect.stringContaining('branching'), 'success');
    });

    it('fires first-image when images map has at least one entry', () => {
      const img = { filePath: 'game/images/bg.png', fileName: 'bg.png', isInProject: true, fileHandle: null, dataUrl: '' };
      const params = makeParams({ images: new Map([['game/images/bg.png', img as ProjectImage]]) });
      renderHook(() => useMilestones(params));
      expect(params.addToast).toHaveBeenCalledWith(expect.stringContaining('Visual'), 'success');
    });
  });

  describe('notifyFirstSave', () => {
    it('fires first-save toast when called', () => {
      const params = makeParams();
      const { result } = renderHook(() => useMilestones(params));
      act(() => { result.current.notifyFirstSave(); });
      expect(params.addToast).toHaveBeenCalledWith(expect.stringContaining('Saved'), 'success');
    });

    it('does not fire again if already in completedMilestones', () => {
      const params = makeParams({ projectSettings: { completedMilestones: ['first-save'] } });
      const { result } = renderHook(() => useMilestones(params));
      act(() => { result.current.notifyFirstSave(); });
      expect(params.addToast).not.toHaveBeenCalled();
    });
  });

  describe('firedThisSession guard', () => {
    it('does not fire the same milestone twice in one session', () => {
      const params = makeParams();
      const { result } = renderHook(() => useMilestones(params));
      act(() => { result.current.notifyFirstSave(); });
      act(() => { result.current.notifyFirstSave(); });
      expect(params.addToast).toHaveBeenCalledTimes(1);
    });
  });
});
