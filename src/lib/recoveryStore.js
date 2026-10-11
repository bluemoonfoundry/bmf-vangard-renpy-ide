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
