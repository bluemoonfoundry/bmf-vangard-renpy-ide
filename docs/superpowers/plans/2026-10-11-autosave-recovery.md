# Autosave Recovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Autosave unsaved work to bounded per-session snapshots in the app data folder, and offer Restore / Discard / Decide later when a project is reopened after a crash.

**Architecture:** The renderer hook `useRecoverySnapshots` builds a snapshot of only the unsaved state and sends it over `recovery:*` IPC. The main-process module `recoveryStore.js` fingerprints the files on disk, writes the snapshot atomically to `userData/recovery/<project-id>/session-<id>.json`, and enforces the size limits. On project open, `useProjectLoad` asks for pending snapshots and `RecoveryModal` lets the user choose. `applyRecoverySnapshot` restores the selected items as unsaved changes only and never writes to disk.

**Tech Stack:** Electron (ESM main process), React 19 + TypeScript, `use-immer`, Vitest + JSDOM + Testing Library, Playwright E2E.

**Spec:** `docs/superpowers/specs/2026-10-11-autosave-recovery-design.md`

## Global Constraints

- Snapshots live in `path.join(app.getPath('userData'), 'recovery')`, overridable only by the test-only env var `RENIDE_RECOVERY_DIR`.
- Limits: `maxSnapshotBytes = 25 * 1024 * 1024`, `maxFilesPerProject = 3`, `maxTotalBytes = 200 * 1024 * 1024`, `maxAgeMs = 30 * 24 * 60 * 60 * 1000`.
- Timing: debounce `5000` ms, max interval `60000` ms.
- Restoring never writes project files. Restored items become dirty (`dirtyBlockIds`, untitled `isDirty`, `hasUnsavedSettings`).
- Esc and the close button on `RecoveryModal` mean **Decide later**. Discard requires an inline confirmation.
- Imports use the `@/` alias (never `../`) in `src/`. Main-process modules in `src/lib/*.js` are plain ESM with relative imports (`./atomicFileWrite.js`), like `saveTransaction.js`.
- IPC channels follow `namespace:action`. The preload exposes them as `electronAPI.recovery.{write,clear,listPending,discardPending}`.
- Autosave failures are logged with `logger.warn` at most once per session, and never shown as a toast.

**Planning refinements to the spec** (the spec file is updated in Task 1):
1. **Live-instance guard.** The app has no single-instance lock, so a second instance opening the same project would otherwise offer the first instance's *live* snapshot as a crash. Snapshots now record the main-process `pid`. `listPending` skips a snapshot whose `pid` is a different process that is still alive.
2. **No `notifyEdit()`.** The editor's `onContentChange` already writes into `blocks` (debounced 800 ms), and untitled edits update `untitledFiles`. The hook therefore restarts its timer on changes to `blocks`, `untitledFiles`, the dirty sets, `hasUnsavedSettings`, and the identity of the memoised settings builder. Nothing extra is needed on the editor path.

## Review Focus

1. **A second app instance on the same project:** the dialog must not offer the other instance's live session. Test in Task 1: `listPending` skips a snapshot whose `pid` is alive and isn't `process.pid`.
2. **The user saves while a snapshot write is in flight:** the write finishes after "nothing unsaved", which would leave a stale file. Test in Task 4: when a write resolves with nothing unsaved, `clear` is called.
3. **The project folder is renamed or moved after a crash:** no dialog and no error, since this is an accepted non-goal. Test in Task 1: `listPending` for a different root returns `null` and leaves the file in place.
4. **Disk full or permission denied while autosaving:** typing is unaffected, no toast, one warning. Test in Task 4: a rejected `write` is logged once across two failures and the hook doesn't throw.
5. **A crash right after a full save, before the snapshot is cleared:** nothing should be offered. Test in Task 1: entries equal to the current disk content are dropped, and an all-dropped snapshot returns `null`.

---

## File Structure

| File | Responsibility |
|---|---|
| `src/lib/recoveryStore.js` | **New.** Main-process storage: paths, fingerprints, limits, pending lookup, expiry. No Electron imports. |
| `src/lib/recoveryStore.test.ts` | **New.** Tests against real temp folders |
| `electron.js` | `recovery:*` IPC; clear the session file on intentional quit; expiry sweep on startup |
| `preload.js` | `electronAPI.recovery.*` |
| `src/types.ts` | `RecoverySnapshotPayload`, `PendingRecovery`, `RecoveryFileStatus`, `RecoverySelection`, IPC typings |
| `src/test/mocks/electronAPI.ts` | `recovery` mocks |
| `src/hooks/useProjectIO.ts` | Extract `buildProjectSettingsPayload`; expose `buildSettingsForDisk` |
| `src/hooks/useRecoverySnapshots.ts` | **New.** Capture hook |
| `src/hooks/useUntitledFiles.ts` | `createRecoveredUntitledFile(title, content)` |
| `src/hooks/useProjectLoad.ts` | Extract `hydrateSettingsFromSnapshot`; session id plus `listPending` after load |
| `src/lib/recoveryRestore.ts` | **New.** `applyRecoverySnapshot` |
| `src/components/RecoveryModal.tsx` | **New.** Startup dialog |
| `src/App.tsx` | Wiring |
| `e2e/smoke/34-crash-recovery.spec.ts` | **New.** Acceptance |

---

### Task 1: `recoveryStore.js`, the main-process snapshot store

**Files:**
- Create: `src/lib/recoveryStore.js`
- Create: `src/lib/recoveryStore.test.ts`
- Modify: `docs/superpowers/specs/2026-10-11-autosave-recovery-design.md` (record the two planning refinements)

**Interfaces:**
- Consumes: `atomicWriteFile(filePath, content, encoding)` from `./atomicFileWrite.js`
- Produces:
  - `RECOVERY_LIMITS`: `{ maxSnapshotBytes, maxFilesPerProject, maxTotalBytes, maxAgeMs }`
  - `projectIdFor(rootPath: string): string`
  - `writeSnapshot({ recoveryDir, projectRoot, sessionId, payload, limits?, pid? }): Promise<{ success: true, skipped?: 'too-large' }>` (throws on invalid input)
  - `clearSnapshot({ recoveryDir, projectRoot, sessionId }): Promise<void>`
  - `listPending({ recoveryDir, projectRoot, sessionId, isAlive? }): Promise<PendingRecovery | null>`
  - `discardPending({ recoveryDir, projectRoot, sessionId }): Promise<void>`
  - `sweepExpired({ recoveryDir, limits?, now? }): Promise<void>`
  - A `payload` is `{ files: {relativePath, content}[], untitled: {id, title, content}[], settings: object | null }`
  - `PendingRecovery` is `{ sessionId, projectRoot, updatedAt, files: {relativePath, content, status: 'unchanged'|'changed'|'deleted'}[], untitled: {id,title,content}[], settings: object|null, settingsStatus: 'unchanged'|'changed'|null }`

- [ ] **Step 1: Update the spec with the planning refinements**

In `docs/superpowers/specs/2026-10-11-autosave-recovery-design.md`:
- Add `"pid": 12345,` after `"sessionId": "…",` in the snapshot format block.
- Append this paragraph to the end of the "Session-scoped files" bullet list:

```markdown
- **Live-instance guard.** The app has no single-instance lock, so each snapshot records the main-process `pid`. `listPending` skips a snapshot whose `pid` is a different process that is still alive (`process.kill(pid, 0)` succeeds), so a second instance never offers the first instance's live session. Snapshots from the same process with a different `sessionId` (an earlier session in this run) are treated as pending.
```

In section 2 (Capture), replace the sentence that begins `It also exposes \`notifyEdit()\`` with:

```markdown
The hook restarts its timer whenever `blocks`, `untitledFiles`, the dirty sets, `hasUnsavedSettings`, or the identity of the memoised settings builder change. Editor keystrokes reach `blocks` via the existing 800 ms `onContentChange` debounce, so no separate `notifyEdit()` call is needed.
```

Then remove the `notifyEdit` mention from the App row of the Files table.

- [ ] **Step 2: Write the failing tests**

Create `src/lib/recoveryStore.test.ts`:

