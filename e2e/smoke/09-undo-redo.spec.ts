import { testWithProject as test, expect } from '../electron-fixture';

test.describe('undo / redo', () => {
  test('typing in the editor then undoing reverts the change', async ({ window }) => {
    const block = window.locator('[data-block-id]').first();
    await expect(block).toBeVisible({ timeout: 30_000 });
    await block.dblclick();

    const editor = window.locator('.monaco-editor').first();
    await expect(editor).toBeVisible({ timeout: 10_000 });

    const marker = `# undo-test-${Date.now()}`;
    const isMac = process.platform === 'darwin';

    // Append a unique marker at the end of the file
    await editor.click();
    await window.keyboard.press(isMac ? 'Meta+End' : 'Control+End');
    await window.keyboard.press('Enter');
    await window.keyboard.type(marker);

    await expect(editor).toContainText(marker, { timeout: 5_000 });

    // Undo once — the typed text should disappear
    await window.keyboard.press(isMac ? 'Meta+Z' : 'Control+Z');

    await expect(editor).not.toContainText(marker, { timeout: 5_000 });
  });
});
