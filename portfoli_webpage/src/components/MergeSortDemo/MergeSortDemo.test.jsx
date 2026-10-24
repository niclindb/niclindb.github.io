import { render, screen, fireEvent, act } from '@testing-library/react';
import { vi } from 'vitest';
import MergeSortDemo from './MergeSortDemo';

const values = [40, 10, 90, 30, 70, 20, 80, 60];

afterEach(() => vi.useRealTimers());

test('runs to the end and reports the speedup', () => {
  vi.useFakeTimers();
  render(<MergeSortDemo initialValues={values} />);
  expect(screen.getByText('4 threads ready')).toBeInTheDocument();
  expect(screen.getByText(/vs 1 thread/)).toBeInTheDocument();

  act(() => vi.advanceTimersByTime(10000));
  expect(screen.getByText('Sorted')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Replay' })).toBeInTheDocument();
  const heights = [...document.querySelectorAll('.sort-demo__bar')].map((b) => parseInt(b.style.height, 10));
  expect(heights).toEqual([...values].sort((x, y) => x - y));
});

test('switching to one thread restarts without a speedup', () => {
  render(<MergeSortDemo initialValues={values} autoPlay={false} />);
  fireEvent.click(screen.getByRole('button', { name: '1 thread' }));
  expect(screen.getByRole('button', { name: '1 thread' })).toHaveAttribute('aria-pressed', 'true');
  expect(screen.queryByText(/vs 1 thread/)).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument();
});

test('Step pauses and moves on one write at a time', () => {
  render(<MergeSortDemo initialValues={values} />);
  fireEvent.click(screen.getByRole('button', { name: 'Step' }));
  expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument();
  expect(screen.getByText('1')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Step' }));
  expect(screen.getByText('2')).toBeInTheDocument();
});

test('Slow takes longer per step than Fast', () => {
  vi.useFakeTimers();
  render(<MergeSortDemo initialValues={values} />);
  fireEvent.click(screen.getByRole('button', { name: 'Slow' }));
  act(() => vi.advanceTimersByTime(800));
  expect(screen.getByText('2')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Fast' }));
  act(() => vi.advanceTimersByTime(500));
  expect(screen.getByText('12')).toBeInTheDocument();
});
