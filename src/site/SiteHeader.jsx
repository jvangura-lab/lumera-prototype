import React, { useState, useEffect } from 'react';
import { BRAND, NAV_LINKS, BOOKING_ANCHOR_ID } from './brand.js';

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleBookClick = (e) => {
    e.preventDefault();
    const target = document.getElementById(BOOKING_ANCHOR_ID);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
