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
