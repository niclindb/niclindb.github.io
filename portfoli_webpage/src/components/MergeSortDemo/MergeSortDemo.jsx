import { useEffect, useMemo, useState } from 'react';
import { prefersReducedMotion } from '../../motion';
import { buildTimeline, randomValues, ticks } from './timeline';
import './MergeSortDemo.css';

const SIZE = 32;
const THREAD_OPTIONS = [1, 2, 4, 8];
// Milliseconds per step; slow enough by default to follow each write
const SPEEDS = [
  { label: 'Slow', ms: 400 },
  { label: 'Normal', ms: 150 },
  { label: 'Fast', ms: 50 },
];
// One hue per thread, starting from the site's violet accent
const THREAD_HUES = [255, 325, 190, 35, 150, 285, 0, 215];

const threadColor = (thread, alpha = 1) => `hsla(${THREAD_HUES[thread]}, 70%, 58%, ${alpha})`;

function phaseText(frame, threads) {
  const busy = frame.active.length;
  if (frame.phase === 'start') return `${threads === 1 ? '1 thread' : `${threads} threads`} ready`;
  if (frame.phase === 'done') return 'Sorted';
  if (frame.phase === 'split') return `${busy === 1 ? '1 thread sorts' : `${busy} threads sort`} ${threads === 1 ? 'the array' : 'their own slice'}`;
  return `${busy === 1 ? '1 thread merges' : `${busy} threads merge`} ${busy === 1 ? 'two halves' : 'pairs of slices'}`;
}

// Parallel merge sort, one bar per value, coloured by the thread working on it
export default function MergeSortDemo({ initialValues, autoPlay = true }) {
  const [values, setValues] = useState(() => initialValues ?? randomValues(SIZE));
  const [threads, setThreads] = useState(4);
  const [step, setStep] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [playing, setPlaying] = useState(() => autoPlay && !prefersReducedMotion());

  const timeline = useMemo(() => buildTimeline(values, threads), [values, threads]);
  const singleThreadTicks = useMemo(() => ticks(buildTimeline(values, 1)), [values]);
  const last = timeline.length - 1;
  const frame = timeline[Math.min(step, last)];
  const done = step >= last;

  useEffect(() => {
    if (!playing) return undefined;
    if (done) {
      setPlaying(false);
      return undefined;
    }
    const timer = setInterval(() => setStep((s) => Math.min(s + 1, last)), SPEEDS[speed].ms);
    return () => clearInterval(timer);
  }, [playing, done, last, speed]);

  const restart = () => {
    setStep(0);
    setPlaying(true);
  };

  const chooseThreads = (n) => {
    setThreads(n);
    restart();
  };

  const shuffle = () => {
    setValues(randomValues(SIZE));
    restart();
  };

  // Pauses and moves on by one write, to look at each step
  const stepOnce = () => {
    setPlaying(false);
    setStep((s) => (s >= last ? 0 : s + 1));
  };

  const togglePlay = () => {
    if (done) restart();
    else setPlaying((p) => !p);
  };

  // What each bar is doing this tick: inside a thread's range, or just written
  const owner = new Array(values.length).fill(null);
  const written = new Array(values.length).fill(false);
  for (const { thread, lo, hi, index } of frame.active) {
    for (let i = lo; i < hi; i++) owner[i] = thread;
    written[index] = true;
  }

  const total = ticks(timeline);
  const elapsed = Math.min(step, total);
  const speedup = singleThreadTicks / total;

  return (
    <figure className="sort-demo" aria-label="Parallel merge sort visualizer">
      <div
        className="sort-demo__bars"
        style={{ '--tick': `${Math.min(SPEEDS[speed].ms * 0.8, 250)}ms` }}
        role="img" aria-label={`${threads} thread merge sort, ${phaseText(frame, threads).toLowerCase()}`}>
        {frame.values.map((value, i) => {
          const thread = owner[i];
          let background;
          if (frame.phase === 'done') background = 'var(--accent)';
          else if (thread === null) background = 'rgba(35, 36, 77, 0.2)';
          else background = threadColor(thread, written[i] ? 1 : 0.4);
          return (
            <span
              key={i}
              className={`sort-demo__bar${written[i] ? ' sort-demo__bar--hit' : ''}`}
              style={{ height: `${value}%`, background }}
            />
          );
        })}
      </div>

      <figcaption className="sort-demo__status">
        <span className="sort-demo__phase" aria-live="polite">{phaseText(frame, threads)}</span>
        <span className="sort-demo__stats">
          <span><strong>{elapsed}</strong> / {total} steps</span>
          {threads > 1 && (
            <span title={`1 thread takes ${singleThreadTicks} steps`}>
              <strong>{speedup.toFixed(1)}×</strong> vs 1 thread
            </span>
          )}
        </span>
      </figcaption>

      <div className="sort-demo__controls">
        <div className="sort-demo__threads" role="group" aria-label="Threads">
          {THREAD_OPTIONS.map((n) => (
            <button
              key={n}
              type="button"
              aria-pressed={threads === n}
              onClick={() => chooseThreads(n)}
            >
              {n} {n === 1 ? 'thread' : 'threads'}
            </button>
          ))}
        </div>
        <div className="sort-demo__threads" role="group" aria-label="Speed">
          {SPEEDS.map((option, i) => (
            <button
              key={option.label}
              type="button"
              aria-pressed={speed === i}
              onClick={() => setSpeed(i)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className="sort-demo__actions">
          <button type="button" onClick={togglePlay}>
            {playing ? 'Pause' : done ? 'Replay' : 'Play'}
          </button>
          <button type="button" onClick={stepOnce}>Step</button>
          <button type="button" onClick={shuffle}>Shuffle</button>
        </div>
      </div>
    </figure>
  );
}
