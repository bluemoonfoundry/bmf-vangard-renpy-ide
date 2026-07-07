import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FileBlock from './FileBlock';
import { createLabelNode } from '@/test/mocks/sampleData';

const node = createLabelNode({ id: 'block-1', label: 'script.rpy' });

function renderFileBlock(overrides: {
  labelCount?: number;
  onDrillDown?: ReturnType<typeof vi.fn>;
  onOpenEditor?: ReturnType<typeof vi.fn>;
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
  });

  it('applies unselected classes when isSelected=false', () => {
    const { container } = renderFileBlock({ isSelected: false });
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('border-gray-300');
    expect(wrapper.className).toContain('bg-white');
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

  it('drill-down button click does not propagate to the parent div', async () => {
    const onDrillDown = vi.fn();
    const { container } = renderFileBlock({ onDrillDown });
    // Click button then check onDrillDown was called exactly once (not once for button + once for bubbled dblclick)
    await userEvent.click(screen.getByRole('button', { name: 'Drill into labels' }));
    expect(onDrillDown).toHaveBeenCalledTimes(1);
    // Verify double-click on parent still fires separately
    await userEvent.dblClick(container.firstChild as HTMLElement);
    expect(onDrillDown).toHaveBeenCalledTimes(2);
  });
});
