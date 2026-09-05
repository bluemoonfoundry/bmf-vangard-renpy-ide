import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCanvasKeyboardPan, type CanvasTransform } from '@/hooks/useCanvasKeyboardPan';

function fireKey(type: 'keydown' | 'keyup', key: string, target: EventTarget = window) {
  const event = new KeyboardEvent(type, { key, bubbles: true, cancelable: true });
  Object.defineProperty(event, 'target', { value: target, configurable: true });
  window.dispatchEvent(event);
}

function hover(el: HTMLElement) {
  el.dispatchEvent(new MouseEvent('mouseenter'));
}

describe('useCanvasKeyboardPan', () => {
  let transform: CanvasTransform;
  let setTransform: (updater: CanvasTransform | ((t: CanvasTransform) => CanvasTransform)) => void;
  let containerRef: { current: HTMLElement | null };

  beforeEach(() => {
    vi.useFakeTimers();
    transform = { x: 0, y: 0, scale: 1 };
    setTransform = (updater) => {
      transform = typeof updater === 'function' ? (updater as (t: CanvasTransform) => CanvasTransform)(transform) : updater;
    };
    const div = document.createElement('div');
    Object.defineProperty(div, 'getBoundingClientRect', {
      value: () => ({ width: 800, height: 600, top: 0, left: 0, right: 800, bottom: 600, x: 0, y: 0, toJSON: () => {} }),
    });
    document.body.appendChild(div);
    containerRef = { current: div };
  });

  afterEach(() => {
    containerRef.current?.remove();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('does nothing when no keys are held', () => {
    renderHook(() => useCanvasKeyboardPan({ containerRef, onTransformChange: setTransform as never }));
    act(() => { vi.advanceTimersByTime(200); });
    expect(transform).toEqual({ x: 0, y: 0, scale: 1 });
  });

  it('does nothing while held keys are down but the canvas is not hovered/focused', () => {
    renderHook(() => useCanvasKeyboardPan({ containerRef, onTransformChange: setTransform as never }));
    act(() => {
      fireKey('keydown', 'd');
      vi.advanceTimersByTime(200);
    });
    expect(transform).toEqual({ x: 0, y: 0, scale: 1 });
  });

  it('pans right (x decreases) while D is held and the canvas is hovered, and stops on keyup', () => {
    renderHook(() => useCanvasKeyboardPan({ containerRef, onTransformChange: setTransform as never }));
    hover(containerRef.current!);

    act(() => {
      fireKey('keydown', 'd');
      vi.advanceTimersByTime(200);
    });
    expect(transform.x).toBeLessThan(0);
    expect(transform.y).toBe(0);
    expect(transform.scale).toBe(1);

    const xAfterHold = transform.x;
    act(() => {
      fireKey('keyup', 'd');
      vi.advanceTimersByTime(200);
    });
    expect(transform.x).toBe(xAfterHold);
  });

  it('pans opposite directions for A/D and W/S', () => {
    renderHook(() => useCanvasKeyboardPan({ containerRef, onTransformChange: setTransform as never }));
    hover(containerRef.current!);

    act(() => {
      fireKey('keydown', 'a');
      vi.advanceTimersByTime(100);
    });
    expect(transform.x).toBeGreaterThan(0);

    act(() => {
      fireKey('keyup', 'a');
      fireKey('keydown', 'w');
      vi.advanceTimersByTime(100);
    });
    expect(transform.y).toBeGreaterThan(0);
  });

  it('zooms in on Q and out on E, clamped to min/max scale', () => {
    renderHook(() => useCanvasKeyboardPan({ containerRef, onTransformChange: setTransform as never, minScale: 0.5, maxScale: 2 }));
    hover(containerRef.current!);

    act(() => {
      fireKey('keydown', 'q');
      vi.advanceTimersByTime(5000);
    });
    expect(transform.scale).toBeCloseTo(2, 5);

    act(() => {
      fireKey('keyup', 'q');
      fireKey('keydown', 'e');
      vi.advanceTimersByTime(5000);
    });
    expect(transform.scale).toBeCloseTo(0.5, 5);
  });

  it('stops panning the instant the pointer leaves mid-hold', () => {
    renderHook(() => useCanvasKeyboardPan({ containerRef, onTransformChange: setTransform as never }));
    hover(containerRef.current!);

    act(() => {
      fireKey('keydown', 'd');
      vi.advanceTimersByTime(100);
    });
    const xAfterHover = transform.x;
    expect(xAfterHover).toBeLessThan(0);

    act(() => {
      containerRef.current!.dispatchEvent(new MouseEvent('mouseleave'));
      vi.advanceTimersByTime(100);
    });
    expect(transform.x).toBe(xAfterHover);
  });

  it('responds to focus-within even without hover', () => {
    const input = document.createElement('input');
    containerRef.current!.appendChild(input);
    input.focus();

    renderHook(() => useCanvasKeyboardPan({ containerRef, onTransformChange: setTransform as never }));

    act(() => {
      fireKey('keydown', 'd', document.body);
      vi.advanceTimersByTime(100);
    });
    expect(transform.x).toBeLessThan(0);
  });

  it('ignores key events while typing in an input', () => {
    renderHook(() => useCanvasKeyboardPan({ containerRef, onTransformChange: setTransform as never }));
    hover(containerRef.current!);
    const input = document.createElement('input');
    document.body.appendChild(input);

    act(() => {
      fireKey('keydown', 'd', input);
      vi.advanceTimersByTime(200);
    });
    expect(transform).toEqual({ x: 0, y: 0, scale: 1 });
    document.body.removeChild(input);
  });

  it('ignores key events targeting a non-contentEditable div inside a Monaco editor', () => {
    // Regression: Monaco's hidden text-input surface is backed by Chromium's native
    // EditContext API on some builds, which shows up as a plain <div> (not a TEXTAREA
    // and not isContentEditable) rather than the classic hidden <textarea>. Without
    // ancestry-based detection, this hook can't tell it's a typing target and
    // preventDefault()s every WASD/QE keystroke typed into the editor.
    renderHook(() => useCanvasKeyboardPan({ containerRef, onTransformChange: setTransform as never }));
    hover(containerRef.current!);
    const monacoRoot = document.createElement('div');
    monacoRoot.className = 'monaco-editor';
    const editContextDiv = document.createElement('div');
    editContextDiv.className = 'native-edit-context';
    monacoRoot.appendChild(editContextDiv);
    document.body.appendChild(monacoRoot);

    act(() => {
      fireKey('keydown', 'w', editContextDiv);
      vi.advanceTimersByTime(200);
    });
    expect(transform).toEqual({ x: 0, y: 0, scale: 1 });
    document.body.removeChild(monacoRoot);
  });

  it('does nothing when disabled', () => {
    renderHook(() => useCanvasKeyboardPan({ containerRef, onTransformChange: setTransform as never, enabled: false }));
    hover(containerRef.current!);
    act(() => {
      fireKey('keydown', 'd');
      vi.advanceTimersByTime(200);
    });
    expect(transform).toEqual({ x: 0, y: 0, scale: 1 });
  });
});
