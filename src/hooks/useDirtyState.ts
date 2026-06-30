import { useState, useRef, useEffect } from 'react';

export function useDirtyState() {
  const [dirtyBlockIds, setDirtyBlockIds] = useState<Set<string>>(new Set());
  const [dirtyEditors, setDirtyEditors] = useState<Set<string>>(new Set());

  // Refs mirroring dirty state for callbacks that need current values without re-creating on every change.
  const dirtyBlockIdsRef = useRef(dirtyBlockIds);
  const dirtyEditorsRef = useRef(dirtyEditors);
  useEffect(() => { dirtyBlockIdsRef.current = dirtyBlockIds; }, [dirtyBlockIds]);
  useEffect(() => { dirtyEditorsRef.current = dirtyEditors; }, [dirtyEditors]);

  const [hasUnsavedSettings, setHasUnsavedSettings] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saving' | 'saved' | 'error'>('saved');

  return {
    dirtyBlockIds, setDirtyBlockIds,
    dirtyEditors, setDirtyEditors,
    dirtyBlockIdsRef, dirtyEditorsRef,
    hasUnsavedSettings, setHasUnsavedSettings,
    saveStatus, setSaveStatus,
  };
}
