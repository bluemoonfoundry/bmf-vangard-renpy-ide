import { describe, it, expect } from 'vitest';

import { classifyFsReadError } from './fsErrorClassification.js';

describe('classifyFsReadError', () => {
  it('classifies ENOENT as missing', () => {
    const err = Object.assign(new Error('no such file'), { code: 'ENOENT' });
    expect(classifyFsReadError(err)).toBe('missing');
  });

  it('classifies EACCES as permission-denied', () => {
    const err = Object.assign(new Error('permission denied'), { code: 'EACCES' });
    expect(classifyFsReadError(err)).toBe('permission-denied');
  });

  it('classifies EPERM as permission-denied', () => {
    const err = Object.assign(new Error('operation not permitted'), { code: 'EPERM' });
    expect(classifyFsReadError(err)).toBe('permission-denied');
  });

  it('classifies a JSON SyntaxError as corrupted', () => {
    let err: unknown;
    try {
      JSON.parse('{ this is not json');
    } catch (e) {
      err = e;
    }
    expect(classifyFsReadError(err)).toBe('corrupted');
  });

  it('classifies an unrecognized error as unknown', () => {
    const err = Object.assign(new Error('mystery failure'), { code: 'EMYSTERY' });
    expect(classifyFsReadError(err)).toBe('unknown');
  });
});
