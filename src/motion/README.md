# Lumera Motion System

A small, opinionated motion layer on top of framer-motion, GSAP (ScrollTrigger), and Lenis.

## Files

- `tokens.js` — durations, easing, distances, scale, parallax speeds, stagger values
- `variants.js` — framer-motion variants (reveal, hero line, step transitions, dialog, error, summary)
- `LenisProvider.jsx` — smooth-scroll provider. Disables on touch + reduced motion
- `useLenis.js` — `useLenis()` hook → `{ lenis, scrollTo }`
- `useScrollReveal.js` — GSAP hooks: `useParallaxY`, `useScrollScale`, `useHeroParallax`
- `useKenBurns.js` — continuous slow zoom + drift for ambient image motion
- `MotionPrimitives.jsx` — `<Reveal>`, `<HeroLine>`, `<StaggerChildren>`, `<ImageReveal>`, `<ParallaxLayer>`, `<KenBurnsImage>`, `<HoverLift>`
- `GrainOverlay.jsx` — fixed paper-grain texture, inline SVG noise

## Tokens

One easing curve sitewide: `EASE = [0.22, 0.61, 0.36, 1]`. Document any exception with `// LUMERA-NOTE:`.

Durations:
- `micro` (150ms) — button press, focus ring fade
- `ui` (250ms) — hover, modal backdrop, dropdown
- `content` (600ms) — reveals
- `cinematic` (900ms) — hero reveal, confirmation
- `step` / `stepIn` (450/500ms) — booking step transitions

## Primitives — quick guide

- `<Reveal>` — fade + 28px translate on scroll-into-view (once). Use on every marketing element entering the viewport.
- `<HeroLine>` — same idea, 32px translate, fires on mount, not on scroll. Use for hero foreground.
- `<StaggerChildren>` — wrap a container so direct children's `<Reveal>`s stagger.
- `<ImageReveal>` — fade + slight scale-down for images entering view.
- `<ParallaxLayer speed={0.75}>` — wraps any layer in a scroll-tied Y translate. Use for accent imagery, icon strips, gradient layers.
- `<KenBurnsImage>` — replace an `<img>` with this for continuous ambient slow zoom + drift.
- `<HoverLift>` — subtle Y lift on hover (testimonials, cards).

## What's off-limits

- Letter-by-letter headline reveals
- Animated count-up numbers
- Custom cursors / magnetic buttons
- Bouncy spring physics on UI
- Page-load splash screens
- Animated gradient backgrounds (hue-shifting)
- 3D card tilts
- Scroll-jacking (Lenis smoothing is fine — forcing scroll velocity is not)

## Lenis on mobile

**Disabled on touch devices by default.** Detected via `matchMedia('(hover: none) and (pointer: coarse)')` at provider mount.

Reason: native iOS/Android momentum is better than Lenis on touch — Lenis can fight native scroll, breaking the rubber-band, momentum, and momentum-flick semantics users expect. On touch, `scrollTo` falls back to `element.scrollIntoView({ behavior: 'smooth' })`.

Lenis is also disabled when `prefers-reduced-motion: reduce` is set — native scroll only.

## prefers-reduced-motion

Honored everywhere:
- Lenis: not initialized
- All `MotionPrimitives` early-return their plain children (no animation)
- `useScrollReveal` / `useKenBurns`: hooks no-op
- Focus states remain visible — never sacrificed
