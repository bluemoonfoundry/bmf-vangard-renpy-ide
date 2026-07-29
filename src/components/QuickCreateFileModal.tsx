/**
 * @file QuickCreateFileModal.tsx
 * @description Lightweight modal for confirming/editing a filename generated
 * from an editor-selection "New File" context-menu action, when the sanitized
 * name differs from the raw selection or collides with an existing file.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useModalAccessibility } from '@/hooks/useModalAccessibility';

interface QuickCreateFileModalProps {
  isOpen: boolean;
  directoryPath: string;
  extension: string;
  initialFileName: string;
  onConfirm: (fileName: string) => void;
  onClose: () => void;
}

const QuickCreateFileModal: React.FC<QuickCreateFileModalProps> = ({ isOpen, directoryPath, extension, initialFileName, onConfirm, onClose }) => {
  const [baseName, setBaseName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { modalProps, contentRef } = useModalAccessibility({ isOpen, onClose, titleId: 'quick-create-file-title' });

  useEffect(() => {
    if (isOpen) {
      setBaseName(initialFileName);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, initialFileName]);

  const handleConfirm = () => {
    const trimmed = baseName.trim();
    if (!trimmed) return;
    onConfirm(`${trimmed}${extension}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleConfirm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div
        ref={contentRef}
        {...modalProps}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-md m-4 flex flex-col border border-gray-200 dark:border-gray-700"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 id="quick-create-file-title" className="text-xl font-bold text-gray-900 dark:text-gray-100">New File</h2>
        </header>

        <main className="p-6 space-y-4">
          <div>
            <label htmlFor="quick-create-file-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              File Name
            </label>
            <div className="flex items-center">
              <input
                ref={inputRef}
                id="quick-create-file-name"
                type="text"
                value={baseName}
                onChange={e => setBaseName(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 p-2 rounded-l bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <span className="p-2 rounded-r bg-gray-100 dark:bg-gray-700 border border-l-0 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 text-sm">
                {extension}
              </span>
            </div>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400">
            Creating in: <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">{directoryPath || '(project root)'}</span>
          </div>
        </main>

        <footer className="bg-gray-50 dark:bg-gray-700 p-4 rounded-b-lg flex justify-end items-center space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded shadow-sm"
          >
            Create
          </button>
        </footer>
      </div>
    </div>
  );
};

export default QuickCreateFileModal;
