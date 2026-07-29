import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import QuickCreateFileModal from './QuickCreateFileModal';

describe('QuickCreateFileModal', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <QuickCreateFileModal isOpen={false} directoryPath="game" extension=".rpy" initialFileName="the_golden_sword" onConfirm={vi.fn()} onClose={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('pre-fills the filename input with initialFileName when opened', () => {
    render(
      <QuickCreateFileModal isOpen={true} directoryPath="game" extension=".rpy" initialFileName="the_golden_sword" onConfirm={vi.fn()} onClose={vi.fn()} />
    );
    const input = screen.getByLabelText(/file name/i) as HTMLInputElement;
    expect(input.value).toBe('the_golden_sword');
  });

  it('shows the target directory and extension', () => {
    render(
      <QuickCreateFileModal isOpen={true} directoryPath="game/chapters" extension=".rpy" initialFileName="foo" onConfirm={vi.fn()} onClose={vi.fn()} />
    );
    expect(screen.getByText(/game\/chapters/)).toBeTruthy();
    expect(screen.getByText('.rpy')).toBeTruthy();
  });

  it('calls onConfirm with the full filename (base + extension) on submit', () => {
    const onConfirm = vi.fn();
    render(
      <QuickCreateFileModal isOpen={true} directoryPath="game" extension=".rpy" initialFileName="the_golden_sword" onConfirm={onConfirm} onClose={vi.fn()} />
    );
    fireEvent.click(screen.getByRole('button', { name: /create/i }));
    expect(onConfirm).toHaveBeenCalledWith('the_golden_sword.rpy');
  });

  it('allows editing the pre-filled name before confirming', () => {
    const onConfirm = vi.fn();
    render(
      <QuickCreateFileModal isOpen={true} directoryPath="game" extension=".rpy" initialFileName="the_golden_sword" onConfirm={onConfirm} onClose={vi.fn()} />
    );
    const input = screen.getByLabelText(/file name/i);
    fireEvent.change(input, { target: { value: 'renamed_file' } });
    fireEvent.click(screen.getByRole('button', { name: /create/i }));
    expect(onConfirm).toHaveBeenCalledWith('renamed_file.rpy');
  });

  it('calls onClose when Cancel is clicked', () => {
    const onClose = vi.fn();
    render(
      <QuickCreateFileModal isOpen={true} directoryPath="game" extension=".rpy" initialFileName="foo" onConfirm={vi.fn()} onClose={onClose} />
    );
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it('shows a collision warning when collidingWithExisting is true', () => {
    render(
      <QuickCreateFileModal isOpen={true} directoryPath="game" extension=".rpy" initialFileName="start" collidingWithExisting={true} onConfirm={vi.fn()} onClose={vi.fn()} />
    );
    expect(screen.getByText(/already exists/i)).toBeTruthy();
  });

  it('does not show a collision warning when collidingWithExisting is false or omitted', () => {
    render(
      <QuickCreateFileModal isOpen={true} directoryPath="game" extension=".rpy" initialFileName="start" onConfirm={vi.fn()} onClose={vi.fn()} />
    );
    expect(screen.queryByText(/already exists/i)).toBeNull();
  });

  it('does not confirm with an empty filename', () => {
    const onConfirm = vi.fn();
    render(
      <QuickCreateFileModal isOpen={true} directoryPath="game" extension=".rpy" initialFileName="foo" onConfirm={onConfirm} onClose={vi.fn()} />
    );
    const input = screen.getByLabelText(/file name/i);
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(screen.getByRole('button', { name: /create/i }));
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
