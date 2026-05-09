import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '../../components/layout/Navbar';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { GlassCard } from '../../components/ui/GlassCard';
import api from '../../services/api';
import { PlatformStats } from '../../types';

const NAV = [
  { label: 'Users', icon: '👥', to: '/admin/users', desc: 'Manage accounts & roles' },
  { label: 'Courses', icon: '📚', to: '/admin/courses', desc: 'Moderate course content' },
  { label: 'Tools', icon: '🔧', to: '/admin/tools', desc: 'Manage AI tool catalog' },
  { label: 'Analytics', icon: '📊', to: '/admin/analytics', desc: 'Platform metrics & insights' },
];

export default function AdminOverviewPage() {
  const { data: stats } = useQuery<PlatformStats>({
    queryKey: ['platform-stats'],
    queryFn: () => api.get('/api/analytics/platform').then((r) => r.data),
  });

  const statCards = stats ? [
    { label: 'Total Users', value: stats.total_users, icon: '👤' },
    { label: 'Active Today', value: stats.dau, icon: '🟢' },
    { label: 'Total Courses', value: stats.total_courses, icon: '📚' },
    { label: 'Total Revenue', value: `$${stats.total_revenue?.toFixed(2) ?? '0.00'}`, icon: '💰' },
  ] : [];

  return (
    <PageWrapper>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
        <p className="text-gray-500 mb-8">Platform overview and management</p>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {statCards.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <GlassCard className="text-center">
                  <div className="text-3xl mb-2">{s.icon}</div>
                  <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                  <div className="text-sm text-gray-500">{s.label}</div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}

        {stats?.top_tools && stats.top_tools.length > 0 && (
          <GlassCard className="mb-6">
            <h2 className="font-semibold text-gray-800 mb-4">Top Tools by Usage</h2>
            <div className="space-y-3">
              {stats.top_tools.map((tool, i) => (
                <div key={tool.slug} className="flex items-center gap-3">
                  <span className="w-6 text-sm font-bold text-gray-400">{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{tool.name}</span>
                      <span className="text-xs text-gray-400">{tool.usage_count} uses</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                        style={{ width: `${Math.min(100, (tool.usage_count / (stats.top_tools[0]?.usage_count || 1)) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {NAV.map((item, i) => (
            <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }}>
              <Link to={item.to}>
                <GlassCard className="flex items-center gap-4 cursor-pointer hover:ring-2 hover:ring-purple-200 transition-all">
                  <div className="text-4xl">{item.icon}</div>
                  <div>
                    <div className="font-semibold text-gray-900">{item.label}</div>
                    <div className="text-sm text-gray-500">{item.desc}</div>
                  </div>
                  <div className="ml-auto text-gray-300">→</div>
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
