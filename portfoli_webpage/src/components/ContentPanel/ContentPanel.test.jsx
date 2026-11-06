import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ContentPanel from './ContentPanel';
import { sections } from '../../content';

const at = (label) => sections.findIndex((s) => s.label === label);

test('shows the selected section and its neighbours', () => {
  const onNavigate = vi.fn();
  const index = at('Web Apps');
  render(<ContentPanel index={index} onClose={() => {}} onNavigate={onNavigate} />);
  expect(screen.getByRole('heading', { name: 'Web Apps' })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /C\+\+ Project/ }));
  expect(onNavigate).toHaveBeenCalledWith(index + 1, 'next');
  fireEvent.click(screen.getByRole('button', { name: /About Me/ }));
  expect(onNavigate).toHaveBeenCalledWith(index - 1, 'prev');
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

test('groups every web app under Web Apps', () => {
  render(<ContentPanel index={at('Web Apps')} onClose={() => {}} onNavigate={() => {}} />);
  const names = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent);
  expect(names).toEqual(['Custom Shopify Extensions', 'Top Ledger', 'Bracelet Studio']);
  const labels = sections.map((s) => s.label);
  ['React Project', 'TypeScript Project', 'Python Project'].forEach((old) => expect(labels).not.toContain(old));
});

test('gives each web app its own stack and links', () => {
  render(<ContentPanel index={at('Web Apps')} onClose={() => {}} onNavigate={() => {}} />);
  expect(screen.getByRole('list', { name: 'Top Ledger tech stack' })).toHaveTextContent('Supabase');
  expect(screen.getByRole('list', { name: 'Bracelet Studio tech stack' })).toHaveTextContent('Flask');
  expect(screen.getByRole('list', { name: 'Custom Shopify Extensions tech stack' })).toHaveTextContent('Shopify GraphQL');
  expect(screen.getByText(/Swap out just one color/)).toBeInTheDocument();

  expect(screen.getByRole('link', { name: /See the code on GitHub/ }))
    .toHaveAttribute('href', 'https://github.com/niclindb/Getzs-apps');
  const live = screen.getByRole('link', { name: /Try the live site\s+for Bracelet Studio/ });
  expect(live).toHaveAttribute('href', 'https://bracelet-color-studio.vercel.app');
  expect(live).toHaveAttribute('target', '_blank');
  expect(live).toHaveAttribute('rel', expect.stringContaining('noopener'));
});
