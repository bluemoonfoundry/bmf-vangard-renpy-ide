import { createContext, useContext } from 'react';
import type { MutableRefObject, Dispatch, SetStateAction } from 'react';
import type { UseTabManagementReturn } from '@/hooks/useTabManagement';

export interface DualPaneContextValue extends UseTabManagementReturn {
  dirtyBlockIds: Set<string>;
  dirtyEditors: Set<string>;
  setDirtyBlockIds: Dispatch<SetStateAction<Set<string>>>;
  setDirtyEditors: Dispatch<SetStateAction<Set<string>>>;
  dirtyBlockIdsRef: MutableRefObject<Set<string>>;
  dirtyEditorsRef: MutableRefObject<Set<string>>;
}

export const DualPaneContext = createContext<DualPaneContextValue | null>(null);

export function useDualPane(): DualPaneContextValue {
  const ctx = useContext(DualPaneContext);
  if (!ctx) throw new Error('useDualPane must be used within a DualPaneContext.Provider');
  return ctx;
}
