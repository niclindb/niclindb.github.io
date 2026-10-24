import { useEffect, useMemo, useState } from 'react';
import { prefersReducedMotion } from '../../motion';
import { buildTimeline, randomValues, ticks } from './timeline';
import './MergeSortDemo.css';

const SIZE = 32;
const THREAD_OPTIONS = [1, 2, 4, 8];
// Milliseconds per comparison; slow enough by default to read each one
const SPEEDS = [
  { label: 'Slow', ms: 800 },
  { label: 'Normal', ms: 350 },
  { label: 'Fast', ms: 100 },
];
// One hue per thread, starting from the site's violet accent
const THREAD_HUES = [255, 325, 190, 35, 150, 285, 0, 215];

const threadColor = (thread, alpha = 1) => `hsla(${THREAD_HUES[thread]}, 70%, 58%, ${alpha})`;
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

function statusText(frame, threads) {
  if (frame.phase === 'start') return `${plural(threads, 'thread')} ready`;
  if (frame.phase === 'done') return 'Sorted';
  if (frame.active.length === 1) {
    const { compare, winner } = frame.active[0];
    const [left, right] = compare.map((i) => frame.values[i]);
    const smaller = frame.values[winner];
    return `Compare ${left} and ${right}: ${smaller} is smaller, so it moves into the merged part`;
  }
  const what = frame.phase === 'split' ? 'sort their own slices' : 'merge pairs of slices';
  return `${frame.active.length} threads ${what}, each comparing the fronts of two halves`;
}

// What each bar is doing this tick
function barRoles(frame) {
  const roles = frame.values.map(() => ({ thread: null }));
  for (const { thread, lo, hi, merged, split, compare, winner } of frame.active) {
    for (let i = lo; i < hi; i++) {
      roles[i] = { thread, part: i < merged ? 'merged' : i < split ? 'left' : 'right' };
    }
    roles[split].splitStart = true;
    for (const i of compare) roles[i].compared = true;
    roles[winner].winner = true;
  }
  return roles;
}

const PART_ALPHA = { merged: 0.95, left: 0.5, right: 0.25 };

function PlayIcon({ playing, done }) {
  if (playing) return <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />;
  if (done) return <path d="M12 5V2L7 6l5 4V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z" />;
  return <path d="M8 5v14l11-7z" />;
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

  // Pauses and moves on by one comparison, to look at each step
  const stepOnce = () => {
    setPlaying(false);
    setStep((s) => (s >= last ? 0 : s + 1));
  };

  const togglePlay = () => {
    if (done) restart();
    else setPlaying((p) => !p);
  };

  const roles = barRoles(frame);
  const total = ticks(timeline);
  const elapsed = Math.min(step, total);
  const speedup = singleThreadTicks / total;
  const status = statusText(frame, threads);

  return (
    <figure className="sort-demo" aria-label="Parallel merge sort visualizer">
      <div
        className="sort-demo__bars"
        style={{ '--tick': `${Math.min(SPEEDS[speed].ms * 0.6, 250)}ms` }}
        role="img"
        aria-label={`${plural(threads, 'thread')} merge sort. ${status}`}
      >
        {frame.values.map((value, i) => {
          const role = roles[i];
          let background = 'rgba(35, 36, 77, 0.16)';
          if (frame.phase === 'done') background = 'var(--accent)';
          else if (role.thread !== null) {
            background = threadColor(role.thread, role.winner ? 1 : PART_ALPHA[role.part]);
          }
          const classes = ['sort-demo__bar'];
          if (role.compared) classes.push('sort-demo__bar--compared');
          if (role.winner) classes.push('sort-demo__bar--winner');
          if (role.splitStart) classes.push('sort-demo__bar--split');
          return (
            <span key={i} className={classes.join(' ')} style={{ height: `${value}%`, background }} />
          );
        })}
      </div>

      <ul className="sort-demo__legend" aria-hidden="true">
        <li><i className="sort-demo__swatch sort-demo__swatch--merged" />Merged</li>
        <li><i className="sort-demo__swatch sort-demo__swatch--left" />Left half</li>
        <li><i className="sort-demo__swatch sort-demo__swatch--right" />Right half</li>
        <li><i className="sort-demo__swatch sort-demo__swatch--compared" />Compared</li>
      </ul>

      <figcaption className="sort-demo__status">
        <span className="sort-demo__phase" aria-live="polite">{status}</span>
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
        <div className="sort-demo__playback">
          <button type="button" className="sort-demo__play" onClick={togglePlay}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <PlayIcon playing={playing} done={done} />
            </svg>
            {playing ? 'Pause' : done ? 'Replay' : 'Play'}
          </button>
          <button type="button" className="sort-demo__ghost" onClick={stepOnce}>Step</button>
          <button type="button" className="sort-demo__ghost" onClick={shuffle}>Shuffle</button>
        </div>

        <div className="sort-demo__settings">
          <div className="sort-demo__setting">
            <span id="sort-demo-threads">Threads</span>
            <div className="sort-demo__segmented" role="group" aria-labelledby="sort-demo-threads">
              {THREAD_OPTIONS.map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-label={plural(n, 'thread')}
                  aria-pressed={threads === n}
                  onClick={() => chooseThreads(n)}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div className="sort-demo__setting">
            <span id="sort-demo-speed">Speed</span>
            <div className="sort-demo__segmented" role="group" aria-labelledby="sort-demo-speed">
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
          </div>
        </div>
      </div>
    </figure>
  );
}
