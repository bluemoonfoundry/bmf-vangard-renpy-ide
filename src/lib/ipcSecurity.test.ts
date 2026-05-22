import { describe, it, expect } from 'vitest';
import path from 'path';

// @ts-expect-error - plain JS utility module
import { validateProjectPath, validateExternalUrl } from './ipcSecurity.js';

const ROOT = path.resolve('/test-project');

describe('validateProjectPath', () => {
    it('allows a file directly in the root', () => {
        expect(validateProjectPath(path.join(ROOT, 'script.rpy'), ROOT)).toBeNull();
    });

    it('allows a file in a nested subdirectory', () => {
        expect(validateProjectPath(path.join(ROOT, 'game', 'sub', 'script.rpy'), ROOT)).toBeNull();
    });

    it('allows the root directory itself', () => {
        expect(validateProjectPath(ROOT, ROOT)).toBeNull();
    });

    it('blocks traversal via .. to parent', () => {
        const traversal = path.join(ROOT, '..', 'evil.rpy');
        expect(validateProjectPath(traversal, ROOT)).toBeTruthy();
    });

    it('blocks traversal via .. to sibling directory', () => {
        const traversal = path.join(ROOT, '..', 'other-project', 'script.rpy');
        expect(validateProjectPath(traversal, ROOT)).toBeTruthy();
    });

    it('blocks a path completely outside the root', () => {
        expect(validateProjectPath(path.resolve('/etc/passwd'), ROOT)).toBeTruthy();
    });

    it('blocks a sibling directory that shares the root prefix (no sep confusion)', () => {
        const sibling = path.join(path.dirname(ROOT), path.basename(ROOT) + '-evil', 'script.rpy');
        expect(validateProjectPath(sibling, ROOT)).toBeTruthy();
    });

    it('blocks null bytes in path', () => {
        expect(validateProjectPath(ROOT + '/script\0.rpy', ROOT)).toBeTruthy();
    });

    it('returns error when projectRoot is null', () => {
        expect(validateProjectPath(path.join(ROOT, 'script.rpy'), null)).toBeTruthy();
    });

    it('returns error when projectRoot is empty string', () => {
        expect(validateProjectPath(path.join(ROOT, 'script.rpy'), '')).toBeTruthy();
    });

    it('returns error for non-string filePath', () => {
        // @ts-expect-error - testing runtime guard
        expect(validateProjectPath(null, ROOT)).toBeTruthy();
        // @ts-expect-error - testing runtime guard
        expect(validateProjectPath(123, ROOT)).toBeTruthy();
    });
});

describe('validateExternalUrl', () => {
    it('allows https URLs', () => {
        expect(validateExternalUrl('https://example.com')).toBeNull();
        expect(validateExternalUrl('https://github.com/user/repo/wiki')).toBeNull();
    });

    it('allows http URLs (e.g. localhost)', () => {
        expect(validateExternalUrl('http://localhost:3000')).toBeNull();
        expect(validateExternalUrl('http://127.0.0.1:8080/docs')).toBeNull();
    });

    it('blocks file: protocol', () => {
        expect(validateExternalUrl('file:///etc/passwd')).toBeTruthy();
        expect(validateExternalUrl('file:///C:/Windows/System32/cmd.exe')).toBeTruthy();
    });

    it('blocks javascript: protocol', () => {
        expect(validateExternalUrl('javascript:alert(1)')).toBeTruthy();
    });

    it('blocks ftp: protocol', () => {
        expect(validateExternalUrl('ftp://example.com/file')).toBeTruthy();
    });

    it('blocks data: protocol', () => {
        expect(validateExternalUrl('data:text/html,<script>alert(1)</script>')).toBeTruthy();
    });

    it('blocks malformed URLs', () => {
        expect(validateExternalUrl('not a url')).toBeTruthy();
        expect(validateExternalUrl('')).toBeTruthy();
    });

    it('blocks non-string input', () => {
        // @ts-expect-error - testing runtime guard
        expect(validateExternalUrl(null)).toBeTruthy();
        // @ts-expect-error - testing runtime guard
        expect(validateExternalUrl(undefined)).toBeTruthy();
    });
});
