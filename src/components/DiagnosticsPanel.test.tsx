import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DiagnosticsPanel from './DiagnosticsPanel';
import { createBlock } from '@/test/mocks/sampleData';
import type { DiagnosticsResult, DiagnosticsTask, IgnoredDiagnosticRule } from '@/types';

describe('DiagnosticsPanel', () => {
  it('uses icon buttons for ignore and navigation while the message body stays inert', async () => {
    const user = userEvent.setup();
    const onOpenBlock = vi.fn();
    const onUpdateIgnoredDiagnostics = vi.fn();
    const diagnostics: DiagnosticsResult = {
      issues: [{
        id: 'invalid-jump:b1:missing_label',
        severity: 'error',
        category: 'invalid-jump',
        message: 'Undefined label "missing_label"',
        blockId: 'b1',
        filePath: 'game/script.rpy',
        line: 2,
      }],
      errorCount: 1,
      warningCount: 0,
      infoCount: 0,
    };

    render(
      <DiagnosticsPanel
        diagnostics={diagnostics}
        blocks={[createBlock({ id: 'b1' })]}
        stickyNotes={[]}
        tasks={[]}
        ignoredDiagnostics={[]}
        onUpdateTasks={vi.fn()}
        onUpdateIgnoredDiagnostics={onUpdateIgnoredDiagnostics}
        onOpenBlock={onOpenBlock}
        onHighlightBlock={vi.fn()}
      />
    );

    await user.click(screen.getByText('Undefined label "missing_label"'));

    expect(onOpenBlock).not.toHaveBeenCalled();
    expect(onUpdateIgnoredDiagnostics).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Open script.rpy:2' }));

    expect(onOpenBlock).toHaveBeenCalledWith('b1', 2);

    await user.click(screen.getByRole('button', { name: 'Ignore issue' }));

    expect(onUpdateIgnoredDiagnostics).toHaveBeenCalledWith([
      {
        category: 'invalid-jump',
        filePath: 'game/script.rpy',
        blockId: undefined,
        line: 2,
        message: 'Undefined label "missing_label"',
      } satisfies IgnoredDiagnosticRule,
    ]);
  });

  // ── Default props helper ───────────────────────────────────────────────────

  const emptyDiagnostics: DiagnosticsResult = {
    issues: [],
    errorCount: 0,
    warningCount: 0,
    infoCount: 0,
  };

  const makePanel = (overrides: Partial<Parameters<typeof DiagnosticsPanel>[0]> = {}) =>
    render(
      <DiagnosticsPanel
        diagnostics={emptyDiagnostics}
        blocks={[]}
        stickyNotes={[]}
        tasks={[]}
        ignoredDiagnostics={[]}
        onUpdateTasks={vi.fn()}
        onUpdateIgnoredDiagnostics={vi.fn()}
        onOpenBlock={vi.fn()}
        onHighlightBlock={vi.fn()}
        {...overrides}
      />
    );

  // ── Empty states ───────────────────────────────────────────────────────────

  it('shows "No issues found" empty state when there are no diagnostics', () => {
    makePanel();
    expect(screen.getByText('No issues found')).toBeInTheDocument();
    expect(screen.getByText('Your project looks clean!')).toBeInTheDocument();
  });

  it('shows empty task state when Tasks tab is active and there are no tasks', async () => {
    const user = userEvent.setup();
    makePanel();
    await user.click(screen.getByRole('button', { name: /Tasks/ }));
    expect(screen.getByText('No tasks yet')).toBeInTheDocument();
  });

  // ── Tab switching ──────────────────────────────────────────────────────────

  it('switches to Tasks view when Tasks tab is clicked', async () => {
    const user = userEvent.setup();
    makePanel();
    // Initially Issues view is active
    expect(screen.getByText('No issues found')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Tasks/ }));
    expect(screen.getByText('No tasks yet')).toBeInTheDocument();
    expect(screen.queryByText('No issues found')).not.toBeInTheDocument();
  });

  // ── Issue count badge ──────────────────────────────────────────────────────

  it('shows issues count badge on the Issues tab button', () => {
    const diagnostics: DiagnosticsResult = {
      issues: [
        {
          id: 'syntax:b1:1',
          severity: 'error',
          category: 'syntax',
          message: 'Unexpected token',
          blockId: 'b1',
          filePath: 'game/script.rpy',
          line: 5,
        },
      ],
      errorCount: 1,
      warningCount: 0,
      infoCount: 0,
    };
    makePanel({ diagnostics });
    // The Issues button should show a "1" badge
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('shows open task count badge on Tasks tab button', async () => {
    const user = userEvent.setup();
    const tasks: DiagnosticsTask[] = [
      { id: 'task-1', title: 'Fix intro scene', status: 'open', createdAt: 0 },
      { id: 'task-2', title: 'Add credits', status: 'completed', createdAt: 1 },
    ];
    makePanel({ tasks });
    // 1 open task
    const tasksButton = screen.getByRole('button', { name: /Tasks/ });
    expect(tasksButton).toBeInTheDocument();
    await user.click(tasksButton);
    // badge "1" should appear on the button header
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  // ── Severity filter pills ──────────────────────────────────────────────────

  it('filters issues by severity when an error pill is clicked', async () => {
    const user = userEvent.setup();
    const diagnostics: DiagnosticsResult = {
      issues: [
        {
          id: 'syntax:b1:1',
          severity: 'error',
          category: 'syntax',
          message: 'Syntax error here',
          blockId: 'b1',
          filePath: 'game/script.rpy',
          line: 1,
        },
        {
          id: 'unused-character:b1:0',
          severity: 'warning',
          category: 'unused-character',
          message: 'Character "Alice" is unused',
          blockId: 'b1',
          filePath: 'game/script.rpy',
          line: 2,
        },
      ],
      errorCount: 1,
      warningCount: 1,
      infoCount: 0,
    };
    makePanel({ diagnostics, blocks: [createBlock({ id: 'b1' })] });

    // Both issues visible
    expect(screen.getByText('Syntax error here')).toBeInTheDocument();
    expect(screen.getByText('Character "Alice" is unused')).toBeInTheDocument();

    // Click "Error (1)" filter
    await user.click(screen.getByRole('button', { name: /Error/ }));

    // Only error visible
    expect(screen.getByText('Syntax error here')).toBeInTheDocument();
    expect(screen.queryByText('Character "Alice" is unused')).not.toBeInTheDocument();
  });

  // ── Text filter ────────────────────────────────────────────────────────────

  it('filters issues by text query', async () => {
    const user = userEvent.setup();
    const diagnostics: DiagnosticsResult = {
      issues: [
        {
          id: 'invalid-jump:b1:1',
          severity: 'error',
          category: 'invalid-jump',
          message: 'Undefined label "scene_two"',
          blockId: 'b1',
          filePath: 'game/script.rpy',
          line: 1,
        },
        {
          id: 'missing-image:b1:2',
          severity: 'warning',
          category: 'missing-image',
          message: 'Missing image "bg cafe"',
          blockId: 'b1',
          filePath: 'game/script.rpy',
          line: 2,
        },
      ],
      errorCount: 1,
      warningCount: 1,
      infoCount: 0,
    };
    makePanel({ diagnostics, blocks: [createBlock({ id: 'b1' })] });

    const filterInput = screen.getByPlaceholderText('Filter…');
    await user.type(filterInput, 'cafe');

    expect(screen.queryByText('Undefined label "scene_two"')).not.toBeInTheDocument();
    expect(screen.getByText('Missing image "bg cafe"')).toBeInTheDocument();
  });

  // ── Unignore rule ──────────────────────────────────────────────────────────

  it('calls onUpdateIgnoredDiagnostics without the rule when Unignore is clicked', async () => {
    const user = userEvent.setup();
    const rule: IgnoredDiagnosticRule = {
      category: 'syntax',
      filePath: 'game/script.rpy',
      blockId: undefined,
      line: 5,
      message: 'Unexpected token',
    };
    const onUpdateIgnoredDiagnostics = vi.fn();
    makePanel({ ignoredDiagnostics: [rule], onUpdateIgnoredDiagnostics });

    await user.click(screen.getByRole('button', { name: 'Unignore issue' }));
    expect(onUpdateIgnoredDiagnostics).toHaveBeenCalledWith([]);
  });

  it('shows ignored issues count in the Ignored Issues section', () => {
    const rule: IgnoredDiagnosticRule = {
      category: 'syntax',
      filePath: 'game/script.rpy',
      blockId: undefined,
      line: 5,
      message: 'A suppressed error',
    };
    makePanel({ ignoredDiagnostics: [rule] });
    expect(screen.getByText('Ignored Issues (1)')).toBeInTheDocument();
    expect(screen.getByText('A suppressed error')).toBeInTheDocument();
  });

  // ── Task CRUD ──────────────────────────────────────────────────────────────

  it('adds a task when Add button is clicked', async () => {
    const user = userEvent.setup();
    const onUpdateTasks = vi.fn();
    makePanel({ onUpdateTasks });

    // Switch to Tasks view
    await user.click(screen.getByRole('button', { name: /Tasks/ }));

    const taskInput = screen.getByPlaceholderText('New task… (Enter to add)');
    await user.type(taskInput, 'Write act 3');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(onUpdateTasks).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ title: 'Write act 3', status: 'open' }),
      ])
    );
  });

  it('adds a task when Enter is pressed in the task input', async () => {
    const user = userEvent.setup();
    const onUpdateTasks = vi.fn();
    makePanel({ onUpdateTasks });

    await user.click(screen.getByRole('button', { name: /Tasks/ }));

    const taskInput = screen.getByPlaceholderText('New task… (Enter to add)');
    await user.type(taskInput, 'Polish dialogue{Enter}');

    expect(onUpdateTasks).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ title: 'Polish dialogue', status: 'open' }),
      ])
    );
  });

  it('Add button is disabled when task input is empty', async () => {
    const user = userEvent.setup();
    makePanel();
    await user.click(screen.getByRole('button', { name: /Tasks/ }));
    expect(screen.getByRole('button', { name: 'Add' })).toBeDisabled();
  });

  it('toggles task status between open and completed', async () => {
    const user = userEvent.setup();
    const tasks: DiagnosticsTask[] = [
      { id: 'task-1', title: 'Fix intro', status: 'open', createdAt: 0 },
    ];
    const onUpdateTasks = vi.fn();
    makePanel({ tasks, onUpdateTasks });

    await user.click(screen.getByRole('button', { name: /Tasks/ }));
    expect(screen.getByText('Fix intro')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Mark complete' }));
    expect(onUpdateTasks).toHaveBeenCalledWith([
      expect.objectContaining({ id: 'task-1', status: 'completed' }),
    ]);
  });

  it('toggles completed task back to open', async () => {
    const user = userEvent.setup();
    const tasks: DiagnosticsTask[] = [
      { id: 'task-1', title: 'Fix intro', status: 'completed', createdAt: 0 },
    ];
    const onUpdateTasks = vi.fn();
    makePanel({ tasks, onUpdateTasks });

    await user.click(screen.getByRole('button', { name: /Tasks/ }));
    await user.click(screen.getByRole('button', { name: 'Mark open' }));
    expect(onUpdateTasks).toHaveBeenCalledWith([
      expect.objectContaining({ id: 'task-1', status: 'open' }),
    ]);
  });

  it('deletes a task when delete button is clicked', async () => {
    const user = userEvent.setup();
    const tasks: DiagnosticsTask[] = [
      { id: 'task-1', title: 'Remove this task', status: 'open', createdAt: 0 },
    ];
    const onUpdateTasks = vi.fn();
    makePanel({ tasks, onUpdateTasks });

    await user.click(screen.getByRole('button', { name: /Tasks/ }));
    await user.click(screen.getByRole('button', { name: 'Delete task' }));
    expect(onUpdateTasks).toHaveBeenCalledWith([]);
  });
});
