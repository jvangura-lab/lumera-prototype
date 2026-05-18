import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';

const LenisContext = createContext({ lenis: null, scrollTo: null });

// Native fallback used when Lenis is disabled (touch device or reduced motion).
function nativeScrollTo(target, opts = {}) {
  let el = null;
  if (typeof target === 'string') {
    el = document.querySelector(target.startsWith('#') ? target : `#${target}`);
  } else if (target instanceof HTMLElement) {
    el = target;
  } else if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: 'smooth' });
    if (opts.onComplete) setTimeout(opts.onComplete, 400);
    return;
  }
  if (!el) return;
  if (opts.offset !== undefined) {
    const y = window.scrollY + el.getBoundingClientRect().top + opts.offset;
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: opts.block || 'start' });
  }
  if (opts.onComplete) setTimeout(opts.onComplete, 400);
}

export default function LenisProvider({ children }) {
  const lenisRef = useRef(null);
  const [ctxValue, setCtxValue] = useState({ lenis: null, scrollTo: nativeScrollTo });

  useEffect(() => {
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReduced) {
      // Keep nativeScrollTo as the scroll handler; do not initialize Lenis.
      setCtxValue({ lenis: null, scrollTo: nativeScrollTo });
      return undefined;
    }

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      infinite: false,
    });
    lenisRef.current = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    function scrollTo(target, opts = {}) {
      lenis.scrollTo(target, {
        duration: opts.duration ?? 0.9,
        easing: opts.easing,
        offset: opts.offset ?? 0,
        onComplete: opts.onComplete,
      });
    }

    setCtxValue({ lenis, scrollTo });

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <LenisContext.Provider value={ctxValue}>{children}</LenisContext.Provider>;
}

export function useLenis() {
  return useContext(LenisContext);
}
