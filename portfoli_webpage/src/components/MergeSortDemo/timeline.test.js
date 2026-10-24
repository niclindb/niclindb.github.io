import { buildTimeline, randomValues, slices, ticks } from './timeline';

const input = [9, 3, 7, 1, 8, 2, 6, 4, 5, 0, 11, 10];
const sorted = [...input].sort((x, y) => x - y);

test.each([1, 2, 3, 4, 8])('sorts with %i threads', (threads) => {
  const timeline = buildTimeline(input, threads);
  expect(timeline[0].values).toEqual(input);
  expect(timeline.at(-1).phase).toBe('done');
  expect(timeline.at(-1).values).toEqual(sorted);
});

test('splits the array into near-equal slices, one per thread', () => {
  expect(slices(10, 4)).toEqual([[0, 2], [2, 5], [5, 7], [7, 10]]);
});

test('never has more busy threads than it was given', () => {
  const values = randomValues(48);
  for (const threads of [1, 2, 4, 8]) {
    for (const frame of buildTimeline(values, threads)) {
      expect(frame.active.length).toBeLessThanOrEqual(threads);
      expect(new Set(frame.active.map((a) => a.thread)).size).toBe(frame.active.length);
    }
  }
});

test('is faster with more threads, but the last merge limits it', () => {
  const values = randomValues(48);
  const one = buildTimeline(values, 1);
  const four = buildTimeline(values, 4);
  // One comparison per step, so one thread's steps are all the work
  expect(ticks(one)).toBe(one.at(-1).work);
  expect(ticks(four)).toBeLessThan(ticks(one) * 0.7);
  // One thread merges the two halves, which takes at least n/2 comparisons
  expect(ticks(four)).toBeGreaterThanOrEqual(24);
});

test('every step compares the fronts of the two halves and picks the smaller', () => {
  for (const frame of buildTimeline(randomValues(32), 4)) {
    for (const { lo, hi, merged, split, compare, winner } of frame.active) {
      expect(compare).toEqual([merged, split]);
      expect(lo <= merged && merged < split && split < hi).toBe(true);
      const [left, right] = compare.map((i) => frame.values[i]);
      expect(frame.values[winner]).toBe(Math.min(left, right));
      // The merged part is sorted and no bigger than either front
      const done = frame.values.slice(lo, merged);
      expect(done).toEqual([...done].sort((x, y) => x - y));
      if (done.length) expect(done.at(-1)).toBeLessThanOrEqual(Math.min(left, right));
    }
  }
});
