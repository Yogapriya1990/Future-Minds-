import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingMap = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

export function GlassCard({
  children,
  className,
  onClick,
  hover = true,
  padding = 'md',
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      whileHover={
        hover && onClick
          ? { y: -3, transition: { duration: 0.2 } }
          : hover
          ? { y: -2, transition: { duration: 0.2 } }
          : undefined
      }
      whileTap={onClick ? { scale: 0.99 } : undefined}
      onClick={onClick}
      className={cn(
        'card-base',
        hover && 'card-hover',
        onClick && 'cursor-pointer',
        paddingMap[padding],
        className
      )}
    >
      {children}
    </motion.div>
  );
}
