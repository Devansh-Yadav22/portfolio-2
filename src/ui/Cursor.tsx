import { useEffect, useState } from 'react';

export function Cursor() {
  const [lagPos, setLagPos] = useState({ x: -100, y: -100 });
  const [state, setState] = useState<'default' | 'text' | 'interactive' | 'console'>('default');
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detect touch / coarse pointer
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true);
      return;
    }

    let targetX = -100;
    let targetY = -100;

    const handlePointerMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      // Determine cursor state based on target element
      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (target.closest('.console-input') || target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        setState('console');
      } else if (target.closest('button, a, [role="button"], .interactive-cell')) {
        setState('interactive');
      } else if (target.closest('p, h1, h2, h3, span, blockquote')) {
        setState('text');
      } else {
        setState('default');
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    // Smooth lag loop
    let animId: number;
    let currentX = -100;
    let currentY = -100;

    const loop = () => {
      currentX += (targetX - currentX) * 0.22;
      currentY += (targetY - currentY) * 0.22;
      setLagPos({ x: currentX, y: currentY });
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  if (isTouch) return null;

  // Visual size and transform based on state
  let cursorSize = 8;
  let cursorClasses = 'rounded-full bg-honey';

  if (state === 'interactive') {
    cursorSize = 22;
    cursorClasses = 'rounded-full border border-honey bg-honey/20';
  } else if (state === 'text') {
    cursorSize = 4;
    cursorClasses = 'rounded-full bg-honey/60';
  } else if (state === 'console') {
    cursorSize = 14;
    cursorClasses = 'rounded-none bg-honey w-[6px] h-[16px]';
  }

  return (
    <div
      className="pointer-events-none fixed top-0 left-0 z-50 transition-[width,height,background-color] duration-150 ease-out"
      style={{
        transform: `translate3d(${lagPos.x}px, ${lagPos.y}px, 0) translate(-50%, -50%)`,
        width: `${cursorSize}px`,
        height: state === 'console' ? '16px' : `${cursorSize}px`,
      }}
      aria-hidden="true"
    >
      <div className={`w-full h-full ${cursorClasses}`} />
    </div>
  );
}
