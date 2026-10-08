import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import Lenis from 'lenis';
import { Cursor } from './ui/Cursor';
import { Nav } from './ui/Nav';
import { Hero } from './ui/Hero';
import { About } from './ui/About';
import { Work } from './ui/Work';
import { Constellation } from './ui/Constellation';
import { Footer } from './ui/Footer';
import { ProjectPanel } from './ui/ProjectPanel';
import { Console } from './ui/Console';
import { HiddenCellModal } from './ui/HiddenCellModal';
import { Project } from './content/projects';
import { HIDDEN_CELLS, HiddenCellFact } from './content/hiddenCells';
import { updateScroll } from './lib/scrollStore';

// Code-split 3D WebGL scene
const Lattice = lazy(() => import('./scene/Lattice').then((m) => ({ default: m.Lattice })));

export function App() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [selectedHiddenFact, setSelectedHiddenFact] = useState<HiddenCellFact | null>(null);
  const [foundCellIds, setFoundCellIds] = useState<number[]>([]);

  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1.0,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', (e: { progress: number; velocity: number }) => {
      updateScroll(e.progress, e.velocity, window.scrollY);
    });

    let animId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      animId = requestAnimationFrame(raf);
    };
    animId = requestAnimationFrame(raf);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsConsoleOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(animId);
      lenis.destroy();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleNavigate = (targetId: string) => {
    if (targetId === 'root') {
      lenisRef.current?.scrollTo(0);
      return;
    }
    const el = document.getElementById(targetId);
    if (el) {
      lenisRef.current?.scrollTo(el);
    }
  };

  const handleSelectHiddenCell = (fact: HiddenCellFact) => {
    setSelectedHiddenFact(fact);
    setFoundCellIds((prev) => (prev.includes(fact.id) ? prev : [...prev, fact.id]));
  };

  return (
    <div className="relative min-h-screen bg-ink text-bone font-serif selection:bg-honey/20 selection:text-honey">
      {/* Signature Honey Lag Cursor */}
      <Cursor />

      {/* Persistent WebGL 3D Hexagonal Lattice Scene */}
      <Suspense
        fallback={
          <div className="fixed inset-0 z-0 bg-ink pointer-events-none">
            <svg
              className="w-full h-full opacity-20"
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="100%"
            >
              <defs>
                <pattern
                  id="hex-fallback"
                  width="48"
                  height="84"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M24 0 L48 14 L48 42 L24 56 L0 42 L0 14 Z M24 84 L48 70 L48 42 L24 28 L0 42 L0 70 Z"
                    fill="none"
                    stroke="#1B2430"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#hex-fallback)" />
            </svg>
          </div>
        }
      >
        <Lattice onSelectHiddenCell={handleSelectHiddenCell} />
      </Suspense>

      {/* Minimal Top Navigation */}
      <Nav
        onOpenConsole={() => setIsConsoleOpen(true)}
        onNavigate={handleNavigate}
      />

      {/* Layered HTML Content */}
      <main className="relative z-10 w-full">
        <Hero />
        <About />
        <Work onSelectProject={setActiveProject} />
        <Constellation />
        <Footer />
      </main>

      {/* Shared-Element Project Detail Panel */}
      <ProjectPanel
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />

      {/* Command Palette & Terminal */}
      <Console
        isOpen={isConsoleOpen}
        onClose={() => setIsConsoleOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* 5 Tiny Corner Hexes & Fact Modal */}
      <HiddenCellModal
        fact={selectedHiddenFact}
        foundCount={foundCellIds.length}
        totalCount={HIDDEN_CELLS.length}
        onClose={() => setSelectedHiddenFact(null)}
      />
    </div>
  );
}

export default App;
