import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

const sizeMap = {
  sm: 'w-6 h-6',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
};

export function Spinner({ size = 'md', label = 'Loading...', className }: SpinnerProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-16', className)}>
      <div className="relative">
        <div className={cn('rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-primary', sizeMap[size], 'flex items-center justify-center')}>
          <motion.div
            className={cn('rounded-full border-2 border-white border-t-transparent', size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-5 h-5' : 'w-7 h-7')}
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 opacity-30 blur-md"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>
      {label && <p className="text-sm text-slate-400 font-medium">{label}</p>}
    </div>
  );
}
