import { useState, useEffect } from 'react';
import type { AppSettings } from '@/types';
import { logger } from '@/lib/logger';

interface UseLegacyMigrationParams {
  appSettingsLoaded: boolean;
  updateAppSettings: (updater: (draft: AppSettings) => void) => void;
}

export function useLegacyMigration({ appSettingsLoaded, updateAppSettings }: UseLegacyMigrationParams) {
  const [showLegacyMigrationModal, setShowLegacyMigrationModal] = useState(false);

  useEffect(() => {
    if (!appSettingsLoaded || !window.electronAPI?.checkLegacyMigration) return;
    window.electronAPI.checkLegacyMigration()
      .then(({ available }) => { if (available) setShowLegacyMigrationModal(true); })
      .catch(err => logger.error('Legacy migration check failed:', err));
  }, [appSettingsLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLegacyMigrationImport = async () => {
    setShowLegacyMigrationModal(false);
    try {
      const result = await window.electronAPI?.performLegacyMigration?.();
      if (result?.success && result.settings) updateAppSettings(draft => { Object.assign(draft, result.settings); });
    } catch (err) {
      logger.error('Legacy migration failed:', err);
    }
  };

  const handleLegacyMigrationSkip = async () => {
    setShowLegacyMigrationModal(false);
    window.electronAPI?.dismissLegacyMigration?.().catch(err =>
      logger.error('Failed to dismiss legacy migration:', err)
    );
  };

  return { showLegacyMigrationModal, handleLegacyMigrationImport, handleLegacyMigrationSkip };
}
