import React from 'react';
import { Info } from 'lucide-react';
import ScreenChrome from '../components/ScreenChrome.jsx';
import { PrimaryButton } from '../components/Button.jsx';
import { useBooking, STEPS, BOOKING_TYPES } from '../state/BookingContext.jsx';
import { findServiceById, findSeriesById } from '../mockData.js';

export default function ClarifyConsultScreen() {
  const { state, actions } = useBooking();
  const isSeries = state.bookingType === BOOKING_TYPES.SERIES;
  const series = isSeries && state.seriesId ? findSeriesById(state.seriesId) : null;
  const service = state.serviceId ? findServiceById(state.serviceId) : null;

  const itemLabel = isSeries
    ? `${series?.name || 'This series'} series`
    : (service?.name || 'This service');
  const followOn = isSeries ? 'schedule the series' : 'schedule the procedure';
  const explainer = isSeries
    ? `${itemLabel} requires a consultation first. We'll book your consultation now; you can ${followOn} after we meet.`
    : `${itemLabel} requires a consultation first. We'll book your consultation now; you can ${followOn} after we meet.`;

  return (
    <ScreenChrome
      title="Consultation first."
      subtitle={explainer}
      footer={<PrimaryButton onClick={() => actions.goTo(STEPS.CONSULT_FORMAT)}>Book my consultation</PrimaryButton>}
    >
      <div className="rounded-xl border border-cream-200 bg-cream-50 p-3 flex gap-2.5 text-sm leading-relaxed text-ink-700">
        <Info className="w-4 h-4 mt-0.5 text-gold-500 flex-shrink-0" />
        <div>
          A consultation lets your practitioner assess what's right for you before any treatment.
          You'll only be charged the consultation fee today; nothing else is committed.
        </div>
      </div>
    </ScreenChrome>
  );
}
