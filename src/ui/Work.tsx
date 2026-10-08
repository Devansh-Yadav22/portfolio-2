import { Project, projects } from '../content/projects';

interface WorkProps {
  onSelectProject: (project: Project) => void;
}

export function Work({ onSelectProject }: WorkProps) {
  return (
    <section id="work" className="relative z-10 w-full">
      {/* Intro section heading */}
      <div className="pt-24 pb-12 px-6 sm:px-12 md:px-20 lg:px-28 max-w-7xl mx-auto">
        <h2 className="font-serif text-3xl sm:text-5xl text-bone font-normal tracking-tight">
          Selected Work
        </h2>
        <p className="font-serif text-base text-mute mt-3 max-w-xl">
          Five things I've built.
        </p>
      </div>

      {/* Pinned 180vh scenes alternating left and right, with NO boxes and NO chips */}
      <div className="relative">
        {projects.map((project, idx) => {
          const isLeft = idx % 2 === 0;

          return (
            <div
              key={project.id}
              id={`project-${project.id}`}
              className="relative h-[180vh]"
            >
              {/* Sticky 100vh viewport container */}
              <div className="sticky top-0 h-screen flex items-center px-6 sm:px-12 md:px-20 lg:px-28 pointer-events-none">
                <div
                  className={`w-full max-w-7xl mx-auto flex ${
                    isLeft ? 'justify-start' : 'justify-end'
                  }`}
                >
                  {/* Narrow column of text sitting directly on the scene */}
                  <div className="w-full max-w-sm sm:max-w-md pointer-events-auto space-y-4">
                    <div className="font-mono text-xs text-mute">
                      {project.year}
                    </div>

                    <h3
                      onClick={() => onSelectProject(project)}
                      className="font-serif text-3xl sm:text-4xl text-bone hover:text-honey cursor-pointer transition-colors font-normal select-text"
                    >
                      {project.title}
                    </h3>

                    <p className="font-serif text-sm sm:text-base text-bone/85 font-light leading-relaxed prose-measure select-text">
                      {project.summary}
                    </p>

                    {/* Plain mono text separated by commas, no bordered chips */}
                    <div className="font-mono text-xs text-mute pt-1 leading-relaxed">
                      {project.stack.join(', ')}
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => onSelectProject(project)}
                        className="font-mono text-xs text-honey hover:underline focus-visible:outline-honey text-left"
                      >
                        Inspect architecture &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
