import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Scroll-tied Y parallax. Element travels `range` px against scroll.
// speed = 0.55 means element moves at 55% of scroll speed (lags behind).
export function useParallaxY(speed = 0.75, range = 120) {
  const ref = useRef(null);
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const el = ref.current;
    if (!el) return undefined;
    const distance = range * (1 - speed); // positive: element trails scroll
    const tween = gsap.fromTo(
      el,
      { yPercent: 0, y: -distance },
      {
        y: distance,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [speed, range]);
  return ref;
}

// Scroll-tied scale from 1 → maxScale across the element's full travel.
export function useScrollScale(maxScale = 1.08) {
  const ref = useRef(null);
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const el = ref.current;
    if (!el) return undefined;
    const tween = gsap.fromTo(
      el,
      { scale: 1 },
      {
        scale: maxScale,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [maxScale]);
  return ref;
}

// Combined parallax-Y + ambient scale (for hero photograph).
export function useHeroParallax({ speed = 0.55, range = 150, scaleStart = 1.02, scaleEnd = 1.06 } = {}) {
  const ref = useRef(null);
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const el = ref.current;
    if (!el) return undefined;
    const distance = range * (1 - speed);
    const tween = gsap.fromTo(
      el,
      { y: -distance, scale: scaleStart },
      {
        y: distance,
        scale: scaleEnd,
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement || el,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [speed, range, scaleStart, scaleEnd]);
  return ref;
}