```ts
// Runs the recovery snapshot store against real temp directories (names with a
// space and non-ASCII characters, like real Windows profiles and projects).
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';

import {
  RECOVERY_LIMITS,
  projectIdFor,
  writeSnapshot,
  clearSnapshot,
  listPending,
  discardPending,
  sweepExpired,
} from './recoveryStore.js';

const S1 = '11111111-1111-4111-8111-111111111111';
const S2 = '22222222-2222-4222-8222-222222222222';
const S3 = '33333333-3333-4333-8333-333333333333';
const S4 = '44444444-4444-4444-8444-444444444444';
const DEAD = () => false;

let base: string;
let recoveryDir: string;
let projectRoot: string;

const projDir = () => path.join(recoveryDir, projectIdFor(projectRoot));
const sessionPath = (id: string) => path.join(projDir(), `session-${id}.json`);
const exists = (p: string) => fs.access(p).then(() => true, () => false);

async function writeProjectFile(rel: string, content: string) {
  await fs.mkdir(path.dirname(path.join(projectRoot, rel)), { recursive: true });
  await fs.writeFile(path.join(projectRoot, rel), content, 'utf-8');
}

const payload = (over: Partial<{ files: { relativePath: string; content: string }[]; untitled: { id: string; title: string; content: string }[]; settings: Record<string, unknown> | null }> = {}) => ({
  files: [{ relativePath: 'game/script.rpy', content: 'label start:\n    "unsaved"\n' }],
  untitled: [],
  settings: null,
  ...over,
});

async function age(p: string, msAgo: number) {
  const t = new Date(Date.now() - msAgo);
  await fs.utimes(p, t, t);
}

beforeEach(async () => {
  base = await fs.mkdtemp(path.join(os.tmpdir(), 'vangard recovery ゲーム-'));
  recoveryDir = path.join(base, 'userData', 'recovery');
  projectRoot = path.join(base, 'My Project 第一');
  await writeProjectFile('game/script.rpy', 'label start:\n    "on disk"\n');
});

afterEach(async () => {
  await fs.rm(base, { recursive: true, force: true });
});

describe('writeSnapshot', () => {
  it('writes a session file with disk fingerprints and the writer pid', async () => {
    const r = await writeSnapshot({ recoveryDir, projectRoot, sessionId: S1, payload: payload() });
    expect(r).toEqual({ success: true });
    const snap = JSON.parse(await fs.readFile(sessionPath(S1), 'utf-8'));
    expect(snap.version).toBe(1);
    expect(snap.pid).toBe(process.pid);
    expect(snap.projectRoot).toBe(projectRoot);
    expect(snap.files[0].diskSha256).toMatch(/^[0-9a-f]{64}$/);
    expect(snap.settingsDiskSha256).toBeNull();
  });

  it('fingerprints project.ide.json only when settings are included', async () => {
    await writeProjectFile('game/project.ide.json', '{"draftingMode":false}');
    await writeSnapshot({ recoveryDir, projectRoot, sessionId: S1, payload: payload({ settings: { draftingMode: true } }) });
    const snap = JSON.parse(await fs.readFile(sessionPath(S1), 'utf-8'));
    expect(snap.settingsDiskSha256).toMatch(/^[0-9a-f]{64}$/);
  });

  it('records a null fingerprint for a file missing on disk', async () => {
    await writeSnapshot({ recoveryDir, projectRoot, sessionId: S1, payload: payload({ files: [{ relativePath: 'game/new.rpy', content: 'x' }] }) });
    const snap = JSON.parse(await fs.readFile(sessionPath(S1), 'utf-8'));
    expect(snap.files[0].diskSha256).toBeNull();
  });

  it.each(['', '../evil', 'not-a-uuid', '11111111-1111-4111-8111-111111111111/../x'])('rejects an invalid session id %j', async (sessionId) => {
    await expect(writeSnapshot({ recoveryDir, projectRoot, sessionId, payload: payload() })).rejects.toThrow(/session id/);
  });

  it('rejects a file path that escapes the project root', async () => {
    await expect(writeSnapshot({
      recoveryDir, projectRoot, sessionId: S1,
      payload: payload({ files: [{ relativePath: '../outside.rpy', content: 'x' }] }),
    })).rejects.toThrow(/escapes the project root/);
  });

  it('rejects a malformed payload', async () => {
    await expect(writeSnapshot({ recoveryDir, projectRoot, sessionId: S1, payload: { files: 'nope' } as never })).rejects.toThrow(/payload/);
  });

  it('skips a snapshot over the size limit and keeps the previous one', async () => {
    await writeSnapshot({ recoveryDir, projectRoot, sessionId: S1, payload: payload() });
    const before = await fs.readFile(sessionPath(S1), 'utf-8');
    const r = await writeSnapshot({
      recoveryDir, projectRoot, sessionId: S1,
      payload: payload({ files: [{ relativePath: 'game/script.rpy', content: 'x'.repeat(2048) }] }),
      limits: { ...RECOVERY_LIMITS, maxSnapshotBytes: 1024 },
    });
    expect(r).toEqual({ success: true, skipped: 'too-large' });
    expect(await fs.readFile(sessionPath(S1), 'utf-8')).toBe(before);
  });

  it('keeps at most maxFilesPerProject session files, never deleting the writer', async () => {
    for (const [i, id] of [S1, S2, S3].entries()) {
      await writeSnapshot({ recoveryDir, projectRoot, sessionId: id, payload: payload() });
      await age(sessionPath(id), (10 - i) * 1000);
    }
    await writeSnapshot({ recoveryDir, projectRoot, sessionId: S4, payload: payload() });
    expect(await exists(sessionPath(S1))).toBe(false); // oldest
    expect(await exists(sessionPath(S2))).toBe(true);
    expect(await exists(sessionPath(S3))).toBe(true);
    expect(await exists(sessionPath(S4))).toBe(true);
  });

  it('enforces the global size cap across projects, least recently updated first', async () => {
    const otherRoot = path.join(base, 'Other');
    await fs.mkdir(path.join(otherRoot, 'game'), { recursive: true });
    await writeSnapshot({ recoveryDir, projectRoot: otherRoot, sessionId: S1, payload: payload({ files: [] , untitled: [{ id: 'u', title: 'U', content: 'y'.repeat(600) }] }) });
    const otherFile = path.join(recoveryDir, projectIdFor(otherRoot), `session-${S1}.json`);
    await age(otherFile, 60_000);
    await writeSnapshot({
      recoveryDir, projectRoot, sessionId: S2,
      payload: payload({ files: [], untitled: [{ id: 'u', title: 'U', content: 'z'.repeat(600) }] }),
      limits: { ...RECOVERY_LIMITS, maxTotalBytes: 1200 },
    });
    expect(await exists(otherFile)).toBe(false);
    expect(await exists(sessionPath(S2))).toBe(true);
    // the emptied project folder is removed
    expect(await exists(path.dirname(otherFile))).toBe(false);
  });
});

describe('listPending', () => {
  it('ignores the current session own file', async () => {
    await writeSnapshot({ recoveryDir, projectRoot, sessionId: S1, payload: payload() });
    expect(await listPending({ recoveryDir, projectRoot, sessionId: S1, isAlive: DEAD })).toBeNull();
  });

  it('returns the newest pending snapshot with per-file disk status', async () => {
    await writeProjectFile('game/changed.rpy', 'v1');
    await writeProjectFile('game/gone.rpy', 'v1');
    await writeSnapshot({
      recoveryDir, projectRoot, sessionId: S1,
      payload: payload({
        files: [
          { relativePath: 'game/script.rpy', content: 'unsaved A' },
          { relativePath: 'game/changed.rpy', content: 'unsaved B' },
          { relativePath: 'game/gone.rpy', content: 'unsaved C' },
        ],
        untitled: [{ id: 'untitled-1', title: 'Untitled-1', content: 'draft' }],
      }),
    });
    await writeProjectFile('game/changed.rpy', 'v2 from git pull');
    await fs.rm(path.join(projectRoot, 'game/gone.rpy'));

    const pending = await listPending({ recoveryDir, projectRoot, sessionId: S2, isAlive: DEAD });
    expect(pending?.sessionId).toBe(S1);
    expect(pending?.files.map(f => [f.relativePath, f.status])).toEqual([
      ['game/script.rpy', 'unchanged'],
      ['game/changed.rpy', 'changed'],
      ['game/gone.rpy', 'deleted'],
    ]);
    expect(pending?.untitled).toEqual([{ id: 'untitled-1', title: 'Untitled-1', content: 'draft' }]);
    expect(pending?.settingsStatus).toBeNull();
  });

  it('flags workspace settings changed on disk since the snapshot', async () => {
    await writeProjectFile('game/project.ide.json', '{"a":1}');
    await writeSnapshot({ recoveryDir, projectRoot, sessionId: S1, payload: payload({ files: [], settings: { draftingMode: true } }) });
    await writeProjectFile('game/project.ide.json', '{"a":2}');
    const pending = await listPending({ recoveryDir, projectRoot, sessionId: S2, isAlive: DEAD });
    expect(pending?.settings).toEqual({ draftingMode: true });
    expect(pending?.settingsStatus).toBe('changed');
  });

  it('drops entries equal to current disk content and returns null when nothing is left', async () => {
    await writeSnapshot({ recoveryDir, projectRoot, sessionId: S1, payload: payload({ files: [{ relativePath: 'game/script.rpy', content: 'saved' }] }) });
    await writeProjectFile('game/script.rpy', 'saved'); // crash happened right after a save
    expect(await listPending({ recoveryDir, projectRoot, sessionId: S2, isAlive: DEAD })).toBeNull();
  });

  it('skips a snapshot owned by another live process (second app instance)', async () => {
    await writeSnapshot({ recoveryDir, projectRoot, sessionId: S1, payload: payload(), pid: 999_999 });
    expect(await listPending({ recoveryDir, projectRoot, sessionId: S2, isAlive: (pid: number) => pid === 999_999 })).toBeNull();
    expect((await listPending({ recoveryDir, projectRoot, sessionId: S2, isAlive: DEAD }))?.sessionId).toBe(S1);
  });

  it('treats an earlier session from this same process as pending', async () => {
    await writeSnapshot({ recoveryDir, projectRoot, sessionId: S1, payload: payload() }); // pid = process.pid
    const pending = await listPending({ recoveryDir, projectRoot, sessionId: S2, isAlive: () => true });
    expect(pending?.sessionId).toBe(S1);
  });

  it('returns null (and leaves the file) for a project that was moved or renamed', async () => {
    await writeSnapshot({ recoveryDir, projectRoot, sessionId: S1, payload: payload() });
    expect(await listPending({ recoveryDir, projectRoot: path.join(base, 'Moved'), sessionId: S2, isAlive: DEAD })).toBeNull();
    expect(await exists(sessionPath(S1))).toBe(true);
  });

  it('ignores a snapshot whose stored projectRoot does not match', async () => {
    await writeSnapshot({ recoveryDir, projectRoot, sessionId: S1, payload: payload() });
    const snap = JSON.parse(await fs.readFile(sessionPath(S1), 'utf-8'));
    await fs.writeFile(sessionPath(S1), JSON.stringify({ ...snap, projectRoot: '/somewhere/else' }));
    expect(await listPending({ recoveryDir, projectRoot, sessionId: S2, isAlive: DEAD })).toBeNull();
    expect(await exists(sessionPath(S1))).toBe(true);
  });

  it.each([
    ['unparseable JSON', '{"version": 1, '],
    ['an unknown version', JSON.stringify({ version: 99 })],
  ])('moves %s aside as .corrupt and keeps looking', async (_label, contents) => {
    await writeSnapshot({ recoveryDir, projectRoot, sessionId: S1, payload: payload() });
    await age(sessionPath(S1), 60_000);
    await fs.writeFile(sessionPath(S3), contents);
    const pending = await listPending({ recoveryDir, projectRoot, sessionId: S2, isAlive: DEAD });
    expect(pending?.sessionId).toBe(S1);
    expect(await exists(sessionPath(S3))).toBe(false);
    expect(await exists(`${sessionPath(S3)}.corrupt`)).toBe(true);
  });

  it('returns null when the recovery folder does not exist yet', async () => {
    expect(await listPending({ recoveryDir, projectRoot, sessionId: S2, isAlive: DEAD })).toBeNull();
  });
});

describe('clearSnapshot / discardPending', () => {
  it('clearSnapshot removes only the given session file', async () => {
    await writeSnapshot({ recoveryDir, projectRoot, sessionId: S1, payload: payload() });
    await writeSnapshot({ recoveryDir, projectRoot, sessionId: S2, payload: payload() });
    await clearSnapshot({ recoveryDir, projectRoot, sessionId: S1 });
    expect(await exists(sessionPath(S1))).toBe(false);
    expect(await exists(sessionPath(S2))).toBe(true);
    await clearSnapshot({ recoveryDir, projectRoot, sessionId: S1 }); // idempotent
  });

  it('discardPending removes every other session file but never the current one', async () => {
    for (const id of [S1, S2, S3]) await writeSnapshot({ recoveryDir, projectRoot, sessionId: id, payload: payload() });
    await discardPending({ recoveryDir, projectRoot, sessionId: S3 });
    expect(await exists(sessionPath(S1))).toBe(false);
    expect(await exists(sessionPath(S2))).toBe(false);
    expect(await exists(sessionPath(S3))).toBe(true);
  });
});

describe('sweepExpired', () => {
  it('deletes files (including .corrupt) older than maxAgeMs and removes empty project folders', async () => {
    await writeSnapshot({ recoveryDir, projectRoot, sessionId: S1, payload: payload() });
    await fs.writeFile(`${sessionPath(S2)}.corrupt`, 'x');
    await age(sessionPath(S1), RECOVERY_LIMITS.maxAgeMs + 1000);
    await age(`${sessionPath(S2)}.corrupt`, RECOVERY_LIMITS.maxAgeMs + 1000);
    await sweepExpired({ recoveryDir });
    expect(await exists(projDir())).toBe(false);
  });

  it('keeps recent files', async () => {
    await writeSnapshot({ recoveryDir, projectRoot, sessionId: S1, payload: payload() });
    await sweepExpired({ recoveryDir });
    expect(await exists(sessionPath(S1))).toBe(true);
  });

  it('is a no-op when the recovery folder does not exist', async () => {
    await expect(sweepExpired({ recoveryDir })).resolves.toBeUndefined();
  });
});
```

- [ ] **Step 3: Run the tests to verify they fail**

Run: `npx vitest run src/lib/recoveryStore.test.ts`
Expected: FAIL, "Failed to resolve import ./recoveryStore.js"

- [ ] **Step 4: Implement `src/lib/recoveryStore.js`**

```js
import fsPromises from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { atomicWriteFile } from './atomicFileWrite.js';

// Crash-recovery snapshots of unsaved work (bmf-vangard-renpy-ide-b70a.2.3).
//
// Each app session writes only its own file:
//   <recoveryDir>/<sha256(normalized project root)>/session-<sessionId>.json
// so a new session can never overwrite or delete a snapshot left by a crashed
// one. Any other session's file is "pending" on the next open, unless it
// belongs to another app instance that is still running (no single-instance
// lock exists). Snapshots hold unsaved content plus a sha256 fingerprint of
// each file's on-disk content at write time; comparing that fingerprint later
// tells whether the file changed on disk after the snapshot.

export const RECOVERY_LIMITS = Object.freeze({
    maxSnapshotBytes: 25 * 1024 * 1024,
    maxFilesPerProject: 3,
    maxTotalBytes: 200 * 1024 * 1024,
    maxAgeMs: 30 * 24 * 60 * 60 * 1000,
});

const SNAPSHOT_VERSION = 1;
const SESSION_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SESSION_FILE = /^session-([^/\\]+)\.json(\.corrupt)?$/;

const sha256 = (data) =>
    crypto.createHash('sha256').update(typeof data === 'string' ? Buffer.from(data, 'utf-8') : data).digest('hex');

function normalizeRoot(rootPath) {
    const resolved = path.resolve(rootPath).replace(/\\/g, '/').replace(/\/+$/, '');
    return process.platform === 'win32' ? resolved.toLowerCase() : resolved;
}

export function projectIdFor(rootPath) {
    return sha256(normalizeRoot(rootPath));
}

function assertSessionId(sessionId) {
    if (typeof sessionId !== 'string' || !SESSION_ID.test(sessionId)) {
        throw new Error('Invalid recovery session id');
    }
}

function resolveInsideRoot(rootPath, relativePath) {
    const root = path.resolve(rootPath);
    const resolved = path.resolve(root, relativePath);
    if (resolved !== root && !resolved.startsWith(root + path.sep)) {
        throw new Error(`Recovery entry escapes the project root: ${relativePath}`);
    }
    return resolved;
}

const projectDir = (recoveryDir, projectRoot) => path.join(recoveryDir, projectIdFor(projectRoot));
const sessionPath = (recoveryDir, projectRoot, sessionId) =>
    path.join(projectDir(recoveryDir, projectRoot), `session-${sessionId}.json`);
const settingsPathFor = (projectRoot) => path.join(projectRoot, 'game', 'project.ide.json');

async function diskSha(absPath) {
    try {
        return sha256(await fsPromises.readFile(absPath));
    } catch (err) {
        if (err.code === 'ENOENT') return null;
        throw err;
    }
}

function validatePayload(payload) {
    const ok = payload && typeof payload === 'object'
        && Array.isArray(payload.files)
        && payload.files.every(f => f && typeof f.relativePath === 'string' && typeof f.content === 'string')
        && Array.isArray(payload.untitled)
        && payload.untitled.every(u => u && typeof u.id === 'string' && typeof u.title === 'string' && typeof u.content === 'string')
        && (payload.settings === null || (typeof payload.settings === 'object' && !Array.isArray(payload.settings)));
    if (!ok) throw new Error('Invalid recovery payload');
}

/** Session files in one project folder (temp files from atomicWriteFile start with '.', so never match). */
async function listSessionFiles(dir) {
    let entries;
    try {
        entries = await fsPromises.readdir(dir, { withFileTypes: true });
    } catch (err) {
        if (err.code === 'ENOENT') return [];
        throw err;
    }
    const out = [];
    for (const entry of entries) {
        const m = entry.isFile() && entry.name.match(SESSION_FILE);
        if (!m) continue;
        const full = path.join(dir, entry.name);
        const stat = await fsPromises.stat(full).catch(() => null);
        if (!stat) continue;
        out.push({ full, sessionId: m[1], corrupt: Boolean(m[2]), size: stat.size, mtimeMs: stat.mtimeMs });
    }
    return out;
}

async function listProjectDirs(recoveryDir) {
    try {
        const entries = await fsPromises.readdir(recoveryDir, { withFileTypes: true });
        return entries.filter(e => e.isDirectory()).map(e => path.join(recoveryDir, e.name));
    } catch (err) {
        if (err.code === 'ENOENT') return [];
        throw err;
    }
}

async function removeIfEmpty(dir) {
    try {
        if ((await fsPromises.readdir(dir)).length === 0) await fsPromises.rmdir(dir);
    } catch {
        // best effort
    }
}

const unlinkQuiet = (p) => fsPromises.unlink(p).catch(err => { if (err.code !== 'ENOENT') throw err; });

async function enforceBounds({ recoveryDir, projectRoot, sessionId, limits }) {
    const ownPath = sessionPath(recoveryDir, projectRoot, sessionId);

    // Per project: newest maxFilesPerProject session files survive (own always kept).
    const mine = (await listSessionFiles(projectDir(recoveryDir, projectRoot)))
        .filter(f => !f.corrupt)
        .sort((a, b) => b.mtimeMs - a.mtimeMs);
    const others = mine.filter(f => f.full !== ownPath);
    for (const f of others.slice(Math.max(0, limits.maxFilesPerProject - 1))) await unlinkQuiet(f.full);

    // Global: delete least recently updated until under maxTotalBytes (own always kept).
    const all = [];
    for (const dir of await listProjectDirs(recoveryDir)) all.push(...(await listSessionFiles(dir)).map(f => ({ ...f, dir })));
    let total = all.reduce((sum, f) => sum + f.size, 0);
    for (const f of all.filter(x => x.full !== ownPath).sort((a, b) => a.mtimeMs - b.mtimeMs)) {
        if (total <= limits.maxTotalBytes) break;
        await unlinkQuiet(f.full);
        total -= f.size;
        await removeIfEmpty(f.dir);
    }
}

export async function writeSnapshot({ recoveryDir, projectRoot, sessionId, payload, limits = RECOVERY_LIMITS, pid = process.pid }) {
    assertSessionId(sessionId);
    validatePayload(payload);

    const files = [];
    for (const f of payload.files) {
        const abs = resolveInsideRoot(projectRoot, f.relativePath);
        files.push({ relativePath: f.relativePath, content: f.content, diskSha256: await diskSha(abs) });
    }
    const snapshot = {
        version: SNAPSHOT_VERSION,
        sessionId,
        pid,
        projectRoot,
        updatedAt: new Date().toISOString(),
        files,
        untitled: payload.untitled,
        settings: payload.settings,
        settingsDiskSha256: payload.settings ? await diskSha(settingsPathFor(projectRoot)) : null,
    };
    const json = JSON.stringify(snapshot);
    if (Buffer.byteLength(json, 'utf-8') > limits.maxSnapshotBytes) return { success: true, skipped: 'too-large' };

    await fsPromises.mkdir(projectDir(recoveryDir, projectRoot), { recursive: true });
    await atomicWriteFile(sessionPath(recoveryDir, projectRoot, sessionId), json, 'utf-8');
    await enforceBounds({ recoveryDir, projectRoot, sessionId, limits });
    return { success: true };
}

export async function clearSnapshot({ recoveryDir, projectRoot, sessionId }) {
    assertSessionId(sessionId);
    await unlinkQuiet(sessionPath(recoveryDir, projectRoot, sessionId));
    await removeIfEmpty(projectDir(recoveryDir, projectRoot));
}

function defaultIsAlive(pid) {
    try {
        process.kill(pid, 0);
        return true;
    } catch (err) {
        return err.code === 'EPERM'; // exists but owned by someone else
    }
}

function isValidSnapshot(s) {
    return s && s.version === SNAPSHOT_VERSION && typeof s.sessionId === 'string' && typeof s.projectRoot === 'string'
        && Array.isArray(s.files) && Array.isArray(s.untitled);
}

async function toPending(snap, projectRoot) {
    const files = [];
    for (const f of snap.files) {
        const current = await diskSha(resolveInsideRoot(projectRoot, f.relativePath));
        if (current === null) {
            files.push({ relativePath: f.relativePath, content: f.content, status: 'deleted' });
        } else if (current === sha256(f.content)) {
            continue; // already on disk -- nothing to recover
        } else {
            files.push({ relativePath: f.relativePath, content: f.content, status: current === f.diskSha256 ? 'unchanged' : 'changed' });
        }
    }
    let settingsStatus = null;
    if (snap.settings) {
        settingsStatus = (await diskSha(settingsPathFor(projectRoot))) === snap.settingsDiskSha256 ? 'unchanged' : 'changed';
    }
    if (files.length === 0 && snap.untitled.length === 0 && !snap.settings) return null;
    return {
        sessionId: snap.sessionId,
        projectRoot: snap.projectRoot,
        updatedAt: snap.updatedAt,
        files,
        untitled: snap.untitled,
        settings: snap.settings ?? null,
        settingsStatus,
    };
}

export async function listPending({ recoveryDir, projectRoot, sessionId, isAlive = defaultIsAlive }) {
    assertSessionId(sessionId);
    const candidates = (await listSessionFiles(projectDir(recoveryDir, projectRoot)))
        .filter(f => !f.corrupt && f.sessionId !== sessionId)
        .sort((a, b) => b.mtimeMs - a.mtimeMs);

    for (const file of candidates) {
        let snap;
        try {
            snap = JSON.parse(await fsPromises.readFile(file.full, 'utf-8'));
            if (!isValidSnapshot(snap)) throw new Error('unrecognised snapshot format');
        } catch {
            await fsPromises.rename(file.full, `${file.full}.corrupt`).catch(() => {});
            continue;
        }
        if (normalizeRoot(snap.projectRoot) !== normalizeRoot(projectRoot)) continue;
        if (typeof snap.pid === 'number' && snap.pid !== process.pid && isAlive(snap.pid)) continue;
        try {
            const pending = await toPending(snap, projectRoot);
            if (pending) return pending;
        } catch {
            continue; // e.g. a journal entry escaping the root -- never offered
        }
    }
    return null;
}

export async function discardPending({ recoveryDir, projectRoot, sessionId }) {
    assertSessionId(sessionId);
    const dir = projectDir(recoveryDir, projectRoot);
    for (const f of await listSessionFiles(dir)) {
        if (!f.corrupt && f.sessionId !== sessionId) await unlinkQuiet(f.full);
    }
    await removeIfEmpty(dir);
}

export async function sweepExpired({ recoveryDir, limits = RECOVERY_LIMITS, now = Date.now() }) {
    for (const dir of await listProjectDirs(recoveryDir)) {
        for (const f of await listSessionFiles(dir)) {
            if (now - f.mtimeMs > limits.maxAgeMs) await unlinkQuiet(f.full);
        }
        await removeIfEmpty(dir);
    }
}
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npx vitest run src/lib/recoveryStore.test.ts`
Expected: PASS (all tests)

