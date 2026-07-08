import React from 'react';
import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AudioManager from '@/components/AudioManager';
import type { RenpyAudio, AudioMetadata } from '@/types';

// ── Factories ─────────────────────────────────────────────────────────────────

function makeAudio(overrides: Partial<RenpyAudio> = {}): RenpyAudio {
  return {
    filePath: 'game/audio/bgm.ogg',
    fileName: 'bgm.ogg',
    dataUrl: 'blob:fake',
    fileHandle: null,
    isInProject: true,
    ...overrides,
  };
}

// ── Mock Audio API ────────────────────────────────────────────────────────────

let mockAudioInstance: {
  play: ReturnType<typeof vi.fn>;
  pause: ReturnType<typeof vi.fn>;
  src: string;
  currentTime: number;
  onended: (() => void) | null;
  onerror: ((e: unknown) => void) | null;
};

beforeAll(() => {
  mockAudioInstance = {
    play: vi.fn().mockResolvedValue(undefined),
    pause: vi.fn(),
    src: '',
    currentTime: 0,
    onended: null,
    onerror: null,
  };
  // stubGlobal replaces the Audio constructor so `new Audio()` returns our mock.
  // Must use a regular function (not arrow) because arrow functions cannot be constructors.
  vi.stubGlobal('Audio', vi.fn().mockImplementation(function () { return mockAudioInstance; }));
});

afterAll(() => {
  vi.unstubAllGlobals();
});

// ── Base props ────────────────────────────────────────────────────────────────

const baseProps = {
  audios: [] as RenpyAudio[],
  metadata: new Map<string, AudioMetadata>(),
  scanDirectories: [] as string[],
  onAddScanDirectory: vi.fn(),
  onRemoveScanDirectory: vi.fn(),
  onCopyAudiosToProject: vi.fn(),
  onOpenAudioEditor: vi.fn(),
  isFileSystemApiSupported: true,
  lastScanned: null as number | null,
  isRefreshing: false,
  onRefresh: vi.fn(),
};

