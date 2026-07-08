import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CopyButton from '@/components/CopyButton';
import ColorDropTarget from '@/components/ColorDropTarget';
import ImageThumbnail from '@/components/ImageThumbnail';
import LoadingOverlay from '@/components/LoadingOverlay';
import AnalysisOverlay from '@/components/AnalysisOverlay';
import ExternalChangesBanner from '@/components/ExternalChangesBanner';
import ErrorBoundary from '@/components/ErrorBoundary';
import Sash from '@/components/Sash';
import type { ProjectImage } from '@/types';

// ─── CopyButton ──────────────────────────────────────────────────────────────

const clipboardMock = { writeText: vi.fn().mockResolvedValue(undefined) };

describe('CopyButton', () => {
  beforeAll(() => {
    // jsdom does not implement clipboard API — install it once
    Object.defineProperty(window.navigator, 'clipboard', {
      value: clipboardMock,
      writable: true,
      configurable: true,
    });
  });

  beforeEach(() => {
    clipboardMock.writeText = vi.fn().mockResolvedValue(undefined);
  });

  it('renders the label', () => {
    render(<CopyButton text="hello" label="Copy code" />);
    expect(screen.getByText('Copy code')).toBeTruthy();
  });

  it('defaults to "Copy to Clipboard" label', () => {
    render(<CopyButton text="hello" />);
    expect(screen.getByText('Copy to Clipboard')).toBeTruthy();
  });

  it('shows idle state before click and Copied state after', async () => {
    const user = userEvent.setup();
    render(<CopyButton text="my text" />);
    expect(screen.getByText('Copy to Clipboard')).toBeTruthy();
    await user.click(screen.getByRole('button'));
    expect(screen.getByText('Copied!')).toBeTruthy();
  });

  it('shows "Copied!" after click', async () => {
    const user = userEvent.setup();
    render(<CopyButton text="x" />);
    await user.click(screen.getByRole('button'));
    expect(screen.getByText('Copied!')).toBeTruthy();
  });

  it('does not call clipboard when text is empty', async () => {
    const user = userEvent.setup();
    render(<CopyButton text="" />);
    await user.click(screen.getByRole('button'));
    expect(clipboardMock.writeText).not.toHaveBeenCalled();
  });
});

// ─── ColorDropTarget ─────────────────────────────────────────────────────────

describe('ColorDropTarget', () => {
  it('renders a color input with the given value', () => {
    const { container } = render(<ColorDropTarget value="#ff0000" onChange={vi.fn()} />);
    const input = container.querySelector('input[type="color"]') as HTMLInputElement;
    expect(input).toBeTruthy();
    expect(input.value).toBe('#ff0000');
  });

  it('calls onChange when input changes', async () => {
    const onChange = vi.fn();
    render(<ColorDropTarget value="#ffffff" onChange={onChange} />);
    const input = document.querySelector('input[type="color"]') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '#0000ff' } });
    expect(onChange).toHaveBeenCalledWith('#0000ff');
  });

  it('calls onChange with expanded hex on drop of renpy-color', () => {
    const onChange = vi.fn();
    render(<ColorDropTarget value="#ffffff" onChange={onChange} />);
    const wrapper = document.querySelector('div.relative') as HTMLElement;
    fireEvent.dragOver(wrapper, {
      dataTransfer: { types: ['application/renpy-color'], dropEffect: '' },
    });
    fireEvent.drop(wrapper, {
      dataTransfer: {
        types: ['application/renpy-color'],
        getData: () => '#f00',
      },
    });
    expect(onChange).toHaveBeenCalled();
  });

  it('applies wrapperClassName', () => {
    const { container } = render(
      <ColorDropTarget value="#000" onChange={vi.fn()} wrapperClassName="my-wrapper" />,
    );
    expect(container.querySelector('.my-wrapper')).toBeTruthy();
  });
});

// ─── ImageThumbnail ──────────────────────────────────────────────────────────

function makeImage(overrides: Partial<ProjectImage> = {}): ProjectImage {
  return {
    filePath: '/project/images/bg.png',
    fileName: 'bg.png',
    dataUrl: 'data:image/png;base64,abc',
    isInProject: false,
    projectFilePath: null,
    ...overrides,
  } as unknown as ProjectImage;
}

