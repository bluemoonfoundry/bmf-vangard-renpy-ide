import React from 'react';
import { useModalAccessibility } from '@/hooks/useModalAccessibility';

interface LegacyMigrationModalProps {
  isOpen: boolean;
  onImport: () => void;
  onSkip: () => void;
}

const LegacyMigrationModal: React.FC<LegacyMigrationModalProps> = ({ isOpen, onImport, onSkip }) => {
  const { modalProps, contentRef } = useModalAccessibility({
    isOpen,
    onClose: onSkip,
    titleId: 'legacy-migration-title',
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100]">
      <div
        ref={contentRef}
        {...modalProps}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-md m-4 border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <div className="p-6">
          <h2 id="legacy-migration-title" className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
            Import settings from Ren'IDE?
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            We found an existing Ren'IDE installation on this computer. Would you like to import
            your previous settings and API keys into Vangard Studio?
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
            This includes your theme, SDK path, recent projects, and editor preferences.
            You won't be asked again.
          </p>
        </div>
        <footer className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onSkip}
            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            Skip
          </button>
          <button
            onClick={onImport}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded transition-colors shadow-sm"
          >
            Import Settings
          </button>
        </footer>
      </div>
    </div>
  );
};

export default LegacyMigrationModal;
