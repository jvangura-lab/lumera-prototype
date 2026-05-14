import React from 'react';
import { Instagram, Facebook } from 'lucide-react';
import { BRAND, NAV_LINKS } from './brand.js';

const SERVICE_LINKS = [
  'Injectables', 'Skin Treatments', 'Laser & Body', 'Wellness & IV',
  'Memberships', 'Gift Cards',
];

export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink-900 text-bone">
      <div className="mx-auto max-w-site px-6 py-16 md:px-10">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand + blurb */}
          <div>
            <div className="flex items-baseline gap-3">
              <span className="font-display text-3xl font-medium tracking-tight">{BRAND.name}</span>
              <span className="font-sans text-[11px] uppercase tracking-eyebrow text-ink-300">
                {BRAND.tagline}
              </span>
            </div>
            <p className="mt-4 max-w-sm font-sans text-sm leading-relaxed text-ink-300">
              Tampa's modern med spa — concierge-level care, board-certified practitioners,
              and the latest in aesthetic medicine. Established {BRAND.yearEstablished}.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <a
                href={BRAND.social.instagram}
                target="_blank"
                rel="noreferrer noopener"
                className="text-ink-300 transition-colors hover:text-accent-soft"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href={BRAND.social.facebook}
                target="_blank"
                rel="noreferrer noopener"
                className="text-ink-300 transition-colors hover:text-accent-soft"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
            </div>
          </div>

          {/* Visit */}
          <div>
            <div className="font-sans text-[11px] uppercase tracking-eyebrow text-accent-soft">Visit</div>
            <address className="mt-4 not-italic font-sans text-sm leading-relaxed text-ink-300">
              {BRAND.address.line1}<br />
              {BRAND.address.line2}<br />
              {BRAND.address.city}, {BRAND.address.state} {BRAND.address.zip}
            </address>
            <div className="mt-4 space-y-1 font-sans text-sm">
              <a href={BRAND.phoneHref} className="block text-bone no-underline hover:text-accent-soft">
                {BRAND.phone}
              </a>
              <a href={`mailto:${BRAND.email}`} className="block text-ink-300 no-underline hover:text-accent-soft">
                {BRAND.email}
              </a>
            </div>
          </div>

          {/* Hours */}
          <div>
            <div className="font-sans text-[11px] uppercase tracking-eyebrow text-accent-soft">Hours</div>
            <ul className="mt-4 space-y-2 font-sans text-sm text-ink-300">
              {BRAND.hours.map((h) => (
                <li key={h.days} className="flex flex-col">
                  <span className="text-bone">{h.days}</span>
                  <span>{h.hours}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div>
            <div className="font-sans text-[11px] uppercase tracking-eyebrow text-accent-soft">Explore</div>
            <ul className="mt-4 space-y-2 font-sans text-sm">
              {NAV_LINKS.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-ink-300 no-underline hover:text-bone">
                    {l.label}
                  </a>
                </li>
              ))}
              {SERVICE_LINKS.map((s) => (
                <li key={s}>
                  <a href="#" className="text-ink-300 no-underline hover:text-bone">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-ink-700 pt-6 font-sans text-[11px] uppercase tracking-eyebrow text-ink-300 md:flex-row md:items-center md:justify-between">
          <div>© {year} {BRAND.legalName}. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#" className="text-ink-300 no-underline hover:text-bone">Privacy</a>
            <a href="#" className="text-ink-300 no-underline hover:text-bone">Terms</a>
            <a href="#" className="text-ink-300 no-underline hover:text-bone">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
