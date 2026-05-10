import React from 'react';
import { BackButton } from './Button.jsx';
import { useBooking, STEPS } from '../state/BookingContext.jsx';

export default function ScreenChrome({ title, subtitle, eyebrow, children, footer, hideBack = false }) {
  const { state, actions } = useBooking();
  const canBack = !hideBack && state.history.length > 0 && state.step !== STEPS.BOOKING_TYPE && state.step !== STEPS.CONFIRMATION;

  return (
    <div className="px-5 pt-4 pb-5 fade-in-up">
      <div className="min-h-[6px] mb-2">
        {canBack && <BackButton onClick={actions.back} />}
      </div>
      {eyebrow && <div className="text-[10px] uppercase tracking-[0.18em] text-gold-600 mb-1.5">{eyebrow}</div>}
      {title && (
        <h1 className="font-display text-[26px] leading-tight text-espresso-900 mb-1" style={{ fontWeight: 600 }}>
          {title}
        </h1>
      )}
      {subtitle && <p className="text-sm text-ink-500 mb-4 leading-relaxed">{subtitle}</p>}
      <div className="space-y-3">{children}</div>
      {footer && <div className="mt-5">{footer}</div>}
    </div>
  );
}
