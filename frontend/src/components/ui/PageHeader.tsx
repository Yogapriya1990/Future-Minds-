import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeVariant?: 'violet' | 'blue' | 'emerald' | 'amber';
  actions?: ReactNode;
  className?: string;
}

const badgeColors = {
  violet:  'bg-violet-50 text-violet-700 border border-violet-100',
  blue:    'bg-blue-50 text-blue-700 border border-blue-100',
  emerald: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  amber:   'bg-amber-50 text-amber-700 border border-amber-100',
};

export function PageHeader({
  title,
  subtitle,
  badge,
  badgeVariant = 'violet',
  actions,
  className,
}: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn('flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-7', className)}
    >
      <div>
        <div className="flex items-center gap-2.5 mb-1.5">
          <h1 className="type-h1 !text-2xl">{title}</h1>
          {badge && (
            <span className={cn('text-2xs font-semibold px-2.5 py-0.5 rounded-full', badgeColors[badgeVariant])}>
              {badge}
            </span>
          )}
        </div>
        {subtitle && <p className="type-body-sm">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
    </motion.div>
  );
}
