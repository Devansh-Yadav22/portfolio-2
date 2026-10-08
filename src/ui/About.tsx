import { links } from '../content/links';

export function About() {
  return (
    <section
      id="about"
      className="relative min-h-[80vh] flex flex-col justify-center px-6 sm:px-12 md:px-20 lg:px-28 z-10 py-32"
    >
      <div className="max-w-2xl">
        <h2 className="font-serif text-3xl sm:text-5xl text-bone font-normal tracking-tight mb-8">
          About
        </h2>

        <div className="space-y-6 font-serif text-base sm:text-lg text-bone/90 font-light leading-relaxed prose-measure">
          <p>
            I am a Computer Science Engineering student based in India, focused on full-stack web development, AI-powered products, and blockchain systems.
          </p>

          <p>
            My work centers on distributed architectures—such as bringing up local Hyperledger Fabric networks for supply chain provenance—and building resilient full-stack applications with decoupled APIs and clean state.
          </p>

          <p>
            Currently, I am deepening my study of machine learning foundations, gradient optimization, and distributed systems, following hands-on Java development during my internship at CodSoft.
          </p>

          {/* Music line: fully readable per Item D, no gradient mask */}
          <p className="text-bone/80 text-sm sm:text-base pt-2">
            Beyond engineering, I sing, play acoustic guitar, write poetry and shayari, and collaborate as part of the independent band Fading-Echoes.
            {links.baarishUrl && (
              <>
                {' '}
                <a
                  href={links.baarishUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-honey hover:underline ml-1"
                >
                  Listen to the Baarish cover
                </a>
                .
              </>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
