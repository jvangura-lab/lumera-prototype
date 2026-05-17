import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import SiteHeader from './site/SiteHeader.jsx';
import SiteFooter from './site/SiteFooter.jsx';
import PageHero from './site/PageHero.jsx';
import AboutStrip from './site/AboutStrip.jsx';
import TeamSection from './site/TeamSection.jsx';
import TrustStrip from './site/TrustStrip.jsx';
import FaqSection from './site/FaqSection.jsx';
import TestimonialsSection from './site/TestimonialsSection.jsx';
import ContactStrip from './site/ContactStrip.jsx';
import MobileBookCTA from './site/MobileBookCTA.jsx';
import BookingSection from './components/BookingSection.jsx';
import { useBooking, STEPS, deriveFlow } from './state/BookingContext.jsx';
import { useLenis } from './motion/LenisProvider.jsx';
import {
  stepForwardVariants,
  stepBackwardVariants,
  stepFadeVariants,
} from './motion/variants.js';

import BookingTypeScreen from './screens/BookingTypeScreen.jsx';
import ServiceSelectScreen from './screens/ServiceSelectScreen.jsx';
import ReturningPatientScreen from './screens/ReturningPatientScreen.jsx';
import ConsultFormatScreen from './screens/ConsultFormatScreen.jsx';
import ClarifyConsultScreen from './screens/ClarifyConsultScreen.jsx';
import PractitionerScreen from './screens/PractitionerScreen.jsx';
import CalendarScreen from './screens/CalendarScreen.jsx';
import SeriesFirstScreen from './screens/SeriesFirstScreen.jsx';
import SeriesScheduleScreen from './screens/SeriesScheduleScreen.jsx';
import SeriesReviewScreen from './screens/SeriesReviewScreen.jsx';
import SameDayScreen from './screens/SameDayScreen.jsx';
import IntakeScreen from './screens/IntakeScreen.jsx';
import PolicyScreen from './screens/PolicyScreen.jsx';
import CheckoutScreen from './screens/CheckoutScreen.jsx';
import ConfirmationScreen from './screens/ConfirmationScreen.jsx';

const SCREENS = {
  [STEPS.BOOKING_TYPE]: BookingTypeScreen,
  [STEPS.SERVICE]: ServiceSelectScreen,
  [STEPS.RETURNING]: ReturningPatientScreen,
  [STEPS.CONSULT_FORMAT]: ConsultFormatScreen,
  [STEPS.CLARIFY]: ClarifyConsultScreen,
  [STEPS.PRACTITIONER]: PractitionerScreen,
  [STEPS.CALENDAR]: CalendarScreen,
  [STEPS.SERIES_FIRST]: SeriesFirstScreen,
  [STEPS.SERIES_SCHEDULE]: SeriesScheduleScreen,
  [STEPS.SERIES_REVIEW]: SeriesReviewScreen,
  [STEPS.SAME_DAY]: SameDayScreen,
  [STEPS.INTAKE]: IntakeScreen,
  [STEPS.POLICY]: PolicyScreen,
  [STEPS.CHECKOUT]: CheckoutScreen,
  [STEPS.CONFIRMATION]: ConfirmationScreen,
};

export default function App() {
  const { state } = useBooking();
  const { scrollTo } = useLenis();
  const reduced = useReducedMotion();
  const Screen = SCREENS[state.step] || BookingTypeScreen;
  const firstStepRender = useRef(true);
  const prevBookingStarted = useRef(false);

  // Step-transition direction. Compare the active step's index in
  // deriveFlow(state).path against the previous render's index.
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
  const screenVariants = reduced
    ? stepFadeVariants
    : direction === 'backward'
      ? stepBackwardVariants
      : direction === 'reset'
        ? stepFadeVariants
        : stepForwardVariants;

  // True once the user has chosen a booking path. Going back to Step 1
  // (via actions.back() or RESET) flips this back to false and the
  // marketing sections reappear.
  const bookingStarted =
    state.step !== STEPS.BOOKING_TYPE || Boolean(state.bookingType);

  // Whether marketing sections are actually mounted. We delay the
  // unmount until AFTER the smooth-scroll to the booking heading
  // completes — otherwise the page height drops mid-scroll, scrollY
  // gets clamped, and the user briefly sees the footer before the
  // scroll re-targets the heading.
  const [marketingHidden, setMarketingHidden] = useState(false);

  useEffect(() => {
    if (firstStepRender.current) {
      firstStepRender.current = false;
      prevBookingStarted.current = bookingStarted;
      setMarketingHidden(bookingStarted);
      return;
    }

    if (bookingStarted && !prevBookingStarted.current) {
      // Path just picked. Marketing is still mounted — smooth-scroll
      // the heading to the top of the viewport first. By the time
      // the timeout fires and we unmount, the marketing is already
      // off-screen above, so removing it is visually inert.
      const el = document.getElementById('booking-step-heading');
      if (el) scrollTo(el, { duration: 0.7 });
      const t = window.setTimeout(() => setMarketingHidden(true), 700);
      prevBookingStarted.current = bookingStarted;
      return () => window.clearTimeout(t);
    }

    if (!bookingStarted) {
      // Returned to Step 1 (or full reset). Re-mount marketing.
      setMarketingHidden(false);
      prevBookingStarted.current = bookingStarted;
      return;
    }

    // Normal step-to-step transition inside the flow.
    const el = document.getElementById('booking-step-heading');
    if (el) scrollTo(el, { duration: 0.7 });
    prevBookingStarted.current = bookingStarted;
  }, [state.step, bookingStarted, scrollTo]);

  return (
    <div className="min-h-screen bg-bone text-ink-900">
      <SiteHeader />
      {!marketingHidden && (
        <>
          <PageHero />
          <AboutStrip />
        </>
      )}
      <main>
        <BookingSection>
          {/* Keyed motion.div, no AnimatePresence. AnimatePresence in
              framer-motion 12.x preserves the OLD subtree across the
              exit phase, which combined with <Screen /> as a JSX
              child causes the next motion.div to mount with the prior
              Screen's content. Without AnimatePresence, React unmounts
              the old screen instantly and mounts the new — the new
              plays its entrance variant. Direction-aware enter still
              communicates forward/backward intent; the missing exit
              animation is a deliberate trade for correctness. */}
          <motion.div
            key={state.step}
            variants={screenVariants}
            initial="initial"
            animate="animate"
          >
            <Screen />
          </motion.div>
        </BookingSection>
      </main>
      {!marketingHidden && (
        <>
          <TrustStrip />
          <TeamSection />
          <TestimonialsSection />
          <FaqSection />
          <ContactStrip />
        </>
      )}
      <SiteFooter />
      <MobileBookCTA hidden={bookingStarted} />
    </div>
  );
}