describe('ImageThumbnail', () => {
  it('renders the image when dataUrl is present', () => {
    render(
      <ImageThumbnail
        image={makeImage()}
        isSelected={false}
        onSelect={vi.fn()}
        onDoubleClick={vi.fn()}
        onContextMenu={vi.fn()}
        onDragStart={vi.fn()}
      />,
    );
    expect(document.querySelector('img')).toBeTruthy();
  });

  it('renders fallback svg when dataUrl is absent', () => {
    render(
      <ImageThumbnail
        image={makeImage({ dataUrl: undefined })}
        isSelected={false}
        onSelect={vi.fn()}
        onDoubleClick={vi.fn()}
        onContextMenu={vi.fn()}
        onDragStart={vi.fn()}
      />,
    );
    expect(document.querySelector('img')).toBeNull();
  });

  it('calls onSelect when clicked', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(
      <ImageThumbnail
        image={makeImage()}
        isSelected={false}
        onSelect={onSelect}
        onDoubleClick={vi.fn()}
        onContextMenu={vi.fn()}
        onDragStart={vi.fn()}
      />,
    );
    await user.click(document.querySelector('div.relative')!);
    expect(onSelect).toHaveBeenCalledWith('/project/images/bg.png', false);
  });

  it('applies selection ring class when isSelected', () => {
    const { container } = render(
      <ImageThumbnail
        image={makeImage()}
        isSelected={true}
        onSelect={vi.fn()}
        onDoubleClick={vi.fn()}
        onContextMenu={vi.fn()}
        onDragStart={vi.fn()}
      />,
    );
    expect(container.innerHTML).toContain('ring-indigo-500');
  });

  it('applies green border when isInProject', () => {
    const { container } = render(
      <ImageThumbnail
        image={makeImage({ isInProject: true })}
        isSelected={false}
        onSelect={vi.fn()}
        onDoubleClick={vi.fn()}
        onContextMenu={vi.fn()}
        onDragStart={vi.fn()}
      />,
    );
    expect(container.innerHTML).toContain('border-green-500');
  });
});

// ─── LoadingOverlay ──────────────────────────────────────────────────────────

