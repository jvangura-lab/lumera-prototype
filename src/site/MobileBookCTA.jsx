import React, { useEffect, useState } from 'react';
import { BOOKING_ANCHOR_ID } from './brand.js';

export default function MobileBookCTA({ hidden = false }) {
  const [showPastHero, setShowPastHero] = useState(false);

  useEffect(() => {
    if (hidden) return;
    const hero = document.getElementById('hero');
    if (!hero) {
      // No hero on screen — flow is already underway. Don't show.
      setShowPastHero(false);
      return;
    }
    // Show the CTA only once the hero has scrolled off the top.
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowPastHero(!entry.isIntersecting);
      },
      { rootMargin: '0px 0px -100% 0px', threshold: 0 }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [hidden]);

  if (hidden || !showPastHero) return null;

  const handleClick = (e) => {
    e.preventDefault();
    const target = document.getElementById(BOOKING_ANCHOR_ID);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <a
      href={`#${BOOKING_ANCHOR_ID}`}
      onClick={handleClick}
      className="fixed bottom-4 inset-x-4 z-40 md:hidden inline-flex items-center justify-center rounded-sm bg-ink-900 px-5 py-4 font-sans text-[12px] font-semibold uppercase tracking-eyebrow text-bone no-underline shadow-card transition-colors hover:bg-[#3a2e26]"
    >
      Reserve a Visit
    </a>
  );
}
