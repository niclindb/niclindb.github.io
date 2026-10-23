import { useEffect } from 'react';
import { sections } from '../../content';
import SectionContent from './SectionContent';
import './ContentPanel.css';

// Glass card shown over the zoomed-in bubble.
export default function ContentPanel({ index, onClose, onNavigate }) {
  const section = sections[index];
  const prev = (index - 1 + sections.length) % sections.length;
  const next = (index + 1) % sections.length;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate(prev);
      if (e.key === 'ArrowRight') onNavigate(next);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onNavigate, prev, next]);

  return (
    <div className="panel-layer">
      <article key={index} className="panel card" aria-labelledby="panel-title">
        <button type="button" className="panel__back" onClick={onClose}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
          Back
        </button>

        <div className="panel__body">
          <SectionContent section={section} headingId="panel-title" />
        </div>

        <nav className="panel__nav" aria-label="Sections">
          <button type="button" onClick={() => onNavigate(prev)}>
            <span aria-hidden="true">← </span>{sections[prev].label}
          </button>
          <button type="button" onClick={() => onNavigate(next)}>
            {sections[next].label}<span aria-hidden="true"> →</span>
          </button>
        </nav>
      </article>
    </div>
  );
}
