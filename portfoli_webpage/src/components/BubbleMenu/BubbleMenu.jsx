import { useEffect, useRef } from 'react';
import { sections } from '../../content';
import './BubbleMenu.css';

// Invisible buttons laid over the 3D bubbles, so the menu works with a
// keyboard and a screen reader. The canvas still handles the mouse; these
// only show a ring around the bubble when focused from the keyboard.
export default function BubbleMenu({ homes, onSelect, onFocusChange, restoreFocusTo = null }) {
  const buttons = useRef([]);

  // After Back, put focus on the bubble the content went back into, but
  // only if nothing else has it (keyboard and screen reader users)
  useEffect(() => {
    if (restoreFocusTo === null) return;
    const active = document.activeElement;
    if (!active || active === document.body) buttons.current[restoreFocusTo]?.focus();
  }, [restoreFocusTo]);

  return (
    <nav className="bubble-menu" aria-label="Sections">
      <ul>
        {sections.map((section, index) => {
          const home = homes[index];
          const style = home && {
            left: home.x - home.radius,
            top: home.y - home.radius,
            width: home.radius * 2,
            height: home.radius * 2,
          };
          return (
            <li key={section.label}>
              <button
                ref={(el) => { buttons.current[index] = el; }}
                type="button"
                className="bubble-menu__button"
                style={style}
                onClick={() => onSelect(index, home ?? centre())}
                // Lift the matching 3D bubble, as hovering does
                onFocus={(e) => onFocusChange?.(isFocusVisible(e.target) ? index : null)}
                onBlur={() => onFocusChange?.(null)}
              >
                <span className="visually-hidden">{section.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function isFocusVisible(el) {
  try {
    return el.matches(':focus-visible');
  } catch {
    return true;
  }
}

// Where to start the pop if the bubbles haven't been laid out yet
function centre() {
  return { x: window.innerWidth / 2, y: window.innerHeight / 2, radius: 80 };
}
