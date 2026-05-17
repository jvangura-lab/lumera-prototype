import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import BookingProgress from './BookingProgress.jsx';
import BookingSummaryBand from './BookingSummaryBand.jsx';
import { BOOKING_ANCHOR_ID } from '../site/brand.js';
import { useBooking, STEPS, deriveFlow } from '../state/BookingContext.jsx';
import {
  stepForwardVariants,
  stepBackwardVariants,
  stepFadeVariants,
} from '../motion/variants.js';

export default function BookingSection({ children }) {
  const { state } = useBooking();
  const isConfirmation = state.step === STEPS.CONFIRMATION;
  const reduced = useReducedMotion();

  // Direction inference. Find the active step's index in the derived path;
  // compare to the previous render's index. Forward = slide left out, right in.
  // Backward = mirror. Reset (back to BOOKING_TYPE) treats as a plain fade.
  const { path } = deriveFlow(state);
  const currentIdx = Math.max(path.indexOf(state.step), 0);
  const prevIdxRef = useRef(currentIdx);
  const direction =
    state.step === STEPS.BOOKING_TYPE
      ? 'reset'
      : currentIdx >= prevIdxRef.current
        ? 'forward'
        : 'backward';
  useEffect(() => {
    prevIdxRef.current = currentIdx;
  });

  const variants = reduced
    ? stepFadeVariants
    : direction === 'backward'
      ? stepBackwardVariants
      : direction === 'reset'
        ? stepFadeVariants
        : stepForwardVariants;

  return (
    <>
      {!isConfirmation && <BookingProgress />}
      {!isConfirmation && <BookingSummaryBand />}
      <section
        id={BOOKING_ANCHOR_ID}
        className="bg-bone scroll-mt-[140px]"
      >
        <div className="mx-auto w-full max-w-3xl px-6 py-16 md:px-10 md:py-24">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={state.step}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}
