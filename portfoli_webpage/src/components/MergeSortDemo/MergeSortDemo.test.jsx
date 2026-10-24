import { render, screen, fireEvent, act } from '@testing-library/react';
import { vi } from 'vitest';
import MergeSortDemo from './MergeSortDemo';

const values = [40, 10, 90, 30, 70, 20, 80, 60];
const stepCount = () => Number(document.querySelector('.sort-demo__stats strong').textContent);

afterEach(() => vi.useRealTimers());

test('runs to the end and reports the speedup', () => {
  vi.useFakeTimers();
  render(<MergeSortDemo initialValues={values} />);
  expect(screen.getByText('4 threads ready')).toBeInTheDocument();
  expect(screen.getByText(/vs 1 thread/)).toBeInTheDocument();

  act(() => vi.advanceTimersByTime(20000));
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

test('with one thread, each step names the two values compared', () => {
  render(<MergeSortDemo initialValues={values} autoPlay={false} />);
  fireEvent.click(screen.getByRole('button', { name: '1 thread' }));
  fireEvent.click(screen.getByRole('button', { name: 'Step' }));
  // The first merge compares 40 and 10
  expect(screen.getByText('Compare 40 and 10: 10 is smaller, so it moves into the merged part')).toBeInTheDocument();
  expect(document.querySelectorAll('.sort-demo__bar--compared')).toHaveLength(2);
  expect(document.querySelectorAll('.sort-demo__bar--winner')).toHaveLength(1);
});

test('Step pauses and moves on one comparison at a time', () => {
  render(<MergeSortDemo initialValues={values} />);
  fireEvent.click(screen.getByRole('button', { name: 'Step' }));
  expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument();
  expect(stepCount()).toBe(1);
  fireEvent.click(screen.getByRole('button', { name: 'Step' }));
  expect(stepCount()).toBe(2);
});

test('Slow takes longer per step than Fast', () => {
  vi.useFakeTimers();
  render(<MergeSortDemo initialValues={values} />);
  fireEvent.click(screen.getByRole('button', { name: 'Slow' }));
  act(() => vi.advanceTimersByTime(1600));
  expect(stepCount()).toBe(2);
  fireEvent.click(screen.getByRole('button', { name: 'Fast' }));
  act(() => vi.advanceTimersByTime(300));
  expect(stepCount()).toBe(5);
});
