import { render } from '@testing-library/react';
import Minimap from './Minimap';
import type { MinimapItem } from './Minimap';

const MINIMAP_WIDTH = 240;
const MINIMAP_HEIGHT = 180;

function makeWideRowItems(count: number, width = 320, height = 200, spacing = 200): MinimapItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `b${i}`,
    position: { x: i * (width + spacing), y: 0 },
    width,
    height,
    type: 'block' as const,
  }));
}

describe('Minimap', () => {
  it('does not render oversized boxes for a wide/short flow-lr-style layout', () => {
    // Default project layout (flow-lr) chains blocks left-to-right, producing
    // exactly this wide/short shape for any non-trivial project.
    const items = makeWideRowItems(20);
    const { container } = render(
      <Minimap
        items={items}
        transform={{ x: 0, y: 0, scale: 1 }}
        canvasDimensions={{ width: 1200, height: 800 }}
        onTransformChange={() => {}}
      />,
    );

    const boxes = Array.from(container.querySelectorAll('.rounded-sm')) as HTMLDivElement[];
    expect(boxes.length).toBe(items.length);
    boxes.forEach(box => {
      const width = parseFloat(box.style.width);
      const height = parseFloat(box.style.height);
      // A single item must never dominate the minimap panel -- that defeats the
      // purpose of an overview and misrepresents the canvas layout.
      expect(width).toBeLessThanOrEqual(MINIMAP_WIDTH * 0.5);
      expect(height).toBeLessThanOrEqual(MINIMAP_HEIGHT * 0.5);
    });
  });
});
