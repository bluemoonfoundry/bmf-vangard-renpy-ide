import fsPromises from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { atomicWriteFile } from './atomicFileWrite.js';

// Multi-file save transaction with a write-ahead journal.
//
// atomicWriteFile makes each *individual* file write all-or-nothing, but a
// Save All that writes five .rpy files can still be cut off after the second,
// leaving the project half old / half new. This module makes a batch of writes
// all-or-nothing as a group:
//
//   1. journal  {state: 'staging', entries}       (atomic write)
//   2. stage    every new content to a sibling temp file, fsync'd
//   3. journal  {state: 'committed', entries}     (atomic write -- THE commit point)
//   4. rename   each temp over its target
//   5. delete   the journal
//
// A crash before (3) completes leaves every target untouched; recovery deletes
// the staged temps (roll back). A crash after (3) leaves every new content
// durably staged; recovery renames the remaining temps into place (roll
// forward). Either way the project ends up entirely in the old or entirely in
// the new state. Recovery runs on project load, before any file is read.
//
// Journal paths are stored relative to the project root (forward slashes) so a
// project folder moved or renamed after a crash still recovers.

export const JOURNAL_DIR = '.renide';
export const JOURNAL_FILE = 'save-journal.json';
const JOURNAL_VERSION = 1;

// Distinct from atomicWriteFile's `.tmp-` suffix on purpose: cleanupStaleTempFiles
// deletes those unconditionally, but a `.txn-` temp may be the only copy of
// committed content and must only ever be removed by recovery.
const tempNameFor = (target, txid) => `.${path.basename(target)}.txn-${txid}`;

const sha256 = (content, encoding) =>
    crypto.createHash('sha256').update(typeof content === 'string' ? Buffer.from(content, encoding) : content).digest('hex');

export function journalPathFor(rootPath) {
    return path.join(rootPath, JOURNAL_DIR, JOURNAL_FILE);
}

async function durableWriteFile(filePath, content, encoding) {
    const handle = await fsPromises.open(filePath, 'w');
    try {
        await handle.writeFile(content, typeof content === 'string' ? encoding : undefined);
        await handle.sync();
    } finally {
        await handle.close();
    }
}

const defaultOps = {
    writeFile: durableWriteFile,
    readFile: (p, enc) => fsPromises.readFile(p, enc),
    rename: (from, to) => fsPromises.rename(from, to),
    unlink: (p) => fsPromises.unlink(p),
    mkdir: (p) => fsPromises.mkdir(p, { recursive: true }),
    exists: (p) => fsPromises.access(p).then(() => true, () => false),
};

function resolveInsideRoot(rootPath, relativePath) {
    const root = path.resolve(rootPath);
    const resolved = path.resolve(root, relativePath);
    if (resolved !== root && !resolved.startsWith(root + path.sep)) {
        throw new Error(`Save journal entry escapes the project root: ${relativePath}`);
    }
    return resolved;
}

const toRelative = (rootPath, absPath) => path.relative(path.resolve(rootPath), path.resolve(absPath)).split(path.sep).join('/');

async function writeJournal(rootPath, journal, ops) {
    await atomicWriteFile(journalPathFor(rootPath), JSON.stringify(journal, null, 2), 'utf-8', {
        writeFileFn: ops.writeFile,
        renameFn: ops.rename,
        unlinkFn: ops.unlink,
    });
}

/**
 * Writes every entry or none of them. Entries are `{ path, content, encoding? }`
 * with absolute paths inside `rootPath`. Throws if the transaction did not
 * commit, in which case no target was modified. Once it has committed, a failure
 * renaming a temp into place is finished by recovery on the next load (or by the
 * next save) -- the call reports `{ committed: true, pendingRecovery: true }`
 * rather than throwing, because the new content is durably on disk.
 *
 * `options.ops` replaces the filesystem primitives (used by the crash tests);
 * `options.beforeRename(absPath)` runs just before each target is replaced.
 */
