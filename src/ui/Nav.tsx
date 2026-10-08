import { useEffect, useState } from 'react';
import { audioManager } from '../scene/audio';

interface NavProps {
  onOpenConsole: () => void;
  onNavigate: (sectionId: string) => void;
}

export function Nav({ onOpenConsole, onNavigate }: NavProps) {
  const [soundOn, setSoundOn] = useState(false);

  useEffect(() => {
    return audioManager.subscribe((val) => setSoundOn(val));
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-40 px-6 sm:px-12 py-5 flex items-center justify-between pointer-events-none">
      {/* Brand anchor */}
      <button
        onClick={() => onNavigate('root')}
        className="pointer-events-auto font-serif text-sm sm:text-base text-bone hover:text-honey transition-colors focus-visible:outline-honey text-left"
        aria-label="Return to top"
      >
        Devansh Yadav
      </button>

      {/* Subtle actions */}
      <div className="pointer-events-auto flex items-center gap-6 font-mono text-xs text-mute">
        <button
          onClick={() => audioManager.toggleSound()}
          className="hover:text-honey transition-colors hidden sm:flex items-center gap-2 focus-visible:outline-honey"
          aria-label="Toggle ambient audio"
        >
          <span className={`w-1.5 h-1.5 ${soundOn ? 'bg-honey' : 'bg-line'}`} />
          {soundOn ? 'Sound: on' : 'Sound: off'}
        </button>

        <button
          onClick={onOpenConsole}
          className="hover:text-honey transition-colors focus-visible:outline-honey"
          aria-label="Open command palette"
        >
          Console <span className="text-mute/60 hidden sm:inline">(Cmd+K)</span>
        </button>
      </div>
    </nav>
  );
}
