import React, { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import { reducer, initialState, STEPS, BOOKING_TYPES } from './reducer.js';
import { loadState, saveState, clearState } from '../utils/storage.js';
import {
  findServiceById,
  findSeriesById,
  findPractitionerById,
  practitionersForService,
  PRACTITIONERS,
} from '../mockData.js';

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    const persisted = loadState();
    if (persisted) {
      return { ...init, ...persisted, history: persisted.history || [] };
    }
    return init;
  });

  const initialMount = useRef(true);
  useEffect(() => {
    if (initialMount.current) {
      initialMount.current = false;
      return;
    }
    saveState(state);
  }, [state]);

  // Browser back-button interception
  useEffect(() => {
    if (state.step === STEPS.BOOKING_TYPE || state.step === STEPS.CONFIRMATION) return;
    window.history.pushState({ magnolia: true, step: state.step }, '');
    const onPop = () => {
      if (state.history.length > 0) {
        dispatch({ type: 'BACK' });
      }
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [state.step, state.history.length]);

  const value = {
    state,
    dispatch,
    actions: buildActions(state, dispatch),
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

function buildActions(state, dispatch) {
  return {
    goTo: (step) => dispatch({ type: 'GO_TO_STEP', step }),
    back: () => dispatch({ type: 'BACK' }),
    setBookingType: (t) => {
      dispatch({ type: 'SET_BOOKING_TYPE', value: t });
    },
    resetBookingTypeDownstream: () => dispatch({ type: 'RESET_BOOKING_TYPE_DOWNSTREAM' }),
    setService: (id) => dispatch({ type: 'SET_SERVICE', value: id }),
    setSeries: (id) => dispatch({ type: 'SET_SERIES', value: id }),
    resetServiceDownstream: () => dispatch({ type: 'RESET_SERVICE_DOWNSTREAM' }),
    setReturning: (v) => dispatch({ type: 'SET_RETURNING', value: v }),
    setConsultFormat: (v) => dispatch({ type: 'SET_CONSULT_FORMAT', value: v }),
    setPractitioner: (id) => dispatch({ type: 'SET_PRACTITIONER', value: id }),
    resetPractitionerDownstream: () => dispatch({ type: 'RESET_PRACTITIONER_DOWNSTREAM' }),
    setAppointment: (a) => dispatch({ type: 'SET_APPOINTMENT', value: a }),
    setSeriesData: (s) => dispatch({ type: 'SET_SERIES_DATA', value: s }),
    setSameDay: (v) => dispatch({ type: 'SET_SAME_DAY', value: v }),
    setIntake: (patch) => dispatch({ type: 'SET_INTAKE', value: patch }),
    setPolicy: (v) => dispatch({ type: 'SET_POLICY', value: v }),
    setPayment: (p) => dispatch({ type: 'SET_PAYMENT', value: p }),
    resetAll: () => {
      clearState();
      try { sessionStorage.removeItem('magnolia.seed'); } catch {}
      try { delete window.__magnolia_session_seed__; } catch {}
      dispatch({ type: 'RESET' });
    },
  };
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used inside BookingProvider');
  return ctx;
}

// ---------- Flow derivation helpers ----------

export function deriveFlow(state) {
  const { bookingType, serviceId, seriesId, returningPatient } = state;
  const service = serviceId ? findServiceById(serviceId) : null;
  const series = seriesId ? findSeriesById(seriesId) : null;

  // Determine the path of steps that will be visited
  const path = [STEPS.BOOKING_TYPE];

  if (!bookingType) {
    return {
      path: [
        STEPS.BOOKING_TYPE,
        STEPS.SERVICE,
        STEPS.RETURNING,
        STEPS.CONSULT_FORMAT,
        STEPS.PRACTITIONER,
        STEPS.CALENDAR,
        STEPS.SAME_DAY,
        STEPS.INTAKE,
        STEPS.POLICY,
        STEPS.CHECKOUT,
        STEPS.CONFIRMATION,
      ],
      maxLen: 11,
    };
  }

  path.push(STEPS.SERVICE);

  if (bookingType === BOOKING_TYPES.SERIES) {
    if (series && series.consultRequired) {
      // Returning gate appears
      path.push(STEPS.RETURNING);
      if (returningPatient === false) {
        // New patient — would route to consult flow first; in the prototype we keep it clean:
        // we still route them to format -> practitioner -> calendar (the consult), then series scheduling.
        path.push(STEPS.CONSULT_FORMAT);
        path.push(STEPS.PRACTITIONER);
        path.push(STEPS.CALENDAR);
      } else if (returningPatient === true) {
        path.push(STEPS.PRACTITIONER);
        path.push(STEPS.SERIES_FIRST);
        path.push(STEPS.SERIES_SCHEDULE);
        path.push(STEPS.SERIES_REVIEW);
      } else {
        path.push(STEPS.PRACTITIONER);
        path.push(STEPS.SERIES_FIRST);
        path.push(STEPS.SERIES_SCHEDULE);
        path.push(STEPS.SERIES_REVIEW);
      }
    } else {
      // Direct series
      path.push(STEPS.PRACTITIONER);
      path.push(STEPS.SERIES_FIRST);
      path.push(STEPS.SERIES_SCHEDULE);
      path.push(STEPS.SERIES_REVIEW);
    }
  } else {
    // single or consult
    const wantsConsult = bookingType === BOOKING_TYPES.CONSULT;
    const consultRequired = service ? service.consultRequired : true;

    if (bookingType === BOOKING_TYPES.SINGLE) {
      if (!consultRequired) {
        // Direct service
        path.push(STEPS.PRACTITIONER, STEPS.CALENDAR);
      } else {
        // Single service that requires consult — use returning-patient gate
        path.push(STEPS.RETURNING);
        if (returningPatient === true) {
          path.push(STEPS.PRACTITIONER, STEPS.CALENDAR);
        } else {
          path.push(STEPS.CONSULT_FORMAT, STEPS.PRACTITIONER, STEPS.CALENDAR, STEPS.SAME_DAY);
        }
      }
    } else {
      // CONSULT booking type explicitly
      path.push(STEPS.RETURNING);
      if (returningPatient === true) {
        path.push(STEPS.PRACTITIONER, STEPS.CALENDAR);
      } else {
        path.push(STEPS.CONSULT_FORMAT, STEPS.PRACTITIONER, STEPS.CALENDAR, STEPS.SAME_DAY);
      }
    }
  }

  path.push(STEPS.INTAKE, STEPS.POLICY, STEPS.CHECKOUT, STEPS.CONFIRMATION);
  return { path, maxLen: path.length };
}

export function stepLabel(step) {
  switch (step) {
    case STEPS.BOOKING_TYPE: return 'Type';
    case STEPS.SERVICE: return 'Service';
    case STEPS.RETURNING: return 'Patient';
    case STEPS.CONSULT_FORMAT: return 'Format';
    case STEPS.PRACTITIONER: return 'Provider';
    case STEPS.CALENDAR: return 'Time';
    case STEPS.SERIES_FIRST: return 'Session 1';
    case STEPS.SERIES_SCHEDULE: return 'Schedule';
    case STEPS.SERIES_REVIEW: return 'Review';
    case STEPS.SAME_DAY: return 'Same-day';
    case STEPS.INTAKE: return 'Details';
    case STEPS.POLICY: return 'Policy';
    case STEPS.CHECKOUT: return 'Payment';
    case STEPS.CONFIRMATION: return 'Done';
    default: return '';
  }
}

export function getQualifyingPractitioners(state) {
  const { bookingType, serviceId, seriesId } = state;
  let svcId = serviceId;
  if (bookingType === BOOKING_TYPES.SERIES && seriesId) {
    const s = findSeriesById(seriesId);
    if (s) svcId = s.serviceId;
  }
  if (!svcId) return [];
  return practitionersForService(svcId);
}

export function getActivePractitionerIds(state) {
  const qual = getQualifyingPractitioners(state);
  if (state.practitionerId === 'first-available') return qual.map((p) => p.id);
  if (state.practitionerId) return [state.practitionerId];
  return qual.map((p) => p.id);
}

export function getSelectedPractitioner(state) {
  if (!state.practitionerId) return null;
  if (state.practitionerId === 'first-available') return null;
  return findPractitionerById(state.practitionerId);
}

export { STEPS, BOOKING_TYPES, PRACTITIONERS };
