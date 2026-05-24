import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef, ReactNode } from 'react';
import { cn } from '../../lib/utils';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: Direction;
  distance?: number;
  once?: boolean;
  className?: string;
}

const directionOffset = (dir: Direction, dist: number) => {
  switch (dir) {
    case 'up':    return { y:  dist };
    case 'down':  return { y: -dist };
    case 'left':  return { x:  dist };
    case 'right': return { x: -dist };
    default:      return {};
  }
};

export function FadeIn({
  children,
  delay    = 0,
  duration = 0.45,
  direction = 'up',
  distance  = 18,
  once      = true,
  className,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduce = useReducedMotion();
  const inView = useInView(ref, { once, margin: '-60px 0px' });

  const offset = shouldReduce ? {} : directionOffset(direction, distance);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...offset }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: shouldReduce ? 0 : duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Stagger wrapper ──────────────────────────────────────────────────────────

interface StaggerProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}

export function Stagger({ children, staggerDelay = 0.07, className }: StaggerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduce = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: '-60px 0px' });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        hidden:  {},
        visible: { transition: { staggerChildren: shouldReduce ? 0 : staggerDelay } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Stagger child ────────────────────────────────────────────────────────────

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  const shouldReduce = useReducedMotion();
  return (
    <motion.div
      variants={{
        hidden:  { opacity: 0, y: shouldReduce ? 0 : 14 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
