/**
 * @file CharacterEditorView.test.tsx
 * @description Tests for CharacterEditorView's initialTag/initialName prefill behavior.
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CharacterEditorView from '@/components/CharacterEditorView';

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
      />
    );
    expect((screen.getByLabelText(/tag/i) as HTMLInputElement).value).toBe('');
    expect((screen.getByLabelText(/name/i) as HTMLInputElement).value).toBe('');
  });
});
