import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StatusBar from './StatusBar';
import { DEFAULT_FILE_SIZE_THRESHOLDS } from '@/lib/fileSizeSeverity';

function createDefaultProps(overrides: Partial<React.ComponentProps<typeof StatusBar>> = {}) {
  return {
    isAnalysisPending: false,
    isScanningAssets: false,
    saveStatus: 'saved' as const,
    blockCount: 3,
    errorCount: 0,
    warningCount: 0,
    screenshotCount: 0,
    activeFileLineCount: null,
    fileSizeThresholds: DEFAULT_FILE_SIZE_THRESHOLDS,
    ...overrides,
  };
}

describe('StatusBar — asset scan cancellation', () => {
  it('does not show a Cancel button when not scanning', () => {
    render(<StatusBar {...createDefaultProps({ isScanningAssets: false })} />);
    expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
  });

  it('shows a Cancel button while scanning assets', () => {
    render(<StatusBar {...createDefaultProps({ isScanningAssets: true, onCancelScan: vi.fn() })} />);
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('calls onCancelScan when the Cancel button is clicked', async () => {
    const onCancelScan = vi.fn();
    render(<StatusBar {...createDefaultProps({ isScanningAssets: true, onCancelScan })} />);
    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onCancelScan).toHaveBeenCalledTimes(1);
  });
});

describe('StatusBar — active file line count', () => {
  it('shows nothing when no file is active', () => {
    render(<StatusBar {...createDefaultProps({ activeFileLineCount: null })} />);
    expect(screen.queryByText(/lines/)).not.toBeInTheDocument();
  });

  it('shows the line count and Ideal status for a small active file', () => {
    render(<StatusBar {...createDefaultProps({ activeFileLineCount: 200 })} />);
    expect(screen.getByText('200 lines (Ideal)')).toBeInTheDocument();
  });

  it('shows Warning status for a file past the warning threshold', () => {
    render(<StatusBar {...createDefaultProps({ activeFileLineCount: 1200 })} />);
    expect(screen.getByText('1,200 lines (Warning)')).toBeInTheDocument();
  });

  it('shows Critical status for a file past the critical threshold', () => {
    render(<StatusBar {...createDefaultProps({ activeFileLineCount: 2000 })} />);
    expect(screen.getByText('2,000 lines (Critical)')).toBeInTheDocument();
  });
});
