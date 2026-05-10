import React from 'react';
import { useBooking, deriveFlow, stepLabel, STEPS } from '../state/BookingContext.jsx';

export default function ProgressBar() {
  const { state } = useBooking();
  const { path } = deriveFlow(state);
  const visiblePath = path.filter((s) => s !== STEPS.CONFIRMATION);
  if (state.step === STEPS.CONFIRMATION) return null;

  const currentIdx = Math.max(visiblePath.indexOf(state.step), 0);
  const total = visiblePath.length;
  const pct = ((currentIdx + 1) / total) * 100;

  return (
    <div
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={currentIdx + 1}
      aria-label={`Step ${currentIdx + 1} of ${total}: ${stepLabel(state.step)}`}
      className="px-5 pt-3 pb-2 bg-cream-50/80"
    >
      <div className="flex items-center justify-between text-[10px] text-ink-500 mb-1.5">
        <span className="uppercase tracking-[0.16em]">{stepLabel(state.step)}</span>
        <span className="num">Step {currentIdx + 1} of {total}</span>
      </div>
      <div className="h-[3px] bg-cream-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gold-400 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
