import React from 'react';

interface ExternalFileChange {
  relativePath: string;
}

interface ExternalChangesBannerProps {
  items: ExternalFileChange[];
  onReload: (item: ExternalFileChange) => void;
  onKeep: (relativePath: string) => void;
}

const ExternalChangesBanner: React.FC<ExternalChangesBannerProps> = ({ items, onReload, onKeep }) => {
  if (items.length === 0) return null;
  return (
    <div className="flex-none border-b border-yellow-300 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900/30">
      {items.map(item => {
        const fileName = item.relativePath.split('/').pop() ?? item.relativePath;
        return (
          <div key={item.relativePath} className="flex items-center gap-2 px-3 py-1.5 text-sm text-yellow-800 dark:text-yellow-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="font-medium truncate max-w-xs" title={item.relativePath}>{fileName}</span>
            <span className="text-yellow-700 dark:text-yellow-300">was modified outside the editor.</span>
            <button
              onClick={() => onReload(item)}
              className="ml-1 px-2 py-0.5 rounded text-xs font-medium bg-yellow-200 hover:bg-yellow-300 dark:bg-yellow-700 dark:hover:bg-yellow-600 text-yellow-900 dark:text-yellow-100 transition-colors"
            >
              Reload
            </button>
            <button
              onClick={() => onKeep(item.relativePath)}
              className="px-2 py-0.5 rounded text-xs font-medium text-yellow-700 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-800/50 transition-colors"
            >
              Keep current
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ExternalChangesBanner;
