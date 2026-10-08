import { links } from '../content/links';
import { closingContent } from '../content/closing';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const isDev = import.meta.env.DEV;

  const contactItems = [
    { label: 'Email', value: links.email, fallback: 'devansh@example.com (TODO)', href: links.email ? `mailto:${links.email}` : undefined },
    { label: 'GitHub', value: links.github, fallback: 'github.com/devansh-yadav (TODO)', href: links.github || undefined },
    { label: 'LinkedIn', value: links.linkedin, fallback: 'linkedin.com/in/devansh-yadav (TODO)', href: links.linkedin || undefined },
    { label: 'Instagram', value: links.instagram, fallback: '@devansh (TODO)', href: links.instagram || undefined },
    { label: 'Resume', value: links.resume, fallback: '/resume.pdf (TODO)', href: links.resume || undefined },
  ];

  return (
    <footer id="contact" className="relative z-10 w-full pt-32 pb-16 px-6 sm:px-12 md:px-20 lg:px-28 max-w-7xl mx-auto">
      <div className="border-t border-line pt-16">
        {/* Closing Line Slot (Section 8: Dev has not supplied it. Render nothing until filled. Do not invent one.) */}
        {closingContent.shayari.trim() !== '' && (
          <div className="mb-12 font-serif text-xl sm:text-2xl text-bone/90 italic max-w-2xl leading-relaxed">
            {closingContent.shayari}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            {/* Heading per Item C: Contact (no ampersand) */}
            <h2 className="font-serif text-3xl sm:text-4xl text-bone font-normal mb-3">
              Contact
            </h2>
            {/* Plain first-person line per Item C */}
            <p className="font-serif text-base text-mute max-w-md font-light leading-relaxed">
              I'm looking for internships and projects. Write to me.
            </p>
          </div>

          {/* Render all contact links per Item D */}
          <div className="flex flex-col space-y-3 font-mono text-xs sm:text-sm">
            {contactItems.map((item) => {
              const displayVal = item.value || (isDev ? item.fallback : '');
              if (!displayVal) return null;

              if (item.href) {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-mute hover:text-honey transition-colors"
                  >
                    {item.label}: {displayVal}
                  </a>
                );
              }

              return (
                <span key={item.label} className="text-mute/60">
                  {item.label}: {displayVal}
                </span>
              );
            })}
          </div>
        </div>

        {/* Minimal Footer reading only: Devansh Yadav, [year] */}
        <div className="pt-8 border-t border-line flex items-center justify-between font-mono text-xs text-mute">
          <div>
            Devansh Yadav, {currentYear}
          </div>
        </div>
      </div>
    </footer>
  );
}
