import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import BubbleMenu from './BubbleMenu';

const homes = Array.from({ length: 5 }, (_, i) => ({ x: 100 + i * 200, y: 300, radius: 80 }));

test('offers every bubble as a button', () => {
  const onSelect = vi.fn();
  render(<BubbleMenu homes={homes} onSelect={onSelect} />);
  const nav = screen.getByRole('navigation', { name: 'Sections' });
  expect(nav).toBeInTheDocument();
  expect(screen.getAllByRole('button')).toHaveLength(5);

  fireEvent.click(screen.getByRole('button', { name: 'Skills' }));
  expect(onSelect).toHaveBeenCalledWith(3, homes[3]);
});

test('sits each button over its bubble', () => {
  render(<BubbleMenu homes={homes} onSelect={() => {}} />);
  expect(screen.getByRole('button', { name: 'About Me' })).toHaveStyle({
    left: '20px', top: '220px', width: '160px', height: '160px',
  });
});

test('returns focus to the bubble the content went back into', () => {
  render(<BubbleMenu homes={homes} onSelect={() => {}} restoreFocusTo={2} />);
  expect(screen.getByRole('button', { name: 'C++ Project' })).toHaveFocus();
});
