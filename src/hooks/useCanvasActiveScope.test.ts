import { describe, it, expect, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useCanvasActiveScope } from '@/hooks/useCanvasActiveScope';

describe('useCanvasActiveScope', () => {
  let container: HTMLDivElement;

  afterEach(() => {
    container?.remove();
    (document.activeElement as HTMLElement | null)?.blur?.();
  });

  it('is inactive by default', () => {
    container = document.createElement('div');
    document.body.appendChild(container);
    const { result } = renderHook(() => useCanvasActiveScope({ current: container }));
    expect(result.current()).toBe(false);
  });

  it('becomes active on mouseenter and inactive on mouseleave', () => {
    container = document.createElement('div');
    document.body.appendChild(container);
    const { result } = renderHook(() => useCanvasActiveScope({ current: container }));

    container.dispatchEvent(new MouseEvent('mouseenter'));
    expect(result.current()).toBe(true);

    container.dispatchEvent(new MouseEvent('mouseleave'));
    expect(result.current()).toBe(false);
  });

  it('is active while focus is inside the container, even without hover', () => {
    container = document.createElement('div');
    const input = document.createElement('input');
    container.appendChild(input);
    document.body.appendChild(container);

    const { result } = renderHook(() => useCanvasActiveScope({ current: container }));
    expect(result.current()).toBe(false);

    input.focus();
    expect(result.current()).toBe(true);

    input.blur();
    expect(result.current()).toBe(false);
  });

  it('is inactive when the container ref is null', () => {
    const { result } = renderHook(() => useCanvasActiveScope({ current: null }));
    expect(result.current()).toBe(false);
  });
});
