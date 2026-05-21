import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import WarpVariablesModal from '@/components/WarpVariablesModal';
import type { WarpVariableDraft } from '@/lib/warpAfterWarp';

const defaultProps = {
  isOpen: true,
  defaultVariables: [] as WarpVariableDraft[],
  hasExistingAfterWarp: false,
  onClose: vi.fn(),
  onConfirm: vi.fn(),
};

describe('WarpVariablesModal', () => {
  it('renders nothing when isOpen is false', () => {
    const { container } = render(<WarpVariablesModal {...defaultProps} isOpen={false} />);
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders the empty-state message when no variables are provided', () => {
    render(<WarpVariablesModal {...defaultProps} defaultVariables={[]} />);
    expect(screen.getByText(/no default variables were found/i)).toBeInTheDocument();
  });

  it('renders inputs for each variable', () => {
    const variables: WarpVariableDraft[] = [
      { name: 'score', value: '0', source: 'default' },
      { name: 'player_name', value: '"Player"', source: 'default' },
    ];
    render(<WarpVariablesModal {...defaultProps} defaultVariables={variables} />);

    expect(screen.getByLabelText('score')).toBeInTheDocument();
    expect(screen.getByLabelText('player_name')).toBeInTheDocument();
  });

  it('shows the warp label name in the description when provided', () => {
    render(<WarpVariablesModal {...defaultProps} warpLabelName="chapter_2" />);
    expect(screen.getByText(/chapter_2/)).toBeInTheDocument();
  });

  it('shows the existing after_warp warning when hasExistingAfterWarp is true', () => {
    render(<WarpVariablesModal {...defaultProps} hasExistingAfterWarp />);
    expect(screen.getByText(/project already defines/i)).toBeInTheDocument();
  });

  it('calls onClose when the Cancel button is clicked', () => {
    const onClose = vi.fn();
    render(<WarpVariablesModal {...defaultProps} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm with the current drafts on form submission', () => {
    const onConfirm = vi.fn();
    const variables: WarpVariableDraft[] = [
      { name: 'score', value: '0', source: 'default' },
    ];
    render(<WarpVariablesModal {...defaultProps} defaultVariables={variables} onConfirm={onConfirm} />);
    fireEvent.click(screen.getByRole('button', { name: /warp now/i }));
    expect(onConfirm).toHaveBeenCalledWith([{ name: 'score', value: '0', source: 'default' }]);
  });

  it('passes updated values to onConfirm after editing an input', () => {
    const onConfirm = vi.fn();
    const variables: WarpVariableDraft[] = [
      { name: 'score', value: '0', source: 'default' },
    ];
    render(<WarpVariablesModal {...defaultProps} defaultVariables={variables} onConfirm={onConfirm} />);
    fireEvent.change(screen.getByLabelText('score'), { target: { value: '42' } });
    fireEvent.click(screen.getByRole('button', { name: /warp now/i }));
    expect(onConfirm).toHaveBeenCalledWith([{ name: 'score', value: '42', source: 'default' }]);
  });

  it('displays the variable count in the footer', () => {
    const variables: WarpVariableDraft[] = [
      { name: 'score', value: '0', source: 'default' },
      { name: 'mc_name', value: 'default_mc_name', source: 'interpolated' },
    ];
    render(<WarpVariablesModal {...defaultProps} defaultVariables={variables} />);
    expect(screen.getByText(/2 variables/i)).toBeInTheDocument();
  });

  it('shows singular variable count when only one variable is present', () => {
    const variables: WarpVariableDraft[] = [
      { name: 'score', value: '0', source: 'default' },
    ];
    render(<WarpVariablesModal {...defaultProps} defaultVariables={variables} />);
    expect(screen.getByText(/1 variable\b/i)).toBeInTheDocument();
  });

  it('separates default and interpolated variables into distinct sections', () => {
    const variables: WarpVariableDraft[] = [
      { name: 'score', value: '0', source: 'default' },
      { name: 'mc_name', value: 'default_mc_name', source: 'interpolated' },
    ];
    render(<WarpVariablesModal {...defaultProps} defaultVariables={variables} />);
    expect(screen.getByText('Default variables')).toBeInTheDocument();
    expect(screen.getByText('Interpolated variables')).toBeInTheDocument();
  });
});
