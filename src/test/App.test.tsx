import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '@/App';
import { installElectronAPI, uninstallElectronAPI, createMockElectronAPI } from './mocks/electronAPI';

function stubMatchMedia(prefersDark = false) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: prefersDark && query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

function renderApp() {
  const result = render(<App />);
  return result;
}

describe('App', () => {
  beforeEach(() => {
    stubMatchMedia(false);
    installElectronAPI();
    document.documentElement.className = '';
    document.title = '';
  });

  afterEach(() => {
    uninstallElectronAPI();
    vi.clearAllMocks();
    document.documentElement.className = '';
    document.title = '';
  });

  // ── Smoke ──────────────────────────────────────────────────────────────────

  describe('basic render', () => {
    it('renders without crashing', () => {
      expect(() => renderApp()).not.toThrow();
    });

    it('shows the no-project empty state by default', () => {
      renderApp();
      expect(screen.getByText('No Project Open')).toBeInTheDocument();
    });

    it('shows "New Project" and "Open Project" buttons when electronAPI is present', () => {
      renderApp();
      expect(screen.getByRole('button', { name: /new project/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /open project/i })).toBeInTheDocument();
    });

    it('sets data-app-ready attribute after settings load', async () => {
      renderApp();
      const root = document.querySelector('[data-app-ready]');
      // not yet set synchronously
      expect(root).toBeNull();
      await waitFor(() => {
        expect(document.querySelector('[data-app-ready="true"]')).toBeInTheDocument();
      });
    });
  });

  // ── Window title ───────────────────────────────────────────────────────────

  describe('window title', () => {
    it('is "Vangard Studio" when no project is open', async () => {
      renderApp();
      // title effect fires after render
      await waitFor(() => {
        expect(document.title).toBe('Vangard Studio');
      });
    });
  });

  // ── applyTheme ─────────────────────────────────────────────────────────────

  describe('applyTheme', () => {
    async function renderWithTheme(theme: string) {
      const api = createMockElectronAPI();
      api.getAppSettings.mockResolvedValue({ theme });
      window.electronAPI = api;
      renderApp();
      await waitFor(() => {
        expect(document.querySelector('[data-app-ready="true"]')).toBeInTheDocument();
      });
    }

    it('dark theme: adds "dark" class', async () => {
      await renderWithTheme('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('light theme: adds no theme classes', async () => {
      await renderWithTheme('light');
      expect(document.documentElement.className).toBe('');
    });

    it('solarized-light: adds theme-solarized-light only', async () => {
      await renderWithTheme('solarized-light');
      expect(document.documentElement.classList.contains('theme-solarized-light')).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('solarized-dark: adds dark and theme-solarized-dark', async () => {
      await renderWithTheme('solarized-dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(document.documentElement.classList.contains('theme-solarized-dark')).toBe(true);
    });

    it('colorful: adds dark and theme-colorful', async () => {
      await renderWithTheme('colorful');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(document.documentElement.classList.contains('theme-colorful')).toBe(true);
    });

    it('colorful-light: adds theme-colorful-light only', async () => {
      await renderWithTheme('colorful-light');
      expect(document.documentElement.classList.contains('theme-colorful-light')).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('neon-dark: adds dark and theme-neon-dark', async () => {
      await renderWithTheme('neon-dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(document.documentElement.classList.contains('theme-neon-dark')).toBe(true);
    });

    it('ocean-dark: adds dark and theme-ocean-dark', async () => {
      await renderWithTheme('ocean-dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(document.documentElement.classList.contains('theme-ocean-dark')).toBe(true);
    });

    it('candy-light: adds theme-candy-light only', async () => {
      await renderWithTheme('candy-light');
      expect(document.documentElement.classList.contains('theme-candy-light')).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('forest-light: adds theme-forest-light only', async () => {
      await renderWithTheme('forest-light');
      expect(document.documentElement.classList.contains('theme-forest-light')).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('synthwave: adds dark and theme-synthwave', async () => {
      await renderWithTheme('synthwave');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(document.documentElement.classList.contains('theme-synthwave')).toBe(true);
    });

    it('system with prefers-dark: applies dark class', async () => {
      stubMatchMedia(true);
      const api = createMockElectronAPI();
      api.getAppSettings.mockResolvedValue({ theme: 'system' });
      window.electronAPI = api;
      renderApp();
      await waitFor(() => {
        expect(document.querySelector('[data-app-ready="true"]')).toBeInTheDocument();
      });
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('system with prefers-light: applies no dark class', async () => {
      stubMatchMedia(false);
      const api = createMockElectronAPI();
      api.getAppSettings.mockResolvedValue({ theme: 'system' });
      window.electronAPI = api;
      renderApp();
      await waitFor(() => {
        expect(document.querySelector('[data-app-ready="true"]')).toBeInTheDocument();
      });
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('removes stale theme classes when theme changes', async () => {
      // Start with a dark theme class already on the element
      document.documentElement.classList.add('dark', 'theme-synthwave');
      await renderWithTheme('candy-light');
      expect(document.documentElement.classList.contains('dark')).toBe(false);
      expect(document.documentElement.classList.contains('theme-synthwave')).toBe(false);
      expect(document.documentElement.classList.contains('theme-candy-light')).toBe(true);
    });
  });

  // ── Settings loading ───────────────────────────────────────────────────────

  describe('app settings loading', () => {
    it('applies settings returned by getAppSettings', async () => {
      const api = createMockElectronAPI();
      api.getAppSettings.mockResolvedValue({ theme: 'dark', editorFontSize: 18 });
      window.electronAPI = api;
      renderApp();
      await waitFor(() => {
        expect(document.querySelector('[data-app-ready="true"]')).toBeInTheDocument();
      });
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('handles null from getAppSettings gracefully (uses defaults)', async () => {
      const api = createMockElectronAPI();
      api.getAppSettings.mockResolvedValue(null);
      window.electronAPI = api;
      expect(() => renderApp()).not.toThrow();
      await waitFor(() => {
        expect(document.querySelector('[data-app-ready="true"]')).toBeInTheDocument();
      });
    });

    it('handles getAppSettings rejection gracefully', async () => {
      const api = createMockElectronAPI();
      api.getAppSettings.mockRejectedValue(new Error('IPC failure'));
      window.electronAPI = api;
      renderApp();
      // Should still mark as loaded and not crash
      await waitFor(() => {
        expect(document.querySelector('[data-app-ready="true"]')).toBeInTheDocument();
      });
    });

    it('falls back to localStorage when electronAPI is absent', async () => {
      uninstallElectronAPI();
      localStorage.setItem('renpy-ide-app-settings', JSON.stringify({ theme: 'dark' }));
      renderApp();
      await waitFor(() => {
        expect(document.querySelector('[data-app-ready="true"]')).toBeInTheDocument();
      });
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      localStorage.removeItem('renpy-ide-app-settings');
    });
  });

  // ── Left sidebar ───────────────────────────────────────────────────────────

  describe('left sidebar', () => {
    it('sidebar is visible by default', () => {
      renderApp();
      expect(screen.getByTitle('Collapse Left Sidebar')).toBeInTheDocument();
    });

    it('collapses when the collapse button is clicked', async () => {
      renderApp();
      const collapseBtn = screen.getByTitle('Collapse Left Sidebar');
      fireEvent.click(collapseBtn);
      await waitFor(() => {
        expect(screen.queryByTitle('Collapse Left Sidebar')).not.toBeInTheDocument();
      });
    });

    it('shows expand button when sidebar is collapsed', async () => {
      renderApp();
      fireEvent.click(screen.getByTitle('Collapse Left Sidebar'));
      await waitFor(() => {
        expect(screen.getByTitle('Expand Left Sidebar')).toBeInTheDocument();
      });
    });

    it('re-expands when the expand button is clicked', async () => {
      renderApp();
      fireEvent.click(screen.getByTitle('Collapse Left Sidebar'));
      await waitFor(() => {
        expect(screen.getByTitle('Expand Left Sidebar')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByTitle('Expand Left Sidebar'));
      await waitFor(() => {
        expect(screen.getByTitle('Collapse Left Sidebar')).toBeInTheDocument();
      });
    });

    it('starts on Explorer tab by default', () => {
      renderApp();
      // Explorer button should be present when sidebar is open
      expect(screen.getByRole('button', { name: /explorer/i })).toBeInTheDocument();
    });

    it('can switch to Search tab', () => {
      renderApp();
      const searchTab = screen.getByRole('button', { name: /^search$/i });
      fireEvent.click(searchTab);
      // Search panel content should become visible
      expect(searchTab).toBeInTheDocument();
    });
  });

  // ── No-project empty state ─────────────────────────────────────────────────

  describe('no-project empty state', () => {
    it('shows descriptive subtitle', () => {
      renderApp();
      expect(screen.getByText(/use the file menu or the buttons below/i)).toBeInTheDocument();
    });

    it('does not show recent projects section when list is empty', () => {
      renderApp();
      expect(screen.queryByText(/recent projects/i)).not.toBeInTheDocument();
    });

    it('shows recent projects when settings include them', async () => {
      const api = createMockElectronAPI();
      api.getAppSettings.mockResolvedValue({
        recentProjects: ['/home/user/my-game'],
      });
      window.electronAPI = api;
      renderApp();
      await waitFor(() => {
        expect(screen.getByText(/recent projects/i)).toBeInTheDocument();
      });
      expect(screen.getByText('my-game')).toBeInTheDocument();
    });

    it('clicking New Project opens the project wizard modal', async () => {
      renderApp();
      fireEvent.click(screen.getByRole('button', { name: /new project/i }));
      await waitFor(() => {
        expect(screen.getByText(/create new ren'py project/i)).toBeInTheDocument();
      });
    });

    it('clicking Open Project calls openDirectory IPC', () => {
      renderApp();
      fireEvent.click(screen.getByRole('button', { name: /open project/i }));
      expect(window.electronAPI?.openDirectory).toHaveBeenCalled();
    });
  });
});
