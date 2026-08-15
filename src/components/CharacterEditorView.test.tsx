/**
 * @file CharacterEditorView.test.tsx
 * @description Tests for CharacterEditorView's initialTag/initialName prefill behavior
 * and its Usage Locations table.
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import CharacterEditorView from '@/components/CharacterEditorView';
import { createEmptyAnalysisResult, createBlock, createCharacter, createLabelNode } from '@/test/mocks/sampleData';

describe('CharacterEditorView — initialTag/initialName prefill', () => {
  it('pre-fills tag and name from initialTag/initialName when character is undefined', () => {
    render(
      <CharacterEditorView
        character={undefined}
        onSave={vi.fn()}
        existingTags={[]}
        projectImages={[]}
        imageMetadata={new Map()}
        initialTag="captain_rex"
        initialName="Captain Rex"
        analysisResult={createEmptyAnalysisResult()}
        blocks={[]}
        onOpenEditor={vi.fn()}
      />
    );
    expect((screen.getByLabelText(/tag/i) as HTMLInputElement).value).toBe('captain_rex');
    expect((screen.getByLabelText(/name/i) as HTMLInputElement).value).toBe('Captain Rex');
  });

  it('leaves tag/name blank when neither character nor initial props are given (existing + Add flow)', () => {
    render(
      <CharacterEditorView
        character={undefined}
        onSave={vi.fn()}
        existingTags={[]}
        projectImages={[]}
        imageMetadata={new Map()}
        analysisResult={createEmptyAnalysisResult()}
        blocks={[]}
        onOpenEditor={vi.fn()}
      />
    );
    expect((screen.getByLabelText(/tag/i) as HTMLInputElement).value).toBe('');
    expect((screen.getByLabelText(/name/i) as HTMLInputElement).value).toBe('');
  });
});

describe('CharacterEditorView — Usage Locations', () => {
  const eileen = createCharacter({ tag: 'e', name: 'Eileen' });

  function usageLocationsSection() {
    return screen.getByText('Usage Locations').closest('div') as HTMLElement;
  }

  it('renders a usage row grouped by file and label', () => {
    const block = createBlock({ id: 'block-1', filePath: 'game/script.rpy' });
    const analysisResult = createEmptyAnalysisResult({
      dialogueLines: new Map([['block-1', [{ line: 2, tag: 'e' }, { line: 4, tag: 'e' }]]]),
      labelNodes: [createLabelNode({ blockId: 'block-1', label: 'start', startLine: 1 })],
    });

    render(
      <CharacterEditorView
        character={eileen}
        onSave={vi.fn()}
        existingTags={['e']}
        projectImages={[]}
        imageMetadata={new Map()}
        analysisResult={analysisResult}
        blocks={[block]}
        onOpenEditor={vi.fn()}
      />
    );

    expect(screen.getByText('Usage Locations')).toBeInTheDocument();
    const section = within(usageLocationsSection());
    expect(section.getByText('script.rpy')).toBeInTheDocument();
    expect(section.getByText('start')).toBeInTheDocument();
    expect(section.getByText('2')).toBeInTheDocument(); // Lines count column
  });

  it('shows an empty state when the character has no dialogue lines', () => {
    render(
      <CharacterEditorView
        character={eileen}
        onSave={vi.fn()}
        existingTags={['e']}
        projectImages={[]}
        imageMetadata={new Map()}
        analysisResult={createEmptyAnalysisResult()}
        blocks={[]}
        onOpenEditor={vi.fn()}
      />
    );

    expect(screen.getByText('No dialogue found for this character yet.')).toBeInTheDocument();
  });

  it('calls onOpenEditor with the block id and first occurrence line when a row is clicked', () => {
    const block = createBlock({ id: 'block-1', filePath: 'game/script.rpy' });
    const analysisResult = createEmptyAnalysisResult({
      dialogueLines: new Map([['block-1', [{ line: 2, tag: 'e' }]]]),
      labelNodes: [createLabelNode({ blockId: 'block-1', label: 'start', startLine: 1 })],
    });
    const onOpenEditor = vi.fn();

    render(
      <CharacterEditorView
        character={eileen}
        onSave={vi.fn()}
        existingTags={['e']}
        projectImages={[]}
        imageMetadata={new Map()}
        analysisResult={analysisResult}
        blocks={[block]}
        onOpenEditor={onOpenEditor}
      />
    );

    fireEvent.click(screen.getByText('script.rpy'));
    expect(onOpenEditor).toHaveBeenCalledWith('block-1', 2);
  });

  it('does not render a Usage Locations section for a new (unsaved) character', () => {
    render(
      <CharacterEditorView
        character={undefined}
        onSave={vi.fn()}
        existingTags={[]}
        projectImages={[]}
        imageMetadata={new Map()}
        analysisResult={createEmptyAnalysisResult()}
        blocks={[]}
        onOpenEditor={vi.fn()}
      />
    );

    expect(screen.queryByText('Usage Locations')).not.toBeInTheDocument();
  });
});
