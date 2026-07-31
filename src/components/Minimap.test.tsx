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
  it('keeps every item within the panel for a wide/short flow-lr-style layout', () => {
    // Default project layout (flow-lr) chains blocks left-to-right, producing
    // exactly this wide/short shape for any non-trivial project. The minimap
    // must always show the whole graph, even blocks currently off-screen in
    // the main canvas -- that's the entire point of an overview minimap.
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
      const left = parseFloat(box.style.left);
      const top = parseFloat(box.style.top);
      const width = parseFloat(box.style.width);
      const height = parseFloat(box.style.height);
      expect(left).toBeGreaterThanOrEqual(0);
      expect(top).toBeGreaterThanOrEqual(0);
      expect(left + width).toBeLessThanOrEqual(MINIMAP_WIDTH + 0.01);
      expect(top + height).toBeLessThanOrEqual(MINIMAP_HEIGHT + 0.01);
    });

    // Distinct block boxes shouldn't collapse onto the same screen position --
    // that's the "only two clusters visible" symptom of the previous bug.
    const distinctLefts = new Set(boxes.map(b => Math.round(parseFloat(b.style.left))));
    expect(distinctLefts.size).toBeGreaterThan(items.length / 2);
  });

  it('renders the same regardless of the current viewport transform (no viewport-follow clipping)', () => {
    const items = makeWideRowItems(20);
    const renderAt = (transform: { x: number; y: number; scale: number }) => {
      const { container } = render(
        <Minimap
          items={items}
          transform={transform}
          canvasDimensions={{ width: 1200, height: 800 }}
          onTransformChange={() => {}}
        />,
      );
      return Array.from(container.querySelectorAll('.rounded-sm')).map(el => (el as HTMLDivElement).style.left);
    };

    const leftsAtOrigin = renderAt({ x: 0, y: 0, scale: 1 });
    const leftsScrolledFarRight = renderAt({ x: -50000, y: 0, scale: 1 });
    expect(leftsScrolledFarRight).toEqual(leftsAtOrigin);
  });
});
