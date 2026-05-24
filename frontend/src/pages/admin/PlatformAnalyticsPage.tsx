import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Users, Activity, BookOpen, GraduationCap, Zap, Bot, CreditCard, DollarSign,
} from 'lucide-react';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { GlassCard, StatCard, PageHeader, Spinner } from '../../components/ui';
import api from '../../services/api';
import { PlatformStats } from '../../types';

const TIER_CONFIG: Record<string, { label: string; cls: string }> = {
  free:       { label: 'Free',       cls: 'bg-slate-50 border border-slate-200 text-slate-700'      },
  pro:        { label: 'Pro',        cls: 'bg-violet-50 border border-violet-100 text-violet-700'    },
  enterprise: { label: 'Enterprise', cls: 'bg-indigo-50 border border-indigo-100 text-indigo-700'   },
};

export default function PlatformAnalyticsPage() {
  const { data: stats, isLoading } = useQuery<PlatformStats>({
    queryKey: ['platform-stats'],
    queryFn: () => api.get('/api/analytics/platform').then((r) => r.data),
    refetchInterval: 60_000,
  });

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <PageHeader
          title="Platform Analytics"
          subtitle="Live metrics — refreshes every 60 seconds"
          badge="Live"
          badgeVariant="emerald"
        />

        {isLoading ? (
          <Spinner label="Loading analytics..." />
        ) : (
          <>
            {/* Stat grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <StatCard label="Total Users"          value={stats?.total_users ?? 0}               icon={<Users size={18} />}        accent="violet"  />
              <StatCard label="Daily Active Users"   value={stats?.dau ?? 0}                       icon={<Activity size={18} />}     accent="emerald" />
              <StatCard label="Total Courses"        value={stats?.total_courses ?? 0}             icon={<BookOpen size={18} />}     accent="blue"    />
              <StatCard label="Total Enrollments"    value={stats?.total_enrollments ?? 0}         icon={<GraduationCap size={18} />}accent="indigo"  />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard label="Tool Runs"            value={stats?.total_tool_runs ?? 0}           icon={<Zap size={18} />}          accent="amber"   />
              <StatCard label="AI Tokens Used"       value={stats?.total_tokens_used?.toLocaleString() ?? '—'} icon={<Bot size={18} />} accent="pink" animate={false} />
              <StatCard label="Active Subscriptions" value={stats?.active_subscriptions ?? 0}     icon={<CreditCard size={18} />}   accent="teal"    />
              <StatCard label="Total Revenue"        value={`$${(stats?.total_revenue ?? 0).toFixed(0)}`} icon={<DollarSign size={18} />} accent="emerald" animate={false} />
            </div>

            {/* Top tools */}
            {stats?.top_tools && stats.top_tools.length > 0 && (
              <GlassCard accent="violet" className="mb-6">
                <h2 className="text-sm font-bold text-slate-900 mb-5">Top Tools by Usage</h2>
                <div className="space-y-4">
                  {stats.top_tools.map((tool, i) => {
                    const pct = Math.max(4, Math.min(100, (tool.usage_count / (stats.top_tools[0]?.usage_count || 1)) * 100));
                    return (
                      <div key={tool.slug}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="w-5 text-xs font-bold text-slate-300">#{i + 1}</span>
                            <span className="text-sm font-semibold text-slate-700">{tool.name}</span>
                          </div>
                          <span className="text-xs font-bold text-slate-500">{tool.usage_count.toLocaleString()}</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ delay: 0.2 + i * 0.1, duration: 0.7, ease: 'easeOut' }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>
            )}

            {/* Subscription breakdown */}
            {stats?.subscription_breakdown && (
              <GlassCard>
                <h2 className="text-sm font-bold text-slate-900 mb-4">Subscription Breakdown</h2>
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(stats.subscription_breakdown).map(([tier, count]) => {
                    const config = TIER_CONFIG[tier] ?? { label: tier, cls: 'bg-slate-50 border border-slate-200 text-slate-700' };
                    return (
                      <div key={tier} className={`rounded-xl p-4 text-center ${config.cls}`}>
                        <p className="text-2xl font-extrabold mb-1">{count as number}</p>
                        <p className="text-xs font-semibold capitalize">{config.label}</p>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>
            )}
          </>
        )}
      </div>
    </PageWrapper>
  );
}
