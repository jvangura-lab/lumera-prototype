// Motion tokens for Lumera.
// One easing curve, calibrated for "noticeable, not loud" motion.
// Edits to these tokens propagate site-wide — change with intent.

export const EASE = [0.22, 0.61, 0.36, 1];
export const EASE_OUT_QUAD = [0.25, 0.46, 0.45, 0.94];

export const DURATION = {
  micro: 0.15,
  ui: 0.25,
  content: 0.6,
  cinematic: 0.9,
  step: 0.45,
  stepIn: 0.5,
};

export const DISTANCE = {
  micro: 8,
  reveal: 28,
  hero: 32,
  parallax: 120,
  grainShift: 8,
};

export const SCALE = {
  hoverImage: 1.04,
  practitionerHover: 1.05,
  kenBurnsMax: 1.05,
  scrollScaleMax: 1.08,
  badgeIn: 1.02,
};

export const PARALLAX_SPEED = {
  heroImage: 0.55,
  sectionImage: 0.75,
  gradientLayer: 0.7,
};

export const KEN_BURNS = {
  duration: 12,
  driftRange: 2.5,
};

export const STAGGER = {
  pill: 0.08,
  card: 0.1,
  testimonial: 0.12,
  pillar: 0.35,
  heroSequence: {
    breadcrumb: 0,
    heading: 0.1,
    subhead: 0.25,
    pills: 0.4,
  },
};
