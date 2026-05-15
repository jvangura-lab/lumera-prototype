import React, { useEffect, useRef, useState } from 'react';
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
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const t = window.setTimeout(() => setMarketingHidden(true), 650);
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
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    prevBookingStarted.current = bookingStarted;
  }, [state.step, bookingStarted]);

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
          <Screen />
        </BookingSection>
      </main>
      {!marketingHidden && (
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
