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

  // ── File size thresholds ───────────────────────────────────────────────────

  it('shows default threshold values when settings has none set', () => {
    render(
      <SettingsModal
        isOpen={true}
        onClose={vi.fn()}
        settings={defaultSettings}
        onSettingsChange={vi.fn()}
      />
    );
    expect((screen.getByLabelText('Healthy starts at') as HTMLInputElement).value).toBe('500');
    expect((screen.getByLabelText('Warning starts at') as HTMLInputElement).value).toBe('1000');
    expect((screen.getByLabelText('Critical starts at') as HTMLInputElement).value).toBe('1500');
  });

  it('shows custom threshold values from settings', () => {
    render(
      <SettingsModal
        isOpen={true}
        onClose={vi.fn()}
        settings={{ ...defaultSettings, fileSizeThresholds: { healthy: 100, warning: 200, critical: 300 } }}
        onSettingsChange={vi.fn()}
      />
    );
    expect((screen.getByLabelText('Healthy starts at') as HTMLInputElement).value).toBe('100');
    expect((screen.getByLabelText('Warning starts at') as HTMLInputElement).value).toBe('200');
    expect((screen.getByLabelText('Critical starts at') as HTMLInputElement).value).toBe('300');
  });

  it('calls onSettingsChange with updated fileSizeThresholds when Healthy input changes', () => {
    const onSettingsChange = vi.fn();
    render(
      <SettingsModal
        isOpen={true}
        onClose={vi.fn()}
        settings={defaultSettings}
        onSettingsChange={onSettingsChange}
      />
    );
    fireEvent.change(screen.getByLabelText('Healthy starts at'), { target: { value: '400' } });
    expect(onSettingsChange).toHaveBeenCalledWith('fileSizeThresholds', { healthy: 400, warning: 1000, critical: 1500 });
  });

  it('calls onSettingsChange with updated fileSizeThresholds when Warning input changes', () => {
    const onSettingsChange = vi.fn();
    render(
      <SettingsModal
        isOpen={true}
        onClose={vi.fn()}
        settings={defaultSettings}
        onSettingsChange={onSettingsChange}
      />
    );
    fireEvent.change(screen.getByLabelText('Warning starts at'), { target: { value: '900' } });
    expect(onSettingsChange).toHaveBeenCalledWith('fileSizeThresholds', { healthy: 500, warning: 900, critical: 1500 });
  });

  it('calls onSettingsChange with updated fileSizeThresholds when Critical input changes', () => {
    const onSettingsChange = vi.fn();
    render(
      <SettingsModal
        isOpen={true}
        onClose={vi.fn()}
        settings={defaultSettings}
        onSettingsChange={onSettingsChange}
      />
    );
    fireEvent.change(screen.getByLabelText('Critical starts at'), { target: { value: '2000' } });
    expect(onSettingsChange).toHaveBeenCalledWith('fileSizeThresholds', { healthy: 500, warning: 1000, critical: 2000 });
  });

  it('shows a warning message when thresholds are not strictly ascending', () => {
    render(
      <SettingsModal
        isOpen={true}
        onClose={vi.fn()}
        settings={{ ...defaultSettings, fileSizeThresholds: { healthy: 900, warning: 500, critical: 1500 } }}
        onSettingsChange={vi.fn()}
      />
    );
    expect(screen.getByText('Thresholds should increase from Healthy to Warning to Critical.')).toBeInTheDocument();
  });

  it('does not show a warning message when thresholds are valid', () => {
    render(
      <SettingsModal
        isOpen={true}
        onClose={vi.fn()}
        settings={defaultSettings}
        onSettingsChange={vi.fn()}
      />
    );
    expect(screen.queryByText('Thresholds should increase from Healthy to Warning to Critical.')).not.toBeInTheDocument();
  });

  it('does not call onSettingsChange when a change makes the thresholds non-ascending, and shows the warning', () => {
    const onSettingsChange = vi.fn();
    render(
      <SettingsModal
        isOpen={true}
        onClose={vi.fn()}
        settings={defaultSettings}
        onSettingsChange={onSettingsChange}
      />
    );
    // Warning starts at 1000 by default; setting it above Critical (1500) breaks ascending order.
    fireEvent.change(screen.getByLabelText('Warning starts at'), { target: { value: '2000' } });
    expect(onSettingsChange).not.toHaveBeenCalled();
    expect(screen.getByText('Thresholds should increase from Healthy to Warning to Critical.')).toBeInTheDocument();
    // The input itself still reflects what was typed, even though it wasn't persisted.
    expect((screen.getByLabelText('Warning starts at') as HTMLInputElement).value).toBe('2000');
  });

  it('persists the corrected value once a multi-keystroke edit becomes ascending again', () => {
    const onSettingsChange = vi.fn();
    render(
      <SettingsModal
        isOpen={true}
        onClose={vi.fn()}
        settings={{ ...defaultSettings, fileSizeThresholds: { healthy: 500, warning: 1000, critical: 1500 } }}
        onSettingsChange={onSettingsChange}
      />
    );
    const criticalInput = screen.getByLabelText('Critical starts at');
    // Simulate typing "5" then "50" then "500" (transiently invalid, since 500 < warning=1000)
    // then "5000" (valid again) — the field must never get stuck reverting to the last-saved value.
    fireEvent.change(criticalInput, { target: { value: '5' } });
    fireEvent.change(criticalInput, { target: { value: '50' } });
    fireEvent.change(criticalInput, { target: { value: '500' } });
    expect(onSettingsChange).not.toHaveBeenCalled();
    expect((criticalInput as HTMLInputElement).value).toBe('500');
    fireEvent.change(criticalInput, { target: { value: '5000' } });
    expect(onSettingsChange).toHaveBeenCalledWith('fileSizeThresholds', { healthy: 500, warning: 1000, critical: 5000 });
    expect((criticalInput as HTMLInputElement).value).toBe('5000');
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
