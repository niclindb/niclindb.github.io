import { parseHash, syncHash } from './deepLink';
import { sections } from './content';

const at = (label) => sections.findIndex((s) => s.label === label);

test('every section and project has its own link', () => {
  const slugs = sections.flatMap((s) => [s.slug, ...(s.projects ?? []).map((p) => p.slug)]);
  expect(slugs.every(Boolean)).toBe(true);
  expect(new Set(slugs).size).toBe(slugs.length);
});

test('a section link opens that section', () => {
  expect(parseHash('#web-apps')).toEqual({ index: at('Web Apps'), project: null });
  expect(parseHash('#Skills')).toEqual({ index: at('Skills'), project: null });
});

test('a project link opens its section at that project', () => {
  expect(parseHash('#bracelet-studio')).toEqual({ index: at('Web Apps'), project: 'bracelet-studio' });
  expect(parseHash('#top-ledger')).toEqual({ index: at('Web Apps'), project: 'top-ledger' });
  expect(parseHash('#northern-oasis-camping')).toEqual({ index: at('Web Apps'), project: 'northern-oasis-camping' });
});

test('unknown or empty links leave the bubbles showing', () => {
  expect(parseHash('')).toBeNull();
  expect(parseHash('#')).toBeNull();
  expect(parseHash('#nope')).toBeNull();
});

test('the address bar follows the open section', () => {
  window.history.replaceState(null, '', '/');
  syncHash(at('Skills'));
  expect(window.location.hash).toBe('#skills');
  syncHash(null);
  expect(window.location.hash).toBe('');

  // A project link stays while its section is open
  window.history.replaceState(null, '', '/#bracelet-studio');
  syncHash(at('Web Apps'));
  expect(window.location.hash).toBe('#bracelet-studio');
});
