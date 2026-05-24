import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

interface FilterBarProps {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  className?: string;
}

export function FilterBar({ options, value, onChange, className }: FilterBarProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {options.map((opt) => {
        const active = opt === value;
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={cn(
              'relative px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 outline-none',
              active
                ? 'text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-violet-300 hover:text-violet-600 hover:bg-violet-50/50'
            )}
          >
            {active && (
              <motion.span
                layoutId={`filter-pill-${className}`}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 shadow-primary"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative">{opt}</span>
          </button>
        );
      })}
    </div>
  );
}