describe('AudioManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAudioInstance.play.mockResolvedValue(undefined);
    mockAudioInstance.onended = null;
  });

  // ── Basic rendering ─────────────────────────────────────────────────────────

  it('renders without crashing', () => {
    const { container } = render(<AudioManager {...baseProps} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('shows empty-state message when no audios exist', () => {
    render(<AudioManager {...baseProps} audios={[]} />);
    expect(screen.getByText(/bring your story to life/i)).toBeTruthy();
  });

  it('shows no-match message when audios exist but all are filtered out', () => {
    const audios = [makeAudio()];
    render(<AudioManager {...baseProps} audios={audios} />);
    fireEvent.change(screen.getByPlaceholderText(/search audio/i), { target: { value: 'xyznonexistent' } });
    expect(screen.getByText(/No audio files match your filter/i)).toBeTruthy();
  });

  it('shows "Last scanned:" time when lastScanned is set', () => {
    render(<AudioManager {...baseProps} lastScanned={Date.now()} />);
    expect(screen.getByText(/Last scanned:/i)).toBeTruthy();
  });

  it('shows "Not scanned" when lastScanned is null', () => {
    render(<AudioManager {...baseProps} lastScanned={null} />);
    expect(screen.getByText(/Not scanned/i)).toBeTruthy();
  });

  // ── Audio item display ──────────────────────────────────────────────────────

  it('renders an AudioItem for a provided audio file', () => {
    const audio = makeAudio();
    render(<AudioManager {...baseProps} audios={[audio]} />);
    expect(screen.getByTitle(audio.filePath)).toBeTruthy();
  });

  it('renders multiple AudioItems within the virtual list buffer', () => {
    const a1 = makeAudio({ filePath: 'game/audio/bgm.ogg', fileName: 'bgm.ogg' });
    const a2 = makeAudio({ filePath: 'game/audio/sfx.ogg', fileName: 'sfx.ogg' });
    render(<AudioManager {...baseProps} audios={[a1, a2]} />);
    expect(screen.getByTitle(a1.filePath)).toBeTruthy();
    expect(screen.getByTitle(a2.filePath)).toBeTruthy();
  });

  it('shows filename text inside the audio item', () => {
    const audio = makeAudio({ fileName: 'theme.ogg' });
    render(<AudioManager {...baseProps} audios={[audio]} />);
    expect(screen.getByText('theme.ogg')).toBeTruthy();
  });

  // ── Search filter ───────────────────────────────────────────────────────────

  it('filters visible items by search term', () => {
    const matching = makeAudio({ filePath: 'game/audio/bgm.ogg', fileName: 'bgm.ogg' });
    const nonMatching = makeAudio({ filePath: 'game/audio/sfx_hit.ogg', fileName: 'sfx_hit.ogg' });
    render(<AudioManager {...baseProps} audios={[matching, nonMatching]} />);
    fireEvent.change(screen.getByPlaceholderText(/search audio/i), { target: { value: 'bgm' } });
    expect(screen.getByTitle(matching.filePath)).toBeTruthy();
    expect(screen.queryByTitle(nonMatching.filePath)).toBeNull();
  });

  it('search matches on metadata tag', () => {
    const audio = makeAudio({ projectFilePath: 'game/audio/bgm.ogg' });
    const meta = new Map<string, AudioMetadata>([
      ['game/audio/bgm.ogg', { renpyName: 'main_theme', tags: ['ambient', 'loop'] }],
    ]);
    render(<AudioManager {...baseProps} audios={[audio]} metadata={meta} />);
    fireEvent.change(screen.getByPlaceholderText(/search audio/i), { target: { value: 'ambient' } });
    expect(screen.getByTitle(audio.filePath)).toBeTruthy();
  });

  it('search matches on renpyName from metadata', () => {
    const audio = makeAudio({ projectFilePath: 'game/audio/bgm.ogg' });
    const meta = new Map<string, AudioMetadata>([
      ['game/audio/bgm.ogg', { renpyName: 'main_theme', tags: [] }],
    ]);
    render(<AudioManager {...baseProps} audios={[audio]} metadata={meta} />);
    fireEvent.change(screen.getByPlaceholderText(/search audio/i), { target: { value: 'main_theme' } });
    expect(screen.getByTitle(audio.filePath)).toBeTruthy();
  });

  // ── Source filter ───────────────────────────────────────────────────────────

  it('renders source select with Project and scan directory options', () => {
    render(<AudioManager {...baseProps} scanDirectories={['C:/sfx']} />);
    expect(screen.getByText('Project Audio')).toBeTruthy();
    expect(screen.getByText('C:/sfx')).toBeTruthy();
  });

  it('filters to project-only audios when source is Project', () => {
    const projectAudio = makeAudio({ filePath: 'game/audio/bgm.ogg', isInProject: true });
    const externalAudio = makeAudio({ filePath: 'C:/sfx/hit.ogg', fileName: 'hit.ogg', isInProject: false });
    render(<AudioManager {...baseProps} audios={[projectAudio, externalAudio]} />);
    // Default source is Project
    expect(screen.getByTitle(projectAudio.filePath)).toBeTruthy();
    expect(screen.queryByTitle(externalAudio.filePath)).toBeNull();
  });

  it('shows all non-duplicate audios when source is "all"', () => {
    const projectAudio = makeAudio({ filePath: 'game/audio/bgm.ogg', isInProject: true });
    const externalAudio = makeAudio({ filePath: 'C:/sfx/hit.ogg', fileName: 'hit.ogg', isInProject: false });
    render(<AudioManager {...baseProps} audios={[projectAudio, externalAudio]} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'all' } });
    expect(screen.getByTitle(projectAudio.filePath)).toBeTruthy();
    expect(screen.getByTitle(externalAudio.filePath)).toBeTruthy();
  });

  // ── Scan directories ────────────────────────────────────────────────────────

  it('shows remove button when a scan directory source is selected', () => {
    render(<AudioManager {...baseProps} scanDirectories={['C:/sfx']} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'C:/sfx' } });
    expect(screen.getByTitle('Remove C:/sfx from scan list')).toBeTruthy();
  });

  it('calls onRemoveScanDirectory when remove button is clicked', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<AudioManager {...baseProps} scanDirectories={['C:/sfx']} onRemoveScanDirectory={onRemove} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'C:/sfx' } });
    await user.click(screen.getByTitle('Remove C:/sfx from scan list'));
    expect(onRemove).toHaveBeenCalledWith('C:/sfx');
  });

  it('does not show remove button for "Project" source', () => {
    render(<AudioManager {...baseProps} />);
    expect(screen.queryByTitle(/Remove.*from scan list/)).toBeNull();
  });

  // ── Refresh button ──────────────────────────────────────────────────────────

  it('calls onRefresh when Refresh button is clicked', async () => {
    const user = userEvent.setup();
    const onRefresh = vi.fn();
    render(<AudioManager {...baseProps} onRefresh={onRefresh} />);
    await user.click(screen.getByRole('button', { name: /refresh/i }));
    expect(onRefresh).toHaveBeenCalled();
  });

  it('disables Refresh button when isFileSystemApiSupported is false', () => {
    render(<AudioManager {...baseProps} isFileSystemApiSupported={false} />);
    expect((screen.getByRole('button', { name: /refresh/i }) as HTMLButtonElement).disabled).toBe(true);
  });

  it('disables Refresh button when isRefreshing is true', () => {
    render(<AudioManager {...baseProps} isRefreshing={true} />);
    expect((screen.getByRole('button', { name: /refresh/i }) as HTMLButtonElement).disabled).toBe(true);
  });

  // ── Add scan directory ──────────────────────────────────────────────────────

  it('calls onAddScanDirectory when Add Directory button is clicked', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<AudioManager {...baseProps} onAddScanDirectory={onAdd} />);
    await user.click(screen.getByRole('button', { name: /add directory/i }));
    expect(onAdd).toHaveBeenCalled();
  });

  it('disables Add Directory button when isFileSystemApiSupported is false', () => {
    render(<AudioManager {...baseProps} isFileSystemApiSupported={false} />);
    expect((screen.getByRole('button', { name: /add directory/i }) as HTMLButtonElement).disabled).toBe(true);
  });

  // ── Selection and Copy ──────────────────────────────────────────────────────

  it('Copy to Project button is disabled when no audios are selected', () => {
    const audio = makeAudio();
    render(<AudioManager {...baseProps} audios={[audio]} />);
    expect((screen.getByRole('button', { name: /copy to project \(0\)/i }) as HTMLButtonElement).disabled).toBe(true);
  });

  it('clicking an audio item selects it and enables Copy to Project button', async () => {
    const user = userEvent.setup();
    const audio = makeAudio();
    render(<AudioManager {...baseProps} audios={[audio]} />);
    await user.click(screen.getByTitle(audio.filePath));
    expect((screen.getByRole('button', { name: /copy to project \(1\)/i }) as HTMLButtonElement).disabled).toBe(false);
  });

  it('calls onCopyAudiosToProject with selected paths when Copy clicked', async () => {
    const user = userEvent.setup();
    const onCopy = vi.fn();
    const audio = makeAudio();
    render(<AudioManager {...baseProps} audios={[audio]} onCopyAudiosToProject={onCopy} />);
    await user.click(screen.getByTitle(audio.filePath));
    await user.click(screen.getByRole('button', { name: /copy to project \(1\)/i }));
    expect(onCopy).toHaveBeenCalledWith([audio.filePath]);
  });

  it('deselects an audio item on second click', async () => {
    const user = userEvent.setup();
    const audio = makeAudio();
    render(<AudioManager {...baseProps} audios={[audio]} />);
    const item = screen.getByTitle(audio.filePath);
    await user.click(item); // select
    await user.click(item); // deselect
    expect(screen.getByRole('button', { name: /copy to project \(0\)/i })).toBeTruthy();
  });

  it('clears selection after Copy to Project is clicked', async () => {
    const user = userEvent.setup();
    const audio = makeAudio();
    render(<AudioManager {...baseProps} audios={[audio]} />);
    await user.click(screen.getByTitle(audio.filePath));
    await user.click(screen.getByRole('button', { name: /copy to project \(1\)/i }));
    expect(screen.getByRole('button', { name: /copy to project \(0\)/i })).toBeTruthy();
  });

  it('double-clicking an audio item calls onOpenAudioEditor', async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    const audio = makeAudio();
    render(<AudioManager {...baseProps} audios={[audio]} onOpenAudioEditor={onOpen} />);
    await user.dblClick(screen.getByTitle(audio.filePath));
    expect(onOpen).toHaveBeenCalledWith(audio.filePath);
  });

  // ── Context menu ────────────────────────────────────────────────────────────

  it('opens context menu on right-click of an audio item', () => {
    const audio = makeAudio();
    render(<AudioManager {...baseProps} audios={[audio]} />);
    fireEvent.contextMenu(screen.getByTitle(audio.filePath));
    expect(screen.getByText(/Insert Audio:/i)).toBeTruthy();
  });

  it('context menu strips game/audio/ prefix from path', () => {
    const audio = makeAudio({ filePath: 'game/audio/bgm.ogg', fileName: 'bgm.ogg' });
    render(<AudioManager {...baseProps} audios={[audio]} />);
    fireEvent.contextMenu(screen.getByTitle(audio.filePath));
    // 'bgm.ogg' appears in the AudioItem (fileName) AND in the context menu (smart path).
    // Two matches confirms the context menu is showing the correctly stripped path.
    expect(screen.getAllByText('bgm.ogg').length).toBe(2);
  });

  it('context menu keeps full path when not under game/audio/', () => {
    const audio = makeAudio({ filePath: 'C:/sfx/hit.ogg', fileName: 'hit.ogg', isInProject: false });
    render(<AudioManager {...baseProps} audios={[audio]} scanDirectories={['C:/sfx']} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'C:/sfx' } });
    fireEvent.contextMenu(screen.getByTitle(audio.filePath));
    expect(screen.getByText('C:/sfx/hit.ogg')).toBeTruthy();
  });

  it('closes context menu when "play audio" option is selected', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      writable: true,
      configurable: true,
    });
    const user = userEvent.setup();
    const audio = makeAudio();
    render(<AudioManager {...baseProps} audios={[audio]} />);
    fireEvent.contextMenu(screen.getByTitle(audio.filePath));
    await user.click(screen.getByRole('button', { name: /play audio/i }));
    expect(screen.queryByText(/Insert Audio:/i)).toBeNull();
  });

  it('closes context menu when "queue audio" option is selected', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      writable: true,
      configurable: true,
    });
    const user = userEvent.setup();
    const audio = makeAudio();
    render(<AudioManager {...baseProps} audios={[audio]} />);
    fireEvent.contextMenu(screen.getByTitle(audio.filePath));
    await user.click(screen.getByRole('button', { name: /queue audio/i }));
    expect(screen.queryByText(/Insert Audio:/i)).toBeNull();
  });

  // ── Play / Stop toggle ──────────────────────────────────────────────────────

  it('play button starts with "Play Preview" title', () => {
    const audio = makeAudio();
    render(<AudioManager {...baseProps} audios={[audio]} />);
    expect(screen.getByTitle('Play Preview')).toBeTruthy();
  });

  it('clicking play button changes title to "Stop"', async () => {
    const user = userEvent.setup();
    const audio = makeAudio();
    render(<AudioManager {...baseProps} audios={[audio]} />);
    await user.click(screen.getByTitle('Play Preview'));
    expect(mockAudioInstance.play).toHaveBeenCalled();
    expect(screen.getByTitle('Stop')).toBeTruthy();
  });

  it('clicking Stop button pauses audio and reverts title to "Play Preview"', async () => {
    const user = userEvent.setup();
    const audio = makeAudio();
    render(<AudioManager {...baseProps} audios={[audio]} />);
    await user.click(screen.getByTitle('Play Preview')); // start
    await user.click(screen.getByTitle('Stop'));          // stop
    expect(mockAudioInstance.pause).toHaveBeenCalled();
    expect(screen.getByTitle('Play Preview')).toBeTruthy();
  });

  it('play button does not propagate click to selection handler', async () => {
    const user = userEvent.setup();
    const audio = makeAudio();
    render(<AudioManager {...baseProps} audios={[audio]} />);
    await user.click(screen.getByTitle('Play Preview'));
    // Item should NOT be selected — play click is stopPropagation'd
    expect(screen.getByRole('button', { name: /copy to project \(0\)/i })).toBeTruthy();
  });

  // ── Drag start ──────────────────────────────────────────────────────────────

  it('sets play audio drag data on dragstart', () => {
    const audio = makeAudio({ filePath: 'game/audio/bgm.ogg', fileName: 'bgm.ogg' });
    render(<AudioManager {...baseProps} audios={[audio]} />);
    const dataTransfer: Record<string, string> = {};
    fireEvent.dragStart(screen.getByTitle(audio.filePath), {
      dataTransfer: {
        setData: (key: string, val: string) => { dataTransfer[key] = val; },
        effectAllowed: '',
      },
    });
    // Smart path strips game/audio/ → bgm.ogg
    expect(dataTransfer['text/plain']).toBe('play audio "bgm.ogg"');
    const dnd = JSON.parse(dataTransfer['application/renpy-dnd']);
    expect(dnd.text).toBe('play audio "bgm.ogg"');
  });

  it('drag data uses full path when audio is not under game/audio/', () => {
    const audio = makeAudio({ filePath: 'C:/sfx/hit.ogg', fileName: 'hit.ogg', isInProject: false });
    render(<AudioManager {...baseProps} audios={[audio]} scanDirectories={['C:/sfx']} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'C:/sfx' } });
    const dataTransfer: Record<string, string> = {};
    fireEvent.dragStart(screen.getByTitle(audio.filePath), {
      dataTransfer: {
        setData: (key: string, val: string) => { dataTransfer[key] = val; },
        effectAllowed: '',
      },
    });
    expect(dataTransfer['text/plain']).toBe('play audio "C:/sfx/hit.ogg"');
  });
});
