import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FirstRunTutorial from '@/components/FirstRunTutorial';

const TUTORIAL_STORAGE_KEY = 'renpy-ide-tutorial-completed';

describe('FirstRunTutorial', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('shows the welcome modal on a fresh install (no completion flag in localStorage)', async () => {
    render(<FirstRunTutorial onComplete={vi.fn()} />);
    expect(await screen.findByText('Welcome to Vangard Studio!', {}, { timeout: 2000 })).toBeTruthy();
  });

  it('does not show the welcome modal when the tutorial was already completed', async () => {
    localStorage.setItem(TUTORIAL_STORAGE_KEY, 'true');
    render(<FirstRunTutorial onComplete={vi.fn()} />);
    await new Promise(resolve => setTimeout(resolve, 1100));
    expect(screen.queryByText('Welcome to Vangard Studio!')).toBeNull();
  });

  it('sets the completion flag and calls onComplete when skipped', async () => {
    const onComplete = vi.fn();
    const user = userEvent.setup();
    render(<FirstRunTutorial onComplete={onComplete} />);

    const skipButton = await screen.findByText("Skip — I'll explore on my own", {}, { timeout: 2000 });
    await user.click(skipButton);

    expect(localStorage.getItem(TUTORIAL_STORAGE_KEY)).toBe('true');
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('shows the welcome modal via forceShow even when already completed', async () => {
    localStorage.setItem(TUTORIAL_STORAGE_KEY, 'true');
    render(<FirstRunTutorial onComplete={vi.fn()} forceShow />);
    await waitFor(() => {
      expect(screen.getByText('Welcome to Vangard Studio!')).toBeTruthy();
    });
  });
});
