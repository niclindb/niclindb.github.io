import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import ContactMenu, { EMAIL } from './ContactMenu';

test('opens with the email, a copy button and a mail link', () => {
  render(<ContactMenu />);
  const toggle = screen.getByRole('button', { name: 'Contact Nick' });
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
  fireEvent.click(toggle);
  expect(toggle).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByText(EMAIL)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Copy email' })).toHaveFocus();
  expect(screen.getByRole('link', { name: 'Open in mail app' })).toHaveAttribute('href', `mailto:${EMAIL}`);
});

test('copies the address to the clipboard', async () => {
  const writeText = vi.fn().mockResolvedValue();
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
  render(<ContactMenu />);
  fireEvent.click(screen.getByRole('button', { name: 'Contact Nick' }));
  fireEvent.click(screen.getByRole('button', { name: 'Copy email' }));
  expect(writeText).toHaveBeenCalledWith(EMAIL);
  expect(await screen.findByRole('button', { name: 'Copied!' })).toBeInTheDocument();
});

test('Escape closes the panel without reaching the window', () => {
  const onWindowKey = vi.fn();
  window.addEventListener('keydown', onWindowKey);
  render(<ContactMenu />);
  fireEvent.click(screen.getByRole('button', { name: 'Contact Nick' }));
  fireEvent.keyDown(screen.getByRole('button', { name: 'Copy email' }), { key: 'Escape' });
  expect(screen.queryByText(EMAIL)).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Contact Nick' })).toHaveFocus();
  expect(onWindowKey).not.toHaveBeenCalled();
  window.removeEventListener('keydown', onWindowKey);
});

test('clicking outside closes the panel', () => {
  render(<ContactMenu />);
  fireEvent.click(screen.getByRole('button', { name: 'Contact Nick' }));
  fireEvent.pointerDown(document.body);
  expect(screen.queryByText(EMAIL)).not.toBeInTheDocument();
});
