import fs from 'fs/promises';
import path from 'path';
import { testWithProject as test, expect, FIXTURE_PROJECT } from '../electron-fixture';

const SCRIPT_PATH = path.join(FIXTURE_PROJECT, 'game', 'script.rpy');

test.describe('edit, save, and reload', () => {
  test('a saved edit persists to disk and survives a renderer reload', async ({ window }) => {
    const originalContent = await fs.readFile(SCRIPT_PATH, 'utf-8');
    const marker = `# e2e-marker-${Date.now()}`;

    try {
      const block = window.locator('[data-block-id]').first();
      await expect(block).toBeVisible({ timeout: 30_000 });
      await block.dblclick();

      const editor = window.locator('.monaco-editor').first();
      await expect(editor).toBeVisible({ timeout: 10_000 });

      // Click into the editor body, jump to end of file, and append the marker.
      await editor.click();
      const isMac = process.platform === 'darwin';
      await window.keyboard.press(isMac ? 'Meta+End' : 'Control+End');
      await window.keyboard.press('Enter');
      await window.keyboard.type(marker);

      // Ctrl+S is bound as a Monaco editor action (see EditorView.tsx) and
      // triggers handleSaveBlock, which writes the file and toasts on success.
      await window.keyboard.press(isMac ? 'Meta+S' : 'Control+S');
      await expect(window.getByText(/^Saved/)).toBeVisible({ timeout: 10_000 });

      await expect.poll(async () => {
        const onDisk = await fs.readFile(SCRIPT_PATH, 'utf-8');
        return onDisk.includes(marker);
      }, { timeout: 10_000 }).toBe(true);

      // Reload the renderer — the app re-reads --project from the main
      // process and should reopen the same project automatically.
      await window.reload();
      await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 30_000 });

      const reopenedBlock = window.locator('[data-block-id]').first();
      await reopenedBlock.dblclick();
      await expect(window.locator('.monaco-editor').first()).toBeVisible({ timeout: 10_000 });
      await expect(window.locator('.monaco-editor').first()).toContainText(marker, { timeout: 10_000 });
    } finally {
      await fs.writeFile(SCRIPT_PATH, originalContent, 'utf-8');
    }
  });
});
