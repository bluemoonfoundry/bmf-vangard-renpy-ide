import { vi } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import StatsView from './StatsView';
import { createBlock, createCharacter, createEmptyAnalysisResult, createVariable } from '@/test/mocks/sampleData';

// recharts ResponsiveContainer requires a real layout measurement to render children.
// In jsdom all elements have 0 width/height, so stub it to just render children directly.
vi.mock('recharts', async () => {
  const actual = await vi.importActual<typeof import('recharts')>('recharts');
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  };
});

const emptyRoute = {
  labelNodes: [],
  routeLinks: [],
  identifiedRoutes: [],
  routesTruncated: false,
};

function renderStats(overrides: Partial<React.ComponentProps<typeof StatsView>> = {}) {
  const props: React.ComponentProps<typeof StatsView> = {
    blocks: [createBlock()],
    analysisResult: createEmptyAnalysisResult(),
    routeAnalysisResult: emptyRoute,
    projectImages: new Map(),
    imageMetadata: new Map(),
    projectAudios: new Map(),
    diagnosticsErrorCount: 0,
    onOpenDiagnostics: vi.fn(),
    ...overrides,
  };
  return { ...render(<StatsView {...props} />), props };
}

describe('StatsView', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  // ── Empty state ─────────────────────────────────────────────────────────────

  it('shows empty state when no blocks are loaded', () => {
    renderStats({ blocks: [] });
    expect(screen.getByText('No script loaded yet')).toBeInTheDocument();
    expect(screen.queryByText('Script Statistics')).not.toBeInTheDocument();
  });

  // ── Structure section (synchronous) ─────────────────────────────────────────

  it('renders script file count', () => {
    renderStats({ blocks: [createBlock(), createBlock({ id: 'block-2', filePath: 'game/ch2.rpy' })] });
    expect(screen.getByText('Script Files')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders label count from analysisResult', () => {
    const analysisResult = createEmptyAnalysisResult({
      labels: {
        start: { blockId: 'block-1', label: 'start', line: 1, column: 7, type: 'label' },
        intro: { blockId: 'block-1', label: 'intro', line: 5, column: 7, type: 'label' },
        ending: { blockId: 'block-1', label: 'ending', line: 10, column: 7, type: 'label' },
      },
    });
    renderStats({ analysisResult });
    expect(screen.getByText('Labels')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  // ── Diagnostics card ─────────────────────────────────────────────────────────

  it('shows green checkmark when there are no errors', () => {
    renderStats({ diagnosticsErrorCount: 0 });
    expect(screen.getByText('No Errors')).toBeInTheDocument();
    expect(screen.getByText('✓')).toBeInTheDocument();
  });

  it('shows error count in red when diagnosticsErrorCount is positive', () => {
    renderStats({ diagnosticsErrorCount: 7 });
    expect(screen.getByText('Script Errors')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('calls onOpenDiagnostics when the error card is clicked', () => {
    const onOpenDiagnostics = vi.fn();
    renderStats({ diagnosticsErrorCount: 3, onOpenDiagnostics });
    // StatCard with onClick renders with role="button"; accessible name includes the label text
    fireEvent.click(screen.getByRole('button', { name: /script errors/i }));
    expect(onOpenDiagnostics).toHaveBeenCalledTimes(1);
  });

  it('does not make the zero-error card clickable', () => {
    renderStats({ diagnosticsErrorCount: 0 });
    // When no errors the StatCard has no onClick so no role="button" for that card
    expect(screen.queryByRole('button', { name: /no errors/i })).not.toBeInTheDocument();
  });

  // ── Asset counts (synchronous) ───────────────────────────────────────────────

  it('renders image asset count', () => {
    const projectImages = new Map<string, { filePath: string; fileName: string; projectFilePath?: string }>([
      ['img1', { filePath: 'images/bg.png', fileName: 'bg.png' }],
      ['img2', { filePath: 'images/char.png', fileName: 'char.png' }],
    ]);
    renderStats({ projectImages: projectImages as Parameters<typeof renderStats>[0]['projectImages'] });
    const imageCard = screen.getByText('Image Assets').closest('div');
    expect(imageCard?.textContent).toContain('2');
  });

  it('renders audio asset count', () => {
    const projectAudios = new Map<string, { filePath: string; fileName: string }>([
      ['aud1', { filePath: 'audio/bgm.ogg', fileName: 'bgm.ogg' }],
      ['aud2', { filePath: 'audio/theme.ogg', fileName: 'theme.ogg' }],
    ]);
    renderStats({ projectAudios: projectAudios as Parameters<typeof renderStats>[0]['projectAudios'] });
    const audioCard = screen.getByText('Audio Assets').closest('div');
    expect(audioCard?.textContent).toContain('2');
  });

  it('shows zero for both asset counts when maps are empty', () => {
    renderStats();
    const imageCard = screen.getByText('Image Assets').closest('div');
    const audioCard = screen.getByText('Audio Assets').closest('div');
    expect(imageCard?.textContent).toContain('0');
    expect(audioCard?.textContent).toContain('0');
  });

  // ── Deferred word count ──────────────────────────────────────────────────────

  it('shows spinner initially and then word count after timer flush', () => {
    // "Hello world" inside a quoted string = 2 dialogue words
    const block = createBlock({ content: 'label start:\n    "Hello world"\n    return\n' });
    renderStats({ blocks: [block] });

    // Before timers run, word count is deferred — Total Words card shows a spinner
    expect(screen.getByText('Total Words')).toBeInTheDocument();
    // No numeric word count yet
    expect(screen.queryByText('2')).not.toBeInTheDocument();

    act(() => { vi.runAllTimers(); });

    // After flush, word count appears
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  // ── Character speaking counts ─────────────────────────────────────────────────

  it('counts words for a character whose dialogue line is correctly located', () => {
    // 1-based line 2 (0-based index 1) is the dialogue line — matches dl.line's 1-based convention.
    const block = createBlock({
      id: 'block-1',
      content: 'label start:\n    e "Hello there"\n    return\n',
    });
    const analysisResult = createEmptyAnalysisResult({
      characters: new Map([['e', createCharacter()]]),
      dialogueLines: new Map([['block-1', [{ line: 2, tag: 'e' }]]]),
    });
    renderStats({ blocks: [block], analysisResult });

    act(() => { vi.runAllTimers(); });

    // "Hello there" = 2 dialogue words, attributed to Eileen.
    expect(screen.getByText('Dialogue Words')).toBeInTheDocument();
    const dialogueWordsCard = screen.getByText('Dialogue Words').closest('div');
    expect(dialogueWordsCard?.textContent).toContain('2');

    // The Characters card's sub-label should report 1 speaking character, not 0.
    const charactersCard = screen.getByText('Characters').closest('div');
    expect(charactersCard?.textContent).toContain('1 speaking');
  });

  // ── Undefined variable usages ─────────────────────────────────────────────────

  it('shows a count of undefined variable usages', () => {
    const blocks = [createBlock({
      id: 'b1',
      content: 'label start:\n    "Hello [oops_typo]!"\n',
      filePath: 'game/script.rpy',
    })];
    const analysisResult = createEmptyAnalysisResult({ storyBlockIds: new Set(['b1']) });

    renderStats({ blocks, analysisResult });

    expect(screen.getByTestId('stat-undefined-variables')).toHaveTextContent('1');
  });

  it('shows the Variables section when known variables exist but there are no undefined-variable usages', () => {
    // Default block content ('label start:\n    "Hello, world!"\n    return\n') has no
    // interpolations or if/elif/while conditions, so it references no undefined variables.
    const analysisResult = createEmptyAnalysisResult({
      variables: new Map([['player_name', createVariable()]]),
    });

    renderStats({ analysisResult });

    expect(screen.getByText('Total Variables')).toBeInTheDocument();
    expect(screen.getByTestId('stat-undefined-variables')).toHaveTextContent('0');
  });

  it('hides the Variables section when there are no known variables and no undefined-variable usages', () => {
    // Default renderStats() props: empty `variables` map, default block with no undefined-variable references.
    renderStats();

    expect(screen.queryByText('Total Variables')).not.toBeInTheDocument();
    expect(screen.queryByTestId('stat-undefined-variables')).not.toBeInTheDocument();
  });

  // ── Default/Implicit/Constants breakdown ────────────────────────────────────

  it('breaks variable counts down into Default, Implicit, and Constants', () => {
    const analysisResult = createEmptyAnalysisResult({
      variables: new Map([
        ['player_name', createVariable({ name: 'player_name', type: 'default' })],
        ['MARKHAM_WINS', createVariable({ name: 'MARKHAM_WINS', type: 'implicit' })],
        ['GAME_VERSION', createVariable({ name: 'GAME_VERSION', type: 'define' })],
        ['persistent.unlocked', createVariable({ name: 'persistent.unlocked', type: 'default' })],
      ]),
    });

    renderStats({ analysisResult });

    expect(screen.getByText('Default').closest('div')?.textContent).toContain('1');
    expect(screen.getByText('Implicit').closest('div')?.textContent).toContain('1');
    expect(screen.getByText('Constants').closest('div')?.textContent).toContain('1');
    expect(screen.getByText('Persistent').closest('div')?.textContent).toContain('1');
    expect(screen.getByText('Total Variables').closest('div')?.textContent).toContain('4');
  });
});
