import { describe, it, expect } from 'vitest';
import { formatErrorMessage } from '@/lib/formatErrorMessage';

describe('formatErrorMessage', () => {
  it('returns the message from an Error instance', () => {
    expect(formatErrorMessage(new Error('something broke'))).toBe('something broke');
  });

  it('converts a string to itself', () => {
    expect(formatErrorMessage('raw string error')).toBe('raw string error');
  });

  it('converts a number to its string representation', () => {
    expect(formatErrorMessage(404)).toBe('404');
  });

  it('converts null to "null"', () => {
    expect(formatErrorMessage(null)).toBe('null');
  });

  it('converts undefined to "undefined"', () => {
    expect(formatErrorMessage(undefined)).toBe('undefined');
  });

  it('converts an object to its toString representation', () => {
    expect(formatErrorMessage({ toString: () => 'custom error' })).toBe('custom error');
  });
});
