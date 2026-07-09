import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import SnippetGridView from './SnippetGridView';
import { installElectronAPI, uninstallElectronAPI } from '@/test/mocks/electronAPI';

const mockCategories = [
  {
    name: 'Test Category 1',
    snippets: [
      {
        title: 'Test Snippet 1',
        description: 'First test snippet',
        code: 'show test1',
      },
      {
        title: 'Test Snippet 2',
        description: 'Second test snippet',
        code: 'show test2',
      },
    ],
  },
  {
    name: 'Test Category 2',
    snippets: [
      {
        title: 'Another Snippet',
        description: 'From second category',
        code: 'hide another',
      },
    ],
  },
];

describe('SnippetGridView', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders all snippet cards', () => {
    render(<SnippetGridView categories={mockCategories} />);
    expect(screen.getByText('Test Snippet 1')).toBeInTheDocument();
    expect(screen.getByText('Test Snippet 2')).toBeInTheDocument();
    expect(screen.getByText('Another Snippet')).toBeInTheDocument();
  });

  it('displays total snippet count', () => {
    render(<SnippetGridView categories={mockCategories} />);
    expect(screen.getByText('3 snippets')).toBeInTheDocument();
  });

  it('renders category filter chips', () => {
    render(<SnippetGridView categories={mockCategories} />);
    const category1Chips = screen.getAllByText('Test Category 1');
    const category2Chips = screen.getAllByText('Test Category 2');
    // Should have at least one chip for each category
    expect(category1Chips.length).toBeGreaterThan(0);
    expect(category2Chips.length).toBeGreaterThan(0);
  });

  it('filters snippets by category when chip is clicked', async () => {
    const user = userEvent.setup();
    render(<SnippetGridView categories={mockCategories} />);

    // Click on "Test Category 1" chip (first one is the filter button)
    const category1Buttons = screen.getAllByText('Test Category 1');
    await user.click(category1Buttons[0]);

    // Should show only 2 snippets from category 1
    expect(screen.getByText('2 snippets (filtered from 3)')).toBeInTheDocument();
    expect(screen.getByText('Test Snippet 1')).toBeInTheDocument();
    expect(screen.getByText('Test Snippet 2')).toBeInTheDocument();
    expect(screen.queryByText('Another Snippet')).not.toBeInTheDocument();
  });

  it('filters snippets by search query', async () => {
    const user = userEvent.setup();
    render(<SnippetGridView categories={mockCategories} />);

    const searchInput = screen.getByPlaceholderText('Search snippets...');
    await user.type(searchInput, 'another');

    // Should show only 1 snippet matching "another"
    expect(screen.getByText('1 snippet (filtered from 3)')).toBeInTheDocument();
    expect(screen.getByText('Another Snippet')).toBeInTheDocument();
    expect(screen.queryByText('Test Snippet 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Test Snippet 2')).not.toBeInTheDocument();
  });

  it('shows clear filters button when filters are active', async () => {
    const user = userEvent.setup();
    render(<SnippetGridView categories={mockCategories} />);

    // No clear button initially
    expect(screen.queryByText('Clear Filters')).not.toBeInTheDocument();

    // Click a category filter (first occurrence is the button)
    const category1Buttons = screen.getAllByText('Test Category 1');
    await user.click(category1Buttons[0]);

    // Clear button should appear
    expect(screen.getByText('Clear Filters')).toBeInTheDocument();
  });

  it('clears all filters when clear button is clicked', async () => {
    const user = userEvent.setup();
    render(<SnippetGridView categories={mockCategories} />);

    // Apply filters (first occurrence is the button)
    const category1Buttons = screen.getAllByText('Test Category 1');
    await user.click(category1Buttons[0]);
    const searchInput = screen.getByPlaceholderText('Search snippets...');
    await user.type(searchInput, 'test');

    expect(screen.getByText(/filtered from 3/)).toBeInTheDocument();

    // Clear filters
    await user.click(screen.getByText('Clear Filters'));

    // Should show all snippets again
    expect(screen.getByText('3 snippets')).toBeInTheDocument();
    expect(searchInput).toHaveValue('');
  });

  it('shows empty state when no snippets match filters', async () => {
    const user = userEvent.setup();
    render(<SnippetGridView categories={mockCategories} />);

    const searchInput = screen.getByPlaceholderText('Search snippets...');
    await user.type(searchInput, 'nonexistent');

    expect(screen.getByText('No snippets found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search or filters')).toBeInTheDocument();
  });

  it('expands snippet code when clicked', async () => {
    const user = userEvent.setup();
    const longCode = 'a'.repeat(100);
    const categories = [
      {
        name: 'Test',
        snippets: [
          {
            title: 'Long Snippet',
            description: 'Has long code',
            code: longCode,
          },
        ],
      },
    ];
    render(<SnippetGridView categories={categories} />);

    // Code should be truncated initially
    expect(screen.getByText(/a+\.\.\./)).toBeInTheDocument();

    // Click to expand
    const codeBlock = screen.getByText(/a+\.\.\./).closest('div');
    if (codeBlock) {
      await user.click(codeBlock);
    }

    // Should show full code now (no truncation)
    expect(screen.getByText(longCode)).toBeInTheDocument();
  });

  it('displays snippet category tags', () => {
    render(<SnippetGridView categories={mockCategories} />);

    const categoryTags = screen.getAllByText(/Test Category \d/);
    expect(categoryTags.length).toBeGreaterThan(0);
  });

  it('renders a sort dropdown defaulting to Alphabetical', () => {
    render(<SnippetGridView categories={mockCategories} />);
    expect(screen.getByLabelText('Sort by:')).toHaveValue('alphabetical');
  });

  it('toggles a snippet favorite and reflects it in the button label', async () => {
    const user = userEvent.setup();
    render(<SnippetGridView categories={mockCategories} />);

    const favoriteButton = screen.getByRole('button', { name: 'Favorite Test Snippet 1' });
    await user.click(favoriteButton);

    expect(screen.getByRole('button', { name: 'Unfavorite Test Snippet 1' })).toBeInTheDocument();
  });

  it('persists favorites across remounts via localStorage', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<SnippetGridView categories={mockCategories} />);
    await user.click(screen.getByRole('button', { name: 'Favorite Test Snippet 1' }));
    unmount();

    render(<SnippetGridView categories={mockCategories} />);
    expect(screen.getByRole('button', { name: 'Unfavorite Test Snippet 1' })).toBeInTheDocument();
  });

  it('shows a copy-count badge after copying, and sorts by Most Copied', async () => {
    const user = userEvent.setup();
    Object.defineProperty(window.navigator, 'clipboard', {
      value: { writeText: async () => {} },
      writable: true,
      configurable: true,
    });
    render(<SnippetGridView categories={mockCategories} />);

    // Copy "Another Snippet" via its copy button (only one CopyButton per card, icon-only).
    const cards = screen.getAllByText(/Test Snippet 1|Test Snippet 2|Another Snippet/);
    const anotherCard = cards.find(el => el.textContent === 'Another Snippet')!.closest('div.p-3')!;
    // Buttons in the card header are [favorite star, copy] in that order.
    const copyButton = anotherCard.querySelectorAll('button')[1] as HTMLElement;
    await user.click(copyButton);

    expect(await screen.findByText('Copied 1×')).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText('Sort by:'), 'mostUsed');
    const grid = screen.getByText('Copied 1×').closest('div.grid, div[class*="grid"]');
    // "Another Snippet" (the only one with a copy count) should now render first.
    const firstCardTitle = document.querySelector('.grid h3')?.textContent;
    expect(firstCardTitle).toBe('Another Snippet');
    expect(grid).toBeTruthy();
  });

  it('renders tag chips and matches tags in search', async () => {
    const user = userEvent.setup();
    const categories = [
      {
        name: 'Tagged',
        snippets: [{ title: 'Tagged Snippet', description: 'desc', code: 'x', tags: ['menu', 'ui'] }],
      },
    ];
    render(<SnippetGridView categories={categories} />);

    expect(screen.getByText('#menu')).toBeInTheDocument();
    expect(screen.getByText('#ui')).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText('Search snippets...');
    await user.type(searchInput, 'menu');
    expect(screen.getByText('Tagged Snippet')).toBeInTheDocument();
  });

  it('shows a hover preview tooltip for truncated code and hides it on mouse leave', async () => {
    const user = userEvent.setup();
    const longCode = 'a'.repeat(100);
    const categories = [{ name: 'Test', snippets: [{ title: 'Long Snippet', description: 'd', code: longCode }] }];
    render(<SnippetGridView categories={categories} />);

    const codeBlock = screen.getByText(/a+\.\.\./).closest('div')!;
    await user.hover(codeBlock);
    expect(screen.getByText(longCode)).toBeInTheDocument();

    await user.unhover(codeBlock);
    expect(screen.queryByText(longCode)).not.toBeInTheDocument();
  });

  it('focuses the search input when "/" is pressed outside a text field', async () => {
    const user = userEvent.setup();
    render(<SnippetGridView categories={mockCategories} />);

    const searchInput = screen.getByPlaceholderText('Search snippets...');
    expect(searchInput).not.toHaveFocus();

    await user.keyboard('/');
    expect(searchInput).toHaveFocus();
  });

  it('clears the search query on Escape while the search input is focused', async () => {
    const user = userEvent.setup();
    render(<SnippetGridView categories={mockCategories} />);

    const searchInput = screen.getByPlaceholderText('Search snippets...');
    await user.click(searchInput);
    await user.type(searchInput, 'test');
    expect(searchInput).toHaveValue('test');

    await user.keyboard('{Escape}');
    expect(searchInput).toHaveValue('');
  });

  describe('export', () => {
    let api: ReturnType<typeof installElectronAPI>;

    beforeEach(() => {
      api = installElectronAPI();
    });

    afterEach(() => {
      uninstallElectronAPI();
    });

    it('shows checkboxes and an Export Selected button once snippets are selected in Select mode', async () => {
      const user = userEvent.setup();
      render(<SnippetGridView categories={mockCategories} />);

      expect(screen.queryByLabelText('Select Test Snippet 1')).not.toBeInTheDocument();
      await user.click(screen.getByRole('button', { name: 'Select' }));

      expect(screen.getByLabelText('Select Test Snippet 1')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /Export Selected/ })).not.toBeInTheDocument();

      await user.click(screen.getByLabelText('Select Test Snippet 1'));
      expect(screen.getByRole('button', { name: 'Export Selected (1)' })).toBeInTheDocument();
    });

    it('calls exportSnippetPack with the selected snippet grouped by category', async () => {
      const user = userEvent.setup();
      api.exportSnippetPack.mockResolvedValue({ success: true, filePath: '/tmp/vangard-snippets.json' });
      render(<SnippetGridView categories={mockCategories} />);

      await user.click(screen.getByRole('button', { name: 'Select' }));
      await user.click(screen.getByLabelText('Select Test Snippet 1'));
      await user.click(screen.getByRole('button', { name: 'Export Selected (1)' }));

      expect(api.exportSnippetPack).toHaveBeenCalledTimes(1);
      const [, content] = api.exportSnippetPack.mock.calls[0];
      const parsed = JSON.parse(content);
      expect(parsed.categories).toEqual([
        { name: 'Test Category 1', snippets: [{ title: 'Test Snippet 1', description: 'First test snippet', code: 'show test1' }] },
      ]);
      expect(await screen.findByText(/Exported 1 snippet/)).toBeInTheDocument();
    });

    it('shows an Export Category button when exactly one category filter is active, and exports it whole', async () => {
      const user = userEvent.setup();
      api.exportSnippetPack.mockResolvedValue({ success: true });
      render(<SnippetGridView categories={mockCategories} />);

      expect(screen.queryByText('Export Category')).not.toBeInTheDocument();
      await user.click(screen.getAllByText('Test Category 1')[0]);
      expect(screen.getByText('Export Category')).toBeInTheDocument();

      await user.click(screen.getByText('Export Category'));
      expect(api.exportSnippetPack).toHaveBeenCalledTimes(1);
      const [, content] = api.exportSnippetPack.mock.calls[0];
      const parsed = JSON.parse(content);
      expect(parsed.categories[0].name).toBe('Test Category 1');
      expect(parsed.categories[0].snippets).toHaveLength(2);
    });

    it('shows an error banner when export fails', async () => {
      const user = userEvent.setup();
      api.exportSnippetPack.mockResolvedValue({ success: false, error: 'Disk full' });
      render(<SnippetGridView categories={mockCategories} />);

      await user.click(screen.getByRole('button', { name: 'Select' }));
      await user.click(screen.getByLabelText('Select Test Snippet 1'));
      await user.click(screen.getByRole('button', { name: 'Export Selected (1)' }));

      expect(await screen.findByText('Disk full')).toBeInTheDocument();
    });
  });
});
