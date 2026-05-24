import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

// ─── Base shimmer ─────────────────────────────────────────────────────────────

function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'skeleton-shimmer rounded-lg',
        className
      )}
    />
  );
}

// ─── Primitives ───────────────────────────────────────────────────────────────

export function SkeletonText({ lines = 1, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Shimmer
          key={i}
          className={cn(
            'h-3',
            i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  );
}

export function SkeletonAvatar({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-12 h-12' };
  return <Shimmer className={cn(sizes[size], '!rounded-xl flex-shrink-0')} />;
}

// ─── Stat card skeleton ───────────────────────────────────────────────────────

export function SkeletonStat() {
  return (
    <div className="bg-white/90 border border-slate-200/70 rounded-2xl p-5 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <Shimmer className="h-2.5 w-24" />
          <Shimmer className="h-7 w-20 mt-1" />
          <Shimmer className="h-2.5 w-16" />
        </div>
        <Shimmer className="w-11 h-11 !rounded-xl" />
      </div>
    </div>
  );
}

// ─── Card skeleton ────────────────────────────────────────────────────────────

export function SkeletonCard({ lines = 3, hasImage = false, className }: { lines?: number; hasImage?: boolean; className?: string }) {
  return (
    <div className={cn('bg-white/90 border border-slate-200/70 rounded-2xl overflow-hidden', className)}>
      {hasImage && <Shimmer className="!rounded-none h-44 w-full" />}
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Shimmer className="h-5 w-5 !rounded-full" />
          <Shimmer className="h-3 w-20" />
        </div>
        <Shimmer className="h-4 w-3/4" />
        <SkeletonText lines={lines} />
        <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
          <Shimmer className="h-3 w-16" />
          <Shimmer className="h-3 w-12" />
        </div>
      </div>
    </div>
  );
}

// ─── List item skeleton ───────────────────────────────────────────────────────

export function SkeletonListItem({ className }: { className?: string }) {
  return (
    <div className={cn('bg-white/90 border border-slate-200/70 rounded-2xl p-4 flex items-center gap-4', className)}>
      <SkeletonAvatar />
      <div className="flex-1 space-y-2">
        <Shimmer className="h-3.5 w-1/2" />
        <Shimmer className="h-2.5 w-1/3" />
      </div>
      <div className="flex gap-2">
        <Shimmer className="h-6 w-14 !rounded-full" />
        <Shimmer className="h-6 w-14 !rounded-full" />
      </div>
    </div>
  );
}

// ─── Table skeleton ───────────────────────────────────────────────────────────

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white/90 border border-slate-200/70 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-100 flex gap-4">
        {[40, 25, 20, 15].map((w, i) => (
          <Shimmer key={i} className={`h-3`} style={{ width: `${w}%` } as React.CSSProperties} />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="px-5 py-4 border-b border-slate-50 last:border-0 flex items-center gap-4">
          <SkeletonAvatar size="sm" />
          <Shimmer className="h-3 flex-1" />
          <Shimmer className="h-3 w-1/4" />
          <Shimmer className="h-5 w-16 !rounded-full" />
          <Shimmer className="h-7 w-16 !rounded-lg" />
        </div>
      ))}
    </div>
  );
}

// ─── Page header skeleton ─────────────────────────────────────────────────────

export function SkeletonPageHeader() {
  return (
    <div className="flex items-center justify-between mb-7">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Shimmer className="h-7 w-40" />
          <Shimmer className="h-5 w-14 !rounded-full" />
        </div>
        <Shimmer className="h-3 w-56" />
      </div>
      <Shimmer className="h-9 w-28 !rounded-xl" />
    </div>
  );
}

// ─── Dashboard widget skeleton ────────────────────────────────────────────────

export function SkeletonDashboard() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-content mx-auto space-y-6 pb-12">
      {/* Banner */}
      <Shimmer className="!rounded-2xl h-36 w-full" />

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {Array(4).fill(0).map((_, i) => <SkeletonStat key={i} />)}
      </div>

      {/* Chart row */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <div className="bg-white/90 border border-slate-200/70 rounded-2xl p-5 h-64">
            <Shimmer className="h-4 w-32 mb-4" />
            <Shimmer className="!rounded-xl h-44 w-full" />
          </div>
        </div>
        <div className="bg-white/90 border border-slate-200/70 rounded-2xl p-5">
          <Shimmer className="h-4 w-28 mb-4" />
          <div className="space-y-3">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <SkeletonAvatar size="sm" />
                <div className="flex-1 space-y-1.5">
                  <Shimmer className="h-2.5 w-full" />
                  <Shimmer className="h-1.5 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity row */}
      <div className="space-y-2.5">
        <Shimmer className="h-4 w-32 mb-2" />
        {Array(4).fill(0).map((_, i) => <SkeletonListItem key={i} />)}
      </div>
    </div>
  );
}
