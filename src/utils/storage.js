const KEY = 'magnolia.bookingState.v1';

export function loadState() {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.warn('[Magnolia] sessionStorage read blocked, using in-memory state.', err);
    return null;
  }
}

export function saveState(state) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('[Magnolia] sessionStorage write blocked.', err);
  }
}

export function clearState() {
  try {
    sessionStorage.removeItem(KEY);
  } catch (err) {
    console.warn('[Magnolia] sessionStorage clear blocked.', err);
  }
}
