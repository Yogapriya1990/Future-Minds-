import { motion } from 'framer-motion';
import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface AnimatedInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const AnimatedInput = forwardRef<HTMLInputElement, AnimatedInputProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <motion.input
        ref={ref}
        whileFocus={{ scale: 1.01 }}
        transition={{ duration: 0.15 }}
        className={cn(
          'w-full px-4 py-3 rounded-xl border-2 outline-none transition-colors',
          'focus:border-purple-500 bg-white/80 backdrop-blur-sm',
          error ? 'border-red-400' : 'border-gray-200',
          className
        )}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
);

AnimatedInput.displayName = 'AnimatedInput';
