import React, { useState, useEffect } from 'react';
import { BRAND, NAV_LINKS, BOOKING_ANCHOR_ID } from './brand.js';
import { useLenis } from '../motion/LenisProvider.jsx';

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollTo } = useLenis();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleBookClick = (e) => {
    e.preventDefault();
    // Prefer scrolling to the booking heading directly so the whole
    // step (heading + options + Continue button) fits in the viewport.
    // Scrolling to the section anchor lands too low — its 96px of top
    // padding pushes the Continue button below the fold on Step 1.
    const heading = document.getElementById('booking-step-heading');
    if (heading) {
      const stickyHeader = document.querySelector('header');
      const stickyOffset = stickyHeader ? stickyHeader.offsetHeight : 72;
      const breathingRoom = 16;
      scrollTo(heading, { offset: -(stickyOffset + breathingRoom), duration: 0.9 });
      return;
    }
    // Fallback if the heading isn't mounted yet.
    const target = document.getElementById(BOOKING_ANCHOR_ID);
    if (target) scrollTo(target, { duration: 0.9 });
  };

  return (
    <header
      className={`sticky top-0 z-40 bg-bone transition-shadow ${
        scrolled ? 'shadow-soft border-b border-[#E2D6C3]' : 'border-b border-[#E2D6C3]/60'
      }`}
    >
      <div className="mx-auto flex max-w-site items-center justify-between gap-8 px-6 py-5 md:px-10">
        <a href="#" className="flex items-baseline gap-3 no-underline">
          <span className="font-display text-2xl font-medium tracking-tight text-ink-900">
            {BRAND.name}
          </span>
          <span className="font-sans text-[11px] uppercase tracking-eyebrow text-ink-500">
            {BRAND.tagline}
          </span>
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={link.label === 'Book' ? handleBookClick : undefined}
              className={`font-sans text-[12px] uppercase tracking-eyebrow no-underline transition-colors ${
                link.current
                  ? 'text-accent-strong border-b border-accent-strong pb-1'
                  : 'text-ink-700 hover:text-ink-900'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href={`#${BOOKING_ANCHOR_ID}`}
          onClick={handleBookClick}
          className="hidden items-center gap-2 rounded-sm border border-ink-900 px-5 py-2.5 font-sans text-[12px] font-semibold uppercase tracking-eyebrow text-ink-900 no-underline transition-colors hover:bg-ink-900 hover:text-bone md:inline-flex"
        >
          Reserve a Visit
        </a>
        <a
          href="#"
          onClick={handleBookClick}
          className="md:hidden font-sans text-[12px] uppercase tracking-eyebrow text-ink-900 no-underline"
        >
          Menu
        </a>
      </div>
    </header>
  );
}
