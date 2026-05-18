import React, { useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Reveal, StaggerChildren } from '../motion/MotionPrimitives.jsx';
import { EASE, STAGGER } from '../motion/tokens.js';

const FAQ = [
  {
    q: 'Is the consultation free?',
    a: 'Consultations are $75, fully credited toward any treatment booked within 30 days.',
  },
  {
    q: 'What happens at my first visit?',
    a: 'You\'ll be greeted at the front, complete a short intake, and meet your practitioner for a 20–30 minute consultation. If you and your practitioner agree on a same-day treatment, you can typically proceed immediately. We close out at the front desk.',
  },
  {
    q: 'How do I prepare for a Botox or filler appointment?',
    a: 'Skip alcohol for 24 hours before, and stop aspirin and other NSAIDs for 7 days where medically appropriate. Arrive without makeup so the treatment area is clean.',
  },
  {
    q: 'What\'s your cancellation policy?',
    a: 'Cancel or reschedule with 24+ hours notice for no charge. Inside 24 hours forfeits the deposit. A no-show is charged the full deposit plus 50% of the booked service.',
  },
  {
    q: 'Are your practitioners licensed?',
    a: 'Every injector on our team is a Florida-licensed RN or MD with current board certification. All treatments are medically supervised.',
  },
  {
    q: 'Do you offer financing?',
    a: 'Yes — we accept CareCredit and Cherry Payments, including 0% APR plans for qualifying applicants. You can apply right at checkout.',
  },
];

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState(null);
  const idBase = useId();

  return (
    <section id="faq" className="border-b border-[#E2D6C3] bg-bone">
      <div className="mx-auto max-w-site px-6 py-20 md:px-10 md:py-24">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal className="font-sans text-[11px] uppercase tracking-eyebrow text-accent-strong">
              Frequently asked
            </Reveal>
            <Reveal
              as="h2"
              delay={0.1}
              className="mt-3 max-w-2xl font-display text-3xl font-medium tracking-tight text-ink-900 md:text-5xl"
            >
              Common questions, answered.
            </Reveal>
          </div>
          <Reveal
            as="p"
            delay={0.2}
            className="max-w-md font-sans text-[15px] leading-relaxed text-ink-700"
          >
            Still have questions? Call the spa at{' '}
            <a href="tel:+18135550142" className="text-ink-900 underline-offset-4 hover:underline">
              (813) 555-0142
            </a>{' '}
            — we'll answer before you book.
          </Reveal>
        </div>

        <StaggerChildren
          as="ul"
          stagger={STAGGER.card}
          delayChildren={0.1}
          className="mt-12 divide-y divide-[#E2D6C3] border-y border-[#E2D6C3]"
        >
          {FAQ.map(({ q, a }, i) => {
            const open = openIdx === i;
            const panelId = `${idBase}-panel-${i}`;
            const headerId = `${idBase}-header-${i}`;
            return (
              <motion.li
                key={q}
                variants={itemVariants}
                className="transition-colors duration-[250ms] hover:bg-[#F3ECE0]/60"
              >
                <h3>
                  <button
                    type="button"
                    id={headerId}
                    aria-controls={panelId}
                    aria-expanded={open}
                    onClick={() => setOpenIdx(open ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-1 py-5 text-left font-sans text-[16px] text-ink-900 transition-colors duration-[250ms] hover:text-accent-strong md:text-[18px]"
                  >
                    <span className="font-display tracking-tight">{q}</span>
                    <motion.span
                      animate={{ rotate: open ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      className="inline-flex"
                    >
                      <ChevronDown
                        className={
                          'h-4 w-4 shrink-0 ' + (open ? 'text-accent-strong' : 'text-ink-500')
                        }
                        strokeWidth={2}
                        aria-hidden
                      />
                    </motion.span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      key="content"
                      id={panelId}
                      role="region"
                      aria-labelledby={headerId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div className="pb-5 pr-8 pl-1 font-sans text-[15px] leading-relaxed text-ink-700">
                        {a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </StaggerChildren>
      </div>
    </section>
  );
}
