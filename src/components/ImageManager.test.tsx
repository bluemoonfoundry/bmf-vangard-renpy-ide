import React from 'react';
import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ImageManager from '@/components/ImageManager';
import type { ProjectImage, ImageMetadata } from '@/types';

function makeImage(overrides: Partial<ProjectImage> = {}): ProjectImage {
  return {
    filePath: 'game/images/eileen.png',
    fileName: 'eileen.png',
    fileHandle: null,
    isInProject: true,
    ...overrides,
  };
}

const baseProps = {
  images: [] as ProjectImage[],
  metadata: new Map<string, ImageMetadata>(),
  scanDirectories: [] as string[],
  onAddScanDirectory: vi.fn(),
  onRemoveScanDirectory: vi.fn(),
  onCopyImagesToProject: vi.fn(),
  onOpenImageEditor: vi.fn(),
  isFileSystemApiSupported: true,
  lastScanned: null as number | null,
  isRefreshing: false,
  onRefresh: vi.fn(),
};

describe('ImageManager', () => {
  // jsdom returns 0 for clientWidth/clientHeight. ImageManager's useEffect sets
  // containerWidth from clientWidth, which would override the initial 300 and
  // collapse the virtual grid. Mock it to 300 so thumbnails actually render.
  beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      get() { return 300; },
    });
  });

  afterAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      get() { return 0; },
    });
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Basic rendering ───────────────────────────────────────────────────────

  it('renders without crashing', () => {
    const { container } = render(<ImageManager {...baseProps} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('shows empty-state message when no images exist', () => {
    render(<ImageManager {...baseProps} images={[]} />);
    expect(screen.getByText(/No images yet/i)).toBeTruthy();
  });

  it('shows no-match message when images exist but are all filtered out by search', () => {
    const images = [makeImage()];
    render(<ImageManager {...baseProps} images={images} />);
    const searchInput = screen.getByPlaceholderText(/search images/i);
    fireEvent.change(searchInput, { target: { value: 'xyznonexistent' } });
    expect(screen.getByText(/No images found matching criteria/i)).toBeTruthy();
  });

  it('shows "Last scanned:" time when lastScanned is set', () => {
    render(<ImageManager {...baseProps} lastScanned={Date.now()} />);
    expect(screen.getByText(/Last scanned:/i)).toBeTruthy();
  });

  it('shows "Not scanned" when lastScanned is null', () => {
    render(<ImageManager {...baseProps} lastScanned={null} />);
    expect(screen.getByText(/Not scanned/i)).toBeTruthy();
  });

  // ── Thumbnail display ─────────────────────────────────────────────────────

  it('renders a thumbnail for a provided image', () => {
    const image = makeImage();
    render(<ImageManager {...baseProps} images={[image]} />);
    expect(screen.getByTitle(image.filePath)).toBeTruthy();
  });

  it('renders multiple thumbnails within the virtual list buffer', () => {
    const img1 = makeImage({ filePath: 'game/images/a.png', fileName: 'a.png' });
    const img2 = makeImage({ filePath: 'game/images/b.png', fileName: 'b.png' });
    render(<ImageManager {...baseProps} images={[img1, img2]} />);
    expect(screen.getByTitle(img1.filePath)).toBeTruthy();
    expect(screen.getByTitle(img2.filePath)).toBeTruthy();
  });

  // ── Search filter ─────────────────────────────────────────────────────────

  it('filters visible thumbnails by search term', () => {
    const matching = makeImage({ filePath: 'game/images/eileen.png', fileName: 'eileen.png' });
    const nonMatching = makeImage({ filePath: 'game/images/bg_city.png', fileName: 'bg_city.png' });
    render(<ImageManager {...baseProps} images={[matching, nonMatching]} />);
    const searchInput = screen.getByPlaceholderText(/search images/i);
    fireEvent.change(searchInput, { target: { value: 'eileen' } });
    expect(screen.getByTitle(matching.filePath)).toBeTruthy();
    expect(screen.queryByTitle(nonMatching.filePath)).toBeNull();
  });

  it('search matches on tag via metadata', () => {
    const image = makeImage({ filePath: 'game/images/eileen.png', fileName: 'eileen.png', projectFilePath: 'game/images/eileen.png' });
    const meta = new Map<string, ImageMetadata>([
      ['game/images/eileen.png', { renpyName: 'eileen happy', tags: ['heroine', 'sprite'] }],
    ]);
    render(<ImageManager {...baseProps} images={[image]} metadata={meta} />);
    const searchInput = screen.getByPlaceholderText(/search images/i);
    fireEvent.change(searchInput, { target: { value: 'heroine' } });
    expect(screen.getByTitle(image.filePath)).toBeTruthy();
  });

  // ── Source filter ─────────────────────────────────────────────────────────

  it('renders source filter select with Project and scan directory options', () => {
    render(<ImageManager {...baseProps} scanDirectories={['C:/art']} />);
    const select = screen.getByRole('combobox');
    expect(select).toBeTruthy();
    expect(screen.getByText('Project Images')).toBeTruthy();
    expect(screen.getByText('C:/art')).toBeTruthy();
  });

  it('shows GUI assets toggle when source is Project', () => {
    render(<ImageManager {...baseProps} />);
    expect(screen.getByText(/Show UI assets/i)).toBeTruthy();
  });

  it('hides GUI assets toggle when source is changed to "all"', () => {
    render(<ImageManager {...baseProps} />);
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'all' } });
    expect(screen.queryByText(/Show UI assets/i)).toBeNull();
  });

  it('filters out gui/ images when GUI assets toggle is off and source is Project', () => {
    const guiImg = makeImage({ filePath: 'game/images/gui/btn.png', fileName: 'btn.png' });
    render(<ImageManager {...baseProps} images={[guiImg]} />);
    // Default: source=Project, hideGuiAssets=true → gui/ images hidden
    expect(screen.queryByTitle(guiImg.filePath)).toBeNull();
    expect(screen.getByText(/No images found matching criteria/i)).toBeTruthy();
  });

  it('shows gui/ images when GUI assets toggle is enabled', async () => {
    const user = userEvent.setup();
    const guiImg = makeImage({ filePath: 'game/images/gui/btn.png', fileName: 'btn.png' });
    render(<ImageManager {...baseProps} images={[guiImg]} />);
    const toggle = screen.getByRole('checkbox');
    await user.click(toggle); // show UI assets
    expect(screen.getByTitle(guiImg.filePath)).toBeTruthy();
  });

  // ── Scan directories ──────────────────────────────────────────────────────

  it('shows remove button when a scan directory source is selected', () => {
    render(<ImageManager {...baseProps} scanDirectories={['C:/art']} />);
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'C:/art' } });
    expect(screen.getByTitle('Remove C:/art from scan list')).toBeTruthy();
  });

  it('calls onRemoveScanDirectory with the selected directory when remove clicked', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<ImageManager {...baseProps} scanDirectories={['C:/art']} onRemoveScanDirectory={onRemove} />);
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'C:/art' } });
    await user.click(screen.getByTitle('Remove C:/art from scan list'));
    expect(onRemove).toHaveBeenCalledWith('C:/art');
  });

  it('does not show remove button for built-in "Project" source', () => {
    render(<ImageManager {...baseProps} />);
    // Default source is Project — no remove button
    expect(screen.queryByTitle(/Remove.*from scan list/)).toBeNull();
  });

  // ── Refresh button ────────────────────────────────────────────────────────

  it('calls onRefresh when Refresh button is clicked', async () => {
    const user = userEvent.setup();
    const onRefresh = vi.fn();
    render(<ImageManager {...baseProps} onRefresh={onRefresh} />);
    await user.click(screen.getByRole('button', { name: /refresh/i }));
    expect(onRefresh).toHaveBeenCalled();
  });

  it('disables Refresh button when isFileSystemApiSupported is false', () => {
    render(<ImageManager {...baseProps} isFileSystemApiSupported={false} />);
    expect((screen.getByRole('button', { name: /refresh/i }) as HTMLButtonElement).disabled).toBe(true);
  });

  it('disables Refresh button when isRefreshing is true', () => {
    render(<ImageManager {...baseProps} isRefreshing={true} />);
    expect((screen.getByRole('button', { name: /refresh/i }) as HTMLButtonElement).disabled).toBe(true);
  });

  // ── Add scan directory ────────────────────────────────────────────────────

  it('calls onAddScanDirectory when Scan Dir button is clicked', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<ImageManager {...baseProps} onAddScanDirectory={onAdd} />);
    await user.click(screen.getByRole('button', { name: /scan dir/i }));
    expect(onAdd).toHaveBeenCalled();
  });

  it('disables Scan Dir button when isFileSystemApiSupported is false', () => {
    render(<ImageManager {...baseProps} isFileSystemApiSupported={false} />);
    expect((screen.getByRole('button', { name: /scan dir/i }) as HTMLButtonElement).disabled).toBe(true);
  });

  // ── Placeholder button ────────────────────────────────────────────────────

  it('renders Placeholder button when onCreatePlaceholder is provided', () => {
    render(<ImageManager {...baseProps} onCreatePlaceholder={vi.fn()} />);
    expect(screen.getByRole('button', { name: /placeholder/i })).toBeTruthy();
  });

  it('does not render Placeholder button when onCreatePlaceholder is absent', () => {
    render(<ImageManager {...baseProps} />);
    expect(screen.queryByRole('button', { name: /placeholder/i })).toBeNull();
  });

  it('calls onCreatePlaceholder when Placeholder button is clicked', async () => {
    const user = userEvent.setup();
    const onCreatePlaceholder = vi.fn();
    render(<ImageManager {...baseProps} onCreatePlaceholder={onCreatePlaceholder} />);
    await user.click(screen.getByRole('button', { name: /placeholder/i }));
    expect(onCreatePlaceholder).toHaveBeenCalled();
  });

  // ── Selection and Copy ────────────────────────────────────────────────────

  it('Copy button is disabled when no images are selected', () => {
    const image = makeImage();
    render(<ImageManager {...baseProps} images={[image]} />);
    expect((screen.getByRole('button', { name: /copy \(0\)/i }) as HTMLButtonElement).disabled).toBe(true);
  });

  it('clicking a thumbnail selects it and enables Copy button', async () => {
    const user = userEvent.setup();
    const image = makeImage();
    render(<ImageManager {...baseProps} images={[image]} />);
    await user.click(screen.getByTitle(image.filePath));
    expect((screen.getByRole('button', { name: /copy \(1\)/i }) as HTMLButtonElement).disabled).toBe(false);
  });

  it('calls onCopyImagesToProject with selected image paths when Copy clicked', async () => {
    const user = userEvent.setup();
    const onCopy = vi.fn();
    const image = makeImage();
    render(<ImageManager {...baseProps} images={[image]} onCopyImagesToProject={onCopy} />);
    await user.click(screen.getByTitle(image.filePath));
    await user.click(screen.getByRole('button', { name: /copy \(1\)/i }));
    expect(onCopy).toHaveBeenCalledWith([image.filePath]);
  });

  it('deselects a thumbnail on second click', async () => {
    const user = userEvent.setup();
    const image = makeImage();
    render(<ImageManager {...baseProps} images={[image]} />);
    const thumbnail = screen.getByTitle(image.filePath);
    await user.click(thumbnail); // select
    await user.click(thumbnail); // deselect
    expect(screen.getByRole('button', { name: /copy \(0\)/i })).toBeTruthy();
  });

  it('clears selection after Copy is clicked', async () => {
    const user = userEvent.setup();
    const image = makeImage();
    render(<ImageManager {...baseProps} images={[image]} />);
    await user.click(screen.getByTitle(image.filePath));
    await user.click(screen.getByRole('button', { name: /copy \(1\)/i }));
    expect(screen.getByRole('button', { name: /copy \(0\)/i })).toBeTruthy();
  });

  // ── Context menu ──────────────────────────────────────────────────────────

  it('opens context menu on right-click of a thumbnail', () => {
    const image = makeImage();
    render(<ImageManager {...baseProps} images={[image]} />);
    fireEvent.contextMenu(screen.getByTitle(image.filePath));
    expect(screen.getByText(/Insert Image:/i)).toBeTruthy();
  });

  it('context menu shows image tag derived from filename', () => {
    const image = makeImage({ filePath: 'game/images/eileen.png', fileName: 'eileen.png' });
    render(<ImageManager {...baseProps} images={[image]} />);
    fireEvent.contextMenu(screen.getByTitle(image.filePath));
    expect(screen.getByText('eileen')).toBeTruthy();
  });

  it('context menu uses renpyName from metadata when available', () => {
    const image = makeImage({ filePath: 'game/images/eileen.png', fileName: 'eileen.png', projectFilePath: 'game/images/eileen.png' });
    const meta = new Map<string, ImageMetadata>([
      ['game/images/eileen.png', { renpyName: 'eileen happy', tags: [] }],
    ]);
    render(<ImageManager {...baseProps} images={[image]} metadata={meta} />);
    fireEvent.contextMenu(screen.getByTitle(image.filePath));
    expect(screen.getByText('eileen happy')).toBeTruthy();
  });

  it('closes context menu when "scene" option is selected', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      writable: true,
      configurable: true,
    });
    const user = userEvent.setup();
    const image = makeImage();
    render(<ImageManager {...baseProps} images={[image]} />);
    fireEvent.contextMenu(screen.getByTitle(image.filePath));
    await user.click(screen.getByRole('button', { name: /scene/i }));
    expect(screen.queryByText(/Insert Image:/i)).toBeNull();
  });

  it('closes context menu when "show" option is selected', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      writable: true,
      configurable: true,
    });
    const user = userEvent.setup();
    const image = makeImage();
    render(<ImageManager {...baseProps} images={[image]} />);
    fireEvent.contextMenu(screen.getByTitle(image.filePath));
    await user.click(screen.getByRole('button', { name: /^add `show`/i }));
    expect(screen.queryByText(/Insert Image:/i)).toBeNull();
  });

  // ── Drag start ────────────────────────────────────────────────────────────

  it('sets renpy-dnd and text/plain drag data on dragstart', () => {
    const image = makeImage({ filePath: 'game/images/eileen.png', fileName: 'eileen.png' });
    render(<ImageManager {...baseProps} images={[image]} />);
    const dataTransfer: Record<string, string> = {};
    fireEvent.dragStart(screen.getByTitle(image.filePath), {
      dataTransfer: {
        setData: (key: string, val: string) => { dataTransfer[key] = val; },
        effectAllowed: '',
      },
    });
    expect(dataTransfer['text/plain']).toMatch(/^show /);
    const dnd = JSON.parse(dataTransfer['application/renpy-dnd']);
    expect(dnd.text).toMatch(/^show /);
  });

  it('includes image file path in drag data', () => {
    const image = makeImage({ filePath: 'game/images/eileen.png', fileName: 'eileen.png' });
    render(<ImageManager {...baseProps} images={[image]} />);
    const dataTransfer: Record<string, string> = {};
    fireEvent.dragStart(screen.getByTitle(image.filePath), {
      dataTransfer: {
        setData: (key: string, val: string) => { dataTransfer[key] = val; },
        effectAllowed: '',
      },
    });
    expect(dataTransfer['application/renpy-image-path']).toBe(image.filePath);
  });

  it('includes dataUrl in drag data when image has one', () => {
    const image = makeImage({ filePath: 'game/images/eileen.png', fileName: 'eileen.png', dataUrl: 'data:image/png;base64,abc' });
    render(<ImageManager {...baseProps} images={[image]} />);
    const dataTransfer: Record<string, string> = {};
    fireEvent.dragStart(screen.getByTitle(image.filePath), {
      dataTransfer: {
        setData: (key: string, val: string) => { dataTransfer[key] = val; },
        effectAllowed: '',
      },
    });
    expect(dataTransfer['application/renpy-image-dataurl']).toBe('data:image/png;base64,abc');
  });
});
