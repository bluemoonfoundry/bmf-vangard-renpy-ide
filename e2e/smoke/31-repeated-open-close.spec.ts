import { testWithProject as test, expect } from '../electron-fixture';

// Regression coverage for review-hardening risk: "repeated open/close"
// (bmf-vangard-renpy-ide-6o47.6). The app has no in-session "Close Project"
// action (useFileSystem's closeProject is unwired — App.tsx destructures it as
// `_closeFileSystemProject`); the closest real-world equivalent a user can
// trigger repeatedly is reloading/reopening the same project, which re-runs the
// full IPC load path (project:load, file watcher restart, asset scans) each
// time. This test repeats that cycle several times in one session and asserts
// state stays consistent instead of drifting (leaked toasts, growing block
// count, dangling editor tabs) — a stand-in for the leaked-listener risk called
// out in the epic.

test.describe('repeated open/close', () => {
  test('reloading the same project repeatedly does not accumulate blocks, tabs, or toasts', async ({ window }) => {
    const initialBlock = window.locator('[data-block-id]').first();
    await expect(initialBlock).toBeVisible({ timeout: 30_000 });
    const expectedBlockCount = await window.locator('[data-block-id]').count();
    // Baseline: the default canvas tab itself renders a (hover-revealed) Close
    // tab button, so this is 1, not 0 — see useTabContentRenderer.tsx's renderTabBar.
    const expectedTabCount = await window.getByLabel('Close tab').count();

    for (let cycle = 0; cycle < 5; cycle++) {
      await window.reload();
      await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 30_000 });

      // Block count must be stable across reloads — not a project re-read bug,
      // not a duplicate-render bug.
      await expect(window.locator('[data-block-id]')).toHaveCount(expectedBlockCount);

      // No editor tabs should carry over from the previous session — each
      // reload starts a fresh renderer, so only the default canvas tab exists.
      await expect(window.getByLabel('Close tab')).toHaveCount(expectedTabCount);

      // At most one "Project loaded successfully" toast should be visible at a
      // time — a leaked listener would double-fire this on every subsequent load.
      const successToasts = window.getByText('Project loaded successfully');
      await expect(successToasts).toHaveCount(1, { timeout: 10_000 });
    }
  });
});
