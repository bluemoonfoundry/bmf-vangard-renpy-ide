import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RouteCanvas from './RouteCanvas';
import {
  createLabelNode,
  createRouteLink,
} from '@/test/mocks/sampleData';
import type { LabelNode, RouteLink } from '@/types';

vi.mock('./LabelBlock', () => ({
  default: ({ node }: { node: LabelNode }) => (
    <div data-testid="label-block" data-node-id={node.id}>{node.label}</div>
  ),
}));
vi.mock('./FileBlock', () => ({
  default: ({ node }: { node: any }) => (
    <div data-testid="file-block" data-node-id={node.id}>{node.id}</div>
  ),
}));
vi.mock('./StickyNote', () => ({
  default: ({ note }: { note: any }) => (
    <div data-testid="sticky-note">{note.content}</div>
  ),
}));
vi.mock('./Minimap', () => ({ default: () => <div data-testid="minimap" /> }));
vi.mock('./ViewRoutesPanel', () => ({ default: () => null }));
vi.mock('./MenuInspectorPanel', () => ({ default: () => null }));
vi.mock('./CanvasContextMenu', () => ({ default: () => null }));
vi.mock('./CanvasNodeContextMenu', () => ({ default: () => null }));
vi.mock('./CanvasLayoutControls', () => ({ default: () => null }));
vi.mock('./CanvasToolbox', () => ({
  default: ({ children }: { children: any }) => <div data-testid="canvas-toolbox">{children}</div>,
}));
vi.mock('./CanvasNavControls', () => ({ default: () => null }));
vi.mock('@/lib/routeCanvasLayout', () => ({
  computeRouteCanvasLayout: (nodes: LabelNode[]) => nodes,
  computeRouteCanvasLayoutFingerprint: () => 'mock-fingerprint',
  getRouteCanvasLayoutVersion: () => 1,
}));

const createProps = (overrides: Record<string, unknown> = {}) => ({
  labelNodes: [] as LabelNode[],
  routeLinks: [] as RouteLink[],
  identifiedRoutes: [],
  routesTruncated: false,
  stickyNotes: [],
  projectImages: new Map(),
  updateLabelNodePositions: vi.fn(),
  onAddStickyNote: vi.fn(),
  updateStickyNote: vi.fn(),
  deleteStickyNote: vi.fn(),
  onOpenEditor: vi.fn(),
  transform: { x: 0, y: 0, scale: 1 },
  onTransformChange: vi.fn(),
  layoutMode: 'flow-lr' as const,
  groupingMode: 'none' as const,
  onChangeLayoutMode: vi.fn(),
  onChangeGroupingMode: vi.fn(),
  onWarpToLabel: vi.fn(),
  centerOnStartRequest: null,
  centerOnNodeRequest: null,
  ...overrides,
});

describe('RouteCanvas', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with correct aria role and label', () => {
    render(<RouteCanvas {...createProps()} />);
    expect(screen.getByRole('application', { name: 'Route canvas' })).toBeInTheDocument();
  });

  it('renders no nodes when labelNodes is empty', () => {
    render(<RouteCanvas {...createProps()} />);
    expect(screen.queryAllByTestId('label-block')).toHaveLength(0);
  });

  it('renders a LabelBlock for each label node', () => {
    const labelNodes = [
      createLabelNode({ id: 'b1:start', label: 'start', blockId: 'b1' }),
      createLabelNode({ id: 'b2:chapter1', label: 'chapter1', blockId: 'b2', position: { x: 300, y: 100 } }),
    ];
    render(<RouteCanvas {...createProps({ labelNodes })} />);
    expect(screen.getAllByTestId('label-block')).toHaveLength(2);
    expect(screen.getByText('start')).toBeInTheDocument();
    expect(screen.getByText('chapter1')).toBeInTheDocument();
  });

  it('has an accessible live announcement region', () => {
    render(<RouteCanvas {...createProps()} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders the go-to-label search input', () => {
    render(<RouteCanvas {...createProps()} />);
    expect(screen.getByPlaceholderText('Go to label...')).toBeInTheDocument();
  });

  it('shows matching nodes in search results when query matches a label', async () => {
    const user = userEvent.setup();
    const labelNodes = [
      createLabelNode({ id: 'b1:start', label: 'start', blockId: 'b1' }),
      createLabelNode({ id: 'b2:intro', label: 'intro', blockId: 'b2', position: { x: 300, y: 100 } }),
    ];
    render(<RouteCanvas {...createProps({ labelNodes })} />);

    const searchInput = screen.getByPlaceholderText('Go to label...');
    await user.type(searchInput, 'intr');

    // 'intr' matches 'intro' but not 'start', so only one result button appears
    expect(screen.getByRole('button', { name: /intro/ })).toBeInTheDocument();
  });

  it('shows "No matching labels." when search query has no results', async () => {
    const user = userEvent.setup();
    const labelNodes = [createLabelNode({ id: 'b1:start', label: 'start', blockId: 'b1' })];
    render(<RouteCanvas {...createProps({ labelNodes })} />);

    const searchInput = screen.getByPlaceholderText('Go to label...');
    await user.type(searchInput, 'zzznomatch');

    expect(screen.getByText('No matching labels.')).toBeInTheDocument();
  });

  it('filters out nodes with labels starting with underscore', () => {
    const labelNodes = [
      createLabelNode({ id: 'b1:start', label: 'start', blockId: 'b1' }),
      createLabelNode({ id: 'b2:_internal', label: '_internal', blockId: 'b2', position: { x: 300, y: 100 } }),
    ];
    render(<RouteCanvas {...createProps({ labelNodes })} />);
    expect(screen.getAllByTestId('label-block')).toHaveLength(1);
    expect(screen.queryByText('_internal')).not.toBeInTheDocument();
  });

  it('renders the navigation Back and Forward buttons', () => {
    render(<RouteCanvas {...createProps()} />);
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Forward' })).toBeInTheDocument();
  });
});