- [ ] **Step 6: Lint and commit**

```bash
npx eslint src/lib/recoveryStore.js src/lib/recoveryStore.test.ts
git add src/lib/recoveryStore.js src/lib/recoveryStore.test.ts docs/superpowers/specs/2026-10-11-autosave-recovery-design.md
git commit -m "feat(recovery): main-process snapshot store with bounds and pending lookup"
```

---

### Task 2: IPC, preload, types, mocks, quit cleanup, startup sweep

**Files:**
- Modify: `electron.js` (imports near line 43; `project:load` handler; `ide-state-saved-for-quit` / `force-quit` handlers; `app.whenReady`)
- Modify: `preload.js`
- Modify: `src/types.ts`
- Modify: `src/test/mocks/electronAPI.ts`

**Interfaces:**
- Consumes: Task 1 exports.
- Produces (renderer-facing types in `src/types.ts`):

```ts
export type RecoveryFileStatus = 'unchanged' | 'changed' | 'deleted';
export interface RecoverySnapshotPayload {
  files: { relativePath: string; content: string }[];
  untitled: { id: string; title: string; content: string }[];
  settings: ProjectSettings | null;
}
export interface PendingRecovery {
  sessionId: string;
  projectRoot: string;
  updatedAt: string;
  files: { relativePath: string; content: string; status: RecoveryFileStatus }[];
  untitled: { id: string; title: string; content: string }[];
  settings: ProjectSettings | null;
  settingsStatus: 'unchanged' | 'changed' | null;
}
export interface RecoverySelection {
  files: string[];      // relativePaths
  untitled: string[];   // untitled ids
  settings: boolean;
}
export interface RecoveryWriteResult { success: boolean; skipped?: 'too-large'; error?: string }
```

and `electronAPI.recovery: { write(sessionId: string, payload: RecoverySnapshotPayload): Promise<RecoveryWriteResult>; clear(sessionId: string): Promise<{ success: boolean; error?: string }>; listPending(sessionId: string): Promise<PendingRecovery | null>; discardPending(sessionId: string): Promise<{ success: boolean; error?: string }> }`.

- [ ] **Step 1: Add the types**

In `src/types.ts`, insert the type block above (`RecoveryFileStatus` … `RecoveryWriteResult`) immediately before the line `/** Result of the scanDirectory IPC call. */`. In the `electronAPI` interface, after the `saveFiles:` member, add:

```ts
          /** Crash-recovery snapshots of unsaved work (main process stores them under userData). */
          recovery: {
            write: (sessionId: string, payload: RecoverySnapshotPayload) => Promise<RecoveryWriteResult>;
            clear: (sessionId: string) => Promise<{ success: boolean; error?: string }>;
            listPending: (sessionId: string) => Promise<PendingRecovery | null>;
            discardPending: (sessionId: string) => Promise<{ success: boolean; error?: string }>;
          };
```

- [ ] **Step 2: Add the mock**

In `src/test/mocks/electronAPI.ts`, add to the mock interface after `saveFiles`:

```ts
  recovery: {
    write: Mock<(sessionId: string, payload: unknown) => Promise<{ success: boolean; skipped?: 'too-large'; error?: string }>>;
    clear: Mock<(sessionId: string) => Promise<{ success: boolean; error?: string }>>;
    listPending: Mock<(sessionId: string) => Promise<unknown>>;
    discardPending: Mock<(sessionId: string) => Promise<{ success: boolean; error?: string }>>;
  };
```

and to `createMockElectronAPI()` after `saveFiles`:

```ts
    recovery: {
      write: vi.fn().mockResolvedValue({ success: true }),
      clear: vi.fn().mockResolvedValue({ success: true }),
      listPending: vi.fn().mockResolvedValue(null),
      discardPending: vi.fn().mockResolvedValue({ success: true }),
    },
```

- [ ] **Step 3: Preload**

In `preload.js`, after the `saveFiles:` line:

```js
  recovery: {
    write: (sessionId, payload) => ipcRenderer.invoke('recovery:write', sessionId, payload),
    clear: (sessionId) => ipcRenderer.invoke('recovery:clear', sessionId),
    listPending: (sessionId) => ipcRenderer.invoke('recovery:listPending', sessionId),
    discardPending: (sessionId) => ipcRenderer.invoke('recovery:discardPending', sessionId),
  },
```

- [ ] **Step 4: Main process**

In `electron.js`, after the `saveTransaction.js` import:

```js
import { writeSnapshot, clearSnapshot, listPending, discardPending, sweepExpired } from './src/lib/recoveryStore.js';
```

After `let currentProjectRoot = null;`:

```js
// Crash-recovery snapshots (see src/lib/recoveryStore.js). RENIDE_RECOVERY_DIR is a
// test-only override so E2E runs never touch the developer's real userData.
const recoveryDir = process.env.RENIDE_RECOVERY_DIR || path.join(app.getPath('userData'), 'recovery');
// The renderer session for currentProjectRoot; its file is deleted on intentional quit.
let currentRecoverySessionId = null;

async function clearCurrentRecoverySession() {
    if (!currentProjectRoot || !currentRecoverySessionId) return;
    try {
        await clearSnapshot({ recoveryDir, projectRoot: currentProjectRoot, sessionId: currentRecoverySessionId });
    } catch (err) {
        logger.warn('Failed to clear recovery snapshot on quit:', err);
    }
}
```

In the `project:load` handler, replace `currentProjectRoot = rootPath; // Track for screenshots` with:

```js
    if (currentProjectRoot !== rootPath) currentRecoverySessionId = null;
    currentProjectRoot = rootPath; // Track for screenshots
```

Replace the two quit handlers:

```js
  ipcMain.on('ide-state-saved-for-quit', () => {
    forceQuit = true;
    clearCurrentRecoverySession().finally(() => app.quit());
  });

  ipcMain.on('force-quit', () => {
    forceQuit = true;
    clearCurrentRecoverySession().finally(() => app.quit());
  });
```

Directly after the `project:saveFiles` handler, add:

```js
  ipcMain.handle('recovery:write', async (event, sessionId, payload) => {
    try {
      if (!currentProjectRoot) throw new Error('No project is open');
      const result = await writeSnapshot({ recoveryDir, projectRoot: currentProjectRoot, sessionId, payload });
      currentRecoverySessionId = sessionId;
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('recovery:clear', async (event, sessionId) => {
    try {
      if (!currentProjectRoot) throw new Error('No project is open');
      await clearSnapshot({ recoveryDir, projectRoot: currentProjectRoot, sessionId });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('recovery:listPending', async (event, sessionId) => {
    if (!currentProjectRoot) return null;
    currentRecoverySessionId = sessionId;
    try {
      return await listPending({ recoveryDir, projectRoot: currentProjectRoot, sessionId });
    } catch (error) {
      logger.warn('Failed to list pending recovery snapshots:', error);
      return null;
    }
  });

  ipcMain.handle('recovery:discardPending', async (event, sessionId) => {
    try {
      if (!currentProjectRoot) throw new Error('No project is open');
      await discardPending({ recoveryDir, projectRoot: currentProjectRoot, sessionId });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });
```

Inside `app.whenReady().then(async () => {`, as its first statement:

```js
  sweepExpired({ recoveryDir }).catch(err => logger.warn('Recovery snapshot expiry sweep failed:', err));
```

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit -p . && npx eslint electron.js preload.js src/types.ts src/test/mocks/electronAPI.ts && npx vitest run src/hooks src/lib`
Expected: tsc exit 0, no lint errors, all tests pass. The IPC paths are exercised end-to-end in Task 8.

- [ ] **Step 6: Commit**

```bash
git add electron.js preload.js src/types.ts src/test/mocks/electronAPI.ts
git commit -m "feat(recovery): recovery IPC, quit-time cleanup and startup expiry sweep"
```

---

### Task 3: Extract `buildProjectSettingsPayload` from `useProjectIO`

**Files:**
- Modify: `src/hooks/useProjectIO.ts` (the `settingsToSave` object inside `handleSaveProjectSettings`, plus the return value)
- Test: `src/hooks/useProjectIO.test.ts`

**Interfaces:**
- Produces:
  - `export function buildProjectSettingsPayload(src: ProjectSettingsPayloadSource): ProjectSettings`
  - `export type ProjectSettingsPayloadSource = Pick<UseProjectIOParams, 'projectSettings' | 'blocks' | 'routeNodeLayoutCache' | 'openTabs' | 'activeTabId' | 'splitLayout' | 'splitPrimarySize' | 'secondaryOpenTabs' | 'secondaryActiveTabId' | 'stickyNotes' | 'routeStickyNotes' | 'choiceStickyNotes' | 'notecards' | 'notecardLinks' | 'notecardTimeline' | 'characterProfiles' | 'characterPortraits' | 'punchlistMetadata' | 'diagnosticsTasks' | 'ignoredDiagnostics' | 'dismissedImplicitVarHint' | 'sceneCompositions' | 'sceneNames' | 'imagemapCompositions' | 'imageScanDirectories' | 'audioScanDirectories'>`
  - `UseProjectIOReturn.buildSettingsForDisk: () => ProjectSettings` returns exactly what `handleSaveProjectSettings` writes: `buildProjectSettingsForSave(buildProjectSettingsPayload(src), projectSettingsMetaRef.current)`

- [ ] **Step 1: Write the failing test**

Add to `src/hooks/useProjectIO.test.ts`, inside `describe('useProjectIO', …)`:

```ts
  it('buildSettingsForDisk returns exactly what handleSaveProjectSettings writes', async () => {
    const api = createMockElectronAPI();
    installElectronAPI(api);
    const notecards = [createNotecard({ id: 'nc-1' })];
    const { result } = renderHook(() => useProjectIO(makeParams({ notecards })));
    await act(async () => { await result.current.handleSaveProjectSettings(); });
    const written = JSON.parse(api.writeFile.mock.calls[0][1] as string);
    expect(JSON.parse(JSON.stringify(result.current.buildSettingsForDisk()))).toEqual(written);
    expect(written.notecards).toEqual(notecards);
  });
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/hooks/useProjectIO.test.ts -t buildSettingsForDisk`
Expected: FAIL, "result.current.buildSettingsForDisk is not a function"

- [ ] **Step 3: Implement**

In `src/hooks/useProjectIO.ts`:

1. Above `export function useProjectIO`, add `ProjectSettingsPayloadSource` (the `Pick` type above) and:

```ts
/**
 * The project.ide.json payload for the current in-memory state, before the
 * schemaVersion/unknown-field wrapping in buildProjectSettingsForSave. Shared
 * by Save and by crash-recovery snapshots so both always agree on the shape.
 */
