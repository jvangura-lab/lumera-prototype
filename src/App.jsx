import React, { useEffect, useRef } from 'react';
import SiteHeader from './site/SiteHeader.jsx';
import SiteFooter from './site/SiteFooter.jsx';
import PageHero from './site/PageHero.jsx';
import AboutStrip from './site/AboutStrip.jsx';
import TeamSection from './site/TeamSection.jsx';
import ContactStrip from './site/ContactStrip.jsx';
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

  useEffect(() => {
    if (firstStepRender.current) {
      firstStepRender.current = false;
      return;
    }
    const raf = window.requestAnimationFrame(() => {
      const el = document.getElementById('booking-step-heading');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    return () => window.cancelAnimationFrame(raf);
  }, [state.step]);

  return (
    <div className="min-h-screen bg-bone text-ink-900">
      <SiteHeader />
      <PageHero />
      <AboutStrip />
      <main>
        <BookingSection>
          <Screen />
        </BookingSection>
      </main>
      <TeamSection />
      <ContactStrip />
      <SiteFooter />
    </div>
  );
}
