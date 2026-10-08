export function Hero() {
  return (
    <header className="relative min-h-[95vh] flex flex-col justify-start pt-[44vh] sm:pt-[40vh] md:pt-[36vh] pb-16 px-6 sm:px-12 md:px-20 lg:px-28 z-10 pointer-events-none select-none">
      <div className="max-w-3xl pointer-events-auto select-text">
        {/* Semantic H1 for screen readers and SEO */}
        <h1 className="sr-only">Devansh Yadav</h1>

        {/* Tagline beneath formed name with clear spacing */}
        <div className="space-y-3">
          <p className="font-serif text-lg sm:text-xl md:text-2xl text-bone/95 font-light leading-relaxed prose-measure">
            Computer Science Engineering student. I build full-stack products, AI tools and blockchain systems.
          </p>

          <p className="font-mono text-xs sm:text-sm text-mute">
            Devansh Yadav &bull; B.Tech CSE (2024 to present), India
          </p>
        </div>
      </div>
    </header>
  );
}
