/**
 * @file CrashLogModal.tsx
 * @description Dismissible modal showing the traceback.txt Ren'Py wrote after the game process
 * crashed with an unhandled exception (~50 lines).
 * Key features: scrollable monospace traceback text, copy-to-clipboard via `CopyButton`.
 * Integration: `isOpen`/`tracebackText`/`onClose` are owned by `useGameExecution`'s
 * `crashLog`/`dismissCrashLog`; rendered from `App.tsx` alongside the other modals.
 */
import React from 'react';
import { createPortal } from 'react-dom';
import { useModalAccessibility } from '@/hooks/useModalAccessibility';
import CopyButton from '@/components/CopyButton';

interface CrashLogModalProps {
  isOpen: boolean;
  tracebackText: string;
  onClose: () => void;
}

const CrashLogModal: React.FC<CrashLogModalProps> = ({ isOpen, tracebackText, onClose }) => {
  const { modalProps, contentRef } = useModalAccessibility({ isOpen, onClose, titleId: 'crash-log-title' });

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        ref={contentRef}
        {...modalProps}
        className="bg-secondary rounded-lg shadow-2xl w-full max-w-2xl m-4 flex flex-col border border-primary text-primary max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        <header className="px-6 py-5 border-b border-primary">
          <h2 id="crash-log-title" className="text-xl font-bold">Game Crashed — traceback.txt</h2>
        </header>
        <main className="px-6 py-6 overflow-auto">
          <pre className="text-xs font-mono whitespace-pre-wrap text-secondary bg-tertiary rounded p-4 border border-primary">
            {tracebackText}
          </pre>
        </main>
        <footer className="bg-header px-6 py-4 rounded-b-lg flex justify-end items-center space-x-4 border-t border-primary">
          <CopyButton text={tracebackText} label="Copy Traceback" size="md" />
          <button
            onClick={onClose}
            className="bg-tertiary hover:bg-tertiary-hover text-primary font-bold py-2 px-4 rounded transition duration-200 border border-primary"
          >
            Close
          </button>
        </footer>
      </div>
    </div>,
    document.body,
  );
};

export default CrashLogModal;
