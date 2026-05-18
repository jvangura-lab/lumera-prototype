import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { BRAND } from './brand.js';
import { HeroLine } from '../motion/MotionPrimitives.jsx';
import { useHeroParallax } from '../motion/useScrollReveal.js';
import { useKenBurns } from '../motion/useKenBurns.js';
import { useParallaxY } from '../motion/useScrollReveal.js';
import { EASE, STAGGER } from '../motion/tokens.js';

// Larger source so the image stays crisp when full-bleed at full viewport
// height across desktop, retina, and mobile.
const HERO_IMAGE_URL =
  'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=2400&q=85';

export default function PageHero() {
  const reduced = useReducedMotion();
  // Background photograph: scroll-tied parallax + scroll-tied scale on
  // top of an ambient Ken Burns slow zoom.
  const photoParallaxRef = useHeroParallax({
    speed: 0.4,
    range: 320,
    scaleStart: 1.04,
    scaleEnd: 1.14,
  });
  // Ken Burns lives on a child div so its transform doesn't fight the
  // parallax wrapper.
  const kenBurnsRef = useKenBurns({ scale: 1.06, drift: 2.8, duration: 9 });
  // Gradient overlay also parallaxes for depth shear.
  const gradientRef = useParallaxY(0.65, 120);

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden border-b border-[#E2D6C3] bg-bone"
    >
      <div className="absolute inset-0 pointer-events-none">
        {/* Full-bleed photograph. Entrance: fades opacity 0 -> 1 and slides
            a touch from the right, so the cream visibly recedes as the
            image arrives on mount. */}
        <motion.div
          initial={reduced ? false : { opacity: 0, x: 60 }}
          animate={reduced ? undefined : { opacity: 1, x: 0 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.15 }}
          className="absolute inset-0"
        >
          <div
            ref={photoParallaxRef}
            className="absolute inset-y-[-15%] inset-x-0"
            style={{ willChange: 'transform' }}
          >
            <div
              ref={kenBurnsRef}
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url("${HERO_IMAGE_URL}")`,
                willChange: 'transform',
              }}
            />
          </div>
        </motion.div>
        {/* Cream-to-transparent gradient. Left side stays readable for
            text; image dominates the right. On mobile (no md), the
            gradient extends further so the narrower viewport still has
            a clean text gutter. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-bone via-bone/85 to-transparent md:via-bone/75 md:to-bone/0"
        />
        {/* Subtle warm radial accent that parallaxes for depth shear. */}
        <div
          ref={gradientRef}
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 78% 35%, rgba(184, 153, 104, 0.10) 0%, rgba(251, 248, 242, 0) 55%)',
            willChange: 'transform',
          }}
        />
      </div>
      <div className="relative mx-auto w-full max-w-site px-6 py-24 md:px-10 md:py-32">
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
