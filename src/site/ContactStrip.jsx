import React from 'react';
import { MapPin, Phone, Clock, Mail } from 'lucide-react';
import { BRAND } from './brand.js';
import { Reveal } from '../motion/MotionPrimitives.jsx';

export default function ContactStrip() {
  // Static Google Maps embed for the (fake) Lumera address.
  // Uses the place query — no API key, no tracking pixel embed.
  const mapQuery = encodeURIComponent(
    `${BRAND.address.line1}, ${BRAND.address.city}, ${BRAND.address.state} ${BRAND.address.zip}`
  );
  const mapEmbedSrc = `https://maps.google.com/maps?q=${mapQuery}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  return (
    <section id="contact" className="border-b border-[#E2D6C3] bg-[#F3ECE0]">
      <div className="mx-auto max-w-site px-6 py-20 md:px-10 md:py-24">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          {/* Left: contact info */}
          <div>
            <Reveal className="font-sans text-[11px] uppercase tracking-eyebrow text-accent-strong">
              Visit us
            </Reveal>
            <Reveal
              as="h2"
              delay={0.1}
              className="mt-3 font-display text-3xl font-medium tracking-tight text-ink-900 md:text-5xl"
            >
              Find us in South Tampa.
            </Reveal>
            <Reveal
              as="p"
              delay={0.2}
              className="mt-5 max-w-md font-sans text-[15px] leading-relaxed text-ink-700"
            >
              Off Kennedy Boulevard, two blocks west of Howard Avenue.
              Validated parking in the building garage; metered street parking on Kennedy.
            </Reveal>

            <Reveal delay={0.3} className="mt-10 space-y-6">
              <ContactRow
                icon={<MapPin className="h-5 w-5" strokeWidth={1.5} />}
                label="Address"
                lines={[
                  `${BRAND.address.line1}, ${BRAND.address.line2}`,
                  `${BRAND.address.city}, ${BRAND.address.state} ${BRAND.address.zip}`,
                ]}
              />
              <ContactRow
                icon={<Phone className="h-5 w-5" strokeWidth={1.5} />}
                label="Call or text"
                lines={[BRAND.phone]}
                href={BRAND.phoneHref}
              />
              <ContactRow
                icon={<Mail className="h-5 w-5" strokeWidth={1.5} />}
                label="Email"
                lines={[BRAND.email]}
                href={`mailto:${BRAND.email}`}
              />
              <ContactRow
                icon={<Clock className="h-5 w-5" strokeWidth={1.5} />}
                label="Hours"
                lines={BRAND.hours.map((h) => `${h.days} · ${h.hours}`)}
              />
            </Reveal>
          </div>

          {/* Right: map */}
          <Reveal delay={0.2} className="md:pt-12">
            <div className="aspect-[4/5] overflow-hidden border border-[#E2D6C3] bg-bone md:aspect-square">
              <iframe
                src={mapEmbedSrc}
                title={`Map of ${BRAND.legalName}`}
                className="h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ContactRow({ icon, label, lines, href }) {
  const content = (
    <div className="flex items-start gap-4">
      <span className="mt-0.5 text-accent-strong">{icon}</span>
      <div>
        <div className="font-sans text-[11px] uppercase tracking-eyebrow text-ink-500">
          {label}
        </div>
        <div className="mt-1 font-sans text-[15px] leading-relaxed text-ink-900">
          {lines.map((l) => (
            <div key={l}>{l}</div>
          ))}
        </div>
      </div>
    </div>
  );
  if (href) {
    return (
      <a
        href={href}
        className="block no-underline transition-colors duration-[250ms] hover:text-accent-strong"
      >
        {content}
      </a>
    );
  }
  return content;
}
