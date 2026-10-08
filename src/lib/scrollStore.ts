// High-performance mutable scroll state to decouple 3D animation loop from React renders
export interface ScrollState {
  progress: number;
  velocity: number;
  scrollY: number;
}

export const scrollState: ScrollState = {
  progress: 0,
  velocity: 0,
  scrollY: 0,
};

export function updateScroll(progress: number, velocity: number, scrollY: number) {
  scrollState.progress = Math.max(0, Math.min(1, progress));
  scrollState.velocity = velocity;
  scrollState.scrollY = scrollY;
}
