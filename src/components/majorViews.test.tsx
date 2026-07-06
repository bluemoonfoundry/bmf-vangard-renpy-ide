import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ViewRoutesPanel from '@/components/ViewRoutesPanel';
import DialoguePreview from '@/components/DialoguePreview';
import StatsView from '@/components/StatsView';
import StoryElementsPanel from '@/components/StoryElementsPanel';
import { createEmptyAnalysisResult, createBlock, createProjectSettings } from '@/test/mocks/sampleData';
import type { IdentifiedRoute } from '@/types';

// ─── ViewRoutesPanel ──────────────────────────────────────────────────────────

function makeRoute(id: number, color = '#ff0000'): IdentifiedRoute {
  return { id, color, linkIds: new Set() };
}

describe('ViewRoutesPanel', () => {
  const baseProps = {
    routes: [makeRoute(0), makeRoute(1, '#00ff00')],
    checkedRoutes: new Set<number>(),
    onToggleRoute: vi.fn(),
    routeLabels: new Map([
      [0, { startLabel: 'start', endLabel: 'end' }],
      [1, { startLabel: 'chapter1', endLabel: 'chapter2' }],
    ]),
  };

  it('renders without crashing', () => {
    const { container } = render(<ViewRoutesPanel {...baseProps} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders empty state when no routes provided', () => {
    render(<ViewRoutesPanel {...baseProps} routes={[]} routeLabels={new Map()} />);
    expect(screen.getByText(/No distinct routes found/i)).toBeTruthy();
  });

  it('shows route labels for each route', () => {
    render(<ViewRoutesPanel {...baseProps} />);
    expect(screen.getByText(/start/i)).toBeTruthy();
    expect(screen.getByText(/chapter1/i)).toBeTruthy();
  });

  it('calls onToggleRoute when a route row is clicked', async () => {
    const onToggleRoute = vi.fn();
    const user = userEvent.setup();
    render(<ViewRoutesPanel {...baseProps} onToggleRoute={onToggleRoute} />);
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);
    expect(onToggleRoute).toHaveBeenCalledWith(0);
  });

  it('shows truncation warning when routesTruncated is true', () => {
    render(<ViewRoutesPanel {...baseProps} routesTruncated={true} />);
    expect(screen.getByText(/truncated|limit/i)).toBeTruthy();
  });

  it('collapses the list when the header is clicked', async () => {
    const user = userEvent.setup();
    render(<ViewRoutesPanel {...baseProps} />);
    // The routes list should be visible initially; click the header to collapse
    const header = screen.getByRole('button');
    await user.click(header);
    // After collapse, route rows may be hidden
    expect(screen.queryByText('start')).toBeNull();
  });
});

// ─── DialoguePreview ──────────────────────────────────────────────────────────