export function buildProjectSettingsPayload(src: ProjectSettingsPayloadSource): ProjectSettings {
  const serializeSprite = (s: SceneSprite): SerializedSprite => ({
    ...s,
    image: { filePath: s.image.filePath },
  });

  const serializableScenes: Record<string, SerializedSceneComposition> = {};
  Object.entries(src.sceneCompositions).forEach(([id, sc]) => {
    serializableScenes[id] = {
      background: sc.background ? serializeSprite(sc.background) : null,
      sprites: sc.sprites.map(serializeSprite),
      resolution: sc.resolution,
      animations: sc.animations,
    };
  });

  const serializableImagemaps: Record<string, SerializedImageMapComposition> = {};
  Object.entries(src.imagemapCompositions).forEach(([id, im]) => {
    serializableImagemaps[id] = {
      screenName: im.screenName,
      groundImage: im.groundImage ? { filePath: im.groundImage.filePath } : null,
      hoverImage: im.hoverImage ? { filePath: im.hoverImage.filePath } : null,
      hotspots: im.hotspots,
    };
  });

  return {
    ...src.projectSettings,
    storyBlockLayouts: buildSavedStoryBlockLayouts(src.blocks),
    routeNodeLayouts: Object.fromEntries(
      Array.from(src.routeNodeLayoutCache.entries()).map(([id, position]) => [id, { position }]),
    ),
    openTabs: src.openTabs,
    activeTabId: src.activeTabId,
    splitLayout: src.splitLayout,
    splitPrimarySize: src.splitPrimarySize,
    secondaryOpenTabs: src.secondaryOpenTabs,
    secondaryActiveTabId: src.secondaryActiveTabId,
    stickyNotes: Array.from(src.stickyNotes),
    routeStickyNotes: Array.from(src.routeStickyNotes),
    choiceStickyNotes: Array.from(src.choiceStickyNotes),
    notecards: Array.from(src.notecards),
    notecardLinks: Array.from(src.notecardLinks),
    notecardTimeline: src.notecardTimeline,
    characterProfiles: src.characterProfiles,
    characterPortraits: src.characterPortraits,
    punchlistMetadata: src.punchlistMetadata,
    diagnosticsTasks: src.diagnosticsTasks,
    ignoredDiagnostics: src.ignoredDiagnostics,
    dismissedImplicitVariableHint: src.dismissedImplicitVarHint,
    sceneCompositions: serializableScenes,
    sceneNames: src.sceneNames,
    imagemapCompositions: serializableImagemaps,
    scannedImagePaths: Array.from(src.imageScanDirectories.keys()),
    scannedAudioPaths: Array.from(src.audioScanDirectories.keys()),
  };
}
```

2. Inside the hook, before `handleSaveProjectSettings`:

```ts
  const buildSettingsForDisk = useCallback((): ProjectSettings => buildProjectSettingsForSave(
    buildProjectSettingsPayload({
      projectSettings, blocks, routeNodeLayoutCache, openTabs, activeTabId, splitLayout, splitPrimarySize,
      secondaryOpenTabs, secondaryActiveTabId, stickyNotes, routeStickyNotes, choiceStickyNotes,
      notecards, notecardLinks, notecardTimeline, characterProfiles, characterPortraits,
      punchlistMetadata, diagnosticsTasks, ignoredDiagnostics, dismissedImplicitVarHint,
      sceneCompositions, sceneNames, imagemapCompositions, imageScanDirectories, audioScanDirectories,
    }),
    projectSettingsMetaRef.current,
  ), [projectSettings, blocks, routeNodeLayoutCache, openTabs, activeTabId, splitLayout, splitPrimarySize, secondaryOpenTabs, secondaryActiveTabId, stickyNotes, routeStickyNotes, choiceStickyNotes, notecards, notecardLinks, notecardTimeline, characterProfiles, characterPortraits, punchlistMetadata, diagnosticsTasks, ignoredDiagnostics, dismissedImplicitVarHint, sceneCompositions, sceneNames, imagemapCompositions, imageScanDirectories, audioScanDirectories, projectSettingsMetaRef]);
```

3. Replace the body of `handleSaveProjectSettings`'s `try` (from the `serializeSprite` declaration through `const fileContents = …`) with:

```ts
      const fileContents = buildSettingsForDisk();
```

Keep the `settingsPath`/`writeFile` lines that follow. Replace the `useCallback` dependency array with `[projectRootPath, buildSettingsForDisk, addToast, setHasUnsavedSettings]`.

4. Add `buildSettingsForDisk: () => ProjectSettings;` (with the doc comment "The exact project.ide.json object a save would write now.") to `UseProjectIOReturn`, and `buildSettingsForDisk` to the returned object.

- [ ] **Step 4: Run the tests**

Run: `npx tsc --noEmit -p . && npx vitest run src/hooks/useProjectIO.test.ts`
Expected: PASS (all existing tests plus the new one)

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useProjectIO.ts src/hooks/useProjectIO.test.ts
git commit -m "refactor(save): share the project.ide.json payload builder with recovery"
```

---

### Task 4: `useRecoverySnapshots`, the capture hook

**Files:**
- Create: `src/hooks/useRecoverySnapshots.ts`
- Create: `src/hooks/useRecoverySnapshots.test.ts`

**Interfaces:**
- Consumes: `window.electronAPI.recovery.write/clear` (Task 2); `buildSettingsForDisk` (Task 3); `UntitledFileState` from `@/hooks/useUntitledFiles`
- Produces:

```ts
export interface UseRecoverySnapshotsParams {
  enabled: boolean;
  sessionIdRef: React.MutableRefObject<string | null>;
  blocks: Block[];
  blocksRef: React.MutableRefObject<Block[]>;
  editorInstances: React.MutableRefObject<Map<string, { getValue(): string }>>;
  dirtyBlockIds: Set<string>;
  dirtyEditors: Set<string>;
  untitledFiles: Map<string, UntitledFileState>;
  hasUnsavedSettings: boolean;
  buildSettingsPayload: () => ProjectSettings;
  debounceMs?: number;     // default 5000
  maxIntervalMs?: number;  // default 60000
}
export function useRecoverySnapshots(params: UseRecoverySnapshotsParams): void;
export function buildRecoveryPayload(state: Pick<UseRecoverySnapshotsParams, 'blocksRef' | 'editorInstances' | 'dirtyBlockIds' | 'dirtyEditors' | 'untitledFiles' | 'hasUnsavedSettings' | 'buildSettingsPayload'>): RecoverySnapshotPayload;
```

- [ ] **Step 1: Write the failing tests**

Create `src/hooks/useRecoverySnapshots.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRecoverySnapshots, buildRecoveryPayload } from '@/hooks/useRecoverySnapshots';
import type { UseRecoverySnapshotsParams } from '@/hooks/useRecoverySnapshots';
import { installElectronAPI, createMockElectronAPI } from '@/test/mocks/electronAPI';
import { createBlock } from '@/test/mocks/sampleData';
import { logger } from '@/lib/logger';

const SESSION = '11111111-1111-4111-8111-111111111111';

function makeParams(over: Partial<UseRecoverySnapshotsParams> = {}): UseRecoverySnapshotsParams {
  const block = createBlock({ id: 'b1', filePath: 'game/script.rpy', content: 'block content' });
  return {
    enabled: true,
    sessionIdRef: { current: SESSION },
    blocks: [block],
    blocksRef: { current: [block] },
    editorInstances: { current: new Map() },
    dirtyBlockIds: new Set(['b1']),
    dirtyEditors: new Set(),
    untitledFiles: new Map(),
    hasUnsavedSettings: false,
    buildSettingsPayload: () => ({ draftingMode: false, openTabs: [], activeTabId: 'canvas' }),
    ...over,
  };
}

let api: ReturnType<typeof createMockElectronAPI>;

beforeEach(() => {
  vi.useFakeTimers();
  api = createMockElectronAPI();
  installElectronAPI(api);
});

afterEach(() => {
  vi.useRealTimers();
});

const flush = async () => { await act(async () => { await Promise.resolve(); }); };

describe('buildRecoveryPayload', () => {
  it('prefers live editor text, includes dirty untitled drafts, and settings only when unsaved', () => {
    const p = makeParams({
      dirtyEditors: new Set(['b1']),
      dirtyBlockIds: new Set(),
      editorInstances: { current: new Map([['b1', { getValue: () => 'live editor text' }]]) },
      untitledFiles: new Map([
        ['u1', { title: 'Untitled-1', content: 'draft', isDirty: true }],
        ['u2', { title: 'Untitled-2', content: '', isDirty: false }],
      ]),
    });
    expect(buildRecoveryPayload(p)).toEqual({
      files: [{ relativePath: 'game/script.rpy', content: 'live editor text' }],
      untitled: [{ id: 'u1', title: 'Untitled-1', content: 'draft' }],
      settings: null,
    });
    expect(buildRecoveryPayload({ ...p, hasUnsavedSettings: true }).settings).toEqual({ draftingMode: false, openTabs: [], activeTabId: 'canvas' });
  });

  it('skips dirty ids with no file path', () => {
    const noPath = createBlock({ id: 'b2', filePath: undefined });
    const p = makeParams({ blocksRef: { current: [noPath] }, dirtyBlockIds: new Set(['b2']) });
    expect(buildRecoveryPayload(p).files).toEqual([]);
  });
});

describe('useRecoverySnapshots', () => {
  it('writes a snapshot 5 s after the last change, not before', async () => {
    renderHook(() => useRecoverySnapshots(makeParams()));
    await act(async () => { vi.advanceTimersByTime(4999); });
    expect(api.recovery.write).not.toHaveBeenCalled();
    await act(async () => { vi.advanceTimersByTime(1); });
    expect(api.recovery.write).toHaveBeenCalledWith(SESSION, {
      files: [{ relativePath: 'game/script.rpy', content: 'block content' }],
      untitled: [],
      settings: null,
    });
  });

  it('restarts the debounce on each change but still writes within 60 s of continuous edits', async () => {
    const params = makeParams();
    const { rerender } = renderHook((p: UseRecoverySnapshotsParams) => useRecoverySnapshots(p), { initialProps: params });
    for (let i = 0; i < 15; i++) {
      await act(async () => { vi.advanceTimersByTime(4000); });
      const block = createBlock({ id: 'b1', filePath: 'game/script.rpy', content: `edit ${i}` });
      rerender({ ...params, blocks: [block], blocksRef: { current: [block] } });
    }
    expect(api.recovery.write).toHaveBeenCalledTimes(1); // forced by the 60 s cap
  });

  it('does nothing while disabled', async () => {
    renderHook(() => useRecoverySnapshots(makeParams({ enabled: false })));
    await act(async () => { vi.advanceTimersByTime(120_000); });
    expect(api.recovery.write).not.toHaveBeenCalled();
  });

  it('does nothing when nothing is unsaved, and never clears a file it did not write', async () => {
    renderHook(() => useRecoverySnapshots(makeParams({ dirtyBlockIds: new Set() })));
    await act(async () => { vi.advanceTimersByTime(120_000); });
    expect(api.recovery.write).not.toHaveBeenCalled();
    expect(api.recovery.clear).not.toHaveBeenCalled();
  });

  it('clears its own file once everything is saved', async () => {
    const params = makeParams();
    const { rerender } = renderHook((p: UseRecoverySnapshotsParams) => useRecoverySnapshots(p), { initialProps: params });
    await act(async () => { vi.advanceTimersByTime(5000); });
    await flush();
    rerender({ ...params, dirtyBlockIds: new Set() });
    await flush();
    expect(api.recovery.clear).toHaveBeenCalledWith(SESSION);
  });

  it('clears after an in-flight write that finishes once nothing is unsaved', async () => {
    let resolveWrite: (v: { success: boolean }) => void = () => {};
    api.recovery.write.mockImplementation(() => new Promise(r => { resolveWrite = r; }));
    const params = makeParams();
    const { rerender } = renderHook((p: UseRecoverySnapshotsParams) => useRecoverySnapshots(p), { initialProps: params });
    await act(async () => { vi.advanceTimersByTime(5000); });
    rerender({ ...params, dirtyBlockIds: new Set() }); // user saved mid-write
    await act(async () => { resolveWrite({ success: true }); await Promise.resolve(); });
    await flush();
    expect(api.recovery.clear).toHaveBeenCalledWith(SESSION);
  });

  it('never overlaps writes; a change during a write schedules one more pass', async () => {
    let resolveWrite: (v: { success: boolean }) => void = () => {};
    api.recovery.write.mockImplementation(() => new Promise(r => { resolveWrite = r; }));
    const params = makeParams();
    const { rerender } = renderHook((p: UseRecoverySnapshotsParams) => useRecoverySnapshots(p), { initialProps: params });
    await act(async () => { vi.advanceTimersByTime(5000); });
    const block = createBlock({ id: 'b1', filePath: 'game/script.rpy', content: 'newer' });
    rerender({ ...params, blocks: [block], blocksRef: { current: [block] } });
    await act(async () => { vi.advanceTimersByTime(5000); });
    expect(api.recovery.write).toHaveBeenCalledTimes(1);
    await act(async () => { resolveWrite({ success: true }); await Promise.resolve(); });
    await act(async () => { vi.advanceTimersByTime(5000); });
    expect(api.recovery.write).toHaveBeenCalledTimes(2);
    expect(api.recovery.write.mock.calls[1][1]).toMatchObject({ files: [{ content: 'newer' }] });
  });

  it('logs a failing write once per session and never throws', async () => {
    const warn = vi.spyOn(logger, 'warn').mockImplementation(() => {});
    api.recovery.write.mockRejectedValue(new Error('ENOSPC'));
    const params = makeParams();
    const { rerender } = renderHook((p: UseRecoverySnapshotsParams) => useRecoverySnapshots(p), { initialProps: params });
    await act(async () => { vi.advanceTimersByTime(5000); });
    await flush();
    const block = createBlock({ id: 'b1', filePath: 'game/script.rpy', content: 'again' });
    rerender({ ...params, blocks: [block], blocksRef: { current: [block] } });
    await act(async () => { vi.advanceTimersByTime(5000); });
    await flush();
    expect(api.recovery.write).toHaveBeenCalledTimes(2);
    expect(warn).toHaveBeenCalledTimes(1);
    warn.mockRestore();
  });

  it('treats a { success: false } result as a failure (logged, file not considered written)', async () => {
    const warn = vi.spyOn(logger, 'warn').mockImplementation(() => {});
    api.recovery.write.mockResolvedValue({ success: false, error: 'No project is open' });
    const params = makeParams();
    const { rerender } = renderHook((p: UseRecoverySnapshotsParams) => useRecoverySnapshots(p), { initialProps: params });
    await act(async () => { vi.advanceTimersByTime(5000); });
    await flush();
    rerender({ ...params, dirtyBlockIds: new Set() });
    await flush();
    expect(warn).toHaveBeenCalledTimes(1);
    expect(api.recovery.clear).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  it('starts fresh (no clear of the old file) when the session id changes', async () => {
    const sessionIdRef = { current: SESSION as string | null };
    const params = makeParams({ sessionIdRef });
    const { rerender } = renderHook((p: UseRecoverySnapshotsParams) => useRecoverySnapshots(p), { initialProps: params });
    await act(async () => { vi.advanceTimersByTime(5000); });
    await flush();
    sessionIdRef.current = '22222222-2222-4222-8222-222222222222';
    rerender({ ...params, dirtyBlockIds: new Set() });
    await flush();
    expect(api.recovery.clear).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run src/hooks/useRecoverySnapshots.test.ts`
