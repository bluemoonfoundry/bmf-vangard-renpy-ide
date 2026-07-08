import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FileBlock from './FileBlock';
import { createLabelNode } from '@/test/mocks/sampleData';

const node = createLabelNode({ id: 'block-1', label: 'script.rpy' });

function renderFileBlock(overrides: {
  labelCount?: number;
  onDrillDown?: (id: string) => void;
  onOpenEditor?: (id: string, line: number) => void;
  isSelected?: boolean;
  isDimmed?: boolean;
} = {}) {
  const props = {
    node,
    labelCount: overrides.labelCount ?? 3,
    onDrillDown: overrides.onDrillDown ?? vi.fn(),
    onOpenEditor: overrides.onOpenEditor ?? vi.fn(),
    isSelected: overrides.isSelected ?? false,
    isDimmed: overrides.isDimmed ?? false,
  };
  return { ...render(<FileBlock {...props} />), ...props };
}

describe('FileBlock', () => {
  it('renders file name and label count', () => {
    renderFileBlock({ labelCount: 5 });
    expect(screen.getByText('script.rpy')).toBeInTheDocument();
    expect(screen.getByText('5 labels')).toBeInTheDocument();
  });

  it('renders singular label when labelCount is 1', () => {
    renderFileBlock({ labelCount: 1 });
    expect(screen.getByText('1 label')).toBeInTheDocument();
  });

  it('applies selected border and bg classes when isSelected=true', () => {
    const { container } = renderFileBlock({ isSelected: true });
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('border-indigo-500');
    expect(wrapper.className).toContain('bg-indigo-50');
    expect(wrapper.className).not.toContain('border-gray-300');
    expect(wrapper.className).not.toContain('bg-white');
  });

  it('applies unselected classes when isSelected=false', () => {
    const { container } = renderFileBlock({ isSelected: false });
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('border-gray-300');
    expect(wrapper.className).toContain('bg-white');
    expect(wrapper.className).not.toContain('border-indigo-500');
    expect(wrapper.className).not.toContain('bg-indigo-50');
  });

  it('applies dimmed opacity class when isDimmed=true', () => {
    const { container } = renderFileBlock({ isDimmed: true });
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('opacity-20');
    expect(wrapper.className).toContain('pointer-events-none');
  });

  it('applies full opacity when isDimmed=false', () => {
    const { container } = renderFileBlock({ isDimmed: false });
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('opacity-100');
  });

  it('calls onDrillDown with node id when double-clicked', async () => {
    const onDrillDown = vi.fn();
    const { container } = renderFileBlock({ onDrillDown });
    await userEvent.dblClick(container.firstChild as HTMLElement);
    expect(onDrillDown).toHaveBeenCalledWith('block-1');
  });

  it('calls onDrillDown when drill-down button is clicked', async () => {
    const onDrillDown = vi.fn();
    renderFileBlock({ onDrillDown });
    await userEvent.click(screen.getByRole('button', { name: 'Drill into labels' }));
    expect(onDrillDown).toHaveBeenCalledWith('block-1');
  });

  it('calls onOpenEditor when the editor button is clicked', async () => {
    const onOpenEditor = vi.fn();
    renderFileBlock({ onOpenEditor });
    await userEvent.click(screen.getByRole('button', { name: /open/i }));
    expect(onOpenEditor).toHaveBeenCalledWith('block-1', 1);
  });

  it('double-clicking drill-down button does not trigger parent onDoubleClick', async () => {
    const onDrillDown = vi.fn();
    renderFileBlock({ onDrillDown });
    // dblClick fires: click → onClick (×2) + dblclick → parent onDoubleClick
    // The button must stop the dblclick event to prevent a third onDrillDown call
    await userEvent.dblClick(screen.getByRole('button', { name: 'Drill into labels' }));
    expect(onDrillDown).toHaveBeenCalledTimes(2); // once per click, NOT three times
  });
});
