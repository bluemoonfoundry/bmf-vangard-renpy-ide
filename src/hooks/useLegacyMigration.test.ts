import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { useLegacyMigration } from './useLegacyMigration';
import { uninstallElectronAPI } from '@/test/mocks/electronAPI';
import type { AppSettings } from '@/types';

function installMigrationAPI(overrides: Record<string, unknown> = {}) {
  const api = {
    checkLegacyMigration: vi.fn().mockResolvedValue({ available: false }),
    performLegacyMigration: vi.fn().mockResolvedValue({ success: true, settings: {} }),
    dismissLegacyMigration: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
  (window as { electronAPI?: unknown }).electronAPI = api;
  return api;
}

afterEach(() => {
  uninstallElectronAPI();
});

describe('useLegacyMigration', () => {
  describe('modal visibility', () => {
    it('shows modal when checkLegacyMigration returns available: true', async () => {
      const api = installMigrationAPI({
        checkLegacyMigration: vi.fn().mockResolvedValue({ available: true }),
      });
      const updateAppSettings = vi.fn();
      const { result } = renderHook(() =>
        useLegacyMigration({ appSettingsLoaded: true, updateAppSettings })
      );
      await waitFor(() => expect(result.current.showLegacyMigrationModal).toBe(true));
      expect(api.checkLegacyMigration).toHaveBeenCalledOnce();
    });

    it('does not show modal when checkLegacyMigration returns available: false', async () => {
      installMigrationAPI({ checkLegacyMigration: vi.fn().mockResolvedValue({ available: false }) });
      const { result } = renderHook(() =>
        useLegacyMigration({ appSettingsLoaded: true, updateAppSettings: vi.fn() })
      );
      await waitFor(() => {});
      expect(result.current.showLegacyMigrationModal).toBe(false);
    });

    it('does not call checkLegacyMigration until appSettingsLoaded is true', () => {
      const api = installMigrationAPI();
      renderHook(() =>
        useLegacyMigration({ appSettingsLoaded: false, updateAppSettings: vi.fn() })
      );
      expect(api.checkLegacyMigration).not.toHaveBeenCalled();
    });

    it('does not call checkLegacyMigration when electronAPI is absent', () => {
      uninstallElectronAPI();
      const { result } = renderHook(() =>
        useLegacyMigration({ appSettingsLoaded: true, updateAppSettings: vi.fn() })
      );
      expect(result.current.showLegacyMigrationModal).toBe(false);
    });
  });

  describe('handleLegacyMigrationSkip', () => {
    it('closes the modal and calls dismissLegacyMigration', async () => {
      const api = installMigrationAPI({
        checkLegacyMigration: vi.fn().mockResolvedValue({ available: true }),
      });
      const { result } = renderHook(() =>
        useLegacyMigration({ appSettingsLoaded: true, updateAppSettings: vi.fn() })
      );
      await waitFor(() => expect(result.current.showLegacyMigrationModal).toBe(true));

      await act(async () => { await result.current.handleLegacyMigrationSkip(); });

      expect(result.current.showLegacyMigrationModal).toBe(false);
      expect(api.dismissLegacyMigration).toHaveBeenCalledOnce();
    });
  });

  describe('handleLegacyMigrationImport', () => {
    it('closes the modal on import', async () => {
      installMigrationAPI({
        checkLegacyMigration: vi.fn().mockResolvedValue({ available: true }),
        performLegacyMigration: vi.fn().mockResolvedValue({ success: true, settings: {} }),
      });
      const { result } = renderHook(() =>
        useLegacyMigration({ appSettingsLoaded: true, updateAppSettings: vi.fn() })
      );
      await waitFor(() => expect(result.current.showLegacyMigrationModal).toBe(true));

      await act(async () => { await result.current.handleLegacyMigrationImport(); });

      expect(result.current.showLegacyMigrationModal).toBe(false);
    });

    it('merges returned settings into app settings on success', async () => {
      const migratedSettings = { renpyPath: '/usr/bin/renpy', theme: 'light' } as Partial<AppSettings>;
      installMigrationAPI({
        checkLegacyMigration: vi.fn().mockResolvedValue({ available: true }),
        performLegacyMigration: vi.fn().mockResolvedValue({ success: true, settings: migratedSettings }),
      });
      const updateAppSettings = vi.fn().mockImplementation((updater: (draft: AppSettings) => void) => {
        const draft = {} as AppSettings;
        updater(draft);
      });
      const { result } = renderHook(() =>
        useLegacyMigration({ appSettingsLoaded: true, updateAppSettings })
      );
      await waitFor(() => expect(result.current.showLegacyMigrationModal).toBe(true));

      await act(async () => { await result.current.handleLegacyMigrationImport(); });

      expect(updateAppSettings).toHaveBeenCalled();
    });

    it('does not call updateAppSettings when migration returns success: false', async () => {
      installMigrationAPI({
        checkLegacyMigration: vi.fn().mockResolvedValue({ available: true }),
        performLegacyMigration: vi.fn().mockResolvedValue({ success: false }),
      });
      const updateAppSettings = vi.fn();
      const { result } = renderHook(() =>
        useLegacyMigration({ appSettingsLoaded: true, updateAppSettings })
      );
      await waitFor(() => expect(result.current.showLegacyMigrationModal).toBe(true));

      await act(async () => { await result.current.handleLegacyMigrationImport(); });

      expect(updateAppSettings).not.toHaveBeenCalled();
    });
  });
});
