import React, { useEffect, useState } from 'react';
import { BOOKING_ANCHOR_ID } from './brand.js';
import { useLenis } from '../motion/LenisProvider.jsx';

export default function MobileBookCTA({ hidden = false }) {
  const { scrollTo } = useLenis();
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
    // Match SiteHeader's Reserve-a-Visit behavior: scroll to the
    // booking heading directly so the step content lands fully in
    // view, not below the section's internal top padding.
    const heading = document.getElementById('booking-step-heading');
    if (heading) {
      const stickyHeader = document.querySelector('header');
      const stickyOffset = stickyHeader ? stickyHeader.offsetHeight : 72;
      const breathingRoom = 16;
      scrollTo(heading, { offset: -(stickyOffset + breathingRoom), duration: 0.9 });
      return;
    }
    const target = document.getElementById(BOOKING_ANCHOR_ID);
    if (target) scrollTo(target, { duration: 0.9 });
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
