import { render } from '@testing-library/react';
import { vi } from 'vitest';
import PopOverlay from './PopOverlay';

test('reveals the card straight away when the canvas animation cannot run', () => {
  // jsdom has no 2D canvas, the same path taken with reduced motion
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
  const onBurst = vi.fn();
  const onDone = vi.fn();
  render(<PopOverlay origin={{ x: 10, y: 10, radius: 20 }} onBurst={onBurst} onDone={onDone} />);
  expect(onBurst).toHaveBeenCalledTimes(1);
  expect(onDone).toHaveBeenCalledTimes(1);
});
