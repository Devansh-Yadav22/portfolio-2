import { useEffect } from 'react';
import { HiddenCellFact } from '../content/hiddenCells';

interface HiddenCellModalProps {
  fact: HiddenCellFact | null;
  foundCount: number;
  totalCount: number;
  onClose: () => void;
}

export function HiddenCellModal({
  fact,
  foundCount,
  totalCount,
  onClose,
}: HiddenCellModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (fact) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fact, onClose]);

  return (
    <>
      {/* Target Item D: 5 tiny hex outlines in a fixed corner that fill with honey when found, NO text */}
      <div
        className="fixed bottom-6 right-6 z-40 pointer-events-none flex items-center gap-2 select-none"
        aria-label={`${foundCount} of ${totalCount} lattice records discovered`}
      >
        {Array.from({ length: totalCount }).map((_, i) => {
          const isFound = i < foundCount;

          return (
            <svg
              key={i}
              width="14"
              height="16"
              viewBox="0 0 14 16"
              className="transition-colors duration-300"
            >
              <polygon
                points="7,1 13,4.5 13,11.5 7,15 1,11.5 1,4.5"
                fill={isFound ? '#FFB23E' : 'none'}
                stroke={isFound ? '#FFB23E' : '#7B8794'}
                strokeWidth="1.2"
                opacity={isFound ? '1.0' : '0.4'}
              />
            </svg>
          );
        })}
      </div>

      {/* Fact panel when a hidden cell is clicked */}
      {fact && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Discovered block details"
        >
          <div className="relative w-full max-w-md bg-ink-2 border border-line p-6 text-bone shadow-2xl panel-card">
            <div className="flex items-center justify-between border-b border-line pb-3 mb-4">
              <span className="font-mono text-xs text-honey">
                Record {foundCount} of {totalCount} &bull; {fact.category}
              </span>
              <button
                onClick={onClose}
                className="font-mono text-xs text-mute hover:text-honey focus-visible:outline-honey px-1"
                aria-label="Close record panel"
              >
                [ ESC ]
              </button>
            </div>

            <h3 className="font-serif text-2xl font-normal text-bone mb-3">
              {fact.title}
            </h3>

            <p className="font-serif text-sm text-bone/90 font-light leading-relaxed mb-6">
              {fact.detail}
            </p>

            <div className="pt-3 border-t border-line flex items-center justify-between font-mono text-xs text-mute">
              <span>Lattice ledger archive</span>
              <span>{foundCount} of {totalCount} discovered</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
