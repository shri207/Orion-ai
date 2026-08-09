import { motion, type HTMLMotionProps } from 'framer-motion';
import { type ReactNode } from 'react';

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  float?: 1 | 2 | 3 | 4;
  glow?: boolean;
  className?: string;
}

export function Card({ children, float, glow, className = '', ...props }: CardProps) {
  const floatClass = float ? `float-${float}` : '';

  return (
    <motion.div
      className={`glass-card rounded-xl ${floatClass} ${glow ? 'hover:shadow-glow-lg' : ''} ${className}`}
      whileHover={{ y: -4, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
      style={{ willChange: 'transform', backfaceVisibility: 'hidden' }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