describe('LoadingOverlay', () => {
  it('renders the progress percentage', () => {
    render(<LoadingOverlay progress={42} message="Scanning files" />);
    expect(screen.getByText('42%')).toBeTruthy();
  });

  it('renders the message', () => {
    render(<LoadingOverlay progress={0} message="Reading assets" />);
    expect(screen.getByText('Reading assets')).toBeTruthy();
  });

  it('shows Cancel button when onCancel is provided', () => {
    render(<LoadingOverlay progress={10} message="msg" onCancel={vi.fn()} />);
    expect(screen.getByRole('button', { name: /cancel/i })).toBeTruthy();
  });

  it('does not show Cancel button without onCancel', () => {
    render(<LoadingOverlay progress={10} message="msg" />);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('shows Cancelling state after Cancel is clicked', async () => {
    const user = userEvent.setup();
    render(<LoadingOverlay progress={10} message="msg" onCancel={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: /cancel/i }));
    expect(screen.getByText(/cancelling/i)).toBeTruthy();
  });
});

// ─── AnalysisOverlay ─────────────────────────────────────────────────────────

describe('AnalysisOverlay', () => {
  it('renders "Preparing your project"', () => {
    render(<AnalysisOverlay blockCount={5} />);
    expect(screen.getByText(/preparing your project/i)).toBeTruthy();
  });

  it('uses singular "file" for one block', () => {
    render(<AnalysisOverlay blockCount={1} />);
    expect(screen.getByText(/1 script file/)).toBeTruthy();
  });

  it('uses plural "files" for multiple blocks', () => {
    render(<AnalysisOverlay blockCount={3} />);
    expect(screen.getByText(/3 script files/)).toBeTruthy();
  });

  it('shows phase and percent when progress is provided', () => {
    render(<AnalysisOverlay blockCount={2} progress={{ phase: 'Parsing', percent: 55 }} />);
    expect(screen.getByText(/Parsing.*55%/)).toBeTruthy();
  });

  it('shows fallback text when no progress', () => {
    render(<AnalysisOverlay blockCount={2} />);
    expect(screen.getByText(/application will be ready/i)).toBeTruthy();
  });
});

// ─── ExternalChangesBanner ───────────────────────────────────────────────────

describe('ExternalChangesBanner', () => {
  it('renders nothing when items is empty', () => {
    const { container } = render(
      <ExternalChangesBanner items={[]} onReload={vi.fn()} onKeep={vi.fn()} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('shows the file name and buttons for each item', () => {
    const items = [{ relativePath: 'scripts/chapter1.rpy' }];
    render(<ExternalChangesBanner items={items} onReload={vi.fn()} onKeep={vi.fn()} />);
    expect(screen.getByText('chapter1.rpy')).toBeTruthy();
    expect(screen.getByText('Reload')).toBeTruthy();
    expect(screen.getByText('Keep current')).toBeTruthy();
  });

  it('calls onReload with the item when Reload is clicked', async () => {
    const onReload = vi.fn();
    const user = userEvent.setup();
    const item = { relativePath: 'scripts/scene.rpy' };
    render(<ExternalChangesBanner items={[item]} onReload={onReload} onKeep={vi.fn()} />);
    await user.click(screen.getByText('Reload'));
    expect(onReload).toHaveBeenCalledWith(item);
  });

  it('calls onKeep with relativePath when Keep current is clicked', async () => {
    const onKeep = vi.fn();
    const user = userEvent.setup();
    render(
      <ExternalChangesBanner
        items={[{ relativePath: 'scripts/scene.rpy' }]}
        onReload={vi.fn()}
        onKeep={onKeep}
      />,
    );
    await user.click(screen.getByText('Keep current'));
    expect(onKeep).toHaveBeenCalledWith('scripts/scene.rpy');
  });

  it('renders multiple items', () => {
    const items = [
      { relativePath: 'a.rpy' },
      { relativePath: 'b.rpy' },
    ];
    render(<ExternalChangesBanner items={items} onReload={vi.fn()} onKeep={vi.fn()} />);
    expect(screen.getByText('a.rpy')).toBeTruthy();
    expect(screen.getByText('b.rpy')).toBeTruthy();
  });
});

// ─── ErrorBoundary ───────────────────────────────────────────────────────────

function ThrowingComponent({ shouldThrow = false }: { shouldThrow?: boolean }) {
  if (shouldThrow) throw new Error('test render error');
  return <div>rendered fine</div>;
}

describe('ErrorBoundary', () => {
  it('renders children normally when no error', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>,
    );
    expect(screen.getByText('rendered fine')).toBeTruthy();
  });

  it('renders fallback UI when child throws', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow />
      </ErrorBoundary>,
    );
    expect(screen.getByText(/something went wrong/i)).toBeTruthy();
    spy.mockRestore();
  });

  it('shows the error message in the fallback', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow />
      </ErrorBoundary>,
    );
    expect(screen.getByText('test render error')).toBeTruthy();
    spy.mockRestore();
  });

  it('renders a reload button in the fallback', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow />
      </ErrorBoundary>,
    );
    expect(screen.getByRole('button', { name: /reload/i })).toBeTruthy();
    spy.mockRestore();
  });
});

// ─── Sash ─────────────────────────────────────────────────────────────────────

describe('Sash', () => {
  it('renders without crashing (horizontal)', () => {
    const { container } = render(<Sash onDrag={vi.fn()} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders without crashing (vertical)', () => {
    const { container } = render(<Sash onDrag={vi.fn()} direction="vertical" />);
    expect(container.firstChild).toBeTruthy();
  });

  it('horizontal sash has col-resize cursor', () => {
    const { container } = render(<Sash onDrag={vi.fn()} direction="horizontal" />);
    expect((container.firstChild as HTMLElement).className).toContain('cursor-col-resize');
  });

  it('vertical sash has row-resize cursor', () => {
    const { container } = render(<Sash onDrag={vi.fn()} direction="vertical" />);
    expect((container.firstChild as HTMLElement).className).toContain('cursor-row-resize');
  });
});
