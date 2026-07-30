import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import VariableManager from './VariableManager';
import { createEmptyAnalysisResult } from '@/test/mocks/sampleData';

function baseProps(overrides = {}) {
  return {
    analysisResult: createEmptyAnalysisResult(),
    onAddVariable: vi.fn(),
    onEditVariable: vi.fn(),
    onFindUsages: vi.fn(),
    onHoverHighlightStart: vi.fn(),
    onHoverHighlightEnd: vi.fn(),
    dismissedImplicitVarHint: true,
    onDismissImplicitVarHint: vi.fn(),
    onOpenDiagnostics: vi.fn(),
    ...overrides,
  };
}

describe('VariableManager prefill', () => {
  it('switches to add mode and pre-fills the form when a prefill is provided', () => {
    render(<VariableManager {...baseProps({ prefill: { name: 'the_golden_sword', initialValue: '0' } })} />);
    expect(screen.getByDisplayValue('the_golden_sword')).toBeTruthy();
    expect(screen.getByDisplayValue('0')).toBeTruthy();
  });

  it('does not enter add mode when prefill is null', () => {
    render(<VariableManager {...baseProps({ prefill: null })} />);
    expect(screen.queryByText('Add New Variable')).toBeNull();
  });

  it('calls onAddVariable and onPrefillConsumed when the pre-filled form is saved', () => {
    const onAddVariable = vi.fn();
    const onPrefillConsumed = vi.fn();
    render(<VariableManager {...baseProps({
      prefill: { name: 'the_golden_sword', initialValue: '0' },
      onAddVariable,
      onPrefillConsumed,
    })} />);
    fireEvent.click(screen.getByRole('button', { name: /^save$/i }));
    expect(onAddVariable).toHaveBeenCalledWith({ name: 'the_golden_sword', type: 'default', initialValue: '0' });
    expect(onPrefillConsumed).toHaveBeenCalled();
  });

  it('calls onPrefillConsumed when the pre-filled form is cancelled', () => {
    const onPrefillConsumed = vi.fn();
    render(<VariableManager {...baseProps({
      prefill: { name: 'the_golden_sword', initialValue: '0' },
      onPrefillConsumed,
    })} />);
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onPrefillConsumed).toHaveBeenCalled();
  });
});
