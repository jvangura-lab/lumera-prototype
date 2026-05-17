import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  revealVariants,
  heroLineVariants,
  imageRevealVariants,
  staggerContainer,
} from './variants.js';
import { useParallaxY } from './useScrollReveal.js';
import { useKenBurns } from './useKenBurns.js';

// Reveal: fade + translate on viewport enter (or on mount).
// `onMount` skips IntersectionObserver — use for above-the-fold (hero) content.
export function Reveal({
  children,
  delay = 0,
  duration,
  y,
  onMount = false,
  as = 'div',
  className,
  variants,
  ...rest
}) {
  const reduced = useReducedMotion();
  const baseVariants = variants || revealVariants;
  const MotionTag = motion[as] || motion.div;

  if (reduced) {
    const Tag = as;
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    );
  }

  const customVariants =
    y !== undefined || duration !== undefined
      ? {
          hidden: { opacity: 0, y: y ?? 28 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: duration ?? 0.6, ease: [0.22, 0.61, 0.36, 1], delay },
          },
        }
      : {
          ...baseVariants,
          visible: {
            ...baseVariants.visible,
            transition: { ...baseVariants.visible.transition, delay },
          },
        };

  if (onMount) {
    return (
      <MotionTag
        className={className}
        initial="hidden"
        animate="visible"
        variants={customVariants}
        {...rest}
      >
        {children}
      </MotionTag>
    );
  }

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={customVariants}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}

// HeroLine: bigger translate (32px) for hero foreground reveals on mount.
export function HeroLine({ children, delay = 0, as = 'div', className, ...rest }) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as] || motion.div;
  if (reduced) {
    const Tag = as;
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    );
  }
  return (
    <MotionTag
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        ...heroLineVariants,
        visible: {
          ...heroLineVariants.visible,
          transition: { ...heroLineVariants.visible.transition, delay },
        },
      }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}

// StaggerChildren: containers that stagger their direct children's reveals.
export function StaggerChildren({
  children,
  stagger = 0.1,
  delayChildren = 0,
  as = 'div',
  className,
  amount = 0.2,
  ...rest
}) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as] || motion.div;
  if (reduced) {
    const Tag = as;
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    );
  }
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={staggerContainer(stagger, delayChildren)}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}

// ImageReveal: ambient fade + slight scale-down for images entering view.
export function ImageReveal({ children, className, ...rest }) {
  const reduced = useReducedMotion();
  if (reduced) {
    return (
      <div className={className} {...rest}>
        {children}
      </div>
    );
  }
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={imageRevealVariants}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

// ParallaxLayer: GSAP-driven Y parallax wrapper for non-image layers.
// children should render directly inside.
export function ParallaxLayer({ speed = 0.75, range = 120, className, children, ...rest }) {
  const ref = useParallaxY(speed, range);
  return (
    <div ref={ref} className={className} style={{ willChange: 'transform' }} {...rest}>
      {children}
    </div>
  );
}

// KenBurnsImage: an <img> (or div with bg-image) that breathes continuously.
export function KenBurnsImage({ as: Tag = 'img', className, ...rest }) {
  const ref = useKenBurns();
  return <Tag ref={ref} className={className} style={{ willChange: 'transform' }} {...rest} />;
}

// HoverLift: subtle Y lift + shadow shift on hover.
export function HoverLift({ children, className, lift = 6, ...rest }) {
  const reduced = useReducedMotion();
  const MotionDiv = motion.div;
  if (reduced) {
    return (
      <div className={className} {...rest}>
        {children}
      </div>
    );
  }
  return (
    <MotionDiv
      className={className}
      whileHover={{ y: -lift, transition: { duration: 0.3, ease: [0.22, 0.61, 0.36, 1] } }}
      {...rest}
    >
      {children}
    </MotionDiv>
  );
}
