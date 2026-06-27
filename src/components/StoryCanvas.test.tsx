import { render, screen, fireEvent } from '@testing-library/react';
import StoryCanvas from './StoryCanvas';
import {
  createBlock,
  createBlockGroup,
  createStickyNote,
  createEmptyAnalysisResult,
} from '@/test/mocks/sampleData';
import type { Block, BlockGroup, StickyNote as StickyNoteType } from '@/types';

vi.mock('./CodeBlock', () => ({
  default: ({ block }: { block: Block }) => (
    <div data-testid="code-block" data-block-id={block.id}>{block.title}</div>
  ),
}));
vi.mock('./GroupContainer', () => ({
  default: ({ group }: { group: BlockGroup }) => (
    <div data-testid="group-container">{group.title}</div>
  ),
}));
vi.mock('./StickyNote', () => ({
  default: ({ note }: { note: StickyNoteType }) => (
    <div data-testid="sticky-note">{note.content}</div>
  ),
}));
vi.mock('./Minimap', () => ({ default: () => <div data-testid="minimap" /> }));
vi.mock('./CanvasContextMenu', () => ({ default: () => null }));
vi.mock('./CanvasLayoutControls', () => ({ default: () => null }));
vi.mock('./CanvasToolbox', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="canvas-toolbox">{children}</div>,
}));
vi.mock('./CanvasNavControls', () => ({ default: () => null }));

const createProps = (overrides: Record<string, unknown> = {}) => ({
  blocks: [] as Block[],
  groups: [] as BlockGroup[],
  stickyNotes: [] as StickyNoteType[],
  analysisResult: createEmptyAnalysisResult(),
  updateBlock: vi.fn(),
  updateGroup: vi.fn(),
  updateBlockPositions: vi.fn(),
  updateGroupPositions: vi.fn(),
  updateStickyNote: vi.fn(),
  deleteStickyNote: vi.fn(),
  onInteractionEnd: vi.fn(),
  deleteBlock: vi.fn(),
  onOpenEditor: vi.fn(),
  selectedBlockIds: [] as string[],
  setSelectedBlockIds: vi.fn(),
  selectedGroupIds: [] as string[],
  setSelectedGroupIds: vi.fn(),
  findUsagesHighlightIds: null,
  clearFindUsages: vi.fn(),
  dirtyBlockIds: new Set<string>(),
  canvasFilters: { story: true, screens: true, config: true, notes: true, minimap: true },
  setCanvasFilters: vi.fn(),
  centerOnBlockRequest: null,
  flashBlockRequest: null,
  hoverHighlightIds: null,
  transform: { x: 0, y: 0, scale: 1 },
  onTransformChange: vi.fn(),
  layoutMode: 'flow-lr' as const,
  groupingMode: 'none' as const,
  onChangeLayoutMode: vi.fn(),
  onChangeGroupingMode: vi.fn(),
  ...overrides,
});

describe('StoryCanvas', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with correct aria role and label', () => {
    render(<StoryCanvas {...createProps()} />);
    expect(screen.getByRole('application', { name: 'Story canvas' })).toBeInTheDocument();
  });

  it('renders no blocks when blocks array is empty', () => {
    render(<StoryCanvas {...createProps()} />);
    expect(screen.queryAllByTestId('code-block')).toHaveLength(0);
  });

  it('renders a CodeBlock for each story block', () => {
    const blocks = [
      createBlock({ id: 'b1', title: 'start' }),
      createBlock({ id: 'b2', title: 'chapter1', position: { x: 400, y: 100 } }),
    ];
    // Blocks must be in storyBlockIds to pass the visibility filter
    const analysisResult = createEmptyAnalysisResult({
      storyBlockIds: new Set(['b1', 'b2']),
    });
    render(<StoryCanvas {...createProps({ blocks, analysisResult })} />);
    expect(screen.getAllByTestId('code-block')).toHaveLength(2);
    expect(screen.getByText('start')).toBeInTheDocument();
    expect(screen.getByText('chapter1')).toBeInTheDocument();
  });

  it('renders a GroupContainer for each group', () => {
    const groups = [createBlockGroup({ id: 'g1', title: 'Act 1' })];
    render(<StoryCanvas {...createProps({ groups })} />);
    expect(screen.getAllByTestId('group-container')).toHaveLength(1);
    expect(screen.getByText('Act 1')).toBeInTheDocument();
  });

  it('renders sticky notes when notes filter is enabled', () => {
    const stickyNotes = [createStickyNote({ id: 'n1', content: 'Remember to fix this' })];
    render(<StoryCanvas {...createProps({ stickyNotes })} />);
    expect(screen.getAllByTestId('sticky-note')).toHaveLength(1);
    expect(screen.getByText('Remember to fix this')).toBeInTheDocument();
  });

  it('hides sticky notes when notes filter is disabled', () => {
    const stickyNotes = [createStickyNote({ id: 'n1', content: 'Hidden note' })];
    const canvasFilters = { story: true, screens: true, config: true, notes: false, minimap: true };
    render(<StoryCanvas {...createProps({ stickyNotes, canvasFilters })} />);
    expect(screen.queryAllByTestId('sticky-note')).toHaveLength(0);
  });

  it('renders the minimap when minimap filter is enabled', () => {
    render(<StoryCanvas {...createProps()} />);
    expect(screen.getByTestId('minimap')).toBeInTheDocument();
  });

  it('hides the minimap when minimap filter is disabled', () => {
    const canvasFilters = { story: true, screens: true, config: true, notes: true, minimap: false };
    render(<StoryCanvas {...createProps({ canvasFilters })} />);
    expect(screen.queryByTestId('minimap')).not.toBeInTheDocument();
  });

  it('has an accessible live announcement region', () => {
    render(<StoryCanvas {...createProps()} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('clears selection when Escape is pressed on the canvas', () => {
    const props = createProps({ selectedBlockIds: ['b1'] });
    render(<StoryCanvas {...props} />);
    const canvas = screen.getByRole('application', { name: 'Story canvas' });
    fireEvent.keyDown(canvas, { key: 'Escape' });
    expect(props.setSelectedBlockIds).toHaveBeenCalledWith([]);
  });
});
