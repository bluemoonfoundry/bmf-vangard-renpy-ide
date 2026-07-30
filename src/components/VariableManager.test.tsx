import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import VariableManager from './VariableManager';
import { createEmptyAnalysisResult, createVariable } from '@/test/mocks/sampleData';

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

describe('VariableManager implicit variable badge', () => {
  it('labels a "$ name = value" variable as implicit, not default', () => {
    const storyBlockId = 'block-1';
    const implicitVar = createVariable({ name: 'MARKHAM_WINS', type: 'implicit', definedInBlockId: storyBlockId });
    const analysisResult = createEmptyAnalysisResult({
      variables: new Map([['MARKHAM_WINS', implicitVar]]),
      storyBlockIds: new Set([storyBlockId]),
    });
    render(<VariableManager {...baseProps({ analysisResult })} />);

    expect(screen.getByText('Implicit (1)')).toBeTruthy();
    expect(screen.getByText('Default (0)')).toBeTruthy();
    expect(screen.getByText('MARKHAM_WINS')).toBeTruthy();
  });

  it('still labels a real default statement as default', () => {
    const storyBlockId = 'block-1';
    const defaultVar = createVariable({ name: 'player_name', type: 'default', definedInBlockId: storyBlockId });
    const analysisResult = createEmptyAnalysisResult({
      variables: new Map([['player_name', defaultVar]]),
      storyBlockIds: new Set([storyBlockId]),
    });
    render(<VariableManager {...baseProps({ analysisResult })} />);

    expect(screen.getByText('Default (1)')).toBeTruthy();
    expect(screen.getByText('Implicit (0)')).toBeTruthy();
    expect(screen.getByText('player_name')).toBeTruthy();
  });
});
