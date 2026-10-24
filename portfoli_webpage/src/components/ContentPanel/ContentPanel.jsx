import { useEffect, useRef, useState } from 'react';
import { sections } from '../../content';
import { prefersReducedMotion } from '../../motion';
import SectionContent from './SectionContent';
import './ContentPanel.css';

const HOME_BUBBLE_SIZE = 180;

// What was inside a popped bubble, shown over a frosted backdrop.
// entrance is 'pop' after a bubble bursts, or 'next'/'prev' when moving
// between sections. home is where the bubble lives on screen, so that Back
// can shrink the content into a bubble and float it back there.
export default function ContentPanel({ index, entrance = 'pop', home, onClose, onNavigate }) {
  const section = sections[index];
  const prev = (index - 1 + sections.length) % sections.length;
  const next = (index + 1) % sections.length;
  const layerRef = useRef(null);
  const panelRef = useRef(null);
  const bubbleRef = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [closing, setClosing] = useState(false);
  // Read the latest values when Back is pressed, without restarting the
  // animation if the parent re-renders mid-flight
  const homeRef = useRef(home);
  const onCloseRef = useRef(onClose);
  homeRef.current = home;
  onCloseRef.current = onClose;

  const close = () => {
    if (closing) return;
    const panel = panelRef.current;
    if (prefersReducedMotion() || !panel?.animate || !home) {
      onClose();
      return;
    }
    setClosing(true);
  };

  useEffect(() => {
    if (!closing) return undefined;
    const panel = panelRef.current;
    const bubble = bubbleRef.current;
    const home = homeRef.current;
    const box = panel.getBoundingClientRect();
    const fromX = box.left + box.width / 2 - HOME_BUBBLE_SIZE / 2;
    const fromY = box.top + box.height / 2 - HOME_BUBBLE_SIZE / 2;
    const toX = home.x - HOME_BUBBLE_SIZE / 2;
    const toY = home.y - HOME_BUBBLE_SIZE / 2;
    const toScale = (home.radius * 2) / HOME_BUBBLE_SIZE;
    const ease = 'cubic-bezier(0.65, 0, 0.35, 1)';

    const animations = [
      panel.animate(
        [{ transform: 'none', opacity: 1 }, { transform: 'scale(0.15)', opacity: 0 }],
        { duration: 320, easing: 'cubic-bezier(0.5, 0, 0.75, 0)', fill: 'forwards' }
      ),
      layerRef.current.animate(
        [{ backgroundColor: 'rgba(248, 245, 255, 0.78)' }, { backgroundColor: 'rgba(248, 245, 255, 0)' }],
        { duration: 700, easing: 'ease-out', fill: 'forwards' }
      ),
      bubble.animate(
        [
          { transform: `translate(${fromX}px, ${fromY}px) scale(0.2)`, opacity: 0, offset: 0 },
          { transform: `translate(${fromX}px, ${fromY}px) scale(1)`, opacity: 1, offset: 0.35 },
          // Bob up a little on the way, like it's floating
          { transform: `translate(${(fromX + toX) / 2}px, ${Math.min(fromY, toY) - 40}px) scale(${(1 + toScale) / 2})`, opacity: 1, offset: 0.7 },
          { transform: `translate(${toX}px, ${toY}px) scale(${toScale})`, opacity: 1, offset: 1 },
        ],
        { duration: 800, easing: ease, fill: 'forwards' }
      ),
    ];
    // Hand over to the real bubble as this one arrives
    animations[2].finished.then(() => onCloseRef.current()).catch(() => {});
    return () => animations.forEach((a) => a.cancel());
  }, [closing]);

  // Move focus into the content as it appears: to the heading after a pop,
  // or back to the arrow that was used when moving between sections
  useEffect(() => {
    const target = entrance === 'next' ? nextRef.current
      : entrance === 'prev' ? prevRef.current
      : panelRef.current?.querySelector('#panel-title');
    target?.focus({ preventScroll: true });
  }, [index, entrance]);

  useEffect(() => {
    const onKey = (e) => {
      if (closing) return;
      if (e.key === 'Tab') {
        keepFocusInside(e, layerRef.current);
        return;
      }
      if (e.key === 'Escape') close();
      // Leave arrow keys alone when they belong to a form control
      if (e.target.closest?.('input, select, textarea, [contenteditable="true"]')) return;
      if (e.key === 'ArrowLeft') onNavigate(prev, 'prev');
      if (e.key === 'ArrowRight') onNavigate(next, 'next');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div ref={layerRef} className="panel-layer">
      <article
        key={index}
        ref={panelRef}
        className={`panel panel--${entrance}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="panel-title"
      >
        <button type="button" className="panel__back" onClick={close}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
          Back
        </button>

        <div className="panel__body">
          <SectionContent section={section} headingId="panel-title" />
        </div>

        <nav className="panel__nav" aria-label="Sections">
          <button ref={prevRef} type="button" onClick={() => onNavigate(prev, 'prev')}>
            <span aria-hidden="true">← </span>{sections[prev].label}
          </button>
          <button ref={nextRef} type="button" onClick={() => onNavigate(next, 'next')}>
            {sections[next].label}<span aria-hidden="true"> →</span>
          </button>
        </nav>
      </article>
      {closing && (
        <div
          ref={bubbleRef}
          className="panel__home-bubble"
          style={{ width: HOME_BUBBLE_SIZE, height: HOME_BUBBLE_SIZE }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

// Tab and Shift+Tab cycle through the open section instead of reaching the
// hidden page behind it
function keepFocusInside(e, container) {
  if (!container) return;
  const focusable = [...container.querySelectorAll('a[href], button:not([disabled])')];
  if (focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const inside = container.contains(document.activeElement);
  if (e.shiftKey && (!inside || document.activeElement === first)) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && (!inside || document.activeElement === last)) {
    e.preventDefault();
    first.focus();
  }
}
