import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ContentPanel from './ContentPanel';

test('shows the selected section with its stack and neighbours', () => {
  const onNavigate = vi.fn();
  render(<ContentPanel index={1} onClose={() => {}} onNavigate={onNavigate} />);
  expect(screen.getByRole('heading', { name: 'Custom Shopify Extensions' })).toBeInTheDocument();
  expect(screen.getByText('Shopify GraphQL')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /C\+\+ Project/ }));
  expect(onNavigate).toHaveBeenCalledWith(2);
  fireEvent.click(screen.getByRole('button', { name: /About Me/ }));
  expect(onNavigate).toHaveBeenCalledWith(0);
});

test('wraps around and closes with Back or Escape', () => {
  const onClose = vi.fn();
  const onNavigate = vi.fn();
  render(<ContentPanel index={0} onClose={onClose} onNavigate={onNavigate} />);

  fireEvent.keyDown(window, { key: 'ArrowLeft' });
  expect(onNavigate).toHaveBeenCalledWith(4);

  fireEvent.click(screen.getByRole('button', { name: 'Back' }));
  fireEvent.keyDown(window, { key: 'Escape' });
  expect(onClose).toHaveBeenCalledTimes(2);
});

test('lists both degrees in Education', () => {
  render(<ContentPanel index={4} onClose={() => {}} onNavigate={() => {}} />);
  expect(screen.getByText('Michigan State University')).toBeInTheDocument();
  expect(screen.getByText('Northern Michigan University')).toBeInTheDocument();
  expect(screen.getByText('In progress, 2026')).toBeInTheDocument();
});
