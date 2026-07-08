import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import ScreenManager from './ScreenManager';
import type { RenpyScreen } from '@/types';

function makeScreen(overrides: Partial<RenpyScreen> = {}): RenpyScreen {
  return {
    name: 'main_menu',
    parameters: '',
    definedInBlockId: 'block-1',
    line: 1,
    ...overrides,
  };
}

describe('ScreenManager', () => {
  it('shows empty state message when screens map is empty', () => {
    render(<ScreenManager screens={new Map()} onFindDefinition={vi.fn()} />);
    expect(screen.getByText('No screens defined yet.')).toBeInTheDocument();
  });

  it('renders screen names alphabetically', () => {
    const screens = new Map<string, RenpyScreen>([
      ['zeta_screen', makeScreen({ name: 'zeta_screen' })],
      ['alpha_screen', makeScreen({ name: 'alpha_screen' })],
      ['mid_screen', makeScreen({ name: 'mid_screen' })],
    ]);
    render(<ScreenManager screens={screens} onFindDefinition={vi.fn()} />);
    const names = screen.getAllByText(/_screen$/).map((el) => el.textContent);
    expect(names).toEqual(['alpha_screen', 'mid_screen', 'zeta_screen']);
  });

  it('shows parameters line when screen has parameters', () => {
    const screens = new Map<string, RenpyScreen>([
      ['stats', makeScreen({ name: 'stats', parameters: '(msg="Hello")' })],
    ]);
    render(<ScreenManager screens={screens} onFindDefinition={vi.fn()} />);
    expect(screen.getByText('(msg="Hello")')).toBeInTheDocument();
  });

  it('omits parameters line when parameters is absent', () => {
    const screens = new Map<string, RenpyScreen>([
      ['stats', makeScreen({ name: 'stats', parameters: '' })],
    ]);
    render(<ScreenManager screens={screens} onFindDefinition={vi.fn()} />);
    expect(screen.getByText('stats')).toBeInTheDocument();
    expect(screen.queryByText(/\(/)).not.toBeInTheDocument();
  });

  it('calls onFindDefinition with screen name when go-to-definition button clicked', async () => {
    const user = userEvent.setup();
    const onFindDefinition = vi.fn();
    const screens = new Map<string, RenpyScreen>([
      ['stats', makeScreen({ name: 'stats' })],
    ]);
    render(<ScreenManager screens={screens} onFindDefinition={onFindDefinition} />);
    await user.click(screen.getByLabelText('Go to definition of stats'));
    expect(onFindDefinition).toHaveBeenCalledWith('stats');
  });
});
