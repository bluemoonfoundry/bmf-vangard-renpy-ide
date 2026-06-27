import React, { createContext, useContext } from 'react';
import type { MutableRefObject, Dispatch, SetStateAction } from 'react';
import type { UseTabManagementReturn } from '@/hooks/useTabManagement';
import type { UseTabLifecycleReturn } from '@/hooks/useTabLifecycle';
import type { UseTabOpenersReturn } from '@/hooks/useTabOpeners';

export interface DualPaneContextValue extends UseTabManagementReturn, UseTabLifecycleReturn, UseTabOpenersReturn {
  // Dirty tracking
  dirtyBlockIds: Set<string>;
  dirtyEditors: Set<string>;
  setDirtyBlockIds: Dispatch<SetStateAction<Set<string>>>;
  setDirtyEditors: Dispatch<SetStateAction<Set<string>>>;
  dirtyBlockIdsRef: MutableRefObject<Set<string>>;
  dirtyEditorsRef: MutableRefObject<Set<string>>;
  // Tab context menu (not from useTabLifecycle — depends on modal state)
  handleTabContextMenu: (e: React.MouseEvent, tabId: string, paneId?: 'primary' | 'secondary') => void;
}

export const DualPaneContext = createContext<DualPaneContextValue | null>(null);

export function useDualPane(): DualPaneContextValue {
  const ctx = useContext(DualPaneContext);
  if (!ctx) throw new Error('useDualPane must be used within a DualPaneContext.Provider');
  return ctx;
}
