// Exercises the multi-file save transaction against a real temp directory, and
// simulates the process dying at every filesystem step of a commit to prove
// recovery always lands on a consistent (all-old or all-new) project.
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';

import {
  commitSaveTransaction,
  recoverSaveTransaction,
  journalPathFor,
} from './saveTransaction.js';

type Ops = Record<string, (...args: never[]) => Promise<unknown>>;

const realOps: Ops = {
  writeFile: (async (p: string, c: string, enc: BufferEncoding) => fs.writeFile(p, c, enc)) as never,
  readFile: (async (p: string, enc?: BufferEncoding) => fs.readFile(p, enc)) as never,
  rename: (async (a: string, b: string) => fs.rename(a, b)) as never,
  unlink: (async (p: string) => fs.unlink(p)) as never,
  mkdir: (async (p: string) => fs.mkdir(p, { recursive: true })) as never,
  exists: (async (p: string) => fs.access(p).then(() => true, () => false)) as never,
};

class SimulatedCrash extends Error {}

/**
 * Wraps the real ops so the `crashAt`-th call dies. In 'before' mode the op
 * never happens; in 'after' mode it completes and then the process "dies".
 * Every call after the crash also throws -- a dead process runs no cleanup.
 */
function crashingOps(crashAt: number, mode: 'before' | 'after') {
  let calls = 0;
  let dead = false;
  const ops: Ops = {};
  for (const [name, fn] of Object.entries(realOps)) {
    ops[name] = (async (...args: never[]) => {
      if (dead) throw new SimulatedCrash('process is dead');
      calls++;
      if (calls === crashAt) {
        dead = true;
        if (mode === 'after') await fn(...args);
        throw new SimulatedCrash(`crash at op ${crashAt}`);
      }
      return fn(...args);
    }) as never;
  }
  return { ops, get calls() { return calls; }, get crashed() { return dead; } };
}

async function listAll(dir: string): Promise<string[]> {
  const out: string[] = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await listAll(full));
    else out.push(full);
  }
  return out;
}

const OLD = {
  'game/script.rpy': 'label start:\n    "old"\n    return\n',
  'game/第一章 序.rpy': 'label ch1:\n    "古い"\n    return\n',
};
const NEW = {
  'game/script.rpy': 'label start:\n    "new"\n    return\n',
  'game/第一章 序.rpy': 'label ch1:\n    "新しい"\n    return\n',
  'game/chapters/added.rpy': 'label added:\n    return\n',
};

