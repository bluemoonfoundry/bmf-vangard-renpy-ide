import { render, screen } from '@testing-library/react';
import FileSizeDot from './FileSizeDot';
import { DEFAULT_FILE_SIZE_THRESHOLDS } from '@/lib/fileSizeSeverity';

describe('FileSizeDot', () => {
  it('renders nothing when line count is within the healthy threshold', () => {
    const { container } = render(
      <FileSizeDot lineCount={200} thresholds={DEFAULT_FILE_SIZE_THRESHOLDS} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders a yellow dot between the healthy and warning thresholds', () => {
    render(<FileSizeDot lineCount={750} thresholds={DEFAULT_FILE_SIZE_THRESHOLDS} />);
    const dot = screen.getByTestId('file-size-dot');
    expect(dot).toHaveAttribute('data-severity', 'yellow');
  });

  it('renders an orange dot between the warning and critical thresholds', () => {
    render(<FileSizeDot lineCount={1200} thresholds={DEFAULT_FILE_SIZE_THRESHOLDS} />);
    const dot = screen.getByTestId('file-size-dot');
    expect(dot).toHaveAttribute('data-severity', 'orange');
  });

  it('renders a red dot above the critical threshold', () => {
    render(<FileSizeDot lineCount={2000} thresholds={DEFAULT_FILE_SIZE_THRESHOLDS} />);
    const dot = screen.getByTestId('file-size-dot');
    expect(dot).toHaveAttribute('data-severity', 'red');
  });

  it('applies the title attribute when provided', () => {
    render(<FileSizeDot lineCount={2000} thresholds={DEFAULT_FILE_SIZE_THRESHOLDS} title="2000 lines" />);
    expect(screen.getByTestId('file-size-dot')).toHaveAttribute('title', '2000 lines');
  });

  it('renders a triangle glyph instead of a circle when variant is "triangle"', () => {
    const { container } = render(
      <FileSizeDot lineCount={2000} thresholds={DEFAULT_FILE_SIZE_THRESHOLDS} variant="triangle" />
    );
    const indicator = screen.getByTestId('file-size-dot');
    expect(indicator.tagName.toLowerCase()).toBe('svg');
    expect(container.querySelector('.rounded-full')).toBeNull();
  });

  it('renders nothing for the triangle variant when line count is within the healthy threshold', () => {
    const { container } = render(
      <FileSizeDot lineCount={200} thresholds={DEFAULT_FILE_SIZE_THRESHOLDS} variant="triangle" />
    );
    expect(container.firstChild).toBeNull();
  });
});
