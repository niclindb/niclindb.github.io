// Records parallel merge sort as a list of frames for the visualizer.
//
// The array is split into one slice per thread and each thread merge sorts
// its slice. Then neighbouring slices are merged in pairs, halving the number
// of busy threads each round, until one thread merges the two halves. Every
// tick, each busy thread makes one comparison, so the number of frames is the
// parallel running time and the total work is what one thread would do.

// Merges [lo, mid) and [mid, hi) so the bars always read as
// [merged so far | rest of left | rest of right]. Each step compares the
// fronts of the two rests; the smaller moves to the end of the merged part.
// One step per yield, shown before the move so the comparison is visible.
function* merge(a, lo, mid, hi) {
  let k = lo; // front of the left rest
  let r = mid; // front of the right rest
  while (k < r && r < hi) {
    const takeRight = a[r] < a[k];
    yield { lo, hi, merged: k, split: r, compare: [k, r], winner: takeRight ? r : k };
    if (takeRight) {
      const value = a[r];
      a.copyWithin(k + 1, k, r);
      a[k] = value;
      r++;
    }
    k++;
  }
  // Once one side runs out, the other is already in place
}

function* mergeSort(a, lo, hi) {
  if (hi - lo < 2) return;
  const mid = (lo + hi) >> 1;
  yield* mergeSort(a, lo, mid);
  yield* mergeSort(a, mid, hi);
  yield* merge(a, lo, mid, hi);
}

// Splits [0, n) into `parts` nearly equal slices
export function slices(n, parts) {
  return Array.from({ length: parts }, (_, p) => [
    Math.floor((p * n) / parts),
    Math.floor(((p + 1) * n) / parts),
  ]);
}

export function buildTimeline(input, threads) {
  const a = input.slice();
  const frames = [{ values: a.slice(), active: [], phase: 'start', work: 0 }];
  let work = 0;

  // Runs every task one step per tick until all of them are done
  const run = (tasks, phase) => {
    let busy = tasks;
    while (busy.length) {
      const active = [];
      busy = busy.filter((task) => {
        const step = task.gen.next();
        if (step.done) return false;
        work++;
        active.push({ thread: task.thread, ...step.value });
        return true;
      });
      // Each step's move happens at the start of the next one, so this
      // snapshot shows the bars as they were compared
      if (active.length) frames.push({ values: a.slice(), active, phase, work });
    }
  };

  // Each thread sorts its own slice
  let runs = slices(a.length, threads).map(([lo, hi], thread) => ({ lo, hi, thread }));
  run(runs.map((r) => ({ thread: r.thread, gen: mergeSort(a, r.lo, r.hi) })), 'split');

  // Neighbouring runs merge in pairs; the left run's thread does the work
  while (runs.length > 1) {
    const next = [];
    const tasks = [];
    for (let i = 0; i < runs.length; i += 2) {
      const left = runs[i];
      const right = runs[i + 1];
      if (!right) {
        next.push(left);
        continue;
      }
      next.push({ lo: left.lo, hi: right.hi, thread: left.thread });
      tasks.push({ thread: left.thread, gen: merge(a, left.lo, left.hi, right.hi) });
    }
    run(tasks, 'merge');
    runs = next;
  }

  frames.push({ values: a.slice(), active: [], phase: 'done', work });
  return frames;
}

// Ticks a run takes, ignoring the start and end frames
export function ticks(timeline) {
  return timeline.length - 2;
}

export function randomValues(n, random = Math.random) {
  return Array.from({ length: n }, () => 4 + Math.floor(random() * 97));
}