describe('saveTransaction', () => {
  let root: string;

  async function seed() {
    for (const [rel, content] of Object.entries(OLD)) {
      await fs.mkdir(path.dirname(path.join(root, rel)), { recursive: true });
      await fs.writeFile(path.join(root, rel), content, 'utf-8');
    }
  }

  const newEntries = () => Object.entries(NEW).map(([rel, content]) => ({ path: path.join(root, rel), content }));

  async function readState() {
    const state: Record<string, string | null> = {};
    for (const rel of Object.keys(NEW)) {
      state[rel] = await fs.readFile(path.join(root, rel), 'utf-8').catch(() => null);
    }
    return state;
  }

  const ALL_OLD = { ...OLD, 'game/chapters/added.rpy': null };
  const ALL_NEW = NEW;

  beforeEach(async () => {
    // Space + non-ASCII in the project root, as on real Windows user machines.
    root = await fs.mkdtemp(path.join(os.tmpdir(), 'vangard save ゲーム-'));
    await seed();
  });

  afterEach(async () => {
    await fs.rm(root, { recursive: true, force: true });
  });

  it('commits every file and leaves no journal or temp files behind', async () => {
    const result = await commitSaveTransaction(root, newEntries());
    expect(result).toEqual({ committed: true, pendingRecovery: false, files: Object.keys(NEW) });
    expect(await readState()).toEqual(ALL_NEW);
    const leftovers = (await listAll(root)).filter(f => f.includes('.txn-') || f.endsWith('save-journal.json'));
    expect(leftovers).toEqual([]);
  });

  it('calls beforeRename for each target just before replacing it', async () => {
    const seen: string[] = [];
    await commitSaveTransaction(root, newEntries(), { beforeRename: (p: string) => seen.push(p) });
    expect(seen.map(p => path.relative(root, p).split(path.sep).join('/'))).toEqual(Object.keys(NEW));
  });

  it('is a no-op for an empty batch', async () => {
    expect(await commitSaveTransaction(root, [])).toEqual({ committed: true, pendingRecovery: false, files: [] });
    expect(await readState()).toEqual(ALL_OLD);
  });

  it('last write wins when the same target is listed twice', async () => {
    const target = path.join(root, 'game/script.rpy');
    await commitSaveTransaction(root, [{ path: target, content: 'first' }, { path: target, content: 'second' }]);
    expect(await fs.readFile(target, 'utf-8')).toBe('second');
  });

  it('reports none when there is nothing to recover', async () => {
    expect(await recoverSaveTransaction(root)).toEqual({ status: 'none', files: [] });
  });

  // Count the ops a clean commit performs so every one of them can be crashed.
  async function countOps(): Promise<number> {
    const probe = crashingOps(Number.MAX_SAFE_INTEGER, 'before');
    await commitSaveTransaction(root, newEntries(), { ops: probe.ops });
    const n = probe.calls;
    await fs.rm(root, { recursive: true, force: true });
    await fs.mkdir(root, { recursive: true });
    await seed();
    return n;
  }

  for (const mode of ['before', 'after'] as const) {
    it(`crash ${mode} any single filesystem step: recovery always yields all-old or all-new`, async () => {
      const total = await countOps();
      expect(total).toBeGreaterThan(10);
      const outcomes = new Set<string>();

      for (let crashAt = 1; crashAt <= total; crashAt++) {
        const sim = crashingOps(crashAt, mode);
        let threw = false;
        let pendingRecovery = false;
        try {
          const r = await commitSaveTransaction(root, newEntries(), { ops: sim.ops });
          pendingRecovery = r.pendingRecovery;
        } catch (err) {
          // A crash during the up-front journal check surfaces wrapped by recovery.
          expect(String(err)).toMatch(/crash at op|process is dead/);
          threw = true;
        }
        expect(sim.crashed).toBe(true);

        // "Restart": recover with a healthy filesystem.
        const recovery = await recoverSaveTransaction(root);
        expect(recovery.status).not.toBe('failed');

        const state = await readState();
        const isOld = JSON.stringify(state) === JSON.stringify(ALL_OLD);
        const isNew = JSON.stringify(state) === JSON.stringify(ALL_NEW);
        expect({ crashAt, mode, consistent: isOld || isNew }).toEqual({ crashAt, mode, consistent: true });
        outcomes.add(isNew ? 'new' : 'old');

        if (mode === 'before') {
          // Without a half-applied op, the caller's view always matches disk:
          // an error means nothing changed; a commit means everything did.
          expect({ crashAt, threw, isOld }).toEqual({ crashAt, threw, isOld: threw });
          if (!threw) expect(pendingRecovery).toBe(true);
        }

        const leftovers = (await listAll(root)).filter(f => f.includes('.txn-') || f.endsWith('save-journal.json'));
        expect({ crashAt, leftovers }).toEqual({ crashAt, leftovers: [] });

        // Reset for the next crash point.
        await fs.rm(root, { recursive: true, force: true });
        await fs.mkdir(root, { recursive: true });
        await seed();
      }

      // Both outcomes must actually occur, or the sweep isn't crossing the commit point.
      expect([...outcomes].sort()).toEqual(['new', 'old']);
    });
  }

  it('recovers after the project folder is moved between the crash and the restart', async () => {
    // Stop right after the commit point by failing the first temp -> target rename.
    let renames = 0;
    const ops = {
      rename: (async (a: string, b: string) => {
        if (a.includes('.txn-') && ++renames === 1) throw new SimulatedCrash('dead');
        return fs.rename(a, b);
      }) as never,
    };
    const r = await commitSaveTransaction(root, newEntries(), { ops });
    expect(r.pendingRecovery).toBe(true);

    const moved = root + ' moved';
    await fs.rename(root, moved);
    root = moved;

    expect((await recoverSaveTransaction(root)).status).toBe('rolled-forward');
    expect(await readState()).toEqual(ALL_NEW);
  });

  it('refuses to roll forward a staged file whose checksum does not match, and keeps the journal', async () => {
    let renames = 0;
    const ops = {
      rename: (async (a: string, b: string) => {
        if (a.includes('.txn-') && ++renames === 1) throw new SimulatedCrash('dead');
        return fs.rename(a, b);
      }) as never,
    };
    await commitSaveTransaction(root, newEntries(), { ops });

    // Corrupt a staged temp file behind the journal's back.
    const temp = (await listAll(root)).find(f => f.includes('.txn-'))!;
    await fs.writeFile(temp, 'garbage', 'utf-8');

    const recovery = await recoverSaveTransaction(root);
    expect(recovery.status).toBe('failed');
    expect(recovery.error).toMatch(/checksum/);
    expect(await fs.access(journalPathFor(root)).then(() => true, () => false)).toBe(true);

    // ... and no new save may start on top of it.
    await expect(commitSaveTransaction(root, newEntries())).rejects.toThrow(/previous save could not be completed/);
  });

  it('rejects a journal entry that points outside the project root', async () => {
    await fs.mkdir(path.dirname(journalPathFor(root)), { recursive: true });
    await fs.writeFile(journalPathFor(root), JSON.stringify({
      version: 1, txid: 'x', state: 'staging',
      entries: [{ target: '../outside.rpy', temp: '../.outside.rpy.txn-x', sha256: '' }],
    }));
    const recovery = await recoverSaveTransaction(root);
    expect(recovery.status).toBe('failed');
    expect(recovery.error).toMatch(/escapes the project root/);
  });

  it('reports a malformed journal as failed instead of guessing', async () => {
    await fs.mkdir(path.dirname(journalPathFor(root)), { recursive: true });
    await fs.writeFile(journalPathFor(root), '{"state": "staging"');
    expect((await recoverSaveTransaction(root)).status).toBe('failed');
    await fs.writeFile(journalPathFor(root), '{"state": "weird", "entries": []}');
    expect((await recoverSaveTransaction(root)).status).toBe('failed');
  });

  it('a staging failure (e.g. disk full) rolls back immediately and leaves targets untouched', async () => {
    let writes = 0;
    const ops = {
      writeFile: (async (p: string, c: string, enc: BufferEncoding) => {
        if (p.includes('.txn-') && ++writes === 2) throw Object.assign(new Error('ENOSPC: no space left on device'), { code: 'ENOSPC' });
        return fs.writeFile(p, c, enc);
      }) as never,
    };
    await expect(commitSaveTransaction(root, newEntries(), { ops })).rejects.toThrow(/ENOSPC/);
    expect(await readState()).toEqual(ALL_OLD);
    const leftovers = (await listAll(root)).filter(f => f.includes('.txn-') || f.endsWith('save-journal.json'));
    expect(leftovers).toEqual([]);
  });
});
