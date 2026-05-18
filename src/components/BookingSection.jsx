import React from 'react';
import BookingProgress from './BookingProgress.jsx';
import BookingSummaryBand from './BookingSummaryBand.jsx';
import { BOOKING_ANCHOR_ID } from '../site/brand.js';
import { useBooking, STEPS } from '../state/BookingContext.jsx';

// Chrome container only. Step transitions (AnimatePresence) live in App.jsx
// around the <Screen /> element directly — wrapping children here triggered
// a stale-children bug where the new motion.div mounted with the prior
// Screen's contents after exit.
export default function BookingSection({ children }) {
  const { state } = useBooking();
  const isConfirmation = state.step === STEPS.CONFIRMATION;
  return (
    <>
      {!isConfirmation && <BookingProgress />}
      {!isConfirmation && <BookingSummaryBand />}
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
