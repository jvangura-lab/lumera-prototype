import React from 'react';
import { BRAND } from './brand.js';
import { HeroLine } from '../motion/MotionPrimitives.jsx';
import { useHeroParallax } from '../motion/useScrollReveal.js';
import { useKenBurns } from '../motion/useKenBurns.js';
import { useParallaxY } from '../motion/useScrollReveal.js';
import { STAGGER } from '../motion/tokens.js';

const HERO_IMAGE_URL =
  'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1400&q=80';

export default function PageHero() {
  // Background photograph: scroll-tied parallax (lags scroll) + scroll-tied
  // scale on top of an ambient Ken Burns slow zoom.
  const photoParallaxRef = useHeroParallax({
    speed: 0.55,
    range: 180,
    scaleStart: 1.02,
    scaleEnd: 1.08,
  });
  // Ken Burns lives on a child div so its transform doesn't fight the
  // parallax wrapper. The wrapper handles Y + scale-on-scroll, the inner
  // div drifts continuously.
  const kenBurnsRef = useKenBurns({ scale: 1.04, drift: 2.0, duration: 14 });
  // Gradient overlay also parallaxes — slightly faster than the photo
  // so it shears against it, deepening the depth illusion.
  const gradientRef = useParallaxY(0.7, 80);

  return (
    <section
      id="hero"
      className="relative overflow-hidden border-b border-[#E2D6C3] bg-gradient-to-b from-bone to-[#F3ECE0]"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div
          ref={photoParallaxRef}
          className="absolute inset-y-[-12%] right-0 w-1/2 opacity-[0.55]"
          style={{ willChange: 'transform' }}
        >
          <div
            ref={kenBurnsRef}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url("${HERO_IMAGE_URL}")`,
              maskImage: 'linear-gradient(to left, black 30%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to left, black 30%, transparent 100%)',
              willChange: 'transform',
            }}
          />
        </div>
        <div
          ref={gradientRef}
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 75% 30%, rgba(184, 153, 104, 0.10) 0%, rgba(251, 248, 242, 0) 55%)',
            willChange: 'transform',
          }}
        />
      </div>
      <div className="relative mx-auto max-w-site px-6 py-24 md:px-10 md:py-32">
        <HeroLine
          delay={STAGGER.heroSequence.breadcrumb}
          className="font-sans text-[11px] uppercase tracking-eyebrow text-ink-500"
        >
          <a href="#" className="text-ink-500 no-underline hover:text-ink-700">
            Home
          </a>
          <span className="mx-2 text-ink-300">›</span>
          <span className="text-ink-700">Book a visit</span>
        </HeroLine>
        <HeroLine
          as="h1"
          delay={STAGGER.heroSequence.heading}
          className="mt-5 max-w-4xl font-display text-5xl font-medium tracking-tight text-ink-900 md:text-7xl"
        >
          Book your visit with {BRAND.name}.
        </HeroLine>
        <HeroLine
          as="p"
          delay={STAGGER.heroSequence.subhead}
          className="mt-6 max-w-prose font-sans text-lg leading-relaxed text-ink-700"
        >
          Choose a service, pick a practitioner, and reserve a time — all in one place.
          No phone tag, no third-party redirects. Same care, fewer steps.
        </HeroLine>
        <HeroLine
          delay={STAGGER.heroSequence.pills}
          className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 font-sans text-[12px] uppercase tracking-eyebrow text-ink-500"
        >
          {[
            'Real-time availability',
            'HIPAA-compliant',
            'Reschedule by phone',
          ].map((label, i) => (
            <HeroLine
              key={label}
              as="span"
              delay={STAGGER.heroSequence.pills + i * STAGGER.pill}
              className="flex items-center gap-2"
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
              {label}
            </HeroLine>
          ))}
        </HeroLine>
      </div>
    </section>
  );
}
