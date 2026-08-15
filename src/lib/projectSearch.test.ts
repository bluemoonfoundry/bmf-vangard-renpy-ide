import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';

import { searchInDirectory } from './projectSearch.js';

describe('searchInDirectory', () => {
    let tmpBase: string;

    beforeAll(async () => {
        tmpBase = await fs.mkdtemp(path.join(os.tmpdir(), 'vangard-project-search-test-'));
    });

    afterAll(async () => {
        await fs.rm(tmpBase, { recursive: true, force: true });
    });

    it('finds matches across .rpy files and reports line/column info', async () => {
        const dir = path.join(tmpBase, 'basic');
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(path.join(dir, 'script.rpy'), 'label start:\n    "Hello world"\n');
        await fs.writeFile(path.join(dir, 'notes.txt'), 'world world world');

        const outcome = await searchInDirectory(dir, 'world', { projectPath: dir });

        expect(outcome.results).toHaveLength(1);
        expect(outcome.results[0].filePath).toBe('script.rpy');
        expect(outcome.results[0].matches[0]).toMatchObject({ lineNumber: 2 });
        expect(outcome.truncated).toBe(false);
        expect(outcome.cancelled).toBe(false);
    });

    it('excludes .git and node_modules directories', async () => {
        const dir = path.join(tmpBase, 'excluded');
        await fs.mkdir(path.join(dir, '.git'), { recursive: true });
        await fs.mkdir(path.join(dir, 'node_modules'), { recursive: true });
        await fs.writeFile(path.join(dir, '.git', 'ignored.rpy'), 'target');
        await fs.writeFile(path.join(dir, 'node_modules', 'ignored.rpy'), 'target');
        await fs.writeFile(path.join(dir, 'real.rpy'), 'target');

        const outcome = await searchInDirectory(dir, 'target', { projectPath: dir });

        expect(outcome.results.map(r => r.filePath)).toEqual(['real.rpy']);
    });

    it('stops promptly and reports cancelled when isCancelled becomes true', async () => {
        const dir = path.join(tmpBase, 'cancel');
        await fs.mkdir(dir, { recursive: true });
        for (let i = 0; i < 20; i++) {
            await fs.writeFile(path.join(dir, `f${i}.rpy`), 'needle\n');
        }

        let calls = 0;
        const outcome = await searchInDirectory(dir, 'needle', {
            projectPath: dir,
            isCancelled: () => {
                calls++;
                return calls > 3;
            },
        });

        expect(outcome.cancelled).toBe(true);
        expect(outcome.results.length).toBeLessThan(20);
    });

    it('enforces maxFiles and marks the outcome truncated', async () => {
        const dir = path.join(tmpBase, 'truncate');
        await fs.mkdir(dir, { recursive: true });
        for (let i = 0; i < 10; i++) {
            await fs.writeFile(path.join(dir, `f${i}.rpy`), 'needle\n');
        }

        const outcome = await searchInDirectory(dir, 'needle', { projectPath: dir, maxFiles: 4 });

        expect(outcome.truncated).toBe(true);
        expect(outcome.results.length).toBeLessThanOrEqual(4);
    });

    it('skips an unreadable file instead of aborting the whole search', async () => {
        const dir = path.join(tmpBase, 'malformed');
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(path.join(dir, 'good.rpy'), 'needle\n');
        await fs.writeFile(path.join(dir, 'bad.rpy'), 'needle\n');

        const failingRead = async (p: string, encoding: string) => {
            if (p.endsWith('bad.rpy')) throw new Error('EACCES: permission denied');
            return fs.readFile(p, encoding as BufferEncoding);
        };

        const outcome = await searchInDirectory(dir, 'needle', { projectPath: dir, readFileFn: failingRead });

        expect(outcome.results.map(r => r.filePath)).toEqual(['good.rpy']);
        expect(outcome.skipped).toHaveLength(1);
        expect(outcome.skipped[0].path).toBe('bad.rpy');
    });

    it('skips files larger than maxFileSize', async () => {
        const dir = path.join(tmpBase, 'toolarge');
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(path.join(dir, 'big.rpy'), 'needle\n');

        const outcome = await searchInDirectory(dir, 'needle', { projectPath: dir, maxFileSize: 1 });

        expect(outcome.results).toHaveLength(0);
        expect(outcome.skipped).toHaveLength(1);
    });

    it('returns a regexError instead of throwing for an invalid regex pattern', async () => {
        const dir = path.join(tmpBase, 'badregex');
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(path.join(dir, 'script.rpy'), 'needle\n');

        const outcome = await searchInDirectory(dir, '(unterminated', { projectPath: dir, isRegex: true });

        expect(outcome.regexError).toBeTruthy();
        expect(outcome.results).toHaveLength(0);
    });
});
