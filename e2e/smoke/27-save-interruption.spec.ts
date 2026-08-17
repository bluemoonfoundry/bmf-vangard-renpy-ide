import fs from 'fs/promises';
import path from 'path';
import { testWithProject as test, expect, FIXTURE_PROJECT } from '../electron-fixture';

// Regression coverage for review-hardening risk: "save interruption"
// (bmf-vangard-renpy-ide-6o47.6). Simulates a save that fails at the filesystem
// level — the destination path becomes unwritable out from under the app right
// before Ctrl+S — and asserts the app surfaces the failure instead of silently
// dropping the edit, and that the edit survives in the editor so the user can
// retry once the obstruction is cleared.

const SCRIPT_PATH = path.join(FIXTURE_PROJECT, 'game', 'script.rpy');

test.describe('save interruption', () => {
  test('a save that fails at the filesystem level surfaces an error and preserves the unsaved edit', async ({ window }) => {
    const originalContent = await fs.readFile(SCRIPT_PATH, 'utf-8');
    const marker = `# e2e-marker-${Date.now()}`;

    try {
      const block = window.locator('[data-block-id]').first();
      await expect(block).toBeVisible({ timeout: 30_000 });
      await block.dblclick();

      const editor = window.locator('.monaco-editor').first();
      await expect(editor).toBeVisible({ timeout: 10_000 });

      await editor.click();
      const isMac = process.platform === 'darwin';
      await window.keyboard.press(isMac ? 'Meta+End' : 'Control+End');
      await window.keyboard.press('Enter');
      await window.keyboard.type(marker);

      // Replace the destination file with a same-named directory. atomicWriteFile
      // (src/lib/atomicFileWrite.js) writes to a temp file then renames it over
      // the destination — renaming a file onto an existing directory fails with
      // EISDIR/EPERM on every platform, unlike a bare permission-bit flip which
      // Windows and POSIX enforce inconsistently. This makes the failure
      // deterministic and cross-platform.
      await fs.rm(SCRIPT_PATH, { force: true });
      await fs.mkdir(SCRIPT_PATH);

      await window.keyboard.press(isMac ? 'Meta+S' : 'Control+S');

      // handleSaveBlock (src/App.tsx) toasts `Failed to save: ${error}` on a
      // non-success IPC result.
      await expect(window.getByText(/^Failed to save/)).toBeVisible({ timeout: 10_000 });

      // The edit must still be present in the editor — a failed save must not
      // silently discard the user's unsaved work.
      await expect(editor).toContainText(marker);

      // Clear the obstruction and confirm the retry succeeds.
      await fs.rmdir(SCRIPT_PATH);
      await window.keyboard.press(isMac ? 'Meta+S' : 'Control+S');
      await expect(window.getByText(/^Saved/)).toBeVisible({ timeout: 10_000 });

      await expect.poll(async () => {
        const onDisk = await fs.readFile(SCRIPT_PATH, 'utf-8').catch(() => '');
        return onDisk.includes(marker);
      }, { timeout: 10_000 }).toBe(true);
    } finally {
      // SCRIPT_PATH may currently be a directory (if an assertion above threw
      // before cleanup) or a file — handle both before restoring content.
      await fs.rm(SCRIPT_PATH, { recursive: true, force: true });
      await fs.writeFile(SCRIPT_PATH, originalContent, 'utf-8');
    }
  });
});
