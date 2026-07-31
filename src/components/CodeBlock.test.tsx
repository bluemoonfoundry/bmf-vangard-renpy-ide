import { render, screen, fireEvent } from '@testing-library/react';
import CodeBlock from './CodeBlock';
import { createBlock, createEmptyAnalysisResult } from '@/test/mocks/sampleData';
import type { Block, RenpyAnalysisResult } from '@/types';

function makeContent(lines: number): string {
  return Array.from({ length: lines }, (_, i) => `# line ${i}`).join('\n');
}

function createDefaultProps(overrides: { block?: Block; analysisResult?: RenpyAnalysisResult } = {}) {
  return {
    block: overrides.block ?? createBlock({ content: makeContent(50) }),
    analysisResult: overrides.analysisResult ?? createEmptyAnalysisResult(),
    updateBlock: vi.fn(),
    deleteBlock: vi.fn(),
    onOpenEditor: vi.fn(),
    isSelected: false,
    isDragging: false,
    isRoot: false,
    isLeaf: false,
    isBranching: false,
    isDimmed: false,
    isUsageHighlighted: false,
    isHoverHighlighted: false,
    isDirty: false,
    isScreenBlock: false,
    isConfigBlock: false,
    isFlashing: false,
    diagnosticSeverity: null,
  };
}

describe('CodeBlock — file size indicator', () => {
  it('does not render a size badge when the line count is within the healthy threshold', () => {
    render(<CodeBlock {...createDefaultProps({ block: createBlock({ content: makeContent(50) }) })} />);
    expect(screen.queryByTestId('file-size-dot')).not.toBeInTheDocument();
  });

  it('renders a yellow size badge between the healthy and warning thresholds', () => {
    render(<CodeBlock {...createDefaultProps({ block: createBlock({ content: makeContent(750) }) })} />);
    expect(screen.getByTestId('file-size-dot')).toHaveAttribute('data-severity', 'yellow');
  });

  it('renders a red size badge above the critical threshold', () => {
    render(<CodeBlock {...createDefaultProps({ block: createBlock({ content: makeContent(2000) }) })} />);
    expect(screen.getByTestId('file-size-dot')).toHaveAttribute('data-severity', 'red');
  });

  it('shows line count, limit, and status label in the tooltip on hover', () => {
    render(<CodeBlock {...createDefaultProps({ block: createBlock({ content: makeContent(1200) }) })} />);
    const anchor = screen.getByTestId('file-size-dot').parentElement!;
    fireEvent.mouseEnter(anchor);
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveTextContent('1,200 / 1,000 lines [Warning]');
  });

  it('shows the block\'s label and jump counts in the tooltip', () => {
    const block = createBlock({ id: 'block-1', content: makeContent(1200) });
    const analysisResult = createEmptyAnalysisResult({
      labels: {
        start: { blockId: 'block-1', label: 'start', line: 1, column: 7, type: 'label' },
        chapter1: { blockId: 'block-1', label: 'chapter1', line: 10, column: 7, type: 'label' },
      },
      jumps: {
        'block-1': [
          { blockId: 'block-1', target: 'other', type: 'jump', line: 20, columnStart: 4, columnEnd: 12 },
        ],
      },
    });
    render(<CodeBlock {...createDefaultProps({ block, analysisResult })} />);
    const anchor = screen.getByTestId('file-size-dot').parentElement!;
    fireEvent.mouseEnter(anchor);
    expect(screen.getByRole('tooltip')).toHaveTextContent('2 labels, 1 jump');
  });

  it('respects a custom fileSizeThresholds prop', () => {
    render(
      <CodeBlock
        {...createDefaultProps({ block: createBlock({ content: makeContent(150) }) })}
        fileSizeThresholds={{ healthy: 100, warning: 200, critical: 300 }}
      />
    );
    expect(screen.getByTestId('file-size-dot')).toHaveAttribute('data-severity', 'yellow');
  });
});
