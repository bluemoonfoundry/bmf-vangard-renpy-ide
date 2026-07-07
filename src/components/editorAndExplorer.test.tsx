/**
 * Tests for EditorView and FileExplorerPanel.
 *
 * Both components have heavy external dependencies (Monaco editor,
 * IPC, virtual list). Strategy: mock everything external, then test
 * visible UI rendering and critical user interactions.
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';

// ---------------------------------------------------------------------------
// Monaco: vite.config.ts already aliases monaco-editor → src/test/mocks/monaco.ts
// We only need to mock the @monaco-editor/react wrapper component.
// ---------------------------------------------------------------------------

vi.mock('@monaco-editor/react', () => ({
  default: (_props: Record<string, unknown>) =>
    React.createElement('div', { 'data-testid': 'monaco-editor' }),
  __esModule: true,
}));

// ---------------------------------------------------------------------------
// Lib mocks — textmate, completions, validator, semantic tokens
// ---------------------------------------------------------------------------

vi.mock('@/lib/textmateGrammar', () => ({
  initTextMate: vi.fn(() => Promise.resolve()),
  createTextMateTokensProvider: vi.fn(() => ({})),
}));

vi.mock('@/lib/renpyCompletionProvider', () => ({
  detectContext: vi.fn(() => 'root'),
  getRenpyCompletions: vi.fn(() => []),
  isInsideScreenBlock: vi.fn(() => false),
}));

vi.mock('@/lib/renpyValidator', () => ({
  validateRenpyCode: vi.fn(() => []),
}));

vi.mock('@/lib/renpySemanticTokens', () => ({
  getSemanticTokensLegend: vi.fn(() => ({ tokenTypes: [], tokenModifiers: [] })),
  computeSemanticTokens: vi.fn(() => ({ data: new Uint32Array() })),
  SEMANTIC_DARK_RULES: [],
  SEMANTIC_LIGHT_RULES: [],
}));

vi.mock('@/lib/renpyLabelGuards', () => ({
  collectRenpyHasLabelGuards: vi.fn(() => new Set()),
  isJumpGuardedByHasLabel: vi.fn(() => false),
}));

vi.mock('@/lib/warpTarget', () => ({
  getLabelAtLine: vi.fn(() => null),
}));

// ---------------------------------------------------------------------------
// Heavy sub-component mocks
// ---------------------------------------------------------------------------

vi.mock('@/components/DialoguePreview', () => ({
  default: () => <div data-testid="dialogue-preview" />,
}));

vi.mock('@/components/MenuConstructorModal', () => ({
  MenuConstructorModal: () => null,
}));

vi.mock('@/components/MenuTemplatePickerModal', () => ({
  MenuTemplatePickerModal: () => null,
}));

// ---------------------------------------------------------------------------
// Imports (after mocks)
// ---------------------------------------------------------------------------

import EditorView from '@/components/EditorView';
import FileExplorerPanel from '@/components/FileExplorerPanel';
import { createBlock, createEmptyAnalysisResult } from '@/test/mocks/sampleData';
import type { FileSystemTreeNode, ClipboardState } from '@/types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeFileNode(
  name: string,
  path: string,
  children?: FileSystemTreeNode[]
): FileSystemTreeNode {
  return children !== undefined ? { name, path, children } : { name, path };
}

function makeTree(): FileSystemTreeNode {
  return makeFileNode('game', '/project/game', [
    makeFileNode('script.rpy', '/project/game/script.rpy'),
    makeFileNode('chapter1.rpy', '/project/game/chapter1.rpy'),
    makeFileNode('images', '/project/game/images', [
      makeFileNode('bg_forest.png', '/project/game/images/bg_forest.png'),
    ]),
  ]);
}

// ============================================================================
// FileExplorerPanel
// ============================================================================

describe('FileExplorerPanel', () => {
  const baseProps = {
    tree: makeTree(),
    onFileOpen: vi.fn(),
    onCreateNode: vi.fn(),
    onRenameNode: vi.fn(),
    onDeleteNode: vi.fn(),
    onMoveNode: vi.fn(),
    clipboard: null as ClipboardState,
    onCut: vi.fn(),
    onCopy: vi.fn(),
    onPaste: vi.fn(),
    onCenterOnBlock: vi.fn(),
    onRefresh: vi.fn(),
    selectedPaths: new Set<string>(),
    setSelectedPaths: vi.fn(),
    lastClickedPath: null,
    setLastClickedPath: vi.fn(),
    expandedPaths: new Set<string>(),
    onToggleExpand: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { container } = render(<FileExplorerPanel {...baseProps} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('shows "Project Explorer" heading', () => {
    render(<FileExplorerPanel {...baseProps} />);
    expect(screen.getByText('Project Explorer')).toBeTruthy();
  });

  it('shows "Open a project folder" message when tree is null', () => {
    render(<FileExplorerPanel {...baseProps} tree={null} />);
    expect(screen.getByText(/Open a project folder/i)).toBeTruthy();
  });

  it('renders top-level file names when tree has children', () => {
    render(<FileExplorerPanel {...baseProps} />);
    expect(screen.getByText('script.rpy')).toBeTruthy();
    expect(screen.getByText('chapter1.rpy')).toBeTruthy();
  });

  it('renders top-level directory names', () => {
    render(<FileExplorerPanel {...baseProps} />);
    expect(screen.getByText('images')).toBeTruthy();
  });

  it('does not render children of collapsed folders', () => {
    render(<FileExplorerPanel {...baseProps} />);
    expect(screen.queryByText('bg_forest.png')).toBeNull();
  });

  it('renders children of expanded folders', () => {
    const expandedPaths = new Set(['/project/game/images']);
    render(<FileExplorerPanel {...baseProps} expandedPaths={expandedPaths} />);
    expect(screen.getByText('bg_forest.png')).toBeTruthy();
  });

  it('calls onFileOpen when double-clicking a file node', () => {
    const onFileOpen = vi.fn();
    render(<FileExplorerPanel {...baseProps} onFileOpen={onFileOpen} />);
    const fileEl = screen.getByText('script.rpy');
    fireEvent.doubleClick(fileEl.closest('[title]') || fileEl);
    expect(onFileOpen).toHaveBeenCalledWith('/project/game/script.rpy');
  });

  it('calls onToggleExpand when double-clicking a folder node', () => {
    const onToggleExpand = vi.fn();
    render(<FileExplorerPanel {...baseProps} onToggleExpand={onToggleExpand} />);
    const folderEl = screen.getByText('images');
    fireEvent.doubleClick(folderEl.closest('[title]') || folderEl);
    expect(onToggleExpand).toHaveBeenCalledWith('/project/game/images');
  });

  it('calls setSelectedPaths when clicking a file row', () => {
    const setSelectedPaths = vi.fn();
    render(<FileExplorerPanel {...baseProps} setSelectedPaths={setSelectedPaths} />);
    const fileEl = screen.getByText('script.rpy');
    fireEvent.click(fileEl.closest('[title]') || fileEl);
    expect(setSelectedPaths).toHaveBeenCalled();
  });

  it('applies selected highlight class when path is selected', () => {
    const selectedPaths = new Set(['/project/game/script.rpy']);
    const { container } = render(<FileExplorerPanel {...baseProps} selectedPaths={selectedPaths} />);
    // The selected row should have bg-accent-light class
    const selectedRow = container.querySelector('.bg-accent-light');
    expect(selectedRow).toBeTruthy();
  });

  it('shows context menu when right-clicking a file node', () => {
    render(<FileExplorerPanel {...baseProps} />);
    const fileEl = screen.getByText('script.rpy');
    const row = fileEl.closest('[title]') || fileEl;
    fireEvent.contextMenu(row);
    // Context menu should appear (rendered via portal)
    expect(screen.getByText('Refresh')).toBeTruthy();
  });

  it('clicking the panel outside rows clears selection', () => {
    const setSelectedPaths = vi.fn();
    render(<FileExplorerPanel {...baseProps} setSelectedPaths={setSelectedPaths} />);
    // Click the aside element (top-level container)
    const aside = document.querySelector('aside');
    if (aside) fireEvent.click(aside);
    expect(setSelectedPaths).toHaveBeenCalledWith(new Set());
  });

  it('context menu closes after New File action is triggered', () => {
    render(<FileExplorerPanel {...baseProps} />);
    const fileEl = screen.getByText('script.rpy');
    fireEvent.contextMenu(fileEl.closest('[title]') || fileEl);
    expect(screen.getByText('New File...')).toBeTruthy();
    const newFileBtn = screen.getByText('New File...');
    fireEvent.click(newFileBtn);
    // Context menu should close
    expect(screen.queryByText('New File...')).toBeNull();
  });

  it('shows new-node input inside expanded subfolder after "New File" on folder', () => {
    // Build a tree where the subfolder IS a visible node (child of root)
    const tree: FileSystemTreeNode = makeFileNode('game', '/project/game', [
      makeFileNode('subdir', '/project/game/subdir', [
        makeFileNode('scene.rpy', '/project/game/subdir/scene.rpy'),
      ]),
    ]);
    const expandedPaths = new Set(['/project/game/subdir']);
    render(<FileExplorerPanel {...baseProps} tree={tree} expandedPaths={expandedPaths} />);
    // Right-click the subdir folder (which IS a visible tree node)
    const folderEl = screen.getByText('subdir');
    fireEvent.contextMenu(folderEl.closest('[title]') || folderEl);
    fireEvent.click(screen.getByText('New File...'));
    // After triggering, the input placeholder for new file should appear
    const input = document.querySelector('input[placeholder="new_file.rpy"]');
    expect(input).toBeTruthy();
  });

  it('handles externalAction new-file on a selected node', async () => {
    const setSelectedPaths = vi.fn();
    const onToggleExpand = vi.fn();
    const tree = makeTree();
    const selectedPaths = new Set(['/project/game']);
    const { rerender } = render(
      <FileExplorerPanel
        {...baseProps}
        tree={tree}
        selectedPaths={selectedPaths}
        setSelectedPaths={setSelectedPaths}
        onToggleExpand={onToggleExpand}
        externalAction={{ type: 'new-file', key: 1 }}
      />
    );
    // Should attempt to expand the selected dir
    expect(onToggleExpand).toHaveBeenCalled();
  });
});

// ============================================================================
// EditorView
// ============================================================================

function makeEditorViewProps(overrides = {}) {
  const block = createBlock({ filePath: 'game/script.rpy', content: 'label start:\n    "Hello"\n    return\n' });
  const analysisResult = createEmptyAnalysisResult();
  return {
    block,
    blocks: [block],
    analysisResult,
    onSwitchFocusBlock: vi.fn(),
    onSave: vi.fn(),
    onDirtyChange: vi.fn(),
    editorTheme: 'dark' as const,
    editorFontFamily: 'monospace',
    editorFontSize: 14,
    addToast: vi.fn(),
    onEditorMount: vi.fn(),
    onEditorUnmount: vi.fn(),
    onWarpToLabel: vi.fn(),
    draftingMode: false,
    existingImageTags: new Set<string>(),
    existingAudioPaths: new Set<string>(),
    ...overrides,
  };
}

describe('EditorView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    const props = makeEditorViewProps();
    const { container } = render(<EditorView {...props} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders the Monaco editor stub', () => {
    const props = makeEditorViewProps();
    render(<EditorView {...props} />);
    expect(screen.getByTestId('monaco-editor')).toBeTruthy();
  });

  it('renders the DialoguePreview stub', () => {
    const props = makeEditorViewProps();
    render(<EditorView {...props} />);
    expect(screen.getByTestId('dialogue-preview')).toBeTruthy();
  });

  it('renders breadcrumbs showing the file path', () => {
    const props = makeEditorViewProps();
    render(<EditorView {...props} />);
    // Breadcrumbs split on "/" — last part "script.rpy" should appear
    expect(screen.getByText('script.rpy')).toBeTruthy();
  });

  it('renders breadcrumbs with each path segment', () => {
    const props = makeEditorViewProps();
    render(<EditorView {...props} />);
    expect(screen.getByText('game')).toBeTruthy();
    expect(screen.getByText('script.rpy')).toBeTruthy();
  });

  it('renders with light theme without crashing', () => {
    const props = makeEditorViewProps({ editorTheme: 'light' });
    const { container } = render(<EditorView {...props} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders with draftingMode enabled without crashing', () => {
    const props = makeEditorViewProps({ draftingMode: true });
    const { container } = render(<EditorView {...props} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('calls onEditorUnmount when unmounted', () => {
    const onEditorUnmount = vi.fn();
    const props = makeEditorViewProps({ onEditorUnmount });
    const { unmount } = render(<EditorView {...props} />);
    unmount();
    expect(onEditorUnmount).toHaveBeenCalledWith('block-1');
  });

  it('renders without filePath (no breadcrumbs shown)', () => {
    const block = createBlock({ filePath: undefined });
    const props = makeEditorViewProps({ block });
    const { container } = render(<EditorView {...props} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders with optional callbacks unset without crashing', () => {
    const props = makeEditorViewProps({
      onTriggerSave: undefined,
      onContentChange: undefined,
      onCursorPositionChange: undefined,
    });
    const { container } = render(<EditorView {...props} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('re-renders cleanly when block content changes', () => {
    const props = makeEditorViewProps();
    const { rerender } = render(<EditorView {...props} />);
    const updated = { ...props, block: { ...props.block, content: 'label updated:\n    return\n' } };
    expect(() => rerender(<EditorView {...updated} />)).not.toThrow();
  });
});
