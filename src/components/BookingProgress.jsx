import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useBooking, deriveFlow, stepLabel, STEPS } from '../state/BookingContext.jsx';
import { EASE } from '../motion/tokens.js';

export default function BookingProgress() {
  const { state } = useBooking();
  const activeChipRef = useRef(null);

  useEffect(() => {
    const el = activeChipRef.current;
    if (!el) return;
    const raf = window.requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    });
    return () => window.cancelAnimationFrame(raf);
  }, [state.step]);

  if (state.step === STEPS.CONFIRMATION) return null;
  if (state.step === STEPS.BOOKING_TYPE) return null;

  const { path } = deriveFlow(state);
  const visiblePath = path.filter((s) => s !== STEPS.CONFIRMATION);
  const currentIdx = Math.max(visiblePath.indexOf(state.step), 0);
  const total = visiblePath.length;

  return (
    <div
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={currentIdx + 1}
      aria-valuetext={`Step ${currentIdx + 1} of ${total}: ${stepLabel(state.step)}`}
      aria-label={`Step ${currentIdx + 1} of ${total}: ${stepLabel(state.step)}`}
      className="sticky top-[72px] z-30 border-b border-[#E2D6C3] bg-white/95 backdrop-blur"
    >
      <div className="mx-auto flex max-w-site items-center gap-6 px-6 py-4 md:px-10 overflow-x-auto no-scrollbar">
        <div className="shrink-0 font-sans text-[10px] uppercase tracking-eyebrow text-ink-500 num">
          Step {currentIdx + 1} of {total}
        </div>
        <div className="flex flex-1 items-center gap-3">
          {visiblePath.map((step, i) => {
            const done = i < currentIdx;
            const active = i === currentIdx;
            return (
              <React.Fragment key={step}>
                <div
                  ref={active ? activeChipRef : undefined}
                  className="flex shrink-0 items-center gap-2"
                >
                  <span
                    className={
                      'relative flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold transition-colors duration-[250ms] ' +
                      (done
                        ? 'bg-accent-strong text-bone'
                        : 'border border-ink-300 bg-white text-ink-500')
                    }
                    aria-hidden
                  >
                    {/* The active gold fill is a single motion element with
                        shared layoutId, so it slides between chip positions
                        rather than popping. */}
                    {active && (
                      <motion.span
                        layoutId="booking-progress-active-fill"
                        className="absolute inset-0 rounded-full bg-accent"
                        transition={{ duration: 0.35, ease: EASE }}
                        aria-hidden
                      />
                    )}
                    <span className="relative">
                      {done ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
                    </span>
                  </span>
                  <span
                    className={
                      'font-sans text-[11px] uppercase tracking-eyebrow whitespace-nowrap transition-colors duration-[250ms] ' +
                      (active
                        ? 'text-ink-900 font-semibold'
                        : done
                          ? 'text-ink-700'
                          : 'text-ink-500')
                    }
                  >
                    {stepLabel(step)}
                  </span>
                </div>
                {i < visiblePath.length - 1 && (
                  <span className="h-px min-w-[16px] flex-1 bg-[#E2D6C3]" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
