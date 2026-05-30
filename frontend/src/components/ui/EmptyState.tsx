import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex flex-col items-center justify-center text-center py-16 px-8',
        'bg-white/80 backdrop-blur-sm border border-slate-200/70 rounded-2xl shadow-card',
        className
      )}
    >
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100 flex items-center justify-center mb-4 text-violet-400">
        {icon}
      </div>
      <h3 className="text-base font-bold text-slate-900 mb-1.5">{title}</h3>
      {description && <p className="text-sm text-slate-500 max-w-xs mb-5 leading-relaxed">{description}</p>}
      {action}
    </motion.div>
  );
}
