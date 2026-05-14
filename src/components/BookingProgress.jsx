import React from 'react';
import { Check } from 'lucide-react';
import { useBooking, deriveFlow, stepLabel, STEPS } from '../state/BookingContext.jsx';

export default function BookingProgress() {
  const { state } = useBooking();
  const { path } = deriveFlow(state);
  const visiblePath = path.filter((s) => s !== STEPS.CONFIRMATION);
  if (state.step === STEPS.CONFIRMATION) return null;

  const currentIdx = Math.max(visiblePath.indexOf(state.step), 0);
  const total = visiblePath.length;

  return (
    <div
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={currentIdx + 1}
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
                <div className="flex shrink-0 items-center gap-2">
                  <span
                    className={
                      'flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold transition ' +
                      (done
                        ? 'bg-accent-strong text-bone'
                        : active
                          ? 'bg-accent text-bone'
                          : 'border border-ink-300 bg-white text-ink-500')
                    }
                    aria-hidden
                  >
                    {done ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
                  </span>
                  <span
                    className={
                      'font-sans text-[11px] uppercase tracking-eyebrow whitespace-nowrap ' +
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