Expected: FAIL, "Failed to resolve import @/hooks/useRecoverySnapshots"

- [ ] **Step 3: Implement `src/hooks/useRecoverySnapshots.ts`**

```ts
/**
 * @file useRecoverySnapshots.ts
 * @description Periodically snapshots unsaved work to the main process for crash
 * recovery (bmf-vangard-renpy-ide-b70a.2.3). Snapshots only what is unsaved, 5 s
 * after the last change (60 s cap during continuous edits), never overlaps writes,
 * and deletes its session's snapshot once nothing is unsaved. Failures are logged
 * once per session and never surface as toasts -- autosave must not interrupt typing.
 */
import { useEffect, useRef } from 'react';
import { logger } from '@/lib/logger';
import type { Block, ProjectSettings, RecoverySnapshotPayload } from '@/types';
import type { UntitledFileState } from '@/hooks/useUntitledFiles';

export interface UseRecoverySnapshotsParams {
  enabled: boolean;
  sessionIdRef: React.MutableRefObject<string | null>;
  /** Change signal: editor keystrokes reach blocks via onContentChange. */
  blocks: Block[];
  blocksRef: React.MutableRefObject<Block[]>;
  editorInstances: React.MutableRefObject<Map<string, { getValue(): string }>>;
  dirtyBlockIds: Set<string>;
  dirtyEditors: Set<string>;
  untitledFiles: Map<string, UntitledFileState>;
  hasUnsavedSettings: boolean;
  /** Memoised; its identity changes whenever workspace state changes. */
  buildSettingsPayload: () => ProjectSettings;
  debounceMs?: number;
  maxIntervalMs?: number;
}

type PayloadState = Pick<UseRecoverySnapshotsParams,
  'blocksRef' | 'editorInstances' | 'dirtyBlockIds' | 'dirtyEditors' | 'untitledFiles' | 'hasUnsavedSettings' | 'buildSettingsPayload'>;

export function buildRecoveryPayload(state: PayloadState): RecoverySnapshotPayload {
  const ids = new Set([...state.dirtyBlockIds, ...state.dirtyEditors]);
  const files: RecoverySnapshotPayload['files'] = [];
  for (const id of ids) {
    const block = state.blocksRef.current.find(b => b.id === id);
    if (!block?.filePath) continue;
    const live = state.editorInstances.current.get(id)?.getValue();
    files.push({ relativePath: block.filePath, content: live ?? block.content });
  }
  const untitled = [...state.untitledFiles.entries()]
    .filter(([, f]) => f.isDirty)
    .map(([id, f]) => ({ id, title: f.title, content: f.content }));
  return { files, untitled, settings: state.hasUnsavedSettings ? state.buildSettingsPayload() : null };
}

const hasUnsaved = (s: PayloadState) =>
  s.dirtyBlockIds.size > 0 || s.dirtyEditors.size > 0 || s.hasUnsavedSettings
  || [...s.untitledFiles.values()].some(f => f.isDirty);

export function useRecoverySnapshots(params: UseRecoverySnapshotsParams): void {
  const { enabled, sessionIdRef, blocks, dirtyBlockIds, dirtyEditors, untitledFiles, hasUnsavedSettings, buildSettingsPayload } = params;
  const debounceMs = params.debounceMs ?? 5000;
  const maxIntervalMs = params.maxIntervalMs ?? 60000;

  const latest = useRef(params);
  latest.current = params;

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inFlight = useRef(false);
  const rerunAfterFlight = useRef(false);
  const session = useRef<{ id: string | null; wrote: boolean; warned: boolean }>({ id: null, wrote: false, warned: false });

  const clearTimers = () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (maxTimer.current) clearTimeout(maxTimer.current);
    debounceTimer.current = null;
    maxTimer.current = null;
  };

  const syncSession = () => {
    const id = latest.current.sessionIdRef.current;
    if (session.current.id !== id) session.current = { id, wrote: false, warned: false };
    return id;
  };

  const clearIfIdle = async () => {
    const id = syncSession();
    if (!id || !session.current.wrote || hasUnsaved(latest.current)) return;
    session.current.wrote = false;
    try {
      await window.electronAPI?.recovery.clear(id);
    } catch (err) {
      logger.warn('Failed to clear recovery snapshot', err);
    }
  };

  const snapshotRef = useRef<() => Promise<void>>(async () => {});
  snapshotRef.current = async () => {
    clearTimers();
    const id = syncSession();
    if (!id || !latest.current.enabled || !window.electronAPI) return;
    if (inFlight.current) { rerunAfterFlight.current = true; return; }
    if (!hasUnsaved(latest.current)) return;

    inFlight.current = true;
    try {
      const result = await window.electronAPI.recovery.write(id, buildRecoveryPayload(latest.current));
      if (!result.success) throw new Error(result.error ?? 'Unknown error');
      if (session.current.id === id) session.current.wrote = true;
    } catch (err) {
      if (!session.current.warned) {
        session.current.warned = true;
        logger.warn('Recovery snapshot failed (further failures this session are not logged)', err);
      }
    } finally {
      inFlight.current = false;
    }
    await clearIfIdle(); // the user may have saved while the write was in flight
    if (rerunAfterFlight.current) {
      rerunAfterFlight.current = false;
      debounceTimer.current = setTimeout(() => { void snapshotRef.current(); }, debounceMs);
    }
  };

  useEffect(() => {
    syncSession();
    if (!enabled) { clearTimers(); return; }
    if (!hasUnsaved(latest.current)) {
      clearTimers();
      void clearIfIdle();
      return;
    }
    if (inFlight.current) { rerunAfterFlight.current = true; return; }
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => { void snapshotRef.current(); }, debounceMs);
    if (!maxTimer.current) {
      maxTimer.current = setTimeout(() => { void snapshotRef.current(); }, maxIntervalMs);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- change signals; everything else is read via `latest`
  }, [enabled, blocks, dirtyBlockIds, dirtyEditors, untitledFiles, hasUnsavedSettings, buildSettingsPayload, debounceMs, maxIntervalMs]);

  useEffect(() => clearTimers, []);
}
```

- [ ] **Step 4: Run the tests**

Run: `npx vitest run src/hooks/useRecoverySnapshots.test.ts`
Expected: PASS. If the "continuous edits" test reports 0 calls, check that `maxTimer` is only created when it's `null` and isn't cleared on each change (only `snapshotRef.current` clears both).

- [ ] **Step 5: Lint and commit**

```bash
npx eslint src/hooks/useRecoverySnapshots.ts src/hooks/useRecoverySnapshots.test.ts
git add src/hooks/useRecoverySnapshots.ts src/hooks/useRecoverySnapshots.test.ts
git commit -m "feat(recovery): debounced capture hook for unsaved-work snapshots"
```

---

### Task 5: Restore support. `createRecoveredUntitledFile`, `hydrateSettingsFromSnapshot`, `applyRecoverySnapshot`

**Files:**
- Modify: `src/hooks/useUntitledFiles.ts` (add the function next to `createUntitledFile`; add it to the return type and the returned object)
- Modify: `src/hooks/useUntitledFiles.test.ts`
- Modify: `src/hooks/useProjectLoad.ts` (extract `hydrateSettingsFromSnapshot` from `hydrateFromProjectData`)
- Modify: `src/hooks/useProjectLoad.test.ts`
- Create: `src/lib/recoveryRestore.ts`
- Create: `src/lib/recoveryRestore.test.ts`

**Interfaces:**
- Consumes: `PendingRecovery`, `RecoverySelection` (Task 2); `deserializeProjectData` from `@/lib/projectSerializer`; `ProjectSnapshot` and `HydrateSetters` from `@/hooks/useProjectLoad`
- Produces:
  - `UseUntitledFilesReturn.createRecoveredUntitledFile: (title: string, content: string) => string` (returns the new tab id; the draft is created with `isDirty: true`)
  - `export function hydrateSettingsFromSnapshot(snapshot: ProjectSnapshot, setters: HydrateSetters): void`
  - `export interface RecoveryRestoreDeps { rootPath: string; tree: FileSystemTreeNode | null; blocksRef: React.MutableRefObject<Block[]>; editorInstances: React.MutableRefObject<Map<string, { getModel(): { getValue(): string; setValue(v: string): void } | null }>>; images: Map<string, ProjectImage>; audios: Map<string, RenpyAudio>; setBlocks: React.Dispatch<React.SetStateAction<Block[]>>; setDirtyBlockIds: React.Dispatch<React.SetStateAction<Set<string>>>; setHasUnsavedSettings: (v: boolean) => void; createRecoveredUntitledFile: (title: string, content: string) => string; applySettingsSnapshot: (snapshot: ProjectSnapshot) => void }`
  - `export function applyRecoverySnapshot(pending: PendingRecovery, selection: RecoverySelection, deps: RecoveryRestoreDeps): { restored: number; failures: { item: string; error: string }[] }`

- [ ] **Step 1: Write the failing `useUntitledFiles` test**

Add to `src/hooks/useUntitledFiles.test.ts`, which already defines `makeProps(overrides)`:

```ts
  it('createRecoveredUntitledFile opens a dirty draft with the given title and content', () => {
    const setOpenTabs = vi.fn();
    const { result } = renderHook(() => useUntitledFiles(makeProps({ setOpenTabs })));
    let tabId = '';
    act(() => { tabId = result.current.createRecoveredUntitledFile('script.rpy (recovered)', 'label start:\n'); });
    expect(result.current.untitledFiles.get(tabId)).toEqual({ title: 'script.rpy (recovered)', content: 'label start:\n', isDirty: true });
    const updater = setOpenTabs.mock.calls.at(-1)![0] as (t: EditorTab[]) => EditorTab[];
    expect(updater([])).toEqual([{ id: tabId, type: 'untitled', title: 'script.rpy (recovered)' }]);
  });
```

Add `EditorTab` to the file's `@/types` import if it isn't already there.

- [ ] **Step 2: Implement `createRecoveredUntitledFile`**

In `src/hooks/useUntitledFiles.ts`, after `createUntitledFile`:

```ts
  // Used by crash recovery: opens a draft that is already dirty (its content
  // exists nowhere on disk) in the primary pane, without stealing focus from
  // the tab the user restored into.
  const createRecoveredUntitledFile = useCallback((title: string, content: string) => {
    counterRef.current += 1;
    const tabId = `untitled-${Date.now()}-${counterRef.current}`;
    setUntitledFiles(prev => {
      const next = new Map(prev);
      next.set(tabId, { title, content, isDirty: true });
      return next;
    });
    setOpenTabs(prev => [...prev, { id: tabId, type: 'untitled', title }]);
    return tabId;
  }, [setOpenTabs]);
```

Add `createRecoveredUntitledFile: (title: string, content: string) => string;` to `UseUntitledFilesReturn` (doc comment: "Opens an already-dirty draft with the given content (crash recovery). Returns the new tab id.") and to the returned object.

Run: `npx vitest run src/hooks/useUntitledFiles.test.ts`. Expected: PASS.

- [ ] **Step 3: Extract `hydrateSettingsFromSnapshot` (test first)**

