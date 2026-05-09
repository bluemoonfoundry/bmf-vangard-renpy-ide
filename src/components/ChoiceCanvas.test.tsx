import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChoiceCanvas from './ChoiceCanvas';
import {
  createLabelNode,
  createRouteLink,
  createEmptyAnalysisResult,
} from '@/test/mocks/sampleData';
import type { LabelNode, RouteLink } from '@/types';

vi.mock('./StickyNote', () => ({
  default: ({ note }: { note: any }) => (
    <div data-testid="sticky-note">{note.content}</div>
  ),
}));
vi.mock('./Minimap', () => ({ default: () => <div data-testid="minimap" /> }));
vi.mock('./CanvasContextMenu', () => ({ default: () => null }));
vi.mock('./CanvasNodeContextMenu', () => ({ default: () => null }));
vi.mock('./CanvasToolbox', () => ({
  default: ({ children }: { children: any }) => <div data-testid="canvas-toolbox">{children}</div>,
}));
vi.mock('./CanvasNavControls', () => ({ default: () => null }));

const createProps = (overrides: Record<string, unknown> = {}) => ({
  labelNodes: [] as LabelNode[],
  routeLinks: [] as RouteLink[],
  blocks: [] as { id: string; content: string }[],
  analysisResult: createEmptyAnalysisResult(),
  stickyNotes: [],
  onAddStickyNote: vi.fn(),
  updateStickyNote: vi.fn(),
  deleteStickyNote: vi.fn(),
  onOpenEditor: vi.fn(),
  transform: { x: 0, y: 0, scale: 1 },
  onTransformChange: vi.fn(),
  onWarpToLabel: vi.fn(),
  centerOnStartRequest: null,
  centerOnNodeRequest: null,
  ...overrides,
});

describe('ChoiceCanvas', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with correct aria role and label', () => {
    render(<ChoiceCanvas {...createProps()} />);
    expect(screen.getByRole('application', { name: 'Walkthrough debugger canvas' })).toBeInTheDocument();
  });

  it('renders without crashing when no label nodes are provided', () => {
    render(<ChoiceCanvas {...createProps()} />);
    expect(screen.getByText(/No labels found/)).toBeInTheDocument();
  });

  it('renders an SVG canvas surface when label nodes are present', () => {
    const labelNodes = [createLabelNode({ id: 'b1:start', label: 'start', blockId: 'b1' })];
    render(<ChoiceCanvas {...createProps({ labelNodes })} />);
    const canvas = screen.getByRole('application', { name: 'Walkthrough debugger canvas' });
    expect(canvas.querySelector('svg')).toBeInTheDocument();
  });

  it('renders the label search input', () => {
    render(<ChoiceCanvas {...createProps()} />);
    expect(screen.getByPlaceholderText('Search labels…')).toBeInTheDocument();
  });

  it('filters out nodes with labels starting with underscore', () => {
    const labelNodes = [
      createLabelNode({ id: 'b1:start', label: 'start', blockId: 'b1' }),
      createLabelNode({ id: 'b2:_hidden', label: '_hidden', blockId: 'b2', position: { x: 300, y: 100 } }),
    ];
    const routeLinks = [
      createRouteLink({ id: 'l1', sourceId: 'b1:start', targetId: 'b2:_hidden' }),
    ];
    render(<ChoiceCanvas {...createProps({ labelNodes, routeLinks })} />);
    expect(screen.queryByRole('button', { name: /Navigate to: _hidden/ })).not.toBeInTheDocument();
  });

  it('shows a navigation button to the child node when a route link exists', () => {
    const startNode = createLabelNode({ id: 'b1:start', label: 'start', blockId: 'b1' });
    const chapter1 = createLabelNode({ id: 'b2:chapter1', label: 'chapter1', blockId: 'b2', position: { x: 300, y: 100 } });
    const routeLinks = [
      createRouteLink({ id: 'l1', sourceId: 'b1:start', targetId: 'b2:chapter1', type: 'jump' }),
    ];
    render(<ChoiceCanvas {...createProps({ labelNodes: [startNode, chapter1], routeLinks })} />);
    expect(screen.getByRole('button', { name: 'Navigate to: chapter1' })).toBeInTheDocument();
  });

  it('does not call onWarpToLabel on initial render', () => {
    const onWarpToLabel = vi.fn();
    render(<ChoiceCanvas {...createProps({ onWarpToLabel })} />);
    expect(onWarpToLabel).not.toHaveBeenCalled();
  });

  it('shows matching labels when search query is entered', async () => {
    const user = userEvent.setup();
    const labelNodes = [
      createLabelNode({ id: 'b1:start', label: 'start', blockId: 'b1' }),
      createLabelNode({ id: 'b2:chapter1', label: 'chapter1', blockId: 'b2', position: { x: 300, y: 100 } }),
    ];
    render(<ChoiceCanvas {...createProps({ labelNodes })} />);

    const searchInput = screen.getByPlaceholderText('Search labels…');
    await user.type(searchInput, 'chap');

    expect(screen.getByText('chapter1')).toBeInTheDocument();
  });
});
