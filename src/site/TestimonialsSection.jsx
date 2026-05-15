import React from 'react';
import { Check } from 'lucide-react';

const TESTIMONIALS = [
  {
    quote:
      "I'd put off Botox for years because every place I'd been felt either clinical or like a sales pitch. Lumera's the opposite — Sarah explained everything, and my results look like me, just rested.",
    name: 'Mara K.',
    neighborhood: 'Hyde Park',
    category: 'Injectables',
  },
  {
    quote:
      'The booking is shockingly easy. Picked my time on a Sunday night and had a confirmation in 30 seconds. The HydraFacial itself was the best I\'ve had in Tampa.',
    name: 'Jenny R.',
    neighborhood: 'Davis Islands',
    category: 'Skin Treatments',
  },
  {
    quote:
      "I asked a lot of questions about laser before committing. Dr. Chen took the time, didn't oversell, and the results have been exactly what she described. Worth every dollar.",
    name: 'Priya S.',
    neighborhood: 'South Tampa',
    category: 'Laser',
  },
];

export default function TestimonialsSection() {
  return (
    <section id="reviews" className="border-b border-[#E2D6C3] bg-[#F7F1E4]">
      <div className="mx-auto max-w-site px-6 py-20 md:px-10 md:py-24">
        <div className="max-w-3xl">
          <div className="font-sans text-[11px] uppercase tracking-eyebrow text-accent-strong">
            What patients say
          </div>
          <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink-900 md:text-5xl">
            Quietly raving.
          </h2>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="flex h-full flex-col justify-between border-t border-accent/40 pt-6"
            >
              <blockquote className="font-display text-[20px] italic leading-snug text-ink-900 md:text-[22px]">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 space-y-1.5 font-sans text-[13px] text-ink-700">
                <div className="font-medium text-ink-900">
                  {t.name} &middot;{' '}
                  <span className="text-ink-700 font-normal">{t.neighborhood}</span>
                </div>
                <div className="text-ink-500 text-[12px]">{t.category}</div>
                <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-eyebrow text-accent-strong">
                  <Check className="h-3 w-3" strokeWidth={2.5} aria-hidden />
                  Verified visit
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
