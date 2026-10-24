import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ContentPanel from './ContentPanel';

test('shows the selected section with its stack and neighbours', () => {
  const onNavigate = vi.fn();
  render(<ContentPanel index={1} onClose={() => {}} onNavigate={onNavigate} />);
  expect(screen.getByRole('heading', { name: 'Custom Shopify Extensions' })).toBeInTheDocument();
  expect(screen.getByText('Shopify GraphQL')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /C\+\+ Project/ }));
  expect(onNavigate).toHaveBeenCalledWith(2, 'next');
  fireEvent.click(screen.getByRole('button', { name: /About Me/ }));
  expect(onNavigate).toHaveBeenCalledWith(0, 'prev');
});

test('wraps around and closes with Back or Escape', () => {
  const onClose = vi.fn();
  const onNavigate = vi.fn();
  render(<ContentPanel index={0} onClose={onClose} onNavigate={onNavigate} />);

  fireEvent.keyDown(window, { key: 'ArrowLeft' });
  expect(onNavigate).toHaveBeenCalledWith(4, 'prev');

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

test('slides in from the side when moving between sections', () => {
  render(<ContentPanel index={2} entrance="next" onClose={() => {}} onNavigate={() => {}} />);
  expect(screen.getByRole('dialog')).toHaveClass('panel--next');
});

test('shows the merge sort visualizer in the C++ project', () => {
  render(<ContentPanel index={2} onClose={() => {}} onNavigate={() => {}} />);
  expect(screen.getByRole('figure', { name: 'Parallel merge sort visualizer' })).toBeInTheDocument();
});

test('opens as a dialog with focus on the section heading', () => {
  render(<ContentPanel index={3} onClose={() => {}} onNavigate={() => {}} />);
  expect(screen.getByRole('dialog', { name: 'Skills' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Skills' })).toHaveFocus();
});

test('keeps focus on the arrow used to move between sections', () => {
  render(<ContentPanel index={2} entrance="next" onClose={() => {}} onNavigate={() => {}} />);
  expect(screen.getByRole('button', { name: /Skills/ })).toHaveFocus();
});

test('Tab cycles inside the open section', () => {
  render(<ContentPanel index={0} onClose={() => {}} onNavigate={() => {}} />);
  const buttons = screen.getAllByRole('button');
  buttons[buttons.length - 1].focus();
  fireEvent.keyDown(window, { key: 'Tab' });
  expect(screen.getByRole('button', { name: 'Back' })).toHaveFocus();
  fireEvent.keyDown(window, { key: 'Tab', shiftKey: true });
  expect(buttons[buttons.length - 1]).toHaveFocus();
});

test('leads About Me with work experience', () => {
  render(<ContentPanel index={0} onClose={() => {}} onNavigate={() => {}} />);
  expect(screen.getByText('Web Developer Intern · Shumaker Tech Group')).toBeInTheDocument();
  expect(screen.getByText(/inventory app for moving stock/)).toBeInTheDocument();
});
