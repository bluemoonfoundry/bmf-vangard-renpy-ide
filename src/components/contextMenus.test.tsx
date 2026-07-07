/**
 * Tests for context menu components:
 * CanvasContextMenu, CanvasNodeContextMenu, FileExplorerContextMenu,
 * ImageContextMenu, AudioContextMenu, TabContextMenu
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import CanvasContextMenu from '@/components/CanvasContextMenu';
import CanvasNodeContextMenu from '@/components/CanvasNodeContextMenu';
import FileExplorerContextMenu from '@/components/FileExplorerContextMenu';
import ImageContextMenu from '@/components/ImageContextMenu';
import AudioContextMenu from '@/components/AudioContextMenu';
import TabContextMenu from '@/components/TabContextMenu';
import { DualPaneContext } from '@/contexts/DualPaneContext';
import type { FileSystemTreeNode, ClipboardState } from '@/types';

// ─── DualPaneContext mock helper ───────────────────────────────────────────────

function makeDualPaneContext(overrides: Record<string, unknown> = {}) {
  return {
    splitLayout: 'none' as const,
    // tab management stubs
    primaryTabs: [],
    secondaryTabs: [],
    activePrimaryTabId: null,
    activeSecondaryTabId: null,
    setPrimaryTabs: vi.fn(),
    setSecondaryTabs: vi.fn(),
    setActivePrimaryTabId: vi.fn(),
    setActiveSecondaryTabId: vi.fn(),
    // tab lifecycle stubs
    handleCloseTab: vi.fn(),
    handleCloseAll: vi.fn(),
    handleCloseOthers: vi.fn(),
    handleCloseLeft: vi.fn(),
    handleCloseRight: vi.fn(),
    handleSplitRight: vi.fn(),
    handleSplitBottom: vi.fn(),
    handleMoveToOtherPane: vi.fn(),
    handleTabContextMenu: vi.fn(),
    // opener stubs
    openTab: vi.fn(),
    openTabInPane: vi.fn(),
    // dirty tracking stubs
    dirtyBlockIds: new Set<string>(),
    dirtyEditors: new Set<string>(),
    setDirtyBlockIds: vi.fn(),
    setDirtyEditors: vi.fn(),
    dirtyBlockIdsRef: { current: new Set<string>() },
    dirtyEditorsRef: { current: new Set<string>() },
    ...overrides,
  } as unknown as import('@/contexts/DualPaneContext').DualPaneContextValue;
}

function renderWithDualPane(ui: React.ReactElement, overrides: Record<string, unknown> = {}) {
  const ctx = makeDualPaneContext(overrides);
  return render(
    <DualPaneContext.Provider value={ctx}>{ui}</DualPaneContext.Provider>
  );
}

// ─── CanvasContextMenu ────────────────────────────────────────────────────────

describe('CanvasContextMenu', () => {
  const baseProps = {
    x: 100,
    y: 200,
    onClose: vi.fn(),
    onCreateBlock: vi.fn(),
    onAddStickyNote: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { baseElement } = render(<CanvasContextMenu {...baseProps} />);
    expect(baseElement).toBeTruthy();
  });

  it('shows Create New section with block type buttons when onCreateBlock is provided', () => {
    render(<CanvasContextMenu {...baseProps} />);
    expect(screen.getByText('Story Block')).toBeTruthy();
    expect(screen.getByText('Screen Block')).toBeTruthy();
    expect(screen.getByText('Config Block')).toBeTruthy();
  });

  it('shows Sticky Note button', () => {
    render(<CanvasContextMenu {...baseProps} />);
    expect(screen.getByText('Sticky Note')).toBeTruthy();
  });

  it('does not show block type buttons when onCreateBlock is not provided', () => {
    const { onCreateBlock: _, ...propsWithoutCreate } = baseProps;
    render(<CanvasContextMenu {...propsWithoutCreate} />);
    expect(screen.queryByText('Story Block')).toBeNull();
    expect(screen.queryByText('Screen Block')).toBeNull();
    expect(screen.queryByText('Config Block')).toBeNull();
  });

  it('calls onCreateBlock with "story" when Story Block is clicked', () => {
    const onCreateBlock = vi.fn();
    const onClose = vi.fn();
    render(<CanvasContextMenu {...baseProps} onCreateBlock={onCreateBlock} onClose={onClose} />);
    fireEvent.click(screen.getByText('Story Block'));
    expect(onCreateBlock).toHaveBeenCalledWith('story');
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onCreateBlock with "screen" when Screen Block is clicked', () => {
    const onCreateBlock = vi.fn();
    const onClose = vi.fn();
    render(<CanvasContextMenu {...baseProps} onCreateBlock={onCreateBlock} onClose={onClose} />);
    fireEvent.click(screen.getByText('Screen Block'));
    expect(onCreateBlock).toHaveBeenCalledWith('screen');
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onCreateBlock with "config" when Config Block is clicked', () => {
    const onCreateBlock = vi.fn();
    const onClose = vi.fn();
    render(<CanvasContextMenu {...baseProps} onCreateBlock={onCreateBlock} onClose={onClose} />);
    fireEvent.click(screen.getByText('Config Block'));
    expect(onCreateBlock).toHaveBeenCalledWith('config');
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onAddStickyNote and onClose when Sticky Note is clicked', () => {
    const onAddStickyNote = vi.fn();
    const onClose = vi.fn();
    render(<CanvasContextMenu {...baseProps} onAddStickyNote={onAddStickyNote} onClose={onClose} />);
    fireEvent.click(screen.getByText('Sticky Note'));
    expect(onAddStickyNote).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when clicking outside the menu', () => {
    const onClose = vi.fn();
    render(<CanvasContextMenu {...baseProps} onClose={onClose} />);
    fireEvent.mouseDown(document.body);
    expect(onClose).toHaveBeenCalled();
  });
});

// ─── CanvasNodeContextMenu ────────────────────────────────────────────────────

describe('CanvasNodeContextMenu', () => {
  const baseProps = {
    x: 50,
    y: 60,
    label: 'start',
    onClose: vi.fn(),
    onOpenEditor: vi.fn(),
    onWarpToHere: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { baseElement } = render(<CanvasNodeContextMenu {...baseProps} />);
    expect(baseElement).toBeTruthy();
  });

  it('displays the label name', () => {
    render(<CanvasNodeContextMenu {...baseProps} />);
    expect(screen.getByText('start')).toBeTruthy();
  });

  it('shows Open in editor and Warp to here buttons', () => {
    render(<CanvasNodeContextMenu {...baseProps} />);
    expect(screen.getByText('Open in editor')).toBeTruthy();
    expect(screen.getByText('Warp to here')).toBeTruthy();
  });

  it('does not show Set as root when onSetAsRoot is not provided', () => {
    render(<CanvasNodeContextMenu {...baseProps} />);
    expect(screen.queryByText('Set as root')).toBeNull();
  });

  it('shows Set as root when onSetAsRoot is provided', () => {
    render(<CanvasNodeContextMenu {...baseProps} onSetAsRoot={vi.fn()} />);
    expect(screen.getByText('Set as root')).toBeTruthy();
  });

  it('calls onOpenEditor and onClose when Open in editor is clicked', () => {
    const onOpenEditor = vi.fn();
    const onClose = vi.fn();
    render(<CanvasNodeContextMenu {...baseProps} onOpenEditor={onOpenEditor} onClose={onClose} />);
    fireEvent.click(screen.getByText('Open in editor'));
    expect(onOpenEditor).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onWarpToHere and onClose when Warp to here is clicked', () => {
    const onWarpToHere = vi.fn();
    const onClose = vi.fn();
    render(<CanvasNodeContextMenu {...baseProps} onWarpToHere={onWarpToHere} onClose={onClose} />);
    fireEvent.click(screen.getByText('Warp to here'));
    expect(onWarpToHere).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onSetAsRoot and onClose when Set as root is clicked', () => {
    const onSetAsRoot = vi.fn();
    const onClose = vi.fn();
    render(<CanvasNodeContextMenu {...baseProps} onSetAsRoot={onSetAsRoot} onClose={onClose} />);
    fireEvent.click(screen.getByText('Set as root'));
    expect(onSetAsRoot).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when clicking outside the menu', () => {
    const onClose = vi.fn();
    render(<CanvasNodeContextMenu {...baseProps} onClose={onClose} />);
    fireEvent.mouseDown(document.body);
    expect(onClose).toHaveBeenCalled();
  });
});

// ─── FileExplorerContextMenu ──────────────────────────────────────────────────

function makeFileNode(overrides: Partial<FileSystemTreeNode> = {}): FileSystemTreeNode {
  return {
    name: 'script.rpy',
    path: '/project/game/script.rpy',
    ...overrides,
  };
}

function makeDirNode(overrides: Partial<FileSystemTreeNode> = {}): FileSystemTreeNode {
  return {
    name: 'game',
    path: '/project/game',
    children: [],
    ...overrides,
  };
}

describe('FileExplorerContextMenu', () => {
  const baseProps = {
    x: 10,
    y: 20,
    node: makeFileNode(),
    clipboard: null as ClipboardState,
    selectionSize: 1,
    onClose: vi.fn(),
    onRefresh: vi.fn(),
    onNewFile: vi.fn(),
    onNewFolder: vi.fn(),
    onRename: vi.fn(),
    onDelete: vi.fn(),
    onCut: vi.fn(),
    onCopy: vi.fn(),
    onPaste: vi.fn(),
    onCenterOnBlock: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { container } = render(<FileExplorerContextMenu {...baseProps} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('shows all core action buttons', () => {
    render(<FileExplorerContextMenu {...baseProps} />);
    expect(screen.getByText('Refresh')).toBeTruthy();
    expect(screen.getByText('New File...')).toBeTruthy();
    expect(screen.getByText('New Folder...')).toBeTruthy();
    expect(screen.getByText('Rename')).toBeTruthy();
    expect(screen.getByText('Cut')).toBeTruthy();
    expect(screen.getByText(/Copy/)).toBeTruthy();
    expect(screen.getByText('Paste')).toBeTruthy();
  });

  it('shows Center on Canvas for .rpy files with single selection', () => {
    render(<FileExplorerContextMenu {...baseProps} />);
    expect(screen.getByText('Center on Canvas')).toBeTruthy();
  });

  it('does not show Center on Canvas for non-.rpy files', () => {
    render(<FileExplorerContextMenu {...baseProps} node={makeFileNode({ name: 'readme.txt', path: '/project/readme.txt' })} />);
    expect(screen.queryByText('Center on Canvas')).toBeNull();
  });

  it('does not show Center on Canvas when selectionSize > 1', () => {
    render(<FileExplorerContextMenu {...baseProps} selectionSize={3} />);
    expect(screen.queryByText('Center on Canvas')).toBeNull();
  });

  it('calls onRefresh with node.path when Refresh is clicked', () => {
    const onRefresh = vi.fn();
    const onClose = vi.fn();
    render(<FileExplorerContextMenu {...baseProps} onRefresh={onRefresh} onClose={onClose} />);
    fireEvent.click(screen.getByText('Refresh'));
    expect(onRefresh).toHaveBeenCalledWith('/project/game/script.rpy');
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onNewFile with correct path for a file node', () => {
    const onNewFile = vi.fn();
    const onClose = vi.fn();
    render(<FileExplorerContextMenu {...baseProps} onNewFile={onNewFile} onClose={onClose} />);
    fireEvent.click(screen.getByText('New File...'));
    expect(onNewFile).toHaveBeenCalledWith('/project/game');
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onNewFile with directory path for a directory node', () => {
    const onNewFile = vi.fn();
    const onClose = vi.fn();
    render(<FileExplorerContextMenu {...baseProps} node={makeDirNode()} onNewFile={onNewFile} onClose={onClose} />);
    fireEvent.click(screen.getByText('New File...'));
    expect(onNewFile).toHaveBeenCalledWith('/project/game');
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onRename with node.path when Rename is clicked', () => {
    const onRename = vi.fn();
    const onClose = vi.fn();
    render(<FileExplorerContextMenu {...baseProps} onRename={onRename} onClose={onClose} />);
    fireEvent.click(screen.getByText('Rename'));
    expect(onRename).toHaveBeenCalledWith('/project/game/script.rpy');
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onDelete and onClose when Delete is clicked', () => {
    const onDelete = vi.fn();
    const onClose = vi.fn();
    render(<FileExplorerContextMenu {...baseProps} onDelete={onDelete} onClose={onClose} />);
    fireEvent.click(screen.getByText(/Delete/));
    expect(onDelete).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onCut and onClose when Cut is clicked', () => {
    const onCut = vi.fn();
    const onClose = vi.fn();
    render(<FileExplorerContextMenu {...baseProps} onCut={onCut} onClose={onClose} />);
    fireEvent.click(screen.getByText('Cut'));
    expect(onCut).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('Paste button is disabled when clipboard is null', () => {
    render(<FileExplorerContextMenu {...baseProps} clipboard={null} />);
    const pasteBtn = screen.getByText('Paste').closest('button');
    expect(pasteBtn).toBeTruthy();
    expect(pasteBtn?.disabled).toBe(true);
  });

  it('Paste button is enabled when clipboard has content', () => {
    const clipboard: ClipboardState = { type: 'copy', paths: new Set(['/project/game/script.rpy']) };
    render(<FileExplorerContextMenu {...baseProps} clipboard={clipboard} />);
    const pasteBtn = screen.getByText('Paste').closest('button');
    expect(pasteBtn?.disabled).toBe(false);
  });

  it('shows multi-item label in Delete/Cut/Copy for selectionSize > 1', () => {
    render(<FileExplorerContextMenu {...baseProps} selectionSize={3} />);
    expect(screen.getByText(/Delete 3 Items/)).toBeTruthy();
    expect(screen.getByText(/Cut 3 Items/)).toBeTruthy();
    expect(screen.getByText(/Copy 3 Items/)).toBeTruthy();
  });

  it('calls onClose when clicking outside the menu', () => {
    const onClose = vi.fn();
    render(<FileExplorerContextMenu {...baseProps} onClose={onClose} />);
    fireEvent.mouseDown(document.body);
    expect(onClose).toHaveBeenCalled();
  });
});

// ─── ImageContextMenu ─────────────────────────────────────────────────────────

describe('ImageContextMenu', () => {
  const baseProps = {
    x: 30,
    y: 40,
    imageTag: 'bg_forest',
    onSelect: vi.fn(),
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { container } = render(<ImageContextMenu {...baseProps} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('displays the image tag', () => {
    render(<ImageContextMenu {...baseProps} />);
    expect(screen.getByText('bg_forest')).toBeTruthy();
  });

  it('shows Insert Image heading', () => {
    render(<ImageContextMenu {...baseProps} />);
    expect(screen.getByText('Insert Image:')).toBeTruthy();
  });

  it('shows scene and show action buttons', () => {
    render(<ImageContextMenu {...baseProps} />);
    expect(screen.getByText(/Add `scene` statement/)).toBeTruthy();
    expect(screen.getByText(/Add `show` statement/)).toBeTruthy();
  });

  it('calls onSelect("scene") when scene button is clicked', () => {
    const onSelect = vi.fn();
    render(<ImageContextMenu {...baseProps} onSelect={onSelect} />);
    fireEvent.click(screen.getByText(/Add `scene` statement/));
    expect(onSelect).toHaveBeenCalledWith('scene');
  });

  it('calls onSelect("show") when show button is clicked', () => {
    const onSelect = vi.fn();
    render(<ImageContextMenu {...baseProps} onSelect={onSelect} />);
    fireEvent.click(screen.getByText(/Add `show` statement/));
    expect(onSelect).toHaveBeenCalledWith('show');
  });

  it('calls onClose when clicking outside the menu', () => {
    const onClose = vi.fn();
    render(<ImageContextMenu {...baseProps} onClose={onClose} />);
    fireEvent.mouseDown(document.body);
    expect(onClose).toHaveBeenCalled();
  });
});

// ─── AudioContextMenu ─────────────────────────────────────────────────────────

describe('AudioContextMenu', () => {
  const baseProps = {
    x: 50,
    y: 60,
    filePath: 'audio/bgm.ogg',
    onSelect: vi.fn(),
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { container } = render(<AudioContextMenu {...baseProps} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('displays the file path', () => {
    render(<AudioContextMenu {...baseProps} />);
    expect(screen.getByText('audio/bgm.ogg')).toBeTruthy();
  });

  it('shows Insert Audio heading', () => {
    render(<AudioContextMenu {...baseProps} />);
    expect(screen.getByText('Insert Audio:')).toBeTruthy();
  });

  it('shows play and queue action buttons', () => {
    render(<AudioContextMenu {...baseProps} />);
    expect(screen.getByText(/Copy `play audio`/)).toBeTruthy();
    expect(screen.getByText(/Copy `queue audio`/)).toBeTruthy();
  });

  it('calls onSelect("play") when play button is clicked', () => {
    const onSelect = vi.fn();
    render(<AudioContextMenu {...baseProps} onSelect={onSelect} />);
    fireEvent.click(screen.getByText(/Copy `play audio`/));
    expect(onSelect).toHaveBeenCalledWith('play');
  });

  it('calls onSelect("queue") when queue button is clicked', () => {
    const onSelect = vi.fn();
    render(<AudioContextMenu {...baseProps} onSelect={onSelect} />);
    fireEvent.click(screen.getByText(/Copy `queue audio`/));
    expect(onSelect).toHaveBeenCalledWith('queue');
  });

  it('calls onClose when clicking outside the menu', () => {
    const onClose = vi.fn();
    render(<AudioContextMenu {...baseProps} onClose={onClose} />);
    fireEvent.mouseDown(document.body);
    expect(onClose).toHaveBeenCalled();
  });
});

// ─── TabContextMenu ───────────────────────────────────────────────────────────

describe('TabContextMenu', () => {
  const baseProps = {
    x: 100,
    y: 50,
    tabId: 'tab-1',
    paneId: 'primary' as const,
    onClose: vi.fn(),
    onCloseTab: vi.fn(),
    onCloseOthers: vi.fn(),
    onCloseLeft: vi.fn(),
    onCloseRight: vi.fn(),
    onCloseAll: vi.fn(),
    onSplitRight: vi.fn(),
    onSplitBottom: vi.fn(),
    onMoveToOtherPane: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    renderWithDualPane(<TabContextMenu {...baseProps} />);
    expect(screen.getByText('Close')).toBeTruthy();
  });

  it('shows all close action buttons', () => {
    renderWithDualPane(<TabContextMenu {...baseProps} />);
    expect(screen.getByText('Close')).toBeTruthy();
    expect(screen.getByText('Close Others')).toBeTruthy();
    expect(screen.getByText('Close to the Left')).toBeTruthy();
    expect(screen.getByText('Close to the Right')).toBeTruthy();
    expect(screen.getByText('Close All')).toBeTruthy();
  });

  it('shows split options when splitLayout is "none" and tab is not protected', () => {
    renderWithDualPane(<TabContextMenu {...baseProps} />, { splitLayout: 'none' });
    expect(screen.getByText('Open in Split Right')).toBeTruthy();
    expect(screen.getByText('Open in Split Bottom')).toBeTruthy();
  });

  it('does not show split options when splitLayout is not "none"', () => {
    renderWithDualPane(<TabContextMenu {...baseProps} />, { splitLayout: 'right' });
    expect(screen.queryByText('Open in Split Right')).toBeNull();
    expect(screen.queryByText('Open in Split Bottom')).toBeNull();
  });

  it('shows Move to Secondary Pane when splitLayout is not "none" and paneId is primary', () => {
    renderWithDualPane(<TabContextMenu {...baseProps} paneId="primary" />, { splitLayout: 'right' });
    expect(screen.getByText('Move to Secondary Pane')).toBeTruthy();
  });

  it('shows Move to Primary Pane when paneId is secondary', () => {
    renderWithDualPane(<TabContextMenu {...baseProps} paneId="secondary" />, { splitLayout: 'right' });
    expect(screen.getByText('Move to Primary Pane')).toBeTruthy();
  });

  it('calls onCloseTab with tabId and calls onClose when Close is clicked', () => {
    const onCloseTab = vi.fn();
    const onClose = vi.fn();
    renderWithDualPane(<TabContextMenu {...baseProps} onCloseTab={onCloseTab} onClose={onClose} />);
    fireEvent.click(screen.getByText('Close'));
    expect(onCloseTab).toHaveBeenCalledWith('tab-1');
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onCloseOthers with tabId when Close Others is clicked', () => {
    const onCloseOthers = vi.fn();
    const onClose = vi.fn();
    renderWithDualPane(<TabContextMenu {...baseProps} onCloseOthers={onCloseOthers} onClose={onClose} />);
    fireEvent.click(screen.getByText('Close Others'));
    expect(onCloseOthers).toHaveBeenCalledWith('tab-1');
  });

  it('calls onCloseLeft with tabId when Close to the Left is clicked', () => {
    const onCloseLeft = vi.fn();
    renderWithDualPane(<TabContextMenu {...baseProps} onCloseLeft={onCloseLeft} />);
    fireEvent.click(screen.getByText('Close to the Left'));
    expect(onCloseLeft).toHaveBeenCalledWith('tab-1');
  });

  it('calls onCloseRight with tabId when Close to the Right is clicked', () => {
    const onCloseRight = vi.fn();
    renderWithDualPane(<TabContextMenu {...baseProps} onCloseRight={onCloseRight} />);
    fireEvent.click(screen.getByText('Close to the Right'));
    expect(onCloseRight).toHaveBeenCalledWith('tab-1');
  });

  it('calls onCloseAll when Close All is clicked', () => {
    const onCloseAll = vi.fn();
    const onClose = vi.fn();
    renderWithDualPane(<TabContextMenu {...baseProps} onCloseAll={onCloseAll} onClose={onClose} />);
    fireEvent.click(screen.getByText('Close All'));
    expect(onCloseAll).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onSplitRight with tabId when Open in Split Right is clicked', () => {
    const onSplitRight = vi.fn();
    const onClose = vi.fn();
    renderWithDualPane(
      <TabContextMenu {...baseProps} onSplitRight={onSplitRight} onClose={onClose} />,
      { splitLayout: 'none' }
    );
    fireEvent.click(screen.getByText('Open in Split Right'));
    expect(onSplitRight).toHaveBeenCalledWith('tab-1');
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onMoveToOtherPane with tabId when Move to Pane is clicked', () => {
    const onMoveToOtherPane = vi.fn();
    const onClose = vi.fn();
    renderWithDualPane(
      <TabContextMenu {...baseProps} onMoveToOtherPane={onMoveToOtherPane} onClose={onClose} />,
      { splitLayout: 'right' }
    );
    fireEvent.click(screen.getByText('Move to Secondary Pane'));
    expect(onMoveToOtherPane).toHaveBeenCalledWith('tab-1');
    expect(onClose).toHaveBeenCalled();
  });

  it('disables Close when tabId is "canvas"', () => {
    renderWithDualPane(<TabContextMenu {...baseProps} tabId="canvas" />);
    const closeBtn = screen.getByText('Close').closest('button');
    expect(closeBtn?.disabled).toBe(true);
  });

  it('does not show split options for protected "canvas" tab', () => {
    renderWithDualPane(<TabContextMenu {...baseProps} tabId="canvas" />, { splitLayout: 'none' });
    expect(screen.queryByText('Open in Split Right')).toBeNull();
    expect(screen.queryByText('Open in Split Bottom')).toBeNull();
  });

  it('calls onClose when clicking outside the menu', () => {
    const onClose = vi.fn();
    renderWithDualPane(<TabContextMenu {...baseProps} onClose={onClose} />);
    fireEvent.mouseDown(document.body);
    expect(onClose).toHaveBeenCalled();
  });
});