Add to `src/hooks/useProjectLoad.test.ts` (under `describe('hydrateFromProjectData', …)`, using the file's existing `createMinimalSnapshot` / `createMockHydrateSetters`):

```ts
  it('hydrateSettingsFromSnapshot applies settings-derived state only', () => {
    const notes = [{ id: 'n1' }] as never;
    const snapshot = createMinimalSnapshot({ stickyNotes: notes, rootPath: '/other' });
    const setters = createMockHydrateSetters();
    hydrateSettingsFromSnapshot(snapshot, setters);
    expect(setters.setStickyNotes).toHaveBeenCalledWith(notes);
    expect(setters.projectSettingsMetaRef.current).toBe(snapshot.settingsMeta);
    expect(setters.updateProjectSettings).toHaveBeenCalled();
    expect(setters.setTabs).toHaveBeenCalledWith(snapshot.primaryTabs, snapshot.primaryActiveTabId, 'primary');
    // never touches project identity, files or assets
    expect(setters.setProjectRootPath).not.toHaveBeenCalled();
    expect(setters.setBlocks).not.toHaveBeenCalled();
    expect(setters.setImages).not.toHaveBeenCalled();
    expect(setters.setAudios).not.toHaveBeenCalled();
    expect(setters.setFileSystemTree).not.toHaveBeenCalled();
  });
```

Add `hydrateSettingsFromSnapshot` to the file's import from `@/hooks/useProjectLoad`. Run it and expect FAIL ("hydrateSettingsFromSnapshot is not a function").

Then, in `src/hooks/useProjectLoad.ts`, add above `hydrateFromProjectData`:

```ts
/**
 * Applies the project.ide.json-derived parts of a snapshot (workspace state) without
 * touching project identity, blocks, assets or scans. Used by hydrateFromProjectData
 * and by crash recovery's "restore workspace changes".
 */
export function hydrateSettingsFromSnapshot(snapshot: ProjectSnapshot, setters: HydrateSetters): void {
  const {
    projectSettingsMetaRef, updateProjectSettings,
    setStickyNotes, setRouteStickyNotes, setChoiceStickyNotes, setNotecards, setNotecardLinks, setNotecardTimeline,
    setCharacterProfiles, setCharacterPortraits,
    setPunchlistMetadata, setDiagnosticsTasks, setIgnoredDiagnostics, setDismissedImplicitVarHint,
    setSceneCompositions, setSceneNames, setImagemapCompositions,
    setRouteNodeLayoutCache,
    setSecondaryOpenTabs, setSecondaryActiveTabId, setSplitLayout, setSplitPrimarySize, setTabs,
  } = setters;

  projectSettingsMetaRef.current = snapshot.settingsMeta;
  setRouteNodeLayoutCache(snapshot.routeNodeLayoutCache);

  updateProjectSettings(draft => {
    const cs = snapshot.canvasSettings;
    draft.draftingMode = cs.draftingMode;
    draft.storyCanvasLayoutMode = cs.storyCanvasLayoutMode as ProjectSettings['storyCanvasLayoutMode'];
    draft.storyCanvasGroupingMode = cs.storyCanvasGroupingMode as ProjectSettings['storyCanvasGroupingMode'];
    draft.storyCanvasLayoutFingerprint = cs.storyCanvasLayoutFingerprint;
    draft.storyCanvasLayoutVersion = cs.storyCanvasLayoutVersion;
    draft.storyCanvasLayoutWasUserAdjusted = cs.storyCanvasLayoutWasUserAdjusted;
    draft.storyCanvasHasAutocentered = false;
    draft.routeCanvasLayoutMode = cs.routeCanvasLayoutMode as ProjectSettings['routeCanvasLayoutMode'];
    draft.routeCanvasGroupingMode = cs.routeCanvasGroupingMode as ProjectSettings['routeCanvasGroupingMode'];
    draft.routeCanvasLayoutFingerprint = cs.routeCanvasLayoutFingerprint;
    draft.routeCanvasLayoutVersion = cs.routeCanvasLayoutVersion;
    draft.routeCanvasLayoutWasUserAdjusted = cs.routeCanvasLayoutWasUserAdjusted;
    draft.routeCanvasHasAutocentered = false;
    draft.choiceCanvasHasAutocentered = false;
    draft.completedMilestones = cs.completedMilestones;
  });

  setStickyNotes(snapshot.stickyNotes);
  setRouteStickyNotes(snapshot.routeStickyNotes);
  setChoiceStickyNotes(snapshot.choiceStickyNotes);
  setNotecards(snapshot.notecards);
  setNotecardLinks(snapshot.notecardLinks);
  setNotecardTimeline(snapshot.notecardTimeline);
  setCharacterProfiles(snapshot.characterProfiles);
  setCharacterPortraits(snapshot.characterPortraits);
  setPunchlistMetadata(snapshot.punchlistMetadata);
  setDiagnosticsTasks(snapshot.diagnosticsTasks);
  setIgnoredDiagnostics(snapshot.ignoredDiagnostics);
  setDismissedImplicitVarHint(snapshot.dismissedImplicitVariableHint);

  setSceneCompositions(snapshot.sceneCompositions);
  setSceneNames(snapshot.sceneNames);
  setImagemapCompositions(snapshot.imagemapCompositions);

  setTabs(snapshot.primaryTabs, snapshot.primaryActiveTabId, 'primary');
  setSplitLayout(snapshot.splitLayout);
  setSplitPrimarySize(snapshot.splitPrimarySize);
  setSecondaryOpenTabs(snapshot.secondaryTabs);
  setSecondaryActiveTabId(snapshot.secondaryActiveTabId);
}
```

In `hydrateFromProjectData`, delete the statements that `hydrateSettingsFromSnapshot` now performs:
- `projectSettingsMetaRef.current = …`
- `setRouteNodeLayoutCache(…)`
- the whole `updateProjectSettings(draft => {…})` call
- every setter from `setStickyNotes` through `setSecondaryActiveTabId`

Replace them with a single `hydrateSettingsFromSnapshot(snapshot, setters);` placed immediately after `setAudios(snapshot.audios);`. Remove the names that are now unused from its destructuring. Keep the identity, blocks, layout-refresh, scan and no-settings-fallback code where it is.

Run: `npx tsc --noEmit -p . && npx vitest run src/hooks/useProjectLoad.test.ts`. Expected: PASS, including every existing hydrate test.

- [ ] **Step 4: Write the failing `recoveryRestore` tests**

Create `src/lib/recoveryRestore.test.ts`:

```ts
import { describe, it, expect, vi } from 'vitest';
import { applyRecoverySnapshot } from '@/lib/recoveryRestore';
import type { RecoveryRestoreDeps } from '@/lib/recoveryRestore';
import type { Block, PendingRecovery, ProjectImage } from '@/types';
import { createBlock } from '@/test/mocks/sampleData';
import { installElectronAPI, createMockElectronAPI } from '@/test/mocks/electronAPI';

function makePending(over: Partial<PendingRecovery> = {}): PendingRecovery {
  return {
    sessionId: '11111111-1111-4111-8111-111111111111',
    projectRoot: '/proj',
    updatedAt: '2026-10-11T20:00:00.000Z',
    files: [
      { relativePath: 'game/script.rpy', content: 'recovered A', status: 'unchanged' },
      { relativePath: 'game/other.rpy', content: 'recovered B', status: 'changed' },
      { relativePath: 'game/gone.rpy', content: 'recovered C', status: 'deleted' },
    ],
    untitled: [{ id: 'u1', title: 'Untitled-1', content: 'draft' }],
    settings: { draftingMode: true, openTabs: [{ id: 'canvas', type: 'canvas' }], activeTabId: 'canvas', stickyNotes: [] },
    settingsStatus: 'unchanged',
    ...over,
  };
}

function makeDeps(blocks: Block[]) {
  const order: string[] = [];
  const setValue = vi.fn();
  const deps: RecoveryRestoreDeps = {
    rootPath: '/proj',
    tree: { name: 'proj', path: '', children: [] },
    blocksRef: { current: blocks },
    editorInstances: { current: new Map([['b1', { getModel: () => ({ getValue: () => 'old', setValue }) }]]) },
    images: new Map<string, ProjectImage>(),
    audios: new Map(),
    setBlocks: vi.fn(() => { order.push('blocks'); }),
    setDirtyBlockIds: vi.fn(),
    setHasUnsavedSettings: vi.fn(),
    createRecoveredUntitledFile: vi.fn(() => 'tab-x'),
    applySettingsSnapshot: vi.fn(() => { order.push('settings'); }),
  };
  return { deps, order, setValue };
}

const blocks = () => [
  createBlock({ id: 'b1', filePath: 'game/script.rpy', content: 'disk A' }),
  createBlock({ id: 'b2', filePath: 'game/other.rpy', content: 'disk B' }),
];

describe('applyRecoverySnapshot', () => {
  it('restores the selected items as unsaved changes, applying workspace changes first', () => {
    installElectronAPI(createMockElectronAPI());
    const api = window.electronAPI!;
    const { deps, order, setValue } = makeDeps(blocks());
    const result = applyRecoverySnapshot(makePending(), {
      files: ['game/script.rpy', 'game/other.rpy', 'game/gone.rpy'],
      untitled: ['u1'],
      settings: true,
    }, deps);

    expect(result).toEqual({ restored: 5, failures: [] });
    expect(order[0]).toBe('settings');
    expect(deps.setHasUnsavedSettings).toHaveBeenCalledWith(true);

    const blockUpdater = (deps.setBlocks as ReturnType<typeof vi.fn>).mock.calls[0][0] as (b: Block[]) => Block[];
    const updated = blockUpdater(blocks());
    expect(updated.find(b => b.id === 'b1')?.content).toBe('recovered A');
    expect(setValue).toHaveBeenCalledWith('recovered A');

    const dirtyUpdaters = (deps.setDirtyBlockIds as ReturnType<typeof vi.fn>).mock.calls.map(c => c[0] as (s: Set<string>) => Set<string>);
    const dirty = dirtyUpdaters.reduce((s, u) => u(s), new Set<string>());
    expect(dirty).toEqual(new Set(['b1', 'b2']));

    expect(deps.createRecoveredUntitledFile).toHaveBeenCalledWith('gone.rpy (recovered)', 'recovered C');
    expect(deps.createRecoveredUntitledFile).toHaveBeenCalledWith('Untitled-1', 'draft');

    // nothing is written to disk
    expect(api.writeFile).not.toHaveBeenCalled();
    expect(api.saveFiles).not.toHaveBeenCalled();
  });

  it('restores only what was selected', () => {
    const { deps } = makeDeps(blocks());
    const result = applyRecoverySnapshot(makePending(), { files: ['game/script.rpy'], untitled: [], settings: false }, deps);
    expect(result.restored).toBe(1);
    expect(deps.applySettingsSnapshot).not.toHaveBeenCalled();
    expect(deps.createRecoveredUntitledFile).not.toHaveBeenCalled();
  });

  it('restores a file whose block no longer exists as an untitled draft', () => {
    const { deps } = makeDeps([]);
    applyRecoverySnapshot(makePending(), { files: ['game/script.rpy'], untitled: [], settings: false }, deps);
    expect(deps.createRecoveredUntitledFile).toHaveBeenCalledWith('script.rpy (recovered)', 'recovered A');
  });

  it('collects per-item failures instead of aborting', () => {
    const { deps } = makeDeps(blocks());
    (deps.applySettingsSnapshot as ReturnType<typeof vi.fn>).mockImplementation(() => { throw new Error('bad settings'); });
    const result = applyRecoverySnapshot(makePending(), { files: ['game/script.rpy'], untitled: [], settings: true }, deps);
    expect(result.restored).toBe(1);
    expect(result.failures).toEqual([{ item: 'Workspace changes', error: 'bad settings' }]);
  });

  it('relinks restored scene sprites to the live image objects', () => {
    const live: ProjectImage = { filePath: 'game/images/bg.png', fileName: 'bg.png', dataUrl: 'data:live', fileHandle: null, isInProject: false };
    const { deps } = makeDeps(blocks());
    deps.images = new Map([[live.filePath, live]]);
    const settings = {
      draftingMode: false, openTabs: [], activeTabId: 'canvas',
      sceneCompositions: { s1: { background: { id: 'bg', image: { filePath: 'game/images/bg.png' }, x: 0, y: 0, zoom: 1, zIndex: 0, flipH: false, flipV: false, rotation: 0, alpha: 1, blur: 0 }, sprites: [], resolution: { width: 1, height: 1 } } },
    };
    applyRecoverySnapshot(makePending({ settings: settings as never }), { files: [], untitled: [], settings: true }, deps);
    const snap = (deps.applySettingsSnapshot as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(snap.sceneCompositions.s1.background.image).toBe(live);
  });
});
```

Run: `npx vitest run src/lib/recoveryRestore.test.ts`. Expected: FAIL, "Failed to resolve import @/lib/recoveryRestore".

- [ ] **Step 5: Implement `src/lib/recoveryRestore.ts`**

```ts
/**
 * @file recoveryRestore.ts
 * @description Applies a crash-recovery snapshot to in-memory state as UNSAVED
 * changes (bmf-vangard-renpy-ide-b70a.2.3). Never writes to disk; the user saves
 * through the normal flow. Workspace changes go first so later layout hydration
 * can't overwrite restored file text. Each item is applied independently and
 * failures are collected rather than aborting the restore.
 */
import { deserializeProjectData } from '@/lib/projectSerializer';
import type {
  Block, FileSystemTreeNode, PendingRecovery, ProjectImage, ProjectLoadResult, ProjectSnapshot,
  RecoverySelection, RenpyAudio, SceneSprite,
} from '@/types';

export interface RecoveryRestoreDeps {
  rootPath: string;
  tree: FileSystemTreeNode | null;
  blocksRef: React.MutableRefObject<Block[]>;
  editorInstances: React.MutableRefObject<Map<string, { getModel(): { getValue(): string; setValue(v: string): void } | null }>>;
  images: Map<string, ProjectImage>;
  audios: Map<string, RenpyAudio>;
  setBlocks: React.Dispatch<React.SetStateAction<Block[]>>;
  setDirtyBlockIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  setHasUnsavedSettings: (v: boolean) => void;
  createRecoveredUntitledFile: (title: string, content: string) => string;
  applySettingsSnapshot: (snapshot: ProjectSnapshot) => void;
}

const toScanned = (a: { filePath: string; fileName?: string; dataUrl?: string; lastModified?: number; size?: number }) => ({
  path: a.filePath,
  fileName: a.fileName ?? a.filePath.split('/').pop() ?? a.filePath,
  dataUrl: a.dataUrl ?? '',
  lastModified: a.lastModified ?? 0,
  size: a.size ?? 0,
});

/** deserializeProjectData marks every image isInProject; point compositions back at the live objects. */
function relinkImages(snapshot: ProjectSnapshot, images: Map<string, ProjectImage>): ProjectSnapshot {
  const relinkSprite = (s: SceneSprite): SceneSprite => ({ ...s, image: images.get(s.image.filePath) ?? s.image });
  const sceneCompositions = Object.fromEntries(Object.entries(snapshot.sceneCompositions).map(([id, sc]) => [id, {
    ...sc,
    background: sc.background ? relinkSprite(sc.background) : null,
    sprites: sc.sprites.map(relinkSprite),
  }]));
  const relinkImage = (img: ProjectImage | null) => (img ? images.get(img.filePath) ?? img : null);
  const imagemapCompositions = Object.fromEntries(Object.entries(snapshot.imagemapCompositions).map(([id, im]) => [id, {
    ...im,
    groundImage: relinkImage(im.groundImage),
    hoverImage: relinkImage(im.hoverImage),
  }]));
  return { ...snapshot, sceneCompositions, imagemapCompositions };
}

const recoveredTitle = (relativePath: string) => `${relativePath.split('/').pop() ?? relativePath} (recovered)`;

export function applyRecoverySnapshot(
  pending: PendingRecovery,
  selection: RecoverySelection,
  deps: RecoveryRestoreDeps,
): { restored: number; failures: { item: string; error: string }[] } {
  let restored = 0;
  const failures: { item: string; error: string }[] = [];
  const attempt = (item: string, fn: () => void) => {
    try {
      fn();
      restored++;
    } catch (err) {
      failures.push({ item, error: err instanceof Error ? err.message : String(err) });
    }
  };

  // 1. Workspace changes first.
  if (selection.settings && pending.settings) {
    attempt('Workspace changes', () => {
      const data: ProjectLoadResult = {
        rootPath: deps.rootPath,
        files: deps.blocksRef.current.filter(b => b.filePath).map(b => ({ path: b.filePath!, content: b.content })),
        images: [...deps.images.values()].map(toScanned),
        audios: [...deps.audios.values()].map(toScanned),
        settings: pending.settings,
        tree: deps.tree ?? { name: '', path: '', children: [] },
      };
      const snapshot = relinkImages(deserializeProjectData(data, deps.blocksRef.current), deps.images);
      deps.applySettingsSnapshot(snapshot);
      deps.setHasUnsavedSettings(true);
    });
  }

  // 2-3. Script files.
  const selectedFiles = new Set(selection.files);
  for (const file of pending.files) {
    if (!selectedFiles.has(file.relativePath)) continue;
    attempt(file.relativePath, () => {
      const block = file.status === 'deleted'
        ? undefined
        : deps.blocksRef.current.find(b => b.filePath === file.relativePath);
      if (!block) {
        deps.createRecoveredUntitledFile(recoveredTitle(file.relativePath), file.content);
        return;
      }
      deps.setBlocks(prev => prev.map(b => (b.id === block.id ? { ...b, content: file.content } : b)));
      const model = deps.editorInstances.current.get(block.id)?.getModel();
      if (model && model.getValue() !== file.content) model.setValue(file.content);
      deps.setDirtyBlockIds(prev => new Set(prev).add(block.id));
    });
  }

  // 4. Untitled drafts.
  const selectedUntitled = new Set(selection.untitled);
  for (const draft of pending.untitled) {
    if (!selectedUntitled.has(draft.id)) continue;
    attempt(draft.title, () => { deps.createRecoveredUntitledFile(draft.title, draft.content); });
  }

  return { restored, failures };
}
```

- [ ] **Step 6: Run the tests**

Run: `npx tsc --noEmit -p . && npx vitest run src/lib/recoveryRestore.test.ts src/hooks/useUntitledFiles.test.ts src/hooks/useProjectLoad.test.ts`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/lib/recoveryRestore.ts src/lib/recoveryRestore.test.ts src/hooks/useUntitledFiles.ts src/hooks/useUntitledFiles.test.ts src/hooks/useProjectLoad.ts src/hooks/useProjectLoad.test.ts
git commit -m "feat(recovery): restore snapshots into unsaved state"
```

---

### Task 6: `RecoveryModal`

**Files:**
- Create: `src/components/RecoveryModal.tsx`
- Create: `src/components/RecoveryModal.test.tsx`

**Interfaces:**
- Consumes: `PendingRecovery`, `RecoverySelection` (Task 2); `useModalAccessibility`
- Produces: `default export RecoveryModal: React.FC<{ isOpen: boolean; pending: PendingRecovery | null; onRestore: (selection: RecoverySelection) => void; onDiscard: () => void; onDecideLater: () => void }>`

- [ ] **Step 1: Write the failing tests**

Create `src/components/RecoveryModal.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RecoveryModal from '@/components/RecoveryModal';
import type { PendingRecovery } from '@/types';

const pending: PendingRecovery = {
  sessionId: '11111111-1111-4111-8111-111111111111',
  projectRoot: '/proj',
  updatedAt: new Date(Date.now() - 5 * 60_000).toISOString(),
  files: [
    { relativePath: 'game/script.rpy', content: 'a', status: 'unchanged' },
    { relativePath: 'game/other.rpy', content: 'b', status: 'changed' },
    { relativePath: 'game/gone.rpy', content: 'c', status: 'deleted' },
  ],
  untitled: [{ id: 'u1', title: 'Untitled-1', content: 'draft' }],
  settings: { draftingMode: false, openTabs: [], activeTabId: 'canvas' },
  settingsStatus: 'changed',
};

function setup(p: PendingRecovery = pending) {
  const handlers = { onRestore: vi.fn(), onDiscard: vi.fn(), onDecideLater: vi.fn() };
  render(<RecoveryModal isOpen pending={p} {...handlers} />);
  return handlers;
}

describe('RecoveryModal', () => {
  it('renders nothing when closed', () => {
    const { container } = render(<RecoveryModal isOpen={false} pending={pending} onRestore={vi.fn()} onDiscard={vi.fn()} onDecideLater={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('checks unchanged files and drafts by default; leaves changed/deleted and changed workspace unchecked', () => {
    setup();
    expect(screen.getByRole('checkbox', { name: /game\/script\.rpy/ })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: /game\/other\.rpy/ })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: /game\/gone\.rpy/ })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: /Untitled-1/ })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: /Workspace changes/ })).not.toBeChecked();
    expect(screen.getByText('changed on disk since', { selector: '[data-badge="file"]' })).toBeInTheDocument();
    expect(screen.getByText(/deleted from disk/)).toBeInTheDocument();
  });

  it('checks workspace changes by default when unchanged on disk', () => {
    setup({ ...pending, settingsStatus: 'unchanged' });
    expect(screen.getByRole('checkbox', { name: /Workspace changes/ })).toBeChecked();
  });

  it('Restore selected passes only the checked items', () => {
    const h = setup();
    fireEvent.click(screen.getByRole('checkbox', { name: /game\/other\.rpy/ }));
    fireEvent.click(screen.getByRole('checkbox', { name: /Untitled-1/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Restore selected' }));
    expect(h.onRestore).toHaveBeenCalledWith({ files: ['game/script.rpy', 'game/other.rpy'], untitled: [], settings: false });
  });

  it('disables Restore selected when nothing is checked', () => {
    setup({ ...pending, files: [pending.files[1]], untitled: [], settings: null, settingsStatus: null });
    expect(screen.getByRole('button', { name: 'Restore selected' })).toBeDisabled();
  });

  it('Discard requires confirmation', () => {
    const h = setup();
    fireEvent.click(screen.getByRole('button', { name: 'Discard…' }));
    expect(h.onDiscard).not.toHaveBeenCalled();
    expect(screen.getByText(/permanently deletes the recovered work/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Discard recovered work' }));
    expect(h.onDiscard).toHaveBeenCalledTimes(1);
  });

  it('Decide later, Escape and the backdrop all defer without discarding', () => {
    const h = setup();
    fireEvent.click(screen.getByRole('button', { name: 'Decide later' }));
    fireEvent.keyDown(document, { key: 'Escape' });
    fireEvent.click(screen.getByTestId('recovery-backdrop'));
    expect(h.onDecideLater).toHaveBeenCalledTimes(3);
    expect(h.onDiscard).not.toHaveBeenCalled();
  });
});
```

Run: `npx vitest run src/components/RecoveryModal.test.tsx`. Expected: FAIL, "Failed to resolve import".

- [ ] **Step 2: Implement `src/components/RecoveryModal.tsx`**

```tsx
/**
 * @file RecoveryModal.tsx
 * @description Startup dialog offering to restore unsaved work left by a crash
 * (bmf-vangard-renpy-ide-b70a.2.3). One checkbox per item; files changed or deleted
 * on disk since the snapshot are flagged and unchecked by default. Restore never
 * writes to disk. Esc / backdrop / "Decide later" defer, never discard.
 * Integration: rendered by App.tsx while `pendingRecovery` is set; uses `useModalAccessibility`.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { useModalAccessibility } from '@/hooks/useModalAccessibility';
import type { PendingRecovery, RecoveryFileStatus, RecoverySelection } from '@/types';

interface RecoveryModalProps {
  isOpen: boolean;
  pending: PendingRecovery | null;
  onRestore: (selection: RecoverySelection) => void;
  onDiscard: () => void;
  onDecideLater: () => void;
}

const FILE_BADGE: Record<RecoveryFileStatus, { label: string; className: string }> = {
  unchanged: { label: 'unchanged on disk', className: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' },
  changed: { label: 'changed on disk since', className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' },
  deleted: { label: 'deleted from disk — restores as an untitled draft', className: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300' },
};

function relativeTime(iso: string): string {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 48) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.round(hours / 24);
  return `${days} days ago`;
}

const RecoveryModal: React.FC<RecoveryModalProps> = ({ isOpen, pending, onRestore, onDiscard, onDecideLater }) => {
  const { modalProps, contentRef } = useModalAccessibility({ isOpen, onClose: onDecideLater, titleId: 'recovery-modal-title' });

  const defaults = useMemo(() => ({
    files: new Set(pending?.files.filter(f => f.status === 'unchanged').map(f => f.relativePath) ?? []),
    untitled: new Set(pending?.untitled.map(u => u.id) ?? []),
    settings: Boolean(pending?.settings) && pending?.settingsStatus !== 'changed',
  }), [pending]);

  const [files, setFiles] = useState(defaults.files);
  const [untitled, setUntitled] = useState(defaults.untitled);
  const [settings, setSettings] = useState(defaults.settings);
  const [confirmingDiscard, setConfirmingDiscard] = useState(false);

  useEffect(() => {
    setFiles(defaults.files);
    setUntitled(defaults.untitled);
    setSettings(defaults.settings);
    setConfirmingDiscard(false);
  }, [defaults]);

  if (!isOpen || !pending) return null;

  const toggle = (set: Set<string>, key: string, update: (s: Set<string>) => void) => {
    const next = new Set(set);
    if (next.has(key)) next.delete(key); else next.add(key);
    update(next);
  };

  const nothingSelected = files.size === 0 && untitled.size === 0 && !settings;
  const when = new Date(pending.updatedAt);

  const restore = () => onRestore({
    files: pending.files.map(f => f.relativePath).filter(p => files.has(p)),
    untitled: pending.untitled.map(u => u.id).filter(id => untitled.has(id)),
    settings,
  });

  const rowClass = 'flex items-start gap-3 py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0';
  const badgeClass = 'ml-2 px-2 py-0.5 rounded text-xs whitespace-nowrap';

  return (
    <div
      data-testid="recovery-backdrop"
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100]"
      onClick={onDecideLater}
    >
      <div
        ref={contentRef}
        {...modalProps}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl m-4 flex flex-col max-h-[85vh]"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 id="recovery-modal-title" className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Recover unsaved work from {relativeTime(pending.updatedAt)}?
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Vangard Studio didn&apos;t close normally ({when.toLocaleString()}). Restored items open as unsaved changes —
            nothing is written to disk until you save.
          </p>
        </header>

        <main className="p-4 overflow-y-auto">
          <ul>
            {pending.files.map(f => (
              <li key={f.relativePath} className={rowClass}>
                <label className="flex items-center gap-3 flex-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={files.has(f.relativePath)}
                    onChange={() => toggle(files, f.relativePath, setFiles)}
                  />
                  <span className="font-mono text-sm text-gray-800 dark:text-gray-200">{f.relativePath}</span>
                </label>
                <span data-badge="file" className={`${badgeClass} ${FILE_BADGE[f.status].className}`}>{FILE_BADGE[f.status].label}</span>
              </li>
            ))}
            {pending.untitled.map(u => (
              <li key={u.id} className={rowClass}>
                <label className="flex items-center gap-3 flex-1 cursor-pointer">
                  <input type="checkbox" checked={untitled.has(u.id)} onChange={() => toggle(untitled, u.id, setUntitled)} />
                  <span className="text-sm text-gray-800 dark:text-gray-200">{u.title}</span>
                </label>
                <span className={`${badgeClass} bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300`}>untitled draft</span>
              </li>
            ))}
            {pending.settings && (
              <li className={rowClass}>
                <label className="flex items-center gap-3 flex-1 cursor-pointer">
                  <input type="checkbox" checked={settings} onChange={() => setSettings(s => !s)} />
                  <span className="text-sm text-gray-800 dark:text-gray-200">
                    Workspace changes <span className="text-gray-500 dark:text-gray-400">(notes, notecards, compositions, layout)</span>
                  </span>
                </label>
                {pending.settingsStatus === 'changed' && (
                  <span data-badge="settings" className={`${badgeClass} ${FILE_BADGE.changed.className}`}>changed on disk since</span>
                )}
              </li>
            )}
          </ul>
        </main>

        <footer className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center gap-3">
          {confirmingDiscard ? (
            <>
              <span className="text-sm text-red-700 dark:text-red-400 flex-1">This permanently deletes the recovered work.</span>
              <button
                onClick={() => setConfirmingDiscard(false)}
                className="px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={onDiscard}
                className="px-4 py-2 text-sm font-bold rounded bg-red-600 hover:bg-red-700 text-white"
              >
                Discard recovered work
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setConfirmingDiscard(true)}
                className="px-4 py-2 text-sm rounded text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
              >
                Discard…
              </button>
              <span className="flex-1" />
              <button
                onClick={onDecideLater}
                className="px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-100"
              >
                Decide later
              </button>
              <button
                onClick={restore}
                disabled={nothingSelected}
                className="px-4 py-2 text-sm font-bold rounded bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Restore selected
              </button>
            </>
          )}
        </footer>
      </div>
    </div>
  );
};

export default RecoveryModal;
```

- [ ] **Step 3: Run the tests**

Run: `npx vitest run src/components/RecoveryModal.test.tsx && npx eslint src/components/RecoveryModal.tsx src/components/RecoveryModal.test.tsx`
Expected: PASS, no lint errors. Escape works because `useModalAccessibility` registers a capturing `keydown` listener on `document`, which calls `onClose` (wired here to `onDecideLater`).

- [ ] **Step 4: Commit**

```bash
git add src/components/RecoveryModal.tsx src/components/RecoveryModal.test.tsx
git commit -m "feat(recovery): startup recovery dialog"
```

---

### Task 7: Wire into project load and `App`

**Files:**
- Modify: `src/hooks/useProjectLoad.ts` (`UseProjectLoadParams`, `loadProject`)
- Modify: `src/hooks/useProjectLoad.test.ts`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: everything from Tasks 2–6
- Produces:
  - `UseProjectLoadParams` gains `recoverySessionIdRef: React.MutableRefObject<string | null>`, `setPendingRecovery: (p: PendingRecovery | null) => void` and `setRecoveryResolved: (v: boolean) => void`

- [ ] **Step 1: Write the failing `useProjectLoad` tests**

In `src/hooks/useProjectLoad.test.ts`, extend that file's `makeParams()` with:

```ts
    recoverySessionIdRef: { current: null },
    setPendingRecovery: vi.fn(),
    setRecoveryResolved: vi.fn(),
```

and add these tests (they use the same `api.loadProject.mockResolvedValue({...})` shape as the existing settingsWarning test):

```ts
  const loadResult = {
    rootPath: '/project', files: [], images: [], audios: [],
    tree: { name: 'game', path: '', children: [] }, settings: null,
  } as unknown as Parameters<typeof api.loadProject.mockResolvedValue>[0];

  it('starts a new recovery session and opens the dialog when a snapshot is pending', async () => {
    const params = makeParams();
    const pending = { sessionId: 'old', files: [], untitled: [{ id: 'u', title: 'U', content: 'x' }], settings: null, settingsStatus: null, projectRoot: '/project', updatedAt: '' };
    api.loadProject.mockResolvedValue(loadResult);
    api.recovery.listPending.mockResolvedValue(pending);
    const { result } = renderHook(() => useProjectLoad(params));
    await act(async () => { await result.current.loadProject('/project'); });

    const sessionId = params.recoverySessionIdRef.current;
    expect(sessionId).toMatch(/^[0-9a-f-]{36}$/);
    expect(api.recovery.listPending).toHaveBeenCalledWith(sessionId);
    expect(params.setRecoveryResolved).toHaveBeenCalledWith(false);
    expect(params.setPendingRecovery).toHaveBeenCalledWith(pending);
    expect(params.setRecoveryResolved).not.toHaveBeenCalledWith(true);
  });

  it('marks recovery resolved when nothing is pending', async () => {
    const params = makeParams();
    api.loadProject.mockResolvedValue(loadResult);
    api.recovery.listPending.mockResolvedValue(null);
    const { result } = renderHook(() => useProjectLoad(params));
    await act(async () => { await result.current.loadProject('/project'); });
    expect(params.setRecoveryResolved).toHaveBeenLastCalledWith(true);
    expect(params.setPendingRecovery).not.toHaveBeenCalledWith(expect.objectContaining({ sessionId: expect.any(String) }));
  });

  it('never blocks loading when listPending fails', async () => {
    const params = makeParams();
    api.loadProject.mockResolvedValue(loadResult);
    api.recovery.listPending.mockRejectedValue(new Error('boom'));
    const { result } = renderHook(() => useProjectLoad(params));
    await act(async () => { await result.current.loadProject('/project'); });
    expect(params.setRecoveryResolved).toHaveBeenLastCalledWith(true);
    expect(params.addToast).toHaveBeenCalledWith('Project loaded successfully', 'success');
  });
```

Run: `npx vitest run src/hooks/useProjectLoad.test.ts`. Expected: FAIL (tsc and test errors for the unknown params / listPending not called).

- [ ] **Step 2: Implement in `useProjectLoad.ts`**

1. Add `PendingRecovery` to the `@/types` import.
2. Add to `UseProjectLoadParams`:

```ts
  // Crash recovery (b70a.2.3): a fresh session id per project open; a pending snapshot
  // opens RecoveryModal; autosave is enabled only once recovery is resolved.
  recoverySessionIdRef: React.MutableRefObject<string | null>;
  setPendingRecovery: (pending: PendingRecovery | null) => void;
  setRecoveryResolved: (resolved: boolean) => void;
```

3. Destructure the three in `useProjectLoad` and add them to `loadProject`'s dependency array.
4. In `loadProject`, immediately after `loadCancelRef.current = false;`:

```ts
    setRecoveryResolved(false);
    setPendingRecovery(null);
    recoverySessionIdRef.current = crypto.randomUUID();
```

5. Immediately after `addToast('Project loaded successfully', 'success');`:

```ts
      try {
        const pending = await window.electronAPI?.recovery?.listPending(recoverySessionIdRef.current!);
        if (loadCancelRef.current) return;
        if (pending) setPendingRecovery(pending);
        else setRecoveryResolved(true);
      } catch (err) {
        logger.warn('Could not check for recoverable unsaved work', err);
        setRecoveryResolved(true);
      }
```

Run: `npx vitest run src/hooks/useProjectLoad.test.ts`. Expected: PASS.

- [ ] **Step 3: Wire `App.tsx`**

1. Imports (next to the other hook and component imports):

```ts
import { useRecoverySnapshots } from '@/hooks/useRecoverySnapshots';
import { applyRecoverySnapshot } from '@/lib/recoveryRestore';
import RecoveryModal from '@/components/RecoveryModal';
import { hydrateSettingsFromSnapshot } from '@/hooks/useProjectLoad';
```

Add `PendingRecovery` and `RecoverySelection` to the `@/types` import. If `useProjectLoad` is already imported from `@/hooks/useProjectLoad`, merge `hydrateSettingsFromSnapshot` into that import instead.

2. State and refs, next to `projectSettingsMetaRef`:

```ts
  const recoverySessionIdRef = useRef<string | null>(null);
  const [pendingRecovery, setPendingRecovery] = useState<PendingRecovery | null>(null);
  const [recoveryResolved, setRecoveryResolved] = useState(false);
```

3. Pass `recoverySessionIdRef, setPendingRecovery, setRecoveryResolved` to `useProjectLoad({...})`. Lift the `hydrateSetters` object literal passed to it into a `const hydrateSetters = { ... }` declared just above, so the restore handler can reuse it, and pass `hydrateSetters` in its place.

4. Add `buildSettingsForDisk` to the destructuring of `useProjectIO(...)`.

5. Below `useProjectIO`, and after `useUntitledFiles` (it needs `createRecoveredUntitledFile` from that destructuring; add it there):

```ts
  useRecoverySnapshots({
    enabled: recoveryResolved && !!projectRootPath,
    sessionIdRef: recoverySessionIdRef,
    blocks, blocksRef, editorInstances,
    dirtyBlockIds, dirtyEditors, untitledFiles, hasUnsavedSettings,
    buildSettingsPayload: buildSettingsForDisk,
  });

  const resolveRecovery = useCallback(() => {
    setPendingRecovery(null);
    setRecoveryResolved(true);
  }, []);

  const handleRecoveryRestore = useCallback(async (selection: RecoverySelection) => {
    if (!pendingRecovery || !projectRootPath) return;
    const { restored, failures } = applyRecoverySnapshot(pendingRecovery, selection, {
      rootPath: projectRootPath,
      tree: fileSystemTree,
      blocksRef, editorInstances,
      images, audios,
      setBlocks, setDirtyBlockIds, setHasUnsavedSettings,
      createRecoveredUntitledFile,
      applySettingsSnapshot: (snapshot) => hydrateSettingsFromSnapshot(snapshot, hydrateSetters),
    });
    if (failures.length === 0) {
      const sessionId = recoverySessionIdRef.current;
      if (sessionId) await window.electronAPI?.recovery.discardPending(sessionId);
      addToast(`Restored ${restored} item${restored === 1 ? '' : 's'} — review and save when ready`, 'success');
    } else {
      addToast(`Some recovered items could not be restored: ${failures.map(f => `${f.item} (${f.error})`).join('; ')}. They will be offered again next time.`, 'error');
    }
    resolveRecovery();
  }, [pendingRecovery, projectRootPath, fileSystemTree, blocksRef, editorInstances, images, audios, setBlocks, setDirtyBlockIds, setHasUnsavedSettings, createRecoveredUntitledFile, hydrateSetters, addToast, resolveRecovery]);

  const handleRecoveryDiscard = useCallback(async () => {
    const sessionId = recoverySessionIdRef.current;
    if (sessionId) await window.electronAPI?.recovery.discardPending(sessionId);
    addToast('Recovered work discarded', 'info');
    resolveRecovery();
  }, [addToast, resolveRecovery]);
```

`fileSystemTree`, `images`, `audios`, `setDirtyBlockIds` and `setHasUnsavedSettings` are already in scope in `App.tsx` under those names (destructured from the existing state hooks near lines 153, 281 and 511). Wrapping `hydrateSetters` in `useMemo` isn't needed: the callback is rebuilt each render, which is fine for a once-per-open dialog.

6. Render the modal next to `<AboutModal … />`:

```tsx
      <RecoveryModal
        isOpen={pendingRecovery !== null}
        pending={pendingRecovery}
        onRestore={handleRecoveryRestore}
        onDiscard={handleRecoveryDiscard}
        onDecideLater={resolveRecovery}
      />
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit -p . && npx eslint src/App.tsx src/hooks/useProjectLoad.ts && npx vitest run`
Expected: tsc exit 0; no new lint errors (the existing `App.tsx` warnings remain); every test passes, including `src/test/App.test.tsx` (its mock now provides `recovery.listPending → null`).

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/hooks/useProjectLoad.ts src/hooks/useProjectLoad.test.ts
git commit -m "feat(recovery): offer recovery on project open and autosave unsaved work"
```

---

### Task 8: E2E acceptance test, full release gate, bookkeeping

**Files:**
- Create: `e2e/smoke/34-crash-recovery.spec.ts`

**Interfaces:**
- Consumes: the whole feature; `RENIDE_RECOVERY_DIR` (Task 2); `launchElectron`, `forceExit` (which calls `app.exit(0)` and skips the clean-quit cleanup) and `suppressFirstRunTutorial` from `e2e/electron-launch.js`; `FIXTURE_PROJECT` from `e2e/electron-fixture`

- [ ] **Step 1: Write the spec**

```ts
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { _electron as electron, expect, test } from 'playwright/test';
import type { ElectronApplication, Page } from 'playwright/test';
import { APP_ENTRY, forceExit, launchElectron, suppressFirstRunTutorial } from '../electron-launch.js';
import { FIXTURE_PROJECT } from '../electron-fixture';

// Acceptance for bmf-vangard-renpy-ide-b70a.2.3: after a simulated crash (hard
// exit that skips the clean-quit cleanup), the next open offers recovery, which
// can be restored as unsaved changes or discarded intentionally. Snapshots go to
// a throwaway RENIDE_RECOVERY_DIR so the developer's userData is never touched.

let base: string;
let projectRoot: string;
let recoveryDir: string;

async function launch(): Promise<{ app: ElectronApplication; window: Page }> {
  const app = await launchElectron(electron, {
    args: [APP_ENTRY, '--project', projectRoot],
    env: {
      RENIDE_RECOVERY_DIR: recoveryDir,
      RENIDE_SETTINGS_OVERRIDE: JSON.stringify({ isLeftSidebarOpen: true, isRightSidebarOpen: true }),
    },
  });
  await suppressFirstRunTutorial(app);
  const window = await app.firstWindow();
  await window.waitForLoadState('domcontentloaded');
  return { app, window };
}

async function snapshotFiles(): Promise<string[]> {
  const out: string[] = [];
  const dirs = await fs.readdir(recoveryDir).catch(() => [] as string[]);
  for (const d of dirs) {
    for (const f of await fs.readdir(path.join(recoveryDir, d)).catch(() => [] as string[])) {
      if (/^session-.+\.json$/.test(f)) out.push(path.join(recoveryDir, d, f));
    }
  }
  return out;
}

async function typeUnsavedEditAndCrash(marker: string) {
  const { app, window } = await launch();
  const block = window.locator('[data-block-id]').first();
  await expect(block).toBeVisible({ timeout: 30_000 });
  await block.dblclick();
  const editor = window.locator('.monaco-editor').first();
  await expect(editor).toBeVisible({ timeout: 10_000 });
  await editor.click();
  await window.keyboard.press(process.platform === 'darwin' ? 'Meta+End' : 'Control+End');
  await window.keyboard.press('Enter');
  await window.keyboard.type(marker);
  // 800 ms content debounce + 5 s snapshot debounce
  await expect.poll(async () => {
    for (const f of await snapshotFiles()) {
      if ((await fs.readFile(f, 'utf-8')).includes(marker)) return true;
    }
    return false;
  }, { timeout: 20_000 }).toBe(true);
  await forceExit(app); // simulated crash
}

test.describe('crash recovery', () => {
  test.beforeEach(async () => {
    base = await fs.mkdtemp(path.join(os.tmpdir(), 'vangard e2e crash ゲーム-'));
    projectRoot = path.join(base, 'project');
    recoveryDir = path.join(base, 'recovery');
    await fs.cp(FIXTURE_PROJECT, projectRoot, { recursive: true });
  });

  test.afterEach(async () => {
    await fs.rm(base, { recursive: true, force: true });
  });

  test('an unsaved edit survives a crash and is restored as an unsaved change', async () => {
    const marker = `# crash-marker-${Date.now()}`;
    const scriptPath = path.join(projectRoot, 'game', 'script.rpy');
    const onDisk = await fs.readFile(scriptPath, 'utf-8');

    await typeUnsavedEditAndCrash(marker);

    const { app, window } = await launch();
    try {
      await expect(window.getByRole('heading', { name: /Recover unsaved work/ })).toBeVisible({ timeout: 30_000 });
      await expect(window.getByRole('checkbox', { name: /game\/script\.rpy/ })).toBeChecked();
      await window.getByRole('button', { name: 'Restore selected' }).click();
      await expect(window.getByText(/Restored 1 item/)).toBeVisible();

      const block = window.locator('[data-block-id]').first();
      await block.dblclick();
      await expect(window.locator('.monaco-editor').first()).toContainText(marker);

      // Restored as UNSAVED: disk is untouched until the user saves.
      expect(await fs.readFile(scriptPath, 'utf-8')).toBe(onDisk);
    } finally {
      await forceExit(app);
    }
  });

  test('discarding recovered work deletes it and it is not offered again', async () => {
    await typeUnsavedEditAndCrash(`# discard-marker-${Date.now()}`);

    let { app, window } = await launch();
    await expect(window.getByRole('heading', { name: /Recover unsaved work/ })).toBeVisible({ timeout: 30_000 });
    await window.getByRole('button', { name: 'Discard…' }).click();
    await window.getByRole('button', { name: 'Discard recovered work' }).click();
    await expect(window.getByText('Recovered work discarded')).toBeVisible();
    expect(await snapshotFiles()).toEqual([]);
    await forceExit(app);

    ({ app, window } = await launch());
    try {
      await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 30_000 });
      await expect(window.getByRole('heading', { name: /Recover unsaved work/ })).toHaveCount(0);
    } finally {
      await forceExit(app);
    }
  });
});
```

- [ ] **Step 2: Run the spec**

Run: `npm run build && npx playwright test e2e/smoke/34-crash-recovery.spec.ts`
Expected: 2 passed. If the snapshot poll times out, check that `recovery:write` reaches the main process (look for "Recovery snapshot failed" in the app log) and that `recoveryResolved` became `true` after load. With no pending snapshot, `listPending` must resolve to `null`.

- [ ] **Step 3: Full release gate**

Run: `npm run gate`
Expected: typecheck, lint (0 errors), coverage, build, docs:check and every E2E test pass. A flake in `09-undo-redo` is tracked separately; if it appears, rerun that spec alone and record the result.

- [ ] **Step 4: Commit**

```bash
npx eslint e2e/smoke/34-crash-recovery.spec.ts
git add e2e/smoke/34-crash-recovery.spec.ts
git commit -m "test(e2e): crash recovery restore and discard"
```

- [ ] **Step 5: Bookkeeping**

```bash
bd comments add b70a.2.4 "From b70a.2.3: unsaved work is snapshotted to <userData>/recovery/<sha256(project path)>/session-<id>.json (5 s after edits, 60 s cap). Each snapshot is capped at 25 MB, with at most 3 per project and 200 MB in total; files expire after 30 days. On reopen after a crash a dialog offers Restore selected / Discard / Decide later; restored items come back as unsaved changes and nothing is written to disk. Files changed or deleted on disk since the snapshot are flagged and unchecked. Document where snapshots live, how to clear them manually, and that a second running instance's live session is never offered."
bd close b70a.2.3 --reason "Implemented per docs/superpowers/specs/2026-10-11-autosave-recovery-design.md and docs/superpowers/plans/2026-10-11-autosave-recovery.md"
git add .beads/ && git commit -m "chore(beads): close b70a.2.3"
```
