import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles, Hand } from 'lucide-react';
import { Reveal, StaggerChildren, ParallaxLayer } from '../motion/MotionPrimitives.jsx';
import { EASE, STAGGER } from '../motion/tokens.js';

const ITEMS = [
  {
    Icon: ShieldCheck,
    kicker: 'Board-certified',
    title: 'Medical-led aesthetics',
    body: 'Every treatment is overseen by an MD. Our injectors and laser specialists are licensed, insured, and trained in the latest aesthetic techniques.',
  },
  {
    Icon: Sparkles,
    kicker: 'In-house, end-to-end',
    title: 'Book, confirm, check in here',
    body: 'No third-party schedulers, no email tag. Your booking is live the moment you reserve, with confirmation in your inbox seconds later.',
  },
  {
    Icon: Hand,
    kicker: 'Always concierge',
    title: 'Cancellations and changes by phone',
    body: "Need to move a visit? Call (813) 555-0142 and a member of our front-desk team will handle it personally — same day, no scripts.",
  },
];

const pillarVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export default function AboutStrip() {
  return (
    <section className="border-b border-[#E2D6C3] bg-[#F3ECE0]">
      <div className="mx-auto max-w-site px-6 py-16 md:px-10 md:py-20">
        <Reveal className="font-sans text-[11px] uppercase tracking-eyebrow text-accent-strong">
          Why book here
        </Reveal>
        <Reveal
          as="h2"
          delay={0.1}
          className="mt-3 max-w-3xl font-display text-3xl font-medium tracking-tight text-ink-900 md:text-4xl"
        >
          Concierge-level care, without the booking friction.
        </Reveal>
        <StaggerChildren
          stagger={STAGGER.pillar}
          delayChildren={0.2}
          className="mt-12 grid gap-10 md:grid-cols-3 md:gap-12"
        >
          {ITEMS.map(({ Icon, kicker, title, body }) => (
            <motion.div key={kicker} variants={pillarVariants} className="flex flex-col">
              <ParallaxLayer speed={0.78} range={80} className="inline-block">
                <Icon className="h-6 w-6 text-accent-strong" strokeWidth={1.5} />
              </ParallaxLayer>
              <div className="mt-4 font-sans text-[11px] uppercase tracking-eyebrow text-ink-500">
                {kicker}
              </div>
              <div className="mt-1 font-display text-xl font-medium leading-snug text-ink-900">
                {title}
              </div>
              <p className="mt-3 font-sans text-[15px] leading-relaxed text-ink-700">
                {body}
              </p>
            </motion.div>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
