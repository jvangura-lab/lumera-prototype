import React from 'react';
import Banner from './components/Banner.jsx';
import Footer from './components/Footer.jsx';
import ProgressBar from './components/ProgressBar.jsx';
import { useBooking, STEPS } from './state/BookingContext.jsx';

import BookingTypeScreen from './screens/BookingTypeScreen.jsx';
import ServiceSelectScreen from './screens/ServiceSelectScreen.jsx';
import ReturningPatientScreen from './screens/ReturningPatientScreen.jsx';
import ConsultFormatScreen from './screens/ConsultFormatScreen.jsx';
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

  return (
    <div className="min-h-screen w-full flex items-start justify-center bg-transparent">
      <div className="w-full max-w-[420px] mt-3 mb-6">
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <Banner />
          <ProgressBar />
          <main>
            <Screen />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
