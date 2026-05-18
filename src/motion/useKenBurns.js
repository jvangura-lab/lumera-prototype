import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { KEN_BURNS } from './tokens.js';

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Continuous slow zoom + drift for ambient image life.
// Loops indefinitely; safe to attach to many elements (GSAP handles the ticker).
export function useKenBurns({
  scale = 1.04,
  drift = KEN_BURNS.driftRange,
  duration = KEN_BURNS.duration,
} = {}) {
  const ref = useRef(null);
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const el = ref.current;
    if (!el) return undefined;
    const tl = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: 'sine.inOut' } });
    tl.fromTo(
      el,
      { scale: 1, xPercent: -drift / 2, yPercent: -drift / 2 },
      {
        scale,
        xPercent: drift / 2,
        yPercent: drift / 2,
        duration,
      }
    );
    return () => {
      tl.kill();
      gsap.set(el, { clearProps: 'transform' });
    };
  }, [scale, drift, duration]);
  return ref;
}
