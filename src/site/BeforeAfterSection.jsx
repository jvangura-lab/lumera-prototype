import React from 'react';

// LUMERA-NOTE: These are stock Unsplash portraits used as visual
// placeholders for before/after composition. Replace with real
// patient photos (with signed written-consent forms on file)
// before production launch. When real photos return, re-add the
// "All featured patients have provided written consent." line to
// the disclaimer below.
const PAIRS = [
  {
    treatment: 'Botox · 2 weeks post-treatment',
    before:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&h=720&q=80',
    after:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&h=720&q=80',
  },
  {
    treatment: 'HydraFacial · 1 week post-treatment',
    before:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&h=720&q=80',
    after:
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&h=720&q=80',
  },
  {
    treatment: 'Microneedling · 6 weeks post-treatment',
    before:
      'https://images.unsplash.com/photo-1542596594-649edbc13630?auto=format&fit=crop&w=600&h=720&q=80',
    after:
      'https://images.unsplash.com/photo-1546961342-1633ee6cccf3?auto=format&fit=crop&w=600&h=720&q=80',
  },
];

export default function BeforeAfterSection() {
  return (
    <section id="gallery" className="border-b border-[#E2D6C3] bg-bone">
      <div className="mx-auto max-w-site px-6 py-20 md:px-10 md:py-24">
        <div className="max-w-3xl">
          <div className="font-sans text-[11px] uppercase tracking-eyebrow text-accent-strong">
            Before &amp; after
          </div>
          <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink-900 md:text-5xl">
            Results, honestly shown.
          </h2>
          <p className="mt-4 max-w-prose font-sans text-[15px] leading-relaxed text-ink-700">
            Subtle changes by design. Our injectors aim for a refreshed version of you —
            not a different face.
          </p>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {PAIRS.map((pair) => (
            <figure key={pair.treatment} className="flex flex-col">
              <div className="grid grid-cols-2 gap-1.5 overflow-hidden rounded-sm">
                <PhotoCard label="Before" src={pair.before} />
                <PhotoCard label="After"  src={pair.after} />
              </div>
              <figcaption className="mt-4 font-sans text-[12px] uppercase tracking-eyebrow text-accent-strong">
                {pair.treatment}
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="mt-10 max-w-prose font-sans text-[12px] leading-relaxed text-ink-500">
          Photos shown are representative. Individual results vary.
        </p>
      </div>
    </section>
  );
}

function PhotoCard({ label, src }) {
  return (
    <div className="group relative aspect-[5/6] overflow-hidden bg-[#F3ECE0]">
      <img
        src={src}
        alt={`${label} treatment`}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        loading="lazy"
      />
      <div className="absolute left-2 top-2 rounded-sm bg-ink-900/80 px-2 py-0.5 font-sans text-[10px] uppercase tracking-eyebrow text-bone">
        {label}
      </div>
    </div>
  );
}
