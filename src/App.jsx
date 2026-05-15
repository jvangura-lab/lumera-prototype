import React, { useLayoutEffect, useRef } from 'react';
import SiteHeader from './site/SiteHeader.jsx';
import SiteFooter from './site/SiteFooter.jsx';
import PageHero from './site/PageHero.jsx';
import AboutStrip from './site/AboutStrip.jsx';
import TeamSection from './site/TeamSection.jsx';
import ContactStrip from './site/ContactStrip.jsx';
import MobileBookCTA from './site/MobileBookCTA.jsx';
import BookingSection from './components/BookingSection.jsx';
import { useBooking, STEPS } from './state/BookingContext.jsx';

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
  const Screen = SCREENS[state.step] || BookingTypeScreen;
  const firstStepRender = useRef(true);
  const prevBookingStarted = useRef(false);

  // True once the user has chosen a booking path. Going back to Step 1
  // (via actions.back() or RESET) flips this back to false and the
  // marketing sections reappear.
  const bookingStarted =
    state.step !== STEPS.BOOKING_TYPE || Boolean(state.bookingType);

  // useLayoutEffect so DOM mutation and scroll reposition land in the
  // same paint frame — otherwise the marketing-section unmount
  // visually races the scrollIntoView and reads as a snap.
  useLayoutEffect(() => {
    if (firstStepRender.current) {
      firstStepRender.current = false;
      prevBookingStarted.current = bookingStarted;
      return;
    }
    const el = document.getElementById('booking-step-heading');
    if (el) {
      const justStartedBooking =
        bookingStarted && !prevBookingStarted.current;
      // On the bookingStarted flip, ~3000px of layout disappears
      // around the user; a smooth animation on top of that reads as
      // jitter. Snap instantly, then resume smooth for in-flow steps.
      el.scrollIntoView({
        behavior: justStartedBooking ? 'auto' : 'smooth',
        block: 'start',
      });
    }
    prevBookingStarted.current = bookingStarted;
  }, [state.step, bookingStarted]);

  return (
    <div className="min-h-screen bg-bone text-ink-900">
      <SiteHeader />
      {!bookingStarted && (
        <>
          <PageHero />
          <AboutStrip />
        </>
      )}
      <main>
        <BookingSection>
          <Screen />
        </BookingSection>
      </main>
      {!bookingStarted && (
        <>
          <TeamSection />
          <ContactStrip />
        </>
      )}
      <SiteFooter />
      <MobileBookCTA hidden={bookingStarted} />
    </div>
  );
}
