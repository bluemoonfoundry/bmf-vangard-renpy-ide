import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';

import { scanDirectoryForAssets } from './assetScanner.js';

describe('scanDirectoryForAssets', () => {
    let tmpBase: string;

    beforeAll(async () => {
        tmpBase = await fs.mkdtemp(path.join(os.tmpdir(), 'vangard-asset-scan-test-'));
    });

    afterAll(async () => {
        await fs.rm(tmpBase, { recursive: true, force: true });
    });

    it('finds images and audio files recursively', async () => {
        const dir = path.join(tmpBase, 'basic');
        await fs.mkdir(path.join(dir, 'sub'), { recursive: true });
        await fs.writeFile(path.join(dir, 'bg.png'), 'x');
        await fs.writeFile(path.join(dir, 'sub', 'sfx.ogg'), 'x');
        await fs.writeFile(path.join(dir, 'notes.txt'), 'x');

        const result = await scanDirectoryForAssets(dir);

        expect(result.images.map(i => i.fileName)).toEqual(['bg.png']);
        expect(result.audios.map(a => a.fileName)).toEqual(['sfx.ogg']);
        expect(result.truncated).toBe(false);
        expect(result.cancelled).toBe(false);
    });

    it('stops promptly and reports cancelled when isCancelled becomes true', async () => {
        const dir = path.join(tmpBase, 'cancel');
        await fs.mkdir(dir, { recursive: true });
        for (let i = 0; i < 20; i++) {
            await fs.writeFile(path.join(dir, `img-${i}.png`), 'x');
        }

        let calls = 0;
        const result = await scanDirectoryForAssets(dir, {
            isCancelled: () => {
                calls++;
                return calls > 3;
            },
        });

        expect(result.cancelled).toBe(true);
        expect(result.images.length).toBeLessThan(20);
    });

    it('enforces maxEntries and marks the result truncated', async () => {
        const dir = path.join(tmpBase, 'truncate');
        await fs.mkdir(dir, { recursive: true });
        for (let i = 0; i < 10; i++) {
            await fs.writeFile(path.join(dir, `img-${i}.png`), 'x');
        }

        const result = await scanDirectoryForAssets(dir, { maxEntries: 4 });

        expect(result.truncated).toBe(true);
        expect(result.images.length).toBeLessThanOrEqual(4);
    });

    it('skips a file that fails to stat instead of aborting the whole scan', async () => {
        const dir = path.join(tmpBase, 'malformed');
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(path.join(dir, 'good.png'), 'x');
        await fs.writeFile(path.join(dir, 'bad.png'), 'x');

        const failingStat = async (p: string) => {
            if (p.endsWith('bad.png')) throw new Error('EACCES: permission denied');
            return fs.stat(p);
        };

        const result = await scanDirectoryForAssets(dir, { statFn: failingStat });

        expect(result.images.map(i => i.fileName)).toEqual(['good.png']);
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].path).toMatch(/bad\.png$/);
    });
});
