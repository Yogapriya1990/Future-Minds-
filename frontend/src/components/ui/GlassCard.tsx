import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

type CardVariant = 'default' | 'stat' | 'feature' | 'ai' | 'glass' | 'flat';
type CardPadding = 'none' | 'sm' | 'md' | 'lg';
type AccentColor = 'violet' | 'blue' | 'emerald' | 'amber' | 'pink' | 'red' | 'indigo' | 'none';

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  variant?: CardVariant;
  padding?: CardPadding;
  hover?: boolean;
  accent?: AccentColor;
  className?: string;
  onClick?: () => void;
}

const paddingMap: Record<CardPadding, string> = {
  none: '',
  sm:   'p-4',
  md:   'p-5',
  lg:   'p-6',
};

const variantMap: Record<CardVariant, string> = {
  default: 'bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/70 dark:border-white/8 shadow-card',
  stat:    'bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/70 dark:border-white/8 shadow-card overflow-hidden',
  feature: 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/8 shadow-card',
  ai:      'bg-gradient-to-br from-violet-600 to-purple-700 border-0 shadow-primary text-white',
  glass:   'bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/60 dark:border-white/8 shadow-glass',
  flat:    'bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/8',
};

const accentMap: Record<AccentColor, string> = {
  violet: 'before:bg-gradient-to-r before:from-violet-500 before:to-purple-500',
  blue:   'before:bg-gradient-to-r before:from-blue-500 before:to-cyan-500',
  emerald:'before:bg-gradient-to-r before:from-emerald-500 before:to-teal-500',
  amber:  'before:bg-gradient-to-r before:from-amber-500 before:to-orange-500',
  pink:   'before:bg-gradient-to-r before:from-pink-500 before:to-rose-500',
  red:    'before:bg-gradient-to-r before:from-red-500 before:to-rose-500',
  indigo: 'before:bg-gradient-to-r before:from-indigo-500 before:to-violet-500',
  none:   '',
};

export function GlassCard({
  children,
  variant = 'default',
  padding = 'md',
  hover = true,
  accent = 'none',
  className,
  onClick,
  ...rest
}: GlassCardProps) {
  const hasAccent = accent !== 'none';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      whileHover={
        hover
          ? {
              y: onClick ? -4 : -2,
              boxShadow: '0 12px 32px -6px rgba(0,0,0,0.1), 0 4px 8px -4px rgba(0,0,0,0.06)',
              transition: { duration: 0.2, ease: 'easeOut' },
            }
          : undefined
      }
      whileTap={onClick ? { scale: 0.99 } : undefined}
      onClick={onClick}
      className={cn(
        'relative rounded-2xl transition-colors duration-200',
        variantMap[variant],
        paddingMap[padding],
        onClick && 'cursor-pointer',
        hasAccent && 'before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:rounded-t-2xl',
        hasAccent && accentMap[accent],
        className
      )}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
