import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Navbar } from '../../components/layout/Navbar';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { GlassCard } from '../../components/ui/GlassCard';
import api from '../../services/api';
import { PlatformStats } from '../../types';

export default function PlatformAnalyticsPage() {
  const { data: stats, isLoading } = useQuery<PlatformStats>({
    queryKey: ['platform-stats'],
    queryFn: () => api.get('/api/analytics/platform').then((r) => r.data),
    refetchInterval: 60_000,
  });

  const metrics = stats ? [
    { label: 'Total Users', value: stats.total_users, icon: '👤', color: 'from-purple-500 to-purple-600' },
    { label: 'Daily Active Users', value: stats.dau, icon: '🟢', color: 'from-green-500 to-green-600' },
    { label: 'Total Courses', value: stats.total_courses, icon: '📚', color: 'from-blue-500 to-blue-600' },
    { label: 'Total Enrollments', value: stats.total_enrollments, icon: '🎓', color: 'from-pink-500 to-pink-600' },
    { label: 'Tool Runs (all time)', value: stats.total_tool_runs, icon: '⚡', color: 'from-amber-500 to-amber-600' },
    { label: 'AI Tokens Used', value: stats.total_tokens_used?.toLocaleString() ?? '—', icon: '🤖', color: 'from-indigo-500 to-indigo-600' },
    { label: 'Active Subscriptions', value: stats.active_subscriptions, icon: '💳', color: 'from-teal-500 to-teal-600' },
    { label: 'Total Revenue', value: `$${stats.total_revenue?.toFixed(2) ?? '0.00'}`, icon: '💰', color: 'from-emerald-500 to-emerald-600' },
  ] : [];

  return (
    <PageWrapper>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Platform Analytics</h1>
            <p className="text-sm text-gray-400 mt-1">Refreshes every 60 seconds</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {metrics.map((m, i) => (
                <motion.div key={m.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                  <GlassCard className="overflow-hidden">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${m.color} flex items-center justify-center text-xl mb-3`}>
                      {m.icon}
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{m.value ?? '—'}</div>
                    <div className="text-sm text-gray-500 mt-0.5">{m.label}</div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            {stats?.top_tools && stats.top_tools.length > 0 && (
              <GlassCard className="mb-6">
                <h2 className="font-semibold text-gray-800 mb-4">Top Tools by Usage</h2>
                <div className="space-y-4">
                  {stats.top_tools.map((tool, i) => {
                    const pct = Math.max(4, Math.min(100, (tool.usage_count / (stats.top_tools[0]?.usage_count || 1)) * 100));
                    return (
                      <div key={tool.slug}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gray-400 w-5">{i + 1}</span>
                            <span className="text-sm font-medium text-gray-700">{tool.name}</span>
                          </div>
                          <span className="text-sm font-semibold text-gray-600">{tool.usage_count.toLocaleString()}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>
            )}

            {stats?.subscription_breakdown && (
              <GlassCard>
                <h2 className="font-semibold text-gray-800 mb-4">Subscription Breakdown</h2>
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(stats.subscription_breakdown).map(([tier, count]) => (
                    <div key={tier} className="text-center p-4 rounded-xl bg-gray-50">
                      <div className="text-2xl font-bold text-gray-900">{count as number}</div>
                      <div className="text-sm text-gray-500 capitalize">{tier}</div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}
          </>
        )}
      </div>
    </PageWrapper>
  );
}
