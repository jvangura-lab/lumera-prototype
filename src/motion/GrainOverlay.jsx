import React from 'react';

// Paper-grain / noise overlay for atmospheric warmth.
// Inline SVG noise — no extra HTTP request, no asset to deploy.
const NOISE_SVG =
  "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.18 0 0 0 0 0.13 0 0 0 0 0.1 0 0 0 0.85 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

export default function GrainOverlay({ opacity = 0.045, blend = 'multiply' }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1]"
      style={{
        backgroundImage: `url("${NOISE_SVG}")`,
        backgroundSize: '240px 240px',
        opacity,
        mixBlendMode: blend,
      }}
    />
  );
}
