import { cn } from '../../lib/utils';

type BadgeVariant =
  | 'published' | 'draft' | 'pending'
  | 'active' | 'inactive' | 'banned'
  | 'free' | 'pro' | 'enterprise'
  | 'beginner' | 'intermediate' | 'advanced'
  | 'running' | 'completed' | 'failed'
  | 'admin' | 'creator' | 'student'
  | 'manual' | 'scheduled' | 'webhook'
  | 'premium' | 'success' | 'warning' | 'error' | 'info';

interface StatusBadgeProps {
  variant: BadgeVariant;
  label?: string;
  dot?: boolean;
  className?: string;
}

const VARIANT_MAP: Record<BadgeVariant, { cls: string; dot: string; defaultLabel: string }> = {
  published:    { cls: 'bg-emerald-50 text-emerald-700 border border-emerald-100',   dot: 'bg-emerald-500', defaultLabel: 'Published'    },
  draft:        { cls: 'bg-amber-50 text-amber-700 border border-amber-100',          dot: 'bg-amber-400',   defaultLabel: 'Draft'        },
  pending:      { cls: 'bg-yellow-50 text-yellow-700 border border-yellow-100',       dot: 'bg-yellow-400',  defaultLabel: 'Pending'      },
  active:       { cls: 'bg-emerald-50 text-emerald-700 border border-emerald-100',   dot: 'bg-emerald-500', defaultLabel: 'Active'       },
  inactive:     { cls: 'bg-slate-50 text-slate-500 border border-slate-200',          dot: 'bg-slate-400',   defaultLabel: 'Inactive'     },
  banned:       { cls: 'bg-red-50 text-red-700 border border-red-100',                dot: 'bg-red-500',     defaultLabel: 'Banned'       },
  free:         { cls: 'bg-slate-50 text-slate-600 border border-slate-200',          dot: 'bg-slate-400',   defaultLabel: 'Free'         },
  pro:          { cls: 'bg-violet-50 text-violet-700 border border-violet-100',       dot: 'bg-violet-500',  defaultLabel: 'Pro'          },
  enterprise:   { cls: 'bg-indigo-50 text-indigo-700 border border-indigo-100',       dot: 'bg-indigo-500',  defaultLabel: 'Enterprise'   },
  beginner:     { cls: 'bg-emerald-50 text-emerald-700 border border-emerald-100',   dot: 'bg-emerald-500', defaultLabel: 'Beginner'     },
  intermediate: { cls: 'bg-amber-50 text-amber-700 border border-amber-100',          dot: 'bg-amber-400',   defaultLabel: 'Intermediate' },
  advanced:     { cls: 'bg-red-50 text-red-700 border border-red-100',                dot: 'bg-red-500',     defaultLabel: 'Advanced'     },
  running:      { cls: 'bg-blue-50 text-blue-700 border border-blue-100',             dot: 'bg-blue-500',    defaultLabel: 'Running'      },
  completed:    { cls: 'bg-emerald-50 text-emerald-700 border border-emerald-100',   dot: 'bg-emerald-500', defaultLabel: 'Completed'    },
  failed:       { cls: 'bg-red-50 text-red-700 border border-red-100',                dot: 'bg-red-500',     defaultLabel: 'Failed'       },
  admin:        { cls: 'bg-red-50 text-red-700 border border-red-100',                dot: 'bg-red-500',     defaultLabel: 'Admin'        },
  creator:      { cls: 'bg-violet-50 text-violet-700 border border-violet-100',       dot: 'bg-violet-500',  defaultLabel: 'Creator'      },
  student:      { cls: 'bg-blue-50 text-blue-700 border border-blue-100',             dot: 'bg-blue-500',    defaultLabel: 'Student'      },
  manual:       { cls: 'bg-slate-50 text-slate-600 border border-slate-200',          dot: 'bg-slate-400',   defaultLabel: 'Manual'       },
  scheduled:    { cls: 'bg-blue-50 text-blue-700 border border-blue-100',             dot: 'bg-blue-500',    defaultLabel: 'Scheduled'    },
  webhook:      { cls: 'bg-indigo-50 text-indigo-700 border border-indigo-100',       dot: 'bg-indigo-500',  defaultLabel: 'Webhook'      },
  premium:      { cls: 'bg-gradient-to-r from-violet-500 to-pink-500 text-white border-0', dot: 'bg-white', defaultLabel: 'Pro'          },
  success:      { cls: 'bg-emerald-50 text-emerald-700 border border-emerald-100',   dot: 'bg-emerald-500', defaultLabel: 'Success'      },
  warning:      { cls: 'bg-amber-50 text-amber-700 border border-amber-100',          dot: 'bg-amber-400',   defaultLabel: 'Warning'      },
  error:        { cls: 'bg-red-50 text-red-700 border border-red-100',                dot: 'bg-red-500',     defaultLabel: 'Error'        },
  info:         { cls: 'bg-blue-50 text-blue-700 border border-blue-100',             dot: 'bg-blue-500',    defaultLabel: 'Info'         },
};

export function StatusBadge({ variant, label, dot = false, className }: StatusBadgeProps) {
  const config = VARIANT_MAP[variant] ?? VARIANT_MAP.info;
  const text = label ?? config.defaultLabel;

  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full', config.cls, className)}>
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', config.dot)} />}
      {text}
    </span>
  );
}
