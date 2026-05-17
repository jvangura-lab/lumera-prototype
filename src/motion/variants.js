import { EASE, DURATION, DISTANCE } from './tokens.js';

export const revealVariants = {
  hidden: { opacity: 0, y: DISTANCE.reveal },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.content, ease: EASE },
  },
};

export const heroLineVariants = {
  hidden: { opacity: 0, y: DISTANCE.hero },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE },
  },
};

export const imageRevealVariants = {
  hidden: { opacity: 0, scale: 1.06 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATION.cinematic, ease: EASE },
  },
};

export const staggerContainer = (stagger = 0.1, delayChildren = 0) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});

export const stepForwardVariants = {
  initial: { opacity: 0, x: 28 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: DURATION.stepIn, ease: EASE, delay: 0.05 },
  },
  exit: {
    opacity: 0,
    x: -28,
    transition: { duration: DURATION.step, ease: EASE },
  },
};

export const stepBackwardVariants = {
  initial: { opacity: 0, x: -28 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: DURATION.stepIn, ease: EASE, delay: 0.05 },
  },
  exit: {
    opacity: 0,
    x: 28,
    transition: { duration: DURATION.step, ease: EASE },
  },
};

export const stepFadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: DURATION.stepIn, ease: EASE } },
  exit: { opacity: 0, transition: { duration: DURATION.step, ease: EASE } },
};

export const dialogBackdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2, ease: EASE } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: EASE } },
};

export const dialogVariants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: EASE },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    transition: { duration: 0.2, ease: EASE },
  },
};

export const errorVariants = {
  initial: { opacity: 0, y: -DISTANCE.micro },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: EASE },
  },
  exit: {
    opacity: 0,
    y: -DISTANCE.micro,
    transition: { duration: 0.15, ease: EASE },
  },
};

export const summaryPartVariants = {
  initial: { opacity: 0, y: 4 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.ui, ease: EASE },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: { duration: 0.2, ease: EASE },
  },
};
