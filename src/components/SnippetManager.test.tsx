import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import SnippetManager from './SnippetManager';
import type { UserSnippet } from '@/types';
import { installElectronAPI, uninstallElectronAPI } from '@/test/mocks/electronAPI';

describe('SnippetManager', () => {
  let api: ReturnType<typeof installElectronAPI>;

  beforeEach(() => {
    api = installElectronAPI();
  });

  afterEach(() => {
    uninstallElectronAPI();
  });
  it('renders built-in snippet categories', async () => {
    render(<SnippetManager />);
    expect(screen.getByText('Snippet Library')).toBeInTheDocument();

    // Wait for snippets to load
    const dialogueCategory = await screen.findAllByText('Dialogue & Narration');
    expect(dialogueCategory[0]).toBeInTheDocument();

    const logicCategory = await screen.findAllByText('Logic & Control Flow');
    expect(logicCategory[0]).toBeInTheDocument();
  });

  it('renders user snippets section when onCreateSnippet is provided', () => {
    render(<SnippetManager onCreateSnippet={vi.fn()} />);
    expect(screen.getByText('My Snippets')).toBeInTheDocument();
    expect(screen.getByText('+ New')).toBeInTheDocument();
  });

  it('does not render user snippets section when no props provided', () => {
    render(<SnippetManager />);
    expect(screen.queryByText('My Snippets')).not.toBeInTheDocument();
  });

  it('renders user snippet entries with edit and delete buttons', () => {
    const snippets: UserSnippet[] = [
      { id: 's1', title: 'My Custom', prefix: 'mycust', description: 'A custom snippet', code: 'show test' },
    ];
    render(
      <SnippetManager
        userSnippets={snippets}
        onCreateSnippet={vi.fn()}
        onEditSnippet={vi.fn()}
        onDeleteSnippet={vi.fn()}
      />
    );
    expect(screen.getByText('My Custom')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('calls onCreateSnippet when + New is clicked', async () => {
    const onCreateSnippet = vi.fn();
    const user = userEvent.setup();
    render(<SnippetManager onCreateSnippet={onCreateSnippet} />);
    await user.click(screen.getByText('+ New'));
    expect(onCreateSnippet).toHaveBeenCalledTimes(1);
  });

  it('calls onEditSnippet with the snippet when Edit is clicked', async () => {
    const onEditSnippet = vi.fn();
    const snippet: UserSnippet = { id: 's1', title: 'Test', prefix: 'tst', description: '', code: 'pass' };
    const user = userEvent.setup();
    render(
      <SnippetManager
        userSnippets={[snippet]}
        onCreateSnippet={vi.fn()}
        onEditSnippet={onEditSnippet}
        onDeleteSnippet={vi.fn()}
      />
    );
    await user.click(screen.getByText('Edit'));
    expect(onEditSnippet).toHaveBeenCalledWith(snippet);
  });

  it('calls onDeleteSnippet after confirmation when Delete is clicked', async () => {
    const onDeleteSnippet = vi.fn();
    const snippet: UserSnippet = { id: 's1', title: 'Test', prefix: 'tst', description: '', code: 'pass' };
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    render(
      <SnippetManager
        userSnippets={[snippet]}
        onCreateSnippet={vi.fn()}
        onEditSnippet={vi.fn()}
        onDeleteSnippet={onDeleteSnippet}
      />
    );
    await user.click(screen.getByText('Delete'));
    expect(window.confirm).toHaveBeenCalled();
    expect(onDeleteSnippet).toHaveBeenCalledWith('s1');
    vi.restoreAllMocks();
  });

  it('does not call onDeleteSnippet when confirmation is cancelled', async () => {
    const onDeleteSnippet = vi.fn();
    const snippet: UserSnippet = { id: 's1', title: 'Test', prefix: 'tst', description: '', code: 'pass' };
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    render(
      <SnippetManager
        userSnippets={[snippet]}
        onCreateSnippet={vi.fn()}
        onEditSnippet={vi.fn()}
        onDeleteSnippet={onDeleteSnippet}
      />
    );
    await user.click(screen.getByText('Delete'));
    expect(onDeleteSnippet).not.toHaveBeenCalled();
    vi.restoreAllMocks();
  });

  it('shows empty state message when no user snippets exist', () => {
    render(<SnippetManager userSnippets={[]} onCreateSnippet={vi.fn()} />);
    expect(screen.getByText(/No custom snippets yet/)).toBeInTheDocument();
  });

  it('shows a warning banner when a snippet source file fails schema validation', async () => {
    api.readUserGlobalSnippets.mockResolvedValue(JSON.stringify({ categories: [{ name: 'Broken', snippets: [{ title: '' }] }] }));

    render(<SnippetManager />);

    expect(await screen.findByText(/Some snippet files were skipped due to invalid content/)).toBeInTheDocument();
  });

  describe('import', () => {
    it('does nothing when the import dialog is canceled', async () => {
      const user = userEvent.setup();
      api.importSnippetPack.mockResolvedValue({ success: false, canceled: true });
      render(<SnippetManager />);

      await user.click(screen.getByText('Import Pack...'));
      expect(api.writeUserGlobalSnippets).not.toHaveBeenCalled();
    });

    it('shows an error when the imported file fails schema validation', async () => {
      const user = userEvent.setup();
      api.importSnippetPack.mockResolvedValue({
        success: true,
        filePath: '/tmp/pack.json',
        content: JSON.stringify({ categories: [{ name: 'Broken', snippets: [{ title: '' }] }] }),
      });
      render(<SnippetManager />);

      await user.click(screen.getByText('Import Pack...'));
      expect(await screen.findByText(/Invalid snippet pack/)).toBeInTheDocument();
      expect(api.writeUserGlobalSnippets).not.toHaveBeenCalled();
    });

    it('merges a valid pack into custom.json and reloads', async () => {
      const user = userEvent.setup();
      api.readUserGlobalSnippets.mockResolvedValue(
        JSON.stringify({ version: '1.0', categories: [{ name: 'Existing', snippets: [{ title: 'Old', description: '', code: 'old' }] }] })
      );
      api.importSnippetPack.mockResolvedValue({
        success: true,
        filePath: '/tmp/pack.json',
        content: JSON.stringify({
          version: '1.0',
          categories: [{ name: 'Shared Pack', snippets: [{ title: 'New', description: 'desc', code: 'new' }] }],
        }),
      });
      api.writeUserGlobalSnippets.mockResolvedValue({ success: true });

      render(<SnippetManager />);
      await user.click(screen.getByText('Import Pack...'));

      expect(await screen.findByText(/Imported 1 snippet/)).toBeInTheDocument();
      expect(api.writeUserGlobalSnippets).toHaveBeenCalledTimes(1);
      const written = JSON.parse(api.writeUserGlobalSnippets.mock.calls[0][0]);
      const categoryNames = written.categories.map((c: { name: string }) => c.name);
      expect(categoryNames).toContain('Existing');
      expect(categoryNames).toContain('Shared Pack');
    });

    it('shows an error when the picked file is not valid JSON', async () => {
      const user = userEvent.setup();
      api.importSnippetPack.mockResolvedValue({ success: true, filePath: '/tmp/pack.json', content: '{ not json' });
      render(<SnippetManager />);

      await user.click(screen.getByText('Import Pack...'));
      expect(await screen.findByText(/Invalid JSON/)).toBeInTheDocument();
    });
  });
});