describe('DialoguePreview', () => {
  const onToggleExpand = vi.fn();

  it('renders null state gracefully', () => {
    const { container } = render(
      <DialoguePreview data={null} isExpanded={false} onToggleExpand={onToggleExpand} />,
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('shows dialogue text', () => {
    render(
      <DialoguePreview
        data={{ kind: 'dialogue', charName: 'Eileen', charColor: '#cc6600', text: 'Hello there!' }}
        isExpanded={true}
        onToggleExpand={onToggleExpand}
      />,
    );
    expect(screen.getByText('Hello there!')).toBeTruthy();
  });

  it('shows character name for dialogue', () => {
    render(
      <DialoguePreview
        data={{ kind: 'dialogue', charName: 'Eileen', charColor: null, text: 'Hi!' }}
        isExpanded={true}
        onToggleExpand={onToggleExpand}
      />,
    );
    expect(screen.getByText('Eileen')).toBeTruthy();
  });

  it('shows menu choices', () => {
    render(
      <DialoguePreview
        data={{
          kind: 'menu',
          prompt: 'What do you do?',
          choices: [
            { text: 'Option A' },
            { text: 'Option B' },
          ],
        }}
        isExpanded={true}
        onToggleExpand={onToggleExpand}
      />,
    );
    expect(screen.getByText('Option A')).toBeTruthy();
    expect(screen.getByText('Option B')).toBeTruthy();
  });

  it('renders dialogue with Ren\'Py text tags stripped/processed', () => {
    render(
      <DialoguePreview
        data={{ kind: 'dialogue', charName: null, charColor: null, text: '{b}Bold text{/b}' }}
        isExpanded={true}
        onToggleExpand={onToggleExpand}
      />,
    );
    expect(screen.getByText('Bold text')).toBeTruthy();
  });

  it('calls onToggleExpand when the toggle button is clicked', async () => {
    const onToggle = vi.fn();
    const user = userEvent.setup();
    render(
      <DialoguePreview
        data={{ kind: 'dialogue', charName: 'Eileen', charColor: null, text: 'Hello' }}
        isExpanded={true}
        onToggleExpand={onToggle}
      />,
    );
    const toggleBtn = screen.getByRole('button');
    await user.click(toggleBtn);
    expect(onToggle).toHaveBeenCalled();
  });
});

// ─── StatsView ────────────────────────────────────────────────────────────────

describe('StatsView', () => {
  const baseProps = {
    blocks: [createBlock()],
    analysisResult: createEmptyAnalysisResult(),
    routeAnalysisResult: {
      labelNodes: [],
      routeLinks: [],
      identifiedRoutes: [],
      routesTruncated: false,
    },
    projectImages: new Map(),
    imageMetadata: new Map(),
    projectAudios: new Map(),
    diagnosticsErrorCount: 0,
    onOpenDiagnostics: vi.fn(),
  };

  it('renders without crashing', () => {
    const { container } = render(<StatsView {...baseProps} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('shows the stats tab bar', () => {
    render(<StatsView {...baseProps} />);
    // There should be tab buttons for Story, Asset Coverage, etc.
    expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
  });

  it('shows block count in story stats', () => {
    const blocks = [createBlock(), createBlock({ id: 'block-2' })];
    render(<StatsView {...baseProps} blocks={blocks} />);
    expect(screen.getByText('2')).toBeTruthy();
  });

  it('shows diagnostics error count when non-zero', () => {
    render(<StatsView {...baseProps} diagnosticsErrorCount={5} />);
    expect(screen.getAllByText(/5/).length).toBeGreaterThan(0);
  });
});

// ─── StoryElementsPanel ───────────────────────────────────────────────────────

describe('StoryElementsPanel', () => {
  const projectSettings = createProjectSettings();

  const baseProps = {
    analysisResult: createEmptyAnalysisResult(),
    onOpenCharacterEditor: vi.fn(),
    onFindCharacterUsages: vi.fn(),
    onAddVariable: vi.fn(),
    onEditVariable: vi.fn(),
    onFindVariableUsages: vi.fn(),
    onFindScreenDefinition: vi.fn(),
    projectImages: new Map(),
    imageMetadata: new Map(),
    imageScanDirectories: new Map(),
    onAddImageScanDirectory: vi.fn(),
    onRemoveImageScanDirectory: vi.fn(),
    onCopyImagesToProject: vi.fn(),
    onOpenImageEditor: vi.fn(),
    imagesLastScanned: null,
    isRefreshingImages: false,
    onRefreshImages: vi.fn(),
    projectAudios: new Map(),
    audioMetadata: new Map(),
    audioScanDirectories: new Map(),
    onAddAudioScanDirectory: vi.fn(),
    onRemoveAudioScanDirectory: vi.fn(),
    onCopyAudiosToProject: vi.fn(),
    onOpenAudioEditor: vi.fn(),
    audiosLastScanned: null,
    isRefreshingAudios: false,
    onRefreshAudios: vi.fn(),
    isFileSystemApiSupported: false,
    onHoverHighlightStart: vi.fn(),
    onHoverHighlightEnd: vi.fn(),
    scenes: [],
    onOpenScene: vi.fn(),
    onCreateScene: vi.fn(),
    onDeleteScene: vi.fn(),
    imagemaps: [],
    onOpenImageMap: vi.fn(),
    onCreateImageMap: vi.fn(),
    onDeleteImageMap: vi.fn(),
    userSnippets: [],
    onCreateSnippet: vi.fn(),
    onEditSnippet: vi.fn(),
    onDeleteSnippet: vi.fn(),
    projectRootPath: '/project',
    menuTemplates: [],
    onCreateMenuTemplate: vi.fn(),
    onEditMenuTemplate: vi.fn(),
    onDeleteMenuTemplate: vi.fn(),
    onInsertColorAtCursor: vi.fn(),
    onWrapColorSelection: vi.fn(),
    onCopyColorHex: vi.fn(),
    projectColors: [],
    projectSettings,
    onUpdateProjectSettings: vi.fn(),
    hasProject: true,
    dismissedImplicitVarHint: false,
    onDismissImplicitVarHint: vi.fn(),
    onOpenDiagnostics: vi.fn(),
  };

  it('renders without crashing', () => {
    const { container } = render(<StoryElementsPanel {...baseProps} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('shows the sub-tab navigation icons', () => {
    render(<StoryElementsPanel {...baseProps} />);
    // Each sub-tab has a tooltip button
    expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
  });

  it('shows empty character list when there are no characters', () => {
    render(<StoryElementsPanel {...baseProps} />);
    // Default tab is characters — no characters means an empty state italic message
    expect(screen.getByText(/bring your story to life/i)).toBeTruthy();
  });
});
