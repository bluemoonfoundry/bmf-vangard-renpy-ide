import { useEffect, useRef, useCallback } from 'react';
import type { Block, RenpyAnalysisResult, ProjectImage } from '@/types';

interface MilestoneSettings {
  completedMilestones?: string[];
}

interface UseMilestonesParams {
  blocks: Block[];
  analysisResult: RenpyAnalysisResult;
  images: Map<string, ProjectImage>;
  projectSettings: MilestoneSettings;
  updateProjectSettings: (updater: (draft: MilestoneSettings) => void) => void;
  addToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

const MILESTONE_MESSAGES: Record<string, string> = {
  'first-block':      '🎉 Your story begins! Keep going...',
  'first-connection': '✨ Connected! Your story is branching',
  'first-save':       '✓ Saved — You\'re making great progress!',
  'first-character':  '👤 Great! Characters bring your story to life',
  'first-image':      '🖼️ Looking good! Visual storytelling starts here',
  'scenes-10':        '🎊 10 scenes! You\'re building something great',
  'scenes-25':        '🌟 25 scenes! This is getting epic',
  'scenes-50':        '🚀 50 scenes! You\'re a storytelling machine',
  'first-branch':     '🌿 Your story is branching! Players will love having choices',
};

export function useMilestones({
  blocks,
  analysisResult,
  images,
  projectSettings,
  updateProjectSettings,
  addToast,
}: UseMilestonesParams) {
  const firedThisSession = useRef<Set<string>>(new Set());

  const trigger = useCallback((id: string) => {
    if (firedThisSession.current.has(id)) return;
    const alreadyDone = projectSettings.completedMilestones?.includes(id) ?? false;
    if (alreadyDone) return;

    firedThisSession.current.add(id);
    const message = MILESTONE_MESSAGES[id];
    if (message) addToast(message, 'success');

    updateProjectSettings(draft => {
      if (!draft.completedMilestones) draft.completedMilestones = [];
      if (!draft.completedMilestones.includes(id)) draft.completedMilestones.push(id);
    });
  }, [projectSettings.completedMilestones, addToast, updateProjectSettings]);

  useEffect(() => {
    if (blocks.length >= 1)  trigger('first-block');
    if (blocks.length >= 10) trigger('scenes-10');
    if (blocks.length >= 25) trigger('scenes-25');
    if (blocks.length >= 50) trigger('scenes-50');
  }, [blocks.length, trigger]);

  useEffect(() => {
    if (analysisResult.links.length >= 1) trigger('first-connection');
  }, [analysisResult.links.length, trigger]);

  useEffect(() => {
    if (analysisResult.characters.size >= 1) trigger('first-character');
  }, [analysisResult.characters.size, trigger]);

  useEffect(() => {
    if (analysisResult.branchingBlockIds.size >= 1) trigger('first-branch');
  }, [analysisResult.branchingBlockIds.size, trigger]);

  useEffect(() => {
    if (images.size >= 1) trigger('first-image');
  }, [images.size, trigger]);

  const notifyFirstSave = useCallback(() => {
    trigger('first-save');
  }, [trigger]);

  return { notifyFirstSave };
}
