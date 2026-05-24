import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../../lib/utils';

type AccentColor = 'violet' | 'blue' | 'emerald' | 'amber' | 'pink' | 'red' | 'indigo' | 'teal';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  accent?: AccentColor;
  trend?: number;
  trendLabel?: string;
  suffix?: string;
  animate?: boolean;
  className?: string;
}

const accentConfig: Record<AccentColor, { gradient: string; bg: string; text: string; glow: string }> = {
  violet:  { gradient: 'from-violet-500 to-purple-600',  bg: 'bg-violet-50',  text: 'text-violet-600', glow: 'shadow-primary'   },
  blue:    { gradient: 'from-blue-500 to-cyan-500',      bg: 'bg-blue-50',    text: 'text-blue-600',   glow: 'shadow-blue-200'  },
  emerald: { gradient: 'from-emerald-500 to-teal-500',   bg: 'bg-emerald-50', text: 'text-emerald-600',glow: 'shadow-green-200' },
  amber:   { gradient: 'from-amber-500 to-orange-500',   bg: 'bg-amber-50',   text: 'text-amber-600',  glow: 'shadow-amber-200' },
  pink:    { gradient: 'from-pink-500 to-rose-500',      bg: 'bg-pink-50',    text: 'text-pink-600',   glow: 'shadow-pink-200'  },
  red:     { gradient: 'from-red-500 to-rose-600',       bg: 'bg-red-50',     text: 'text-red-600',    glow: 'shadow-red-200'   },
  indigo:  { gradient: 'from-indigo-500 to-violet-500',  bg: 'bg-indigo-50',  text: 'text-indigo-600', glow: 'shadow-indigo-200'},
  teal:    { gradient: 'from-teal-500 to-cyan-500',      bg: 'bg-teal-50',    text: 'text-teal-600',   glow: 'shadow-teal-200'  },
};

function AnimatedNumber({ value }: { value: number }) {
  const mv = useMotionValue(0);
  const display = useTransform(mv, (v) => Math.round(v).toLocaleString());

  useEffect(() => {
    const controls = animate(mv, value, { duration: 1.2, ease: 'easeOut' });
    return controls.stop;
  }, [mv, value]);

  return <motion.span>{display}</motion.span>;
}

export function StatCard({
  label,
  value,
  icon,
  accent = 'violet',
  trend,
  trendLabel,
  suffix,
  animate: shouldAnimate = true,
  className,
}: StatCardProps) {
  const config = accentConfig[accent];
  const isNumeric = typeof value === 'number' && shouldAnimate;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      whileHover={{
        y: -3,
        boxShadow: '0 16px 36px -8px rgba(0,0,0,0.1)',
        transition: { duration: 0.2 },
      }}
      className={cn(
        'relative bg-white/90 backdrop-blur-sm border border-slate-200/70 rounded-2xl p-5 overflow-hidden',
        className
      )}
    >
      {/* AI-themed accent bar */}
      <div className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${config.gradient} rounded-t-2xl`} />

      {/* Subtle background glow */}
      <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br ${config.gradient} opacity-5 blur-xl`} />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{label}</p>
          <p className="text-2xl font-extrabold text-slate-900 leading-none tracking-tight">
            {isNumeric ? <AnimatedNumber value={value as number} /> : value}
            {suffix && <span className="text-base font-semibold text-slate-400 ml-0.5">{suffix}</span>}
          </p>

          {trend !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${
              trend > 0 ? 'text-emerald-600' : trend < 0 ? 'text-red-500' : 'text-slate-400'
            }`}>
              {trend > 0 ? <TrendingUp size={13} /> : trend < 0 ? <TrendingDown size={13} /> : <Minus size={13} />}
              <span>{trend > 0 ? '+' : ''}{trend}%</span>
              {trendLabel && <span className="text-slate-400 font-normal">{trendLabel}</span>}
            </div>
          )}
        </div>

        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center text-white flex-shrink-0 shadow-sm`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
