import { motion } from 'framer-motion';
import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function GradientButton({
  children,
  variant = 'primary',
  size = 'md',
  isLoading,
  className,
  disabled,
  onAnimationStart: _onAnimationStart,
  ...props
}: GradientButtonProps) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      disabled={disabled || isLoading}
      className={cn(
        'rounded-full font-semibold transition-shadow',
        sizeClasses[size],
        variant === 'primary' && 'text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg hover:shadow-purple-200',
        variant === 'outline' && 'text-purple-600 border-2 border-purple-500 hover:bg-purple-50',
        (disabled || isLoading) && 'opacity-60 cursor-not-allowed',
        className
      )}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Loading...
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
}
