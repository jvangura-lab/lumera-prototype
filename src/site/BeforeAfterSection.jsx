import React from 'react';

// LUMERA-NOTE: Production launch requires real consented patient
// photos (signed HIPAA release on file). When real photos return,
// re-add this third sentence to the disclaimer below:
//   "All featured patients have provided written consent."
//
// Drop your composite before/after images at the paths below — each
// image should be a single horizontal composite with "before" on
// the left and "after" on the right (the format the user supplied).
const PAIRS = [
  {
    treatment: 'Dermal filler · Marionette lines',
    src: '/before-after/pair-1.jpg',
    alt: 'Before and after photo: dermal filler treatment around the mouth and chin',
  },
  {
    treatment: 'HydraFacial · Texture & clarity',
    src: '/before-after/pair-2.jpg',
    alt: 'Before and after photo: skin clarity around the eye area',
  },
  {
    treatment: 'Acne protocol · 8 weeks',
    src: '/before-after/pair-3.jpg',
    alt: 'Before and after photo: acne clearing on the cheek',
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
            <figure key={pair.src} className="flex flex-col">
              <div className="group relative overflow-hidden rounded-sm bg-[#F3ECE0]">
                <img
                  src={pair.src}
                  alt={pair.alt}
                  className="block h-auto w-full transition-transform duration-500 group-hover:scale-[1.02]"
                  loading="lazy"
                />
                {/* Before / After labels overlaid on the two halves */}
                <span className="pointer-events-none absolute left-2 top-2 rounded-sm bg-ink-900/80 px-2 py-0.5 font-sans text-[10px] uppercase tracking-eyebrow text-bone">
                  Before
                </span>
                <span className="pointer-events-none absolute right-2 top-2 rounded-sm bg-ink-900/80 px-2 py-0.5 font-sans text-[10px] uppercase tracking-eyebrow text-bone">
                  After
                </span>
                {/* Center divider hint */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-bone/40"
                />
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
