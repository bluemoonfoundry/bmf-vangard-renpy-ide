import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';

import { atomicWriteFile, cleanupStaleTempFiles } from './atomicFileWrite.js';

describe('atomicWriteFile', () => {
    let tmpBase: string;

    beforeAll(async () => {
        tmpBase = await fs.mkdtemp(path.join(os.tmpdir(), 'vangard-atomic-write-test-'));
    });

    afterAll(async () => {
        await fs.rm(tmpBase, { recursive: true, force: true });
    });

    it('writes content to a new file', async () => {
        const dir = path.join(tmpBase, 'new-file');
        await fs.mkdir(dir, { recursive: true });
        const target = path.join(dir, 'script.rpy');

        await atomicWriteFile(target, 'label start:\n    return\n');

        expect(await fs.readFile(target, 'utf-8')).toBe('label start:\n    return\n');
    });

    it('does not leave a temp file behind after a successful write', async () => {
        const dir = path.join(tmpBase, 'no-leftovers');
        await fs.mkdir(dir, { recursive: true });
        const target = path.join(dir, 'script.rpy');

        await atomicWriteFile(target, 'content');

        const entries = await fs.readdir(dir);
        expect(entries).toEqual(['script.rpy']);
    });

    it('fully replaces existing content rather than appending or merging', async () => {
        const dir = path.join(tmpBase, 'replace');
        await fs.mkdir(dir, { recursive: true });
        const target = path.join(dir, 'script.rpy');
        await fs.writeFile(target, 'old content that is much longer than the new content');

        await atomicWriteFile(target, 'new');

        expect(await fs.readFile(target, 'utf-8')).toBe('new');
    });

    it('leaves the original file untouched when the write step fails', async () => {
        const dir = path.join(tmpBase, 'write-fails');
        await fs.mkdir(dir, { recursive: true });
        const target = path.join(dir, 'script.rpy');
        await fs.writeFile(target, 'original content');

        const failingWrite = async () => { throw new Error('disk full'); };

        await expect(atomicWriteFile(target, 'new content', 'utf-8', { writeFileFn: failingWrite }))
            .rejects.toThrow('disk full');

        expect(await fs.readFile(target, 'utf-8')).toBe('original content');
        const entries = await fs.readdir(dir);
        expect(entries).toEqual(['script.rpy']);
    });

    it('leaves the original file untouched when the rename step fails, and cleans up the temp file', async () => {
        const dir = path.join(tmpBase, 'rename-fails');
        await fs.mkdir(dir, { recursive: true });
        const target = path.join(dir, 'script.rpy');
        await fs.writeFile(target, 'original content');

        const failingRename = async () => { throw new Error('EBUSY: resource busy'); };

        await expect(atomicWriteFile(target, 'new content', 'utf-8', { renameFn: failingRename }))
            .rejects.toThrow('EBUSY');

        expect(await fs.readFile(target, 'utf-8')).toBe('original content');
        const entries = await fs.readdir(dir);
        expect(entries).toEqual(['script.rpy']);
    });
});

describe('cleanupStaleTempFiles', () => {
    let tmpBase: string;

    beforeAll(async () => {
        tmpBase = await fs.mkdtemp(path.join(os.tmpdir(), 'vangard-temp-cleanup-test-'));
    });

    afterAll(async () => {
        await fs.rm(tmpBase, { recursive: true, force: true });
    });

    it('removes stray atomic-write temp files recursively, leaving real files untouched', async () => {
        const root = path.join(tmpBase, 'project');
        await fs.mkdir(path.join(root, 'game', 'sub'), { recursive: true });
        await fs.writeFile(path.join(root, 'game', 'script.rpy'), 'real content');
        await fs.writeFile(path.join(root, 'game', '.script.rpy.tmp-abc123'), 'stale from a crashed save');
        await fs.writeFile(path.join(root, 'game', 'sub', '.nested.rpy.tmp-def456'), 'stale nested');

        const removed = await cleanupStaleTempFiles(root);

        expect(removed).toHaveLength(2);
        expect(await fs.readFile(path.join(root, 'game', 'script.rpy'), 'utf-8')).toBe('real content');
        const gameEntries = await fs.readdir(path.join(root, 'game'));
        expect(gameEntries.sort()).toEqual(['script.rpy', 'sub']);
        const subEntries = await fs.readdir(path.join(root, 'game', 'sub'));
        expect(subEntries).toEqual([]);
    });

    it('skips .git and node_modules directories', async () => {
        const root = path.join(tmpBase, 'excluded');
        await fs.mkdir(path.join(root, '.git'), { recursive: true });
        await fs.mkdir(path.join(root, 'node_modules'), { recursive: true });
        await fs.writeFile(path.join(root, '.git', '.x.tmp-1'), 'x');
        await fs.writeFile(path.join(root, 'node_modules', '.y.tmp-2'), 'y');

        const removed = await cleanupStaleTempFiles(root);

        expect(removed).toEqual([]);
    });

    it('returns an empty array when the directory has no stray temp files', async () => {
        const root = path.join(tmpBase, 'clean');
        await fs.mkdir(root, { recursive: true });
        await fs.writeFile(path.join(root, 'script.rpy'), 'content');

        const removed = await cleanupStaleTempFiles(root);

        expect(removed).toEqual([]);
    });
});
