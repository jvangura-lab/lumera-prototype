import React from 'react';
import { motion } from 'framer-motion';
import { PRACTITIONERS } from '../mockData.js';
import Tooltip from '../components/Tooltip.jsx';
import { Reveal, StaggerChildren } from '../motion/MotionPrimitives.jsx';
import { EASE, STAGGER } from '../motion/tokens.js';

// Curated Unsplash portrait URLs paired to the funnel's practitioners
// (synced names/credentials/specialties per Phase 2 decision 3).
const PORTRAITS = {
  chen:     'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&h=720&q=80',
  martinez: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&h=720&q=80',
  reyes:    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&h=720&q=80',
  park:     'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&h=720&q=80',
  brooks:   'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&h=720&q=80',
};

const CREDENTIAL_LABELS = {
  MD: 'Doctor of Medicine',
  RN: 'Registered Nurse',
  BSN: 'Bachelor of Science in Nursing',
  LE: 'Licensed Esthetician',
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export default function TeamSection() {
  return (
    <section id="team" className="border-b border-[#E2D6C3] bg-bone">
      <div className="mx-auto max-w-site px-6 py-20 md:px-10 md:py-28">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal className="font-sans text-[11px] uppercase tracking-eyebrow text-accent-strong">
              Your practitioners
            </Reveal>
            <Reveal
              as="h2"
              delay={0.1}
              className="mt-3 max-w-2xl font-display text-3xl font-medium tracking-tight text-ink-900 md:text-5xl"
            >
              The team you'll meet.
            </Reveal>
          </div>
          <Reveal
            as="p"
            delay={0.2}
            className="max-w-md font-sans text-[15px] leading-relaxed text-ink-700"
          >
            Every member is licensed, insured, and continuously trained. Below are the
            practitioners available for the services in your booking.
          </Reveal>
        </div>

        <StaggerChildren
          stagger={STAGGER.card}
          delayChildren={0.15}
          className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3"
        >
          {PRACTITIONERS.map((p) => (
            <motion.article key={p.id} variants={cardVariants} className="group flex flex-col">
              <div className="relative aspect-[5/6] overflow-hidden bg-[#F3ECE0] shadow-soft">
                <img
                  src={PORTRAITS[p.id]}
                  alt={`${p.name}, ${p.credentials}`}
                  className="h-full w-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.05]"
                  loading="lazy"
                  style={{ willChange: 'transform' }}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-accent-strong/15 via-transparent to-transparent opacity-0 transition-opacity duration-[250ms] group-hover:opacity-100" />
              </div>
              <div className="mt-5">
                <div className="font-display text-2xl font-medium leading-tight text-ink-900">
                  {p.name}
                </div>
                <div className="mt-1 font-sans text-[12px] uppercase tracking-eyebrow text-accent-strong">
                  <CredentialList credentials={p.credentials} />
                </div>
                <p className="mt-3 font-sans text-[15px] leading-relaxed text-ink-700">
                  {p.bio}
                </p>
                <div className="mt-4 font-sans text-[12px] leading-relaxed text-ink-500">
                  <span className="font-sans text-[10px] uppercase tracking-eyebrow text-ink-500">
                    Treats:
                  </span>{' '}
                  {p.specialties.join(' · ')}
                </div>
              </div>
            </motion.article>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}

function CredentialList({ credentials }) {
  // Split on comma so "RN, BSN" yields two tokens, each tooltipped.
  const tokens = credentials.split(',').map((t) => t.trim()).filter(Boolean);
  return (
    <>
      {tokens.map((tok, i) => {
        const label = CREDENTIAL_LABELS[tok];
        return (
          <React.Fragment key={`${tok}-${i}`}>
            {i > 0 && <span className="mx-1">,</span>}
            {label ? (
              <Tooltip label={label}>{tok}</Tooltip>
            ) : (
              <span>{tok}</span>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
}
