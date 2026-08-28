import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExportMenu from '@/components/ExportMenu';
import { createMockElectronAPI, installElectronAPI, uninstallElectronAPI } from '@/test/mocks/electronAPI';

describe('ExportMenu', () => {
  beforeEach(() => {
    installElectronAPI(createMockElectronAPI());
  });

  afterEach(() => {
    uninstallElectronAPI();
  });

  // userEvent.setup() installs its own navigator.clipboard stub, so the mock
  // must be applied *after* setup() or it gets clobbered.
  function setupUser() {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(window.navigator, 'clipboard', {
      value: { writeText },
      writable: true,
      configurable: true,
    });
    return { user, writeText };
  }

  function setup(overrides: Partial<React.ComponentProps<typeof ExportMenu>> = {}) {
    const getMarkdown = vi.fn(() => '# report');
    const getCSV = vi.fn(() => 'a,b');
    render(
      <ExportMenu getMarkdown={getMarkdown} getCSV={getCSV} filenameBase="report" {...overrides} />
    );
    return { getMarkdown, getCSV };
  }

  it('is closed until the Export button is clicked', () => {
    setup();
    expect(screen.queryByText('Copy to Clipboard')).toBeNull();
  });

  it('opens the popover and lazily builds report text', async () => {
    const { user } = setupUser();
    const { getMarkdown, getCSV } = setup();
    expect(getMarkdown).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: /export/i }));
    expect(screen.getByText('Copy to Clipboard')).toBeTruthy();
    expect(getMarkdown).toHaveBeenCalled();
    expect(getCSV).toHaveBeenCalled();
  });

  it('copies the Markdown text to the clipboard', async () => {
    const { user, writeText } = setupUser();
    setup();
    await user.click(screen.getByRole('button', { name: /export/i }));
    await user.click(screen.getByRole('button', { name: 'Markdown' }));
    expect(writeText).toHaveBeenCalledWith('# report');
  });

  it('copies the CSV text to the clipboard', async () => {
    const { user, writeText } = setupUser();
    setup();
    await user.click(screen.getByRole('button', { name: /export/i }));
    await user.click(screen.getByRole('button', { name: 'CSV' }));
    expect(writeText).toHaveBeenCalledWith('a,b');
  });

  it('saves the Markdown report via the save dialog and fs IPC when a path is chosen', async () => {
    const { user } = setupUser();
    const api = createMockElectronAPI();
    api.showSaveDialog.mockResolvedValue('/tmp/report.md');
    installElectronAPI(api);
    setup();
    await user.click(screen.getByRole('button', { name: /export/i }));
    await user.click(screen.getByRole('button', { name: /Markdown \(\.md\)/ }));
    await waitFor(() => expect(api.writeFile).toHaveBeenCalledWith('/tmp/report.md', '# report', 'utf8'));
  });

  it('does not write a file when the save dialog is canceled', async () => {
    const { user } = setupUser();
    const api = createMockElectronAPI();
    api.showSaveDialog.mockResolvedValue(null);
    installElectronAPI(api);
    setup();
    await user.click(screen.getByRole('button', { name: /export/i }));
    await user.click(screen.getByRole('button', { name: /CSV \(\.csv\)/ }));
    await waitFor(() => expect(api.showSaveDialog).toHaveBeenCalled());
    expect(api.writeFile).not.toHaveBeenCalled();
  });

  it('disables the trigger button when disabled is passed', () => {
    setup({ disabled: true });
    expect(screen.getByRole('button', { name: /export/i })).toBeDisabled();
  });
});
