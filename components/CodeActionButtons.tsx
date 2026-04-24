/**
 * @file CodeActionButtons.tsx
 * @description Standardized button group for generated code actions: copy to clipboard and insert at cursor.
 * Key features: copy to clipboard, insert at active editor cursor, disabled states, feedback animations.
 * Integration: use in SceneComposer, ScreenLayoutComposer, MenuConstructor, ImageMapComposer, and other code-generating components.
 */
import React, { useState } from 'react';
import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

interface CodeActionButtonsProps {
    /** Generated code to copy/insert */
    code: string;
    /** Active Monaco editor instance (if available) */
    activeEditor?: monaco.editor.IStandaloneCodeEditor | null;
    /** Size variant (default: 'sm') */
    size?: 'xs' | 'sm' | 'md';
    /** Additional CSS classes */
    className?: string;
    /** Show only copy button (hide insert button) */
    copyOnly?: boolean;
}

/**
 * Standardized button group for generated code actions.
 * Provides "Copy" and "Insert at Cursor" buttons with visual feedback.
 */
export default function CodeActionButtons({
    code,
    activeEditor,
    size = 'sm',
    className = '',
    copyOnly = false,
}: CodeActionButtonsProps) {
    const [copied, setCopied] = useState(false);
    const [inserted, setInserted] = useState(false);

    const handleCopy = async () => {
        if (!code) return;
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy to clipboard:', err);
        }
    };

    const handleInsert = () => {
        if (!code || !activeEditor) return;
        try {
            const position = activeEditor.getPosition();
            if (!position) return;

            const model = activeEditor.getModel();
            if (!model) return;

            // Get current line text to detect indentation
            const currentLineText = model.getLineContent(position.lineNumber);
            const currentIndent = currentLineText.match(/^[\t ]*/)?.[0] || '';

            // Smart indentation logic:
            // - If cursor is at column 1 (start of line), insert code as-is
            // - If cursor is indented or mid-line, prepend current line's indentation to all lines
            let textToInsert = code;
            if (position.column > 1 && currentIndent) {
                const codeLines = code.split('\n');
                // Strip the common base indentation already present in generated code
                // so we don't double-indent lines that already carry absolute indentation.
                const nonEmptyTrailing = codeLines.slice(1).filter(l => l.trim().length > 0);
                const baseIndentLen = nonEmptyTrailing.length > 0
                    ? Math.min(...nonEmptyTrailing.map(l => (l.match(/^[\t ]*/) ?? [''])[0].length))
                    : 0;
                textToInsert = codeLines.map((line, idx) => {
                    if (idx === 0) return line;
                    if (!line.trim()) return line;
                    return currentIndent + line.slice(baseIndentLen);
                }).join('\n');
            }

            activeEditor.executeEdits('insert-generated-code', [
                {
                    range: {
                        startLineNumber: position.lineNumber,
                        startColumn: position.column,
                        endLineNumber: position.lineNumber,
                        endColumn: position.column,
                    },
                    text: textToInsert,
                    forceMoveMarkers: true,
                },
            ]);

            // Move cursor to end of inserted text
            const lines = textToInsert.split('\n');
            const lastLineLength = lines[lines.length - 1].length;
            activeEditor.setPosition({
                lineNumber: position.lineNumber + lines.length - 1,
                column: lines.length === 1 ? position.column + lastLineLength : lastLineLength + 1,
            });

            activeEditor.focus();
            setInserted(true);
            setTimeout(() => setInserted(false), 2000);
        } catch (err) {
            console.error('Failed to insert code at cursor:', err);
        }
    };

    const sizeClasses: Record<NonNullable<typeof size>, string> = {
        xs: 'px-2 py-0.5 text-[10px] gap-1',
        sm: 'px-3 py-1.5 text-xs gap-1.5',
        md: 'px-4 py-2 text-sm gap-2',
    };

    const iconSizeClass: Record<NonNullable<typeof size>, string> = {
        xs: 'w-2.5 h-2.5',
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
    };

    const iconClass = iconSizeClass[size];
    const btnClasses = sizeClasses[size];

    const canInsert = !!activeEditor && !!code;

    return (
        <div className={`inline-flex items-center gap-2 ${className}`}>
            {/* Copy Button */}
            <button
                onClick={handleCopy}
                disabled={!code}
                className={`inline-flex items-center font-semibold rounded transition-colors
                    ${btnClasses}
                    ${copied
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }
                    ${!code ? 'opacity-50 cursor-not-allowed' : ''}`}
                title="Copy code to clipboard"
            >
                {copied ? (
                    <>
                        <svg viewBox="0 0 12 12" className={iconClass} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 6l3 3 5-5" />
                        </svg>
                        Copied!
                    </>
                ) : (
                    <>
                        <svg viewBox="0 0 12 12" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="4" y="1" width="7" height="8" rx="1" />
                            <path d="M1 4v7h7" />
                        </svg>
                        Copy
                    </>
                )}
            </button>

            {/* Insert Button */}
            {!copyOnly && (
                <button
                    onClick={handleInsert}
                    disabled={!canInsert}
                    className={`inline-flex items-center font-semibold rounded transition-colors
                        ${btnClasses}
                        ${inserted
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }
                        ${!canInsert ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title={canInsert ? 'Insert code at cursor position in active editor' : 'No active editor'}
                >
                    {inserted ? (
                        <>
                            <svg viewBox="0 0 12 12" className={iconClass} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M2 6l3 3 5-5" />
                            </svg>
                            Inserted!
                        </>
                    ) : (
                        <>
                            <svg viewBox="0 0 12 12" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 2v8M10 6H2" />
                            </svg>
                            Insert at Cursor
                        </>
                    )}
                </button>
            )}
        </div>
    );
}
