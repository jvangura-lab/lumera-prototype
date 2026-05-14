import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useBooking, STEPS } from '../state/BookingContext.jsx';

export default function ScreenChrome({ title, subtitle, eyebrow, children, footer, hideBack = false }) {
  const { state, actions } = useBooking();
  const canBack = !hideBack
    && state.history.length > 0
    && state.step !== STEPS.BOOKING_TYPE
    && state.step !== STEPS.CONFIRMATION;

  return (
    <div className="fade-in-up">
      {canBack && (
        <button
          type="button"
          onClick={actions.back}
          className="mb-6 inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-eyebrow text-ink-500 transition-colors hover:text-ink-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
          Back
        </button>
      )}
      {eyebrow && (
        <div className="mb-3 font-sans text-[11px] uppercase tracking-eyebrow text-accent-strong">
          {eyebrow}
        </div>
      )}
      {title && (
        <h1 className="font-display text-4xl font-medium leading-tight tracking-tight text-ink-900 md:text-5xl">
          {title}
        </h1>
      )}
      {subtitle && (
        <p className="mt-4 max-w-prose font-sans text-base leading-relaxed text-ink-700 md:text-lg">
          {subtitle}
        </p>
      )}
      <div className="mt-10 space-y-4">{children}</div>
      {footer && <div className="mt-10">{footer}</div>}
    </div>
  );
}
