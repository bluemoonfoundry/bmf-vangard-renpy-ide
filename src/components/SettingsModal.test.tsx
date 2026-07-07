import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SettingsModal from './SettingsModal';
import {
  createMockElectronAPI,
  installElectronAPI,
  uninstallElectronAPI,
} from '@/test/mocks/electronAPI';
import type { IdeSettings } from '@/types';

const defaultSettings: IdeSettings = {
  // AppSettings
  theme: 'dark',
  isLeftSidebarOpen: true,
  leftSidebarWidth: 240,
  isRightSidebarOpen: true,
  rightSidebarWidth: 280,
  renpyPath: '/usr/local/renpy',
  recentProjects: [],
  editorFontFamily: 'Consolas',
  editorFontSize: 14,
  // ProjectSettings required fields
  draftingMode: false,
  openTabs: [],
  activeTabId: '',
};

describe('SettingsModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    uninstallElectronAPI();
  });

  afterEach(() => {
    uninstallElectronAPI();
  });

  // ── Visibility ─────────────────────────────────────────────────────────────

  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <SettingsModal
        isOpen={false}
        onClose={vi.fn()}
        settings={defaultSettings}
        onSettingsChange={vi.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders the Settings heading when isOpen is true', () => {
    render(
      <SettingsModal
        isOpen={true}
        onClose={vi.fn()}
        settings={defaultSettings}
        onSettingsChange={vi.fn()}
      />
    );
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  // ── Close actions ──────────────────────────────────────────────────────────

  it('calls onClose when Close button is clicked', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <SettingsModal
        isOpen={true}
        onClose={onClose}
        settings={defaultSettings}
        onSettingsChange={vi.fn()}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    const { container } = render(
      <SettingsModal
        isOpen={true}
        onClose={onClose}
        settings={defaultSettings}
        onSettingsChange={vi.fn()}
      />
    );
    const backdrop = container.firstElementChild as HTMLElement;
    await user.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when clicking inside modal content', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <SettingsModal
        isOpen={true}
        onClose={onClose}
        settings={defaultSettings}
        onSettingsChange={vi.fn()}
      />
    );
    await user.click(screen.getByText('Settings'));
    expect(onClose).not.toHaveBeenCalled();
  });

  // ── Theme select ───────────────────────────────────────────────────────────

  it('shows current theme as selected option', () => {
    render(
      <SettingsModal
        isOpen={true}
        onClose={vi.fn()}
        settings={{ ...defaultSettings, theme: 'light' }}
        onSettingsChange={vi.fn()}
      />
    );
    const select = screen.getByRole('combobox', { name: 'Color Theme' });
    expect((select as HTMLSelectElement).value).toBe('light');
  });

  it('calls onSettingsChange with theme when theme select changes', () => {
    const onSettingsChange = vi.fn();
    render(
      <SettingsModal
        isOpen={true}
        onClose={vi.fn()}
        settings={defaultSettings}
        onSettingsChange={onSettingsChange}
      />
    );
    const select = screen.getByRole('combobox', { name: 'Color Theme' });
    fireEvent.change(select, { target: { value: 'solarized-dark' } });
    expect(onSettingsChange).toHaveBeenCalledWith('theme', 'solarized-dark');
  });

  // ── Font settings ──────────────────────────────────────────────────────────

  it('shows current font family value', () => {
    render(
      <SettingsModal
        isOpen={true}
        onClose={vi.fn()}
        settings={defaultSettings}
        onSettingsChange={vi.fn()}
      />
    );
    const input = screen.getByLabelText('Font Family');
    expect((input as HTMLInputElement).value).toBe('Consolas');
  });

  it('calls onSettingsChange with editorFontFamily when font family changes', () => {
    const onSettingsChange = vi.fn();
    render(
      <SettingsModal
        isOpen={true}
        onClose={vi.fn()}
        settings={defaultSettings}
        onSettingsChange={onSettingsChange}
      />
    );
    const input = screen.getByLabelText('Font Family');
    fireEvent.change(input, { target: { value: 'Fira Code' } });
    expect(onSettingsChange).toHaveBeenCalledWith('editorFontFamily', 'Fira Code');
  });

  it('calls onSettingsChange with editorFontSize when font size changes', () => {
    const onSettingsChange = vi.fn();
    render(
      <SettingsModal
        isOpen={true}
        onClose={vi.fn()}
        settings={defaultSettings}
        onSettingsChange={onSettingsChange}
      />
    );
    const input = screen.getByLabelText('Font Size (px)');
    fireEvent.change(input, { target: { value: '16' } });
    expect(onSettingsChange).toHaveBeenCalledWith('editorFontSize', 16);
  });

  it('falls back to 14 when font size is cleared', () => {
    const onSettingsChange = vi.fn();
    render(
      <SettingsModal
        isOpen={true}
        onClose={vi.fn()}
        settings={defaultSettings}
        onSettingsChange={onSettingsChange}
      />
    );
    const input = screen.getByLabelText('Font Size (px)');
    fireEvent.change(input, { target: { value: '' } });
    expect(onSettingsChange).toHaveBeenCalledWith('editorFontSize', 14);
  });

  // ── Canvas & Mouse settings ────────────────────────────────────────────────

  it('calls onSettingsChange with updated mouseGestures when pan gesture changes', () => {
    const onSettingsChange = vi.fn();
    render(
      <SettingsModal
        isOpen={true}
        onClose={vi.fn()}
        settings={defaultSettings}
        onSettingsChange={onSettingsChange}
      />
    );
    const select = screen.getByRole('combobox', { name: 'Canvas Pan Gesture' });
    fireEvent.change(select, { target: { value: 'drag' } });
    expect(onSettingsChange).toHaveBeenCalledWith('mouseGestures', expect.objectContaining({
      canvasPanGesture: 'drag',
    }));
  });

  it('shows middle mouse checkbox when pan gesture is not middle-drag', () => {
    render(
      <SettingsModal
        isOpen={true}
        onClose={vi.fn()}
        settings={defaultSettings}
        onSettingsChange={vi.fn()}
      />
    );
    expect(screen.getByText('Middle mouse button also pans')).toBeInTheDocument();
  });

  it('hides middle mouse checkbox when pan gesture is middle-drag', () => {
    render(
      <SettingsModal
        isOpen={true}
        onClose={vi.fn()}
        settings={{
          ...defaultSettings,
          mouseGestures: {
            canvasPanGesture: 'middle-drag',
            middleMouseAlwaysPans: false,
            zoomScrollDirection: 'normal',
            zoomScrollSensitivity: 1.0,
          },
        }}
        onSettingsChange={vi.fn()}
      />
    );
    expect(screen.queryByText('Middle mouse button also pans')).not.toBeInTheDocument();
  });

  it('calls onSettingsChange with updated mouseGestures when middle mouse checkbox is toggled', async () => {
    const onSettingsChange = vi.fn();
    const user = userEvent.setup();
    render(
      <SettingsModal
        isOpen={true}
        onClose={vi.fn()}
        settings={defaultSettings}
        onSettingsChange={onSettingsChange}
      />
    );
    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);
    expect(onSettingsChange).toHaveBeenCalledWith('mouseGestures', expect.objectContaining({
      middleMouseAlwaysPans: true,
    }));
  });

  it('calls onSettingsChange with updated mouseGestures when zoom direction changes', () => {
    const onSettingsChange = vi.fn();
    render(
      <SettingsModal
        isOpen={true}
        onClose={vi.fn()}
        settings={defaultSettings}
        onSettingsChange={onSettingsChange}
      />
    );
    const select = screen.getByRole('combobox', { name: 'Zoom Scroll Direction' });
    fireEvent.change(select, { target: { value: 'inverted' } });
    expect(onSettingsChange).toHaveBeenCalledWith('mouseGestures', expect.objectContaining({
      zoomScrollDirection: 'inverted',
    }));
  });

  it('calls onSettingsChange with updated mouseGestures when zoom sensitivity range changes', () => {
    const onSettingsChange = vi.fn();
    render(
      <SettingsModal
        isOpen={true}
        onClose={vi.fn()}
        settings={defaultSettings}
        onSettingsChange={onSettingsChange}
      />
    );
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '1.5' } });
    expect(onSettingsChange).toHaveBeenCalledWith('mouseGestures', expect.objectContaining({
      zoomScrollSensitivity: 1.5,
    }));
  });

  // ── Ren'Py SDK path (requires electronAPI) ─────────────────────────────────

  it('shows Ren\'Py SDK section when electronAPI is present', () => {
    installElectronAPI();
    render(
      <SettingsModal
        isOpen={true}
        onClose={vi.fn()}
        settings={defaultSettings}
        onSettingsChange={vi.fn()}
      />
    );
    expect(screen.getByText("Ren'Py SDK Directory")).toBeInTheDocument();
  });

  it('shows renpyPath value in the Ren\'Py path input', () => {
    installElectronAPI();
    render(
      <SettingsModal
        isOpen={true}
        onClose={vi.fn()}
        settings={{ ...defaultSettings, renpyPath: '/opt/renpy' }}
        onSettingsChange={vi.fn()}
      />
    );
    const pathInput = screen.getByDisplayValue('/opt/renpy');
    expect(pathInput).toBeInTheDocument();
  });

  it('calls selectRenpy and then onSettingsChange with the returned path', async () => {
    const api = createMockElectronAPI();
    api.selectRenpy.mockResolvedValue('/new/renpy/path');
    installElectronAPI(api);
    const onSettingsChange = vi.fn();
    const user = userEvent.setup();
    render(
      <SettingsModal
        isOpen={true}
        onClose={vi.fn()}
        settings={defaultSettings}
        onSettingsChange={onSettingsChange}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Change...' }));
    expect(api.selectRenpy).toHaveBeenCalledTimes(1);
    // Wait for async resolution
    await vi.waitFor(() => {
      expect(onSettingsChange).toHaveBeenCalledWith('renpyPath', '/new/renpy/path');
    });
  });

  it('does not call onSettingsChange when selectRenpy returns null', async () => {
    const api = createMockElectronAPI();
    api.selectRenpy.mockResolvedValue(null);
    installElectronAPI(api);
    const onSettingsChange = vi.fn();
    const user = userEvent.setup();
    render(
      <SettingsModal
        isOpen={true}
        onClose={vi.fn()}
        settings={defaultSettings}
        onSettingsChange={onSettingsChange}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Change...' }));
    await vi.waitFor(() => {
      expect(api.selectRenpy).toHaveBeenCalledTimes(1);
    });
    expect(onSettingsChange).not.toHaveBeenCalled();
  });
});
