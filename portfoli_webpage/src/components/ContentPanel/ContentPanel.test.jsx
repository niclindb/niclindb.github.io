import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ContentPanel from './ContentPanel';
import { sections } from '../../content';

const at = (label) => sections.findIndex((s) => s.label === label);

test('shows the selected section with its stack and neighbours', () => {
  const onNavigate = vi.fn();
  render(<ContentPanel index={1} onClose={() => {}} onNavigate={onNavigate} />);
  expect(screen.getByRole('heading', { name: 'Custom Shopify Extensions' })).toBeInTheDocument();
  expect(screen.getByText('Shopify GraphQL')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /See the code on GitHub/ }))
    .toHaveAttribute('href', 'https://github.com/niclindb/Getzs-apps');

  fireEvent.click(screen.getByRole('button', { name: /TypeScript Project/ }));
  expect(onNavigate).toHaveBeenCalledWith(2, 'next');
  fireEvent.click(screen.getByRole('button', { name: /About Me/ }));
  expect(onNavigate).toHaveBeenCalledWith(0, 'prev');
});

test('wraps around and closes with Back or Escape', () => {
  const onClose = vi.fn();
  const onNavigate = vi.fn();
  render(<ContentPanel index={0} onClose={onClose} onNavigate={onNavigate} />);

  fireEvent.keyDown(window, { key: 'ArrowLeft' });
  expect(onNavigate).toHaveBeenCalledWith(sections.length - 1, 'prev');

  fireEvent.click(screen.getByRole('button', { name: 'Back' }));
  fireEvent.keyDown(window, { key: 'Escape' });
  expect(onClose).toHaveBeenCalledTimes(2);
});

test('lists both degrees in Education', () => {
  render(<ContentPanel index={at('Education')} onClose={() => {}} onNavigate={() => {}} />);
  expect(screen.getByText('Michigan State University')).toBeInTheDocument();
  expect(screen.getByText('Northern Michigan University')).toBeInTheDocument();
  expect(screen.getByText('Expected May 2028')).toBeInTheDocument();
});

test('shows honors and relevant coursework in Education', () => {
  render(<ContentPanel index={at('Education')} onClose={() => {}} onNavigate={() => {}} />);
  expect(screen.getByRole('list', { name: 'Honors' })).toHaveTextContent('Dean’s List');
  expect(screen.getByText('Parallel and Distributed Processing')).toBeInTheDocument();
});

test('slides in from the side when moving between sections', () => {
  render(<ContentPanel index={2} entrance="next" onClose={() => {}} onNavigate={() => {}} />);
  expect(screen.getByRole('dialog')).toHaveClass('panel--next');
});

test('shows the merge sort visualizer in the C++ project', () => {
  render(<ContentPanel index={at('C++ Project')} onClose={() => {}} onNavigate={() => {}} />);
  expect(screen.getByRole('figure', { name: 'Parallel merge sort visualizer' })).toBeInTheDocument();
  expect(screen.getByText(/last merge of the two halves runs on one thread/)).toBeInTheDocument();
});

test('opens as a dialog with focus on the section heading', () => {
  render(<ContentPanel index={at('Skills')} onClose={() => {}} onNavigate={() => {}} />);
  expect(screen.getByRole('dialog', { name: 'Skills' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Skills' })).toHaveFocus();
});

test('keeps focus on the arrow used to move between sections', () => {
  render(<ContentPanel index={at('C++ Project')} entrance="next" onClose={() => {}} onNavigate={() => {}} />);
  expect(screen.getByRole('button', { name: /Python Project/ })).toHaveFocus();
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
  expect(screen.getByText('Shumaker Technology Group')).toBeInTheDocument();
  expect(screen.getByText(/Web Development Intern/)).toBeInTheDocument();
  expect(screen.getByText(/inventory app for moving stock/)).toBeInTheDocument();
});

test('lists what each job involved and its stack', () => {
  render(<ContentPanel index={0} onClose={() => {}} onNavigate={() => {}} />);
  expect(screen.getByText(/WordPress sites from Figma designs/)).toBeInTheDocument();
  expect(screen.getAllByRole('list', { name: 'Tech stack' })).toHaveLength(3);
  expect(screen.getByText(/ROS 2 for autonomous racing/)).toBeInTheDocument();
});

test('features Top Ledger as the TypeScript project', () => {
  render(<ContentPanel index={at('TypeScript Project')} onClose={() => {}} onNavigate={() => {}} />);
  expect(screen.getByRole('heading', { name: 'Top Ledger' })).toBeInTheDocument();
  expect(screen.getByText('Supabase')).toBeInTheDocument();
});

test('features Bracelet Studio as the Python project', () => {
  render(<ContentPanel index={at('Python Project')} onClose={() => {}} onNavigate={() => {}} />);
  expect(screen.getByRole('heading', { name: 'Bracelet Studio' })).toBeInTheDocument();
  expect(screen.getByText(/Swap out just one color/)).toBeInTheDocument();
  const live = screen.getByRole('link', { name: 'Try the live site' });
  expect(live).toHaveAttribute('href', 'https://bracelet-color-studio-lindberg-dev-projects.vercel.app');
  expect(live).toHaveAttribute('target', '_blank');
  expect(live).toHaveAttribute('rel', expect.stringContaining('noopener'));
});
