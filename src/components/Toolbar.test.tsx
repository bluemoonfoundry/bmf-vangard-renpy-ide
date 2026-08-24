import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Toolbar from './Toolbar';
import { useDualPane } from '@/contexts/DualPaneContext';

// Mock the logo import — jsdom can't handle image imports
vi.mock('../vangard.png', () => ({ default: 'logo.png' }));

vi.mock('@/contexts/DualPaneContext', () => ({
  useDualPane: vi.fn(() => ({
    dirtyBlockIds: new Set<string>(),
    dirtyEditors: new Set<string>(),
  })),
}));

describe('Toolbar', () => {
  const createProps = (overrides?: Partial<Parameters<typeof Toolbar>[0]>) => ({
    projectRootPath: '/project',
    activeCanvasType: 'story' as const,
    hasUnsavedSettings: false,
    saveStatus: 'saved' as const,
    canUndo: false,
    canRedo: false,
    undo: vi.fn(),
    redo: vi.fn(),
    addBlock: vi.fn(),
    handleTidyUp: vi.fn(),
    handleSave: vi.fn(),
    onOpenSettings: vi.fn(),
    onOpenShortcuts: vi.fn(),
    onOpenStaticTab: vi.fn(),
    diagnosticsErrorCount: 0,
    onAddStickyNote: vi.fn(),
    isGameRunning: false,
    onRunGame: vi.fn(),
    onWarpToLabel: vi.fn(),
    onStopGame: vi.fn(),
    isRenpyPathValid: true,
    draftingMode: false,
    onToggleDraftingMode: vi.fn(),
    ...overrides,
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders key toolbar buttons', () => {
    render(<Toolbar {...createProps()} />);

    expect(screen.getByTitle('New Scene (N)')).toBeInTheDocument();
    expect(screen.getByTitle('Leave a Note on active canvas')).toBeInTheDocument();
    expect(screen.getByTitle('Organize Story Layout')).toBeInTheDocument();
    expect(screen.getByTitle('Warp to Label...')).toBeInTheDocument();
    expect(screen.getByTitle('Run Project (F5)')).toBeInTheDocument();
  });

  it('disables undo button when canUndo is false', () => {
    render(<Toolbar {...createProps({ canUndo: false })} />);
    const undoBtn = screen.getByTitle('Undo (Ctrl+Z)');
    expect(undoBtn).toBeDisabled();
  });

  it('enables undo button when canUndo is true', () => {
    render(<Toolbar {...createProps({ canUndo: true })} />);
    const undoBtn = screen.getByTitle('Undo (Ctrl+Z)');
    expect(undoBtn).not.toBeDisabled();
  });

  it('disables redo button when canRedo is false', () => {
    render(<Toolbar {...createProps({ canRedo: false })} />);
    const redoBtn = screen.getByTitle('Redo (Ctrl+Y)');
    expect(redoBtn).toBeDisabled();
  });

  it('enables redo button when canRedo is true', () => {
    render(<Toolbar {...createProps({ canRedo: true })} />);
    const redoBtn = screen.getByTitle('Redo (Ctrl+Y)');
    expect(redoBtn).not.toBeDisabled();
  });

  it('calls undo when undo button is clicked', async () => {
    const props = createProps({ canUndo: true });
    const user = userEvent.setup();
    render(<Toolbar {...props} />);

    await user.click(screen.getByTitle('Undo (Ctrl+Z)'));
    expect(props.undo).toHaveBeenCalledTimes(1);
  });

  it('calls redo when redo button is clicked', async () => {
    const props = createProps({ canRedo: true });
    const user = userEvent.setup();
    render(<Toolbar {...props} />);

    await user.click(screen.getByTitle('Redo (Ctrl+Y)'));
    expect(props.redo).toHaveBeenCalledTimes(1);
  });

  it('shows save button as disabled when no unsaved changes', () => {
    render(<Toolbar {...createProps()} />);
    // Save button has a dynamic title that mentions "No changes to save"
    const saveBtn = screen.getByTitle('No changes to save');
    expect(saveBtn).toBeDisabled();
  });

  it('shows save button as enabled when there are unsaved changes', () => {
    vi.mocked(useDualPane).mockReturnValueOnce({
      dirtyBlockIds: new Set(['block-1']),
      dirtyEditors: new Set<string>(),
    } as ReturnType<typeof useDualPane>);
    render(<Toolbar {...createProps()} />);
    const saveBtn = screen.getByTitle(/Save All/);
    expect(saveBtn).not.toBeDisabled();
  });

  it('shows Stop button when game is running', () => {
    render(<Toolbar {...createProps({ isGameRunning: true })} />);
    expect(screen.getByTitle('Stop Game')).toBeInTheDocument();
    expect(screen.queryByTitle('Run Project (F5)')).not.toBeInTheDocument();
  });

  it('shows Run button when game is not running', () => {
    render(<Toolbar {...createProps({ isGameRunning: false })} />);
    expect(screen.getByTitle('Warp to Label...')).toBeInTheDocument();
    expect(screen.getByTitle('Run Project (F5)')).toBeInTheDocument();
    expect(screen.queryByTitle('Stop Game')).not.toBeInTheDocument();
  });

  it('calls warp handler when Warp to Label is clicked', async () => {
    const props = createProps();
    const user = userEvent.setup();
    render(<Toolbar {...props} />);

    await user.click(screen.getByTitle('Warp to Label...'));
    expect(props.onWarpToLabel).toHaveBeenCalledTimes(1);
  });

  it('disables Run button when no project is open', () => {
    render(<Toolbar {...createProps({ projectRootPath: null })} />);
    const runBtn = screen.getByTitle('Run Project (F5)');
    expect(runBtn).toBeDisabled();
  });

  it('keeps Run button enabled with a prompt title when Ren\'Py path is invalid', async () => {
    const props = createProps({ isRenpyPathValid: false });
    const user = userEvent.setup();
    render(<Toolbar {...props} />);
    const runBtn = screen.getByTitle("Configure Ren'Py SDK path (F5)");
    expect(runBtn).not.toBeDisabled();

    await user.click(runBtn);
    expect(props.onRunGame).toHaveBeenCalledTimes(1);
  });

  it('toggles drafting mode when toggle is clicked', async () => {
    const props = createProps({ draftingMode: false });
    const user = userEvent.setup();
    render(<Toolbar {...props} />);

    // Find the drafting mode toggle button (it's next to the "Drafting Mode" text)
    const toggle = screen.getByTitle(/Drafting Mode/);
    await user.click(toggle);
    expect(props.onToggleDraftingMode).toHaveBeenCalledWith(true);
  });

  it('calls addBlock when New Scene is clicked', async () => {
    const props = createProps();
    const user = userEvent.setup();
    render(<Toolbar {...props} />);

    await user.click(screen.getByTitle('New Scene (N)'));
    expect(props.addBlock).toHaveBeenCalledTimes(1);
  });

  it('calls redraw for the active canvas', async () => {
    const props = createProps();
    const user = userEvent.setup();
    render(<Toolbar {...props} />);

    await user.click(screen.getByTitle('Organize Story Layout'));

    expect(props.handleTidyUp).toHaveBeenCalledTimes(1);
  });

  // ── Settings & Shortcuts ─────────────────────────────────────────────────

  it('calls onOpenSettings when Settings button is clicked', async () => {
    const props = createProps();
    const user = userEvent.setup();
    render(<Toolbar {...props} />);

    await user.click(screen.getByTitle('Settings'));
    expect(props.onOpenSettings).toHaveBeenCalledTimes(1);
  });

  it('calls onOpenShortcuts when Keyboard Shortcuts button is clicked', async () => {
    const props = createProps();
    const user = userEvent.setup();
    render(<Toolbar {...props} />);

    await user.click(screen.getByTitle('Keyboard Shortcuts (Ctrl+/)'));
    expect(props.onOpenShortcuts).toHaveBeenCalledTimes(1);
  });

  // ── Sticky note button ──────────────────────────────────────────────────

  it('sticky note button is disabled when onAddStickyNote is null', () => {
    render(<Toolbar {...createProps({ onAddStickyNote: null })} />);
    const btn = screen.getByTitle('Open a canvas to add notes');
    expect(btn).toBeDisabled();
  });

  it('calls onAddStickyNote when sticky note button is clicked', async () => {
    const props = createProps({ onAddStickyNote: vi.fn() });
    const user = userEvent.setup();
    render(<Toolbar {...props} />);

    await user.click(screen.getByTitle('Leave a Note on active canvas'));
    expect(props.onAddStickyNote).toHaveBeenCalledTimes(1);
  });

  // ── Diagnostics error badge ──────────────────────────────────────────────

  it('shows diagnostics error count badge when diagnosticsErrorCount > 0', () => {
    render(<Toolbar {...createProps({ diagnosticsErrorCount: 5 })} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('does not show error badge when diagnosticsErrorCount is 0', () => {
    render(<Toolbar {...createProps({ diagnosticsErrorCount: 0 })} />);
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  // ── Save button behavior ─────────────────────────────────────────────────

  it('calls handleSave when save button is clicked and there are unsaved changes', async () => {
    vi.mocked(useDualPane).mockReturnValueOnce({
      dirtyBlockIds: new Set(['block-1']),
      dirtyEditors: new Set<string>(),
    } as ReturnType<typeof useDualPane>);
    const props = createProps();
    const user = userEvent.setup();
    render(<Toolbar {...props} />);

    const saveBtn = screen.getByTitle(/Save All/);
    await user.click(saveBtn);
    expect(props.handleSave).toHaveBeenCalledTimes(1);
  });

  // ── Run/Stop game ────────────────────────────────────────────────────────

  it('calls onRunGame when Run Project button is clicked', async () => {
    const props = createProps();
    const user = userEvent.setup();
    render(<Toolbar {...props} />);

    await user.click(screen.getByTitle('Run Project (F5)'));
    expect(props.onRunGame).toHaveBeenCalledTimes(1);
  });

  it('calls onStopGame when Stop Game button is clicked', async () => {
    const props = createProps({ isGameRunning: true });
    const user = userEvent.setup();
    render(<Toolbar {...props} />);

    await user.click(screen.getByTitle('Stop Game'));
    expect(props.onStopGame).toHaveBeenCalledTimes(1);
  });

  // ── Canvas switcher ──────────────────────────────────────────────────────

  it('calls onOpenStaticTab with "canvas" when Project Canvas button is clicked', async () => {
    const props = createProps();
    const user = userEvent.setup();
    render(<Toolbar {...props} />);

    await user.click(screen.getByTitle('Project Canvas — bird\'s-eye view of your script files'));
    expect(props.onOpenStaticTab).toHaveBeenCalledWith('canvas');
  });

  it('calls onOpenStaticTab with "route-canvas" when Flow Canvas button is clicked', async () => {
    const props = createProps();
    const user = userEvent.setup();
    render(<Toolbar {...props} />);

    await user.click(screen.getByTitle('Flow Canvas — trace your story\'s narrative flow'));
    expect(props.onOpenStaticTab).toHaveBeenCalledWith('route-canvas');
  });

  it('calls onOpenStaticTab with "choice-canvas" when Choices Canvas button is clicked', async () => {
    const props = createProps();
    const user = userEvent.setup();
    render(<Toolbar {...props} />);

    await user.click(screen.getByTitle('Choices Canvas — player decision tree'));
    expect(props.onOpenStaticTab).toHaveBeenCalledWith('choice-canvas');
  });

  it('calls onOpenStaticTab with "notecard-canvas" when Notecard Canvas button is clicked', async () => {
    const props = createProps();
    const user = userEvent.setup();
    render(<Toolbar {...props} />);

    await user.click(screen.getByLabelText('Notecard Canvas'));
    expect(props.onOpenStaticTab).toHaveBeenCalledWith('notecard-canvas');
  });

  it('disables New Scene button when active canvas is not story', () => {
    render(<Toolbar {...createProps({ activeCanvasType: 'route' })} />);
    const btn = screen.getByTitle('Switch to Project Canvas to add scenes');
    expect(btn).toBeDisabled();
  });

  it('disables Organize Layout button when active canvas is choice', () => {
    render(<Toolbar {...createProps({ activeCanvasType: 'choice' })} />);
    const btn = screen.getByTitle('No active canvas to organize');
    expect(btn).toBeDisabled();
  });

  it('shows Organize Route Layout when active canvas is route', () => {
    render(<Toolbar {...createProps({ activeCanvasType: 'route' })} />);
    expect(screen.getByTitle('Organize Route Layout')).toBeInTheDocument();
  });
});