export async function commitSaveTransaction(rootPath, entries, options = {}) {
    const ops = { ...defaultOps, ...options.ops };
    const beforeRename = options.beforeRename ?? (() => {});

    // Never start a new transaction on top of an unfinished one.
    const prior = await recoverSaveTransaction(rootPath, { ops });
    if (prior.status === 'failed') {
        throw new Error(`A previous save could not be completed and must be resolved first: ${prior.error}`);
    }

    // Last write wins if the same target appears twice (they would share a temp file).
    const byTarget = new Map();
    for (const e of entries) byTarget.set(path.resolve(e.path), e);
    entries = [...byTarget.values()];

    if (entries.length === 0) return { committed: true, pendingRecovery: false, files: [] };

    const txid = crypto.randomUUID();
    const journalEntries = entries.map(e => {
        const target = resolveInsideRoot(rootPath, toRelative(rootPath, e.path));
        return {
            target: toRelative(rootPath, target),
            temp: toRelative(rootPath, path.join(path.dirname(target), tempNameFor(target, txid))),
            sha256: sha256(e.content, e.encoding ?? 'utf-8'),
        };
    });
    const journal = { version: JOURNAL_VERSION, txid, state: 'staging', createdAt: new Date().toISOString(), entries: journalEntries };

    // 1-2: stage. Any failure here rolls back: targets were never touched.
    try {
        await ops.mkdir(path.join(rootPath, JOURNAL_DIR));
        await writeJournal(rootPath, journal, ops);
        for (let i = 0; i < entries.length; i++) {
            const tempAbs = resolveInsideRoot(rootPath, journalEntries[i].temp);
            await ops.mkdir(path.dirname(tempAbs));
            await ops.writeFile(tempAbs, entries[i].content, entries[i].encoding ?? 'utf-8');
        }
        // 3: commit point.
        await writeJournal(rootPath, { ...journal, state: 'committed' }, ops);
    } catch (err) {
        await rollBack(rootPath, journalEntries, ops).catch(() => {});
        throw err;
    }

    // 4-5: apply. From here on the save has happened; only cleanup can fail.
    try {
        await applyCommitted(rootPath, journalEntries, ops, beforeRename);
    } catch {
        return { committed: true, pendingRecovery: true, files: journalEntries.map(e => e.target) };
    }
    return { committed: true, pendingRecovery: false, files: journalEntries.map(e => e.target) };
}

async function rollBack(rootPath, journalEntries, ops) {
    for (const entry of journalEntries) {
        const tempAbs = resolveInsideRoot(rootPath, entry.temp);
        if (await ops.exists(tempAbs)) await ops.unlink(tempAbs);
    }
    const journalPath = journalPathFor(rootPath);
    if (await ops.exists(journalPath)) await ops.unlink(journalPath);
}

async function applyCommitted(rootPath, journalEntries, ops, beforeRename = () => {}) {
    for (const entry of journalEntries) {
        const tempAbs = resolveInsideRoot(rootPath, entry.temp);
        // Already renamed by an earlier, interrupted apply.
        if (!(await ops.exists(tempAbs))) continue;
        const staged = await ops.readFile(tempAbs);
        if (sha256(staged) !== entry.sha256) {
            throw new Error(`Staged content for ${entry.target} does not match the journal checksum`);
        }
        const targetAbs = resolveInsideRoot(rootPath, entry.target);
        beforeRename(targetAbs);
        await ops.rename(tempAbs, targetAbs);
    }
    await ops.unlink(journalPathFor(rootPath));
}

/**
 * Finishes or undoes an interrupted save, if there is one. Never throws.
 * Returns `{ status: 'none' | 'rolled-back' | 'rolled-forward' | 'failed', files, error? }`
 * where `files` are project-relative target paths. On 'failed' the journal is
 * left in place so recovery is retried next time and no data is discarded.
 */
export async function recoverSaveTransaction(rootPath, options = {}) {
    const ops = { ...defaultOps, ...options.ops };
    const beforeRename = options.beforeRename ?? (() => {});
    const journalPath = journalPathFor(rootPath);

    let journal;
    try {
        if (!(await ops.exists(journalPath))) return { status: 'none', files: [] };
        journal = JSON.parse(await ops.readFile(journalPath, 'utf-8'));
    } catch (err) {
        return { status: 'failed', files: [], error: `Could not read save journal: ${err.message}` };
    }

    const entries = Array.isArray(journal?.entries) ? journal.entries : null;
    if (!entries || (journal.state !== 'staging' && journal.state !== 'committed')) {
        return { status: 'failed', files: [], error: 'Save journal is malformed' };
    }
    const files = entries.map(e => e.target);

    try {
        if (journal.state === 'staging') {
            await rollBack(rootPath, entries, ops);
            return { status: 'rolled-back', files };
        }
        await applyCommitted(rootPath, entries, ops, beforeRename);
        return { status: 'rolled-forward', files };
    } catch (err) {
        return { status: 'failed', files, error: err.message };
    }
}
