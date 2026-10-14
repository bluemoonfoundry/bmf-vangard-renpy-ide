import { describe, it, expect, vi, afterEach } from 'vitest';
import { fetchWasmBytes } from '@/lib/tree-sitter/parseBlock';

/** Minimal XMLHttpRequest stand-in that answers every request with `body`. */
function fakeXhr(body: ArrayBuffer | null, status = 0) {
  const opened: string[] = [];
  class FakeXhr {
    responseType = '';
    response: ArrayBuffer | null = null;
    status = 0;
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    open(_method: string, url: string) { opened.push(url); }
    send() {
      this.status = status;
      this.response = body;
      queueMicrotask(() => this.onload?.());
    }
  }
  return { FakeXhr, opened };
}

afterEach(() => vi.unstubAllGlobals());

describe('fetchWasmBytes (C2)', () => {
  it('reads file:// assets with an arraybuffer XHR, never fetch()', async () => {
    const { FakeXhr, opened } = fakeXhr(new Uint8Array([0, 97, 115, 109]).buffer);
    const fetchSpy = vi.fn();
    vi.stubGlobal('XMLHttpRequest', FakeXhr);
    vi.stubGlobal('fetch', fetchSpy);
    const bytes = await fetchWasmBytes('renpy-abc.wasm', 'file:///C:/app/dist/assets/renpyAnalysis.worker-x.js');
    expect([...bytes]).toEqual([0, 97, 115, 109]);
    expect(opened).toEqual(['file:///C:/app/dist/assets/renpy-abc.wasm']);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('rejects an empty file:// response instead of handing emscripten an empty buffer', async () => {
    const { FakeXhr } = fakeXhr(new ArrayBuffer(0));
    vi.stubGlobal('XMLHttpRequest', FakeXhr);
    await expect(fetchWasmBytes('file:///C:/app/dist/assets/missing.wasm')).rejects.toThrow('Failed to load wasm asset');
  });

  it('uses fetch() for http(s) URLs (Vite dev server)', async () => {
    const fetchSpy = vi.fn(async () => new Response(new Uint8Array([1, 2, 3])));
    vi.stubGlobal('fetch', fetchSpy);
    const bytes = await fetchWasmBytes('/assets/renpy.wasm', 'http://localhost:5173/src/workers/w.ts');
    expect([...bytes]).toEqual([1, 2, 3]);
    expect(fetchSpy).toHaveBeenCalledWith('http://localhost:5173/assets/renpy.wasm');
  });
});
