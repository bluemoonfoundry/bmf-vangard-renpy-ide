import fsPromises from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

// Marks a file as an in-progress atomic write: written to the *same directory*
// as the destination (so the final rename is same-filesystem and therefore
// atomic), with a leading dot and a suffix that can't collide with any real
// project extension (.rpy, .png, .json, ...).
const TEMP_SUFFIX_PATTERN = /^\.(.+)\.tmp-[0-9a-f-]+$/;

function tempPathFor(filePath) {
    const id = crypto.randomUUID();
    return path.join(path.dirname(filePath), `.${path.basename(filePath)}.tmp-${id}`);
}

/**
 * Writes `content` to `filePath` without ever leaving the destination in a
 * truncated/partial state if the process is interrupted mid-write.
 *
 * Writes to a temp file in the same directory, then renames it over the
 * destination. fs.rename is a single atomic directory-entry update on both
 * POSIX and NTFS, so a crash can only ever leave either the old destination
 * content (temp file never renamed) or the new content (rename completed) --
 * never a half-written destination. A crash before rename leaves a harmless
 * stray temp file, cleaned up by `cleanupStaleTempFiles` on next project load.
 */
export async function atomicWriteFile(filePath, content, encoding = 'utf-8', options = {}) {
    const {
        writeFileFn = (p, c, enc) => fsPromises.writeFile(p, c, enc),
        renameFn = (from, to) => fsPromises.rename(from, to),
        unlinkFn = (p) => fsPromises.unlink(p),
    } = options;

    const tempPath = tempPathFor(filePath);
    try {
        await writeFileFn(tempPath, content, encoding);
        await renameFn(tempPath, filePath);
    } catch (err) {
        try {
            await unlinkFn(tempPath);
        } catch {
            // Temp file may never have been created (write itself failed) -- fine.
        }
        throw err;
    }
}

async function collectStaleTempFiles(dirPath, readdirFn) {
    const found = [];
    let entries;
    try {
        entries = await readdirFn(dirPath);
    } catch {
        return found;
    }
    for (const entry of entries) {
        if (entry.isDirectory()) {
            if (entry.name === '.git' || entry.name === 'node_modules') continue;
            found.push(...await collectStaleTempFiles(path.join(dirPath, entry.name), readdirFn));
        } else if (entry.isFile() && TEMP_SUFFIX_PATTERN.test(entry.name)) {
            found.push(path.join(dirPath, entry.name));
        }
    }
    return found;
}

/**
 * Best-effort recursive cleanup of leftover atomic-write temp files from a
 * previous crashed/killed session. The destination files they were meant to
 * replace are unaffected (see atomicWriteFile) -- this just tidies up.
 */
export async function cleanupStaleTempFiles(rootPath, options = {}) {
    const {
        readdirFn = (p) => fsPromises.readdir(p, { withFileTypes: true }),
        unlinkFn = (p) => fsPromises.unlink(p),
    } = options;

    const stale = await collectStaleTempFiles(rootPath, readdirFn);
    const removed = [];
    for (const filePath of stale) {
        try {
            await unlinkFn(filePath);
            removed.push(filePath);
        } catch {
            // Best effort -- leave it for next time if it can't be removed.
        }
    }
    return removed;
}
