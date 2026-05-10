import React, { useState } from 'react';
import ScreenChrome from '../components/ScreenChrome.jsx';
import { PrimaryButton } from '../components/Button.jsx';
import { useBooking, STEPS, BOOKING_TYPES, isConsultFlow } from '../state/BookingContext.jsx';
import { PLACEHOLDERS, FEES } from '../mockData.js';
import { formatPrice } from '../utils/formatting.js';

export default function PolicyScreen() {
  const { state, actions } = useBooking();
  const [ack, setAck] = useState(state.policyAck || false);
  const isSeries = state.bookingType === BOOKING_TYPES.SERIES;
  const sameDay = state.sameDay === true;
  const isConsult = isConsultFlow(state);
  // Card on file applies to non-consult-fee-only flows: returning direct, new-patient consult flow, series.
  // Direct-bookable single visits also save the card on file.
  const cardOnFile = !sameDay; // sameDay path already covers card capture via deposit copy

  const handleContinue = () => {
    if (!ack) return;
    actions.setPolicy(true);
    actions.goTo(STEPS.CHECKOUT);
  };

  const items = [
    <>Cancellations: call <span className="font-medium">{PLACEHOLDERS.spaPhone}</span>.</>,
  ];
  if (sameDay) {
    items.push(
      <>
        <span className="num">{formatPrice(FEES.sameDayDeposit)}</span> deposit is non-refundable but transferable to other approved services.
      </>
    );
  }
  if (cardOnFile) {
    items.push(<>Card on file — the spa bills after your visit.</>);
  }
  if (isSeries) {
    items.push(<>Reschedule individual sessions by calling the spa.</>);
  }

  return (
    <ScreenChrome
      title="Quick policy check."
      footer={<PrimaryButton onClick={handleContinue} disabled={!ack}>Continue</PrimaryButton>}
    >
      <ul className="space-y-2 text-sm text-ink-700">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2">
            <span aria-hidden className="text-gold-500 mt-1">•</span>
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>

      <label
        className={
          'flex items-center gap-2 rounded-lg border p-3 text-sm cursor-pointer transition ' +
          (ack ? 'border-gold-400 bg-blush-100/60' : 'border-cream-200 bg-white')
        }
      >
        <input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} />
        <span>I agree.</span>
      </label>
    </ScreenChrome>
  );
}
