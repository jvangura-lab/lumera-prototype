// Booking flow steps
export const STEPS = {
  BOOKING_TYPE: 'BOOKING_TYPE',
  SERVICE: 'SERVICE',
  RETURNING: 'RETURNING',
  CONSULT_FORMAT: 'CONSULT_FORMAT',
  CLARIFY: 'CLARIFY',
  PRACTITIONER: 'PRACTITIONER',
  CALENDAR: 'CALENDAR',
  SERIES_FIRST: 'SERIES_FIRST',
  SERIES_SCHEDULE: 'SERIES_SCHEDULE',
  SERIES_REVIEW: 'SERIES_REVIEW',
  SAME_DAY: 'SAME_DAY',
  INTAKE: 'INTAKE',
  POLICY: 'POLICY',
  CHECKOUT: 'CHECKOUT',
  CONFIRMATION: 'CONFIRMATION',
};

// Booking types
export const BOOKING_TYPES = {
  CONSULT: 'consult',
  SINGLE: 'single',
  SERIES: 'series',
};

export const initialState = {
  step: STEPS.BOOKING_TYPE,
  bookingType: null, // 'consult' | 'single' | 'series'
  serviceId: null,
  seriesId: null,
  returningPatient: null, // true | false | null
  consultFormat: null, // 'virtual' | 'in-person'
  practitionerId: null, // 'first-available' or specific id
  appointment: null, // { dateIso, slot, practitionerId }
  series: null, // { sessions: [{dateIso, slot, practitionerId, adjusted}] }
  sameDay: null, // true | false
  intake: {
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    newOrReturning: '',
    reason: '',
    hearAbout: '',
    medical: '',
    healthAck: false,
  },
  policyAck: false,
  payment: null, // { last4, brand, paid, amount }
  history: [], // step history for back-button
};

export function reducer(state, action) {
  switch (action.type) {
    case 'GO_TO_STEP':
      return { ...state, step: action.step, history: [...state.history, state.step] };
    case 'BACK': {
      if (state.history.length === 0) return state;
      const prev = state.history[state.history.length - 1];
      return { ...state, step: prev, history: state.history.slice(0, -1) };
    }
    case 'SET_BOOKING_TYPE':
      return { ...state, bookingType: action.value };
    case 'RESET_BOOKING_TYPE_DOWNSTREAM':
      // Changing booking type invalidates service/practitioner/time/series
      return {
        ...state,
        serviceId: null,
        seriesId: null,
        returningPatient: null,
        consultFormat: null,
        practitionerId: null,
        appointment: null,
        series: null,
        sameDay: null,
      };
    case 'SET_SERVICE':
      return { ...state, serviceId: action.value };
    case 'SET_SERIES':
      return { ...state, seriesId: action.value };
    case 'RESET_SERVICE_DOWNSTREAM':
      return {
        ...state,
        practitionerId: null,
        appointment: null,
        series: null,
        sameDay: null,
      };
    case 'SET_RETURNING':
      return { ...state, returningPatient: action.value };
    case 'SET_CONSULT_FORMAT':
      return { ...state, consultFormat: action.value };
    case 'SET_PRACTITIONER':
      return { ...state, practitionerId: action.value };
    case 'RESET_PRACTITIONER_DOWNSTREAM':
      return { ...state, appointment: null, series: null };
    case 'SET_APPOINTMENT':
      return { ...state, appointment: action.value };
    case 'SET_SERIES_DATA':
      return { ...state, series: action.value };
    case 'SET_SAME_DAY':
      return { ...state, sameDay: action.value };
    case 'SET_INTAKE':
      return { ...state, intake: { ...state.intake, ...action.value } };
    case 'SET_POLICY':
      return { ...state, policyAck: action.value };
    case 'SET_PAYMENT':
      return { ...state, payment: action.value };
    case 'HYDRATE':
      return { ...state, ...action.value };
    case 'RESET':
      return { ...initialState, history: [] };
    default:
      return state;
  }
}
