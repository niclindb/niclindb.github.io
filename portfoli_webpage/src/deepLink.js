import { sections } from './content';

// Links that open a section straight away, so a visitor arriving from one of
// Nick's apps lands on it instead of the bubble menu:
//   #web-apps         opens the Web Apps section
//   #bracelet-studio  opens Web Apps and scrolls to Bracelet Studio
// Slugs live in content.js.

// The section (and project inside it) a hash points to, or null
export function parseHash(hash) {
  const slug = decodeURIComponent((hash ?? '').replace(/^#/, '')).trim().toLowerCase();
  if (!slug) return null;
  for (let index = 0; index < sections.length; index += 1) {
    const section = sections[index];
    if (section.slug === slug) return { index, project: null };
    const project = section.projects?.find((p) => p.slug === slug);
    if (project) return { index, project: project.slug };
  }
  return null;
}

// Keep the address bar pointing at the open section, so it can be copied and
// shared. Replaces the history entry, so Back in the browser still leaves the
// site rather than stepping through every section.
export function syncHash(index) {
  if (typeof window === 'undefined') return;
  const { pathname, search, hash } = window.location;
  if (index === null) {
    if (hash) window.history.replaceState(null, '', pathname + search);
    return;
  }
  // Already on this section (maybe on one of its projects): leave it be
  if (parseHash(hash)?.index === index) return;
  window.history.replaceState(null, '', `${pathname}${search}#${sections[index].slug}`);
}
