import fs from 'fs/promises';
import path from 'path';
import { testWithProject as test, expect, FIXTURE_PROJECT } from '../electron-fixture';

// Regression coverage for review-hardening risk: "external edits"
// (bmf-vangard-renpy-ide-6o47.6). useExternalFileChanges.test.ts already covers
// the dirty/non-dirty branching logic with a mocked electronAPI; these specs
// drive the real Electron file watcher (electron.js's startProjectWatcher) end
// to end against the real filesystem, which the unit tests cannot exercise.

const SCRIPT_PATH = path.join(FIXTURE_PROJECT, 'game', 'script.rpy');

test.describe('external file changes', () => {
  test('a clean (non-dirty) open file silently reloads its content from disk', async ({ window }) => {
    const originalContent = await fs.readFile(SCRIPT_PATH, 'utf-8');
    const externalMarker = `# external-edit-${Date.now()}`;

    try {
      const block = window.locator('[data-block-id]').first();
      await expect(block).toBeVisible({ timeout: 30_000 });
      await block.dblclick();

      const editor = window.locator('.monaco-editor').first();
      await expect(editor).toBeVisible({ timeout: 10_000 });
      // No edits made — the block stays clean.

      await fs.writeFile(SCRIPT_PATH, originalContent + `\n${externalMarker}\n`, 'utf-8');

      // The watcher debounces at 400ms (WATCH_DEBOUNCE_MS in electron.js) before
      // notifying the renderer, which then reloads content — allow generous slack.
      await expect(editor).toContainText(externalMarker, { timeout: 15_000 });

      // No conflict banner for the clean-file case.
      await expect(window.getByText(/was modified outside the editor/i)).not.toBeVisible();
    } finally {
      await fs.writeFile(SCRIPT_PATH, originalContent, 'utf-8');
    }
  });

  test('a dirty open file shows the external-changes banner instead of silently reloading', async ({ window }) => {
    const originalContent = await fs.readFile(SCRIPT_PATH, 'utf-8');
    const localMarker = `# local-edit-${Date.now()}`;
    const externalMarker = `# external-edit-${Date.now()}`;

    try {
      const block = window.locator('[data-block-id]').first();
      await expect(block).toBeVisible({ timeout: 30_000 });
      await block.dblclick();

      const editor = window.locator('.monaco-editor').first();
      await expect(editor).toBeVisible({ timeout: 10_000 });

      // Make the block dirty without saving.
      await editor.click();
      const isMac = process.platform === 'darwin';
      await window.keyboard.press(isMac ? 'Meta+End' : 'Control+End');
      await window.keyboard.press('Enter');
      await window.keyboard.type(localMarker);

      await fs.writeFile(SCRIPT_PATH, originalContent + `\n${externalMarker}\n`, 'utf-8');

      const banner = window.getByText(/was modified outside the editor/i);
      await expect(banner).toBeVisible({ timeout: 15_000 });

      // The dirty in-editor content must be left untouched while the conflict
      // is unresolved — no silent overwrite from disk.
      await expect(editor).toContainText(localMarker);
      await expect(editor).not.toContainText(externalMarker);

      // "Keep current" dismisses the banner without discarding local edits.
      await window.getByRole('button', { name: 'Keep current' }).click();
      await expect(banner).not.toBeVisible({ timeout: 5_000 });
      await expect(editor).toContainText(localMarker);
    } finally {
      await fs.writeFile(SCRIPT_PATH, originalContent, 'utf-8');
    }
  });
});
