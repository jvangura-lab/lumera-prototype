import React from 'react';
import BookingProgress from './BookingProgress.jsx';
import { BOOKING_ANCHOR_ID } from '../site/brand.js';
import { useBooking, STEPS } from '../state/BookingContext.jsx';

export default function BookingSection({ children }) {
  const { state } = useBooking();
  const isConfirmation = state.step === STEPS.CONFIRMATION;
  return (
    <>
      {!isConfirmation && <BookingProgress />}
      <section
        id={BOOKING_ANCHOR_ID}
        className="bg-bone scroll-mt-[140px]"
      >
        <div className="mx-auto w-full max-w-3xl px-6 py-16 md:px-10 md:py-24">
          {children}
        </div>
      </section>
    </>
  );
}
