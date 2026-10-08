export const MOTION = {
  easePrimary: 'cubic-bezier(0.22, 1, 0.36, 1)',
  easeSecondary: 'cubic-bezier(0.65, 0, 0.35, 1)',
  duration: {
    micro: 200,
    state: 400,
    structural: 900,
    camera: 1800,
  },
} as const;

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
