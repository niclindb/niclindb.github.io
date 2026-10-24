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

test('does the same work but in fewer steps with more threads', () => {
  const values = randomValues(48);
  const one = buildTimeline(values, 1);
  const four = buildTimeline(values, 4);
  // Every element written once per level of merging, regardless of threads
  expect(four.at(-1).work).toBeGreaterThan(0);
  expect(ticks(one)).toBe(one.at(-1).work);
  expect(ticks(four)).toBeLessThan(ticks(one) / 2);
  // The final merge is done by one thread, so it can't beat n steps
  expect(ticks(four)).toBeGreaterThan(48);
});
