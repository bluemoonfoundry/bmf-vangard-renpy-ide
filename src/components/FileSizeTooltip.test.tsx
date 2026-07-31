import { render, screen, fireEvent } from '@testing-library/react';
import FileSizeTooltip from './FileSizeTooltip';
import { DEFAULT_FILE_SIZE_THRESHOLDS } from '@/lib/fileSizeSeverity';

describe('FileSizeTooltip', () => {
  it('does not show tooltip content before hover', () => {
    render(
      <FileSizeTooltip
        fileName="chapter1.rpy"
        lineCount={1242}
        thresholds={DEFAULT_FILE_SIZE_THRESHOLDS}
        labelCount={3}
        jumpCount={5}
      >
        <span data-testid="badge">badge</span>
      </FileSizeTooltip>
    );
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('shows formatted line count, limit, and status on mouseEnter', () => {
    render(
      <FileSizeTooltip
        fileName="chapter1.rpy"
        lineCount={1242}
        thresholds={DEFAULT_FILE_SIZE_THRESHOLDS}
        labelCount={3}
        jumpCount={5}
      >
        <span data-testid="badge">badge</span>
      </FileSizeTooltip>
    );
    fireEvent.mouseEnter(screen.getByTestId('badge').parentElement!);
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveTextContent('chapter1.rpy');
    expect(tooltip).toHaveTextContent('1,242 / 1,000 lines [Warning]');
    expect(tooltip).toHaveTextContent('3 labels, 5 jumps');
  });

  it('hides the tooltip on mouseLeave', () => {
    render(
      <FileSizeTooltip
        fileName="chapter1.rpy"
        lineCount={1242}
        thresholds={DEFAULT_FILE_SIZE_THRESHOLDS}
        labelCount={3}
        jumpCount={5}
      >
        <span data-testid="badge">badge</span>
      </FileSizeTooltip>
    );
    const anchor = screen.getByTestId('badge').parentElement!;
    fireEvent.mouseEnter(anchor);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    fireEvent.mouseLeave(anchor);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('uses singular label/jump wording when counts are 1', () => {
    render(
      <FileSizeTooltip
        fileName="chapter1.rpy"
        lineCount={600}
        thresholds={DEFAULT_FILE_SIZE_THRESHOLDS}
        labelCount={1}
        jumpCount={1}
      >
        <span data-testid="badge">badge</span>
      </FileSizeTooltip>
    );
    fireEvent.mouseEnter(screen.getByTestId('badge').parentElement!);
    expect(screen.getByRole('tooltip')).toHaveTextContent('1 label, 1 jump');
  });
});
