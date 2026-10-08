import { useEffect } from 'react';
import { Project } from '../content/projects';

interface ProjectPanelProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectPanel({ project, onClose }: ProjectPanelProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (project) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 md:p-12 bg-ink/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-panel-title"
    >
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-ink-2 border border-line p-6 sm:p-10 text-bone shadow-2xl panel-card">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-line pb-6">
          <div>
            <div className="font-mono text-xs text-mute">
              {project.year}
            </div>
            <h2 id="project-panel-title" className="font-serif text-3xl sm:text-4xl font-normal text-bone mt-2">
              {project.title}
            </h2>
            <p className="font-serif text-base text-mute mt-1">
              {project.subtitle}
            </p>
          </div>

          <button
            onClick={onClose}
            className="font-mono text-xs text-mute hover:text-honey border border-line px-3 py-1.5 transition-colors focus-visible:outline-honey"
            aria-label="Close project details"
          >
            [ ESC ]
          </button>
        </div>

        {/* Stack: plain mono text separated by commas per Item C */}
        <div className="py-4 border-b border-line font-mono text-xs text-mute">
          {project.stack.join(', ')}
        </div>

        {/* Content sections: sentence-case mono in --mute per Item C */}
        <div className="py-6 space-y-6 text-sm sm:text-base font-serif font-light leading-relaxed">
          <div>
            <h3 className="font-mono text-xs text-mute mb-2">
              Overview
            </h3>
            <p className="text-bone/90 prose-measure">
              {project.whatItIs}
            </p>
          </div>

          {project.whatShipped && (
            <div>
              <h3 className="font-mono text-xs text-mute mb-2">
                What shipped
              </h3>
              <p className="text-bone/90 prose-measure">
                {project.whatShipped}
              </p>
            </div>
          )}

          {project.engineeringProblem && (
            <div>
              <h3 className="font-mono text-xs text-mute mb-2">
                Engineering challenge
              </h3>
              <p className="text-bone/90 prose-measure">
                {project.engineeringProblem}
              </p>
            </div>
          )}

          {project.accuracyNotice && (
            <div className="p-4 bg-ink border border-line text-xs font-mono text-mute">
              <span className="text-honey font-semibold block mb-1">
                Engineering note:
              </span>
              {project.accuracyNotice}
            </div>
          )}

          {project.liveUrl && (
            <div className="pt-2">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block font-mono text-xs text-honey hover:underline border border-honey/40 px-3 py-2"
              >
                Visit live deployment &rarr;
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
