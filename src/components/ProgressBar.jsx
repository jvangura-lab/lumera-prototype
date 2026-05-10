import React from 'react';
import { useBooking, deriveFlow, stepLabel } from '../state/BookingContext.jsx';

export default function ProgressBar() {
  const { state } = useBooking();
  const { path } = deriveFlow(state);
  const visiblePath = path.filter((s) => s !== 'CONFIRMATION');
  const currentIdx = visiblePath.indexOf(state.step);
  if (state.step === 'CONFIRMATION') return null;

  return (
    <div
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={visiblePath.length}
      aria-valuenow={currentIdx >= 0 ? currentIdx + 1 : 1}
      aria-label={`Step ${currentIdx + 1} of ${visiblePath.length}: ${stepLabel(state.step)}`}
      className="px-5 pt-3 pb-2 bg-cream-50/80"
    >
      <div className="flex items-center justify-between text-[10px] text-ink-500 mb-1.5">
        <span className="uppercase tracking-[0.16em]">{stepLabel(state.step)}</span>
        <span className="num">
          Step {Math.max(currentIdx + 1, 1)} of {visiblePath.length}
        </span>
      </div>
      <div className="flex gap-1">
        {visiblePath.map((s, i) => {
          const filled = i <= currentIdx;
          return (
            <div
              key={s + i}
              className={
                'h-1 flex-1 rounded-full transition-colors duration-300 ' +
                (filled ? 'bg-gold-400' : 'bg-cream-200')
              }
            />
          );
        })}
      </div>
    </div>
  );
}
