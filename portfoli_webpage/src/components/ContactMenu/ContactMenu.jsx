import { useEffect, useRef, useState } from 'react';
import './ContactMenu.css';

export const EMAIL = 'nicklindberg0@gmail.com';

const mailIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M0 3v18h24V3H0zm21.518 2L12 12.713 2.482 5h19.036zM2 19V7.183l10 8.104 10-8.104V19H2z"/>
  </svg>
);

export default function ContactMenu() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const rootRef = useRef(null);
  const toggleRef = useRef(null);
  const copyRef = useRef(null);

  // Clicking anywhere else closes the panel
  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    copyRef.current?.focus();
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
    } catch {
      // No clipboard access, so select the address for a manual copy
      const range = document.createRange();
      range.selectNodeContents(rootRef.current.querySelector('.contact__email'));
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
    }
  };

  // Escape closes only this panel, not an open section behind it
  const onKeyDown = (e) => {
    if (e.key === 'Escape' && open) {
      e.stopPropagation();
      setOpen(false);
      toggleRef.current?.focus();
    }
  };

  return (
    <div className="contact" ref={rootRef} onKeyDown={onKeyDown}>
      <button
        ref={toggleRef}
        type="button"
        className="header__social-link header__social-link--primary"
        aria-expanded={open}
        aria-controls="contact-panel"
        aria-label="Contact Nick"
        title="Contact Me"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="header__social-icon" aria-hidden="true">{mailIcon}</span>
        <span className="header__social-text">Contact Me</span>
      </button>

      {open && (
        <div id="contact-panel" className="contact__panel" role="group" aria-label="Contact Nick">
          <p className="contact__heading">Best way to reach me</p>
          <p className="contact__email">{EMAIL}</p>
          <div className="contact__actions">
            <button ref={copyRef} type="button" className="contact__action contact__action--primary" onClick={copy}>
              {copied ? 'Copied!' : 'Copy email'}
            </button>
            <a className="contact__action" href={`mailto:${EMAIL}`}>
              Open in mail app
            </a>
          </div>
          <p className="contact__status" role="status">{copied ? 'Email address copied' : ''}</p>
        </div>
      )}
    </div>
  );
}
