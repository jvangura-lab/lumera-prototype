import React from 'react';
import { BRAND } from './brand.js';

export default function PageHero() {
  return (
    <section id="hero" className="relative overflow-hidden border-b border-[#E2D6C3] bg-gradient-to-b from-bone to-[#F3ECE0]">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-y-0 right-0 w-1/2 opacity-[0.18] bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1400&q=80")',
            maskImage: 'linear-gradient(to left, black 30%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to left, black 30%, transparent 100%)',
          }}
        />
      </div>
      <div className="relative mx-auto max-w-site px-6 py-24 md:px-10 md:py-32">
        <div className="font-sans text-[11px] uppercase tracking-eyebrow text-ink-500">
          <a href="#" className="text-ink-500 no-underline hover:text-ink-700">Home</a>
          <span className="mx-2 text-ink-300">›</span>
          <span className="text-ink-700">Book a visit</span>
        </div>
        <h1 className="mt-5 max-w-4xl font-display text-5xl font-medium tracking-tight text-ink-900 md:text-7xl">
          Book your visit with {BRAND.name}.
        </h1>
        <p className="mt-6 max-w-prose font-sans text-lg leading-relaxed text-ink-700">
          Choose a service, pick a practitioner, and reserve a time — all in one place.
          No phone tag, no third-party redirects. Same care, fewer steps.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 font-sans text-[12px] uppercase tracking-eyebrow text-ink-500">
          <span className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
            Real-time availability
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
            HIPAA-compliant
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
            Reschedule by phone
          </span>
        </div>
      </div>
    </section>
  );
}
