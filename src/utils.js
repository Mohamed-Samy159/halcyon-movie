export const FONT = "'Big Shoulders Display','Arial Narrow',Impact,sans-serif";

/* tiny deterministic random so seat maps and poster art stay stable */
export const hash = (s) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};
export const rnd = (s) => (hash(String(s)) % 10000) / 10000;

export const runtime = (m) => Math.floor(m / 60) + 'h ' + (m % 60) + 'm';

export const reduced = () =>
  !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
