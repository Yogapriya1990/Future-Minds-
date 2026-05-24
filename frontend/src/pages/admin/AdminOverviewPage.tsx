import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, Activity, BookOpen, DollarSign,
  ChevronRight, BarChart3, Wrench,
} from 'lucide-react';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { GlassCard, StatCard, PageHeader, Spinner } from '../../components/ui';
import api from '../../services/api';
import { PlatformStats } from '../../types';

const NAV_CARDS = [
  { label: 'Users',     icon: Users,      to: '/admin/users',     desc: 'Manage accounts & roles',    gradient: 'from-violet-500 to-purple-600', accent: 'violet' as const },
  { label: 'Courses',   icon: BookOpen,   to: '/admin/courses',   desc: 'Moderate course content',    gradient: 'from-blue-500 to-cyan-500',     accent: 'blue'   as const },
  { label: 'Tools',     icon: Wrench,     to: '/admin/tools',     desc: 'Manage AI tool catalog',     gradient: 'from-emerald-500 to-teal-500',  accent: 'emerald'as const },
  { label: 'Analytics', icon: BarChart3,  to: '/admin/analytics', desc: 'Platform metrics & insights',gradient: 'from-amber-500 to-orange-500',  accent: 'amber'  as const },
];

export default function AdminOverviewPage() {
  const { data: stats, isLoading } = useQuery<PlatformStats>({
    queryKey: ['platform-stats'],
    queryFn: () => api.get('/api/analytics/platform').then((r) => r.data),
  });

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <PageHeader
          title="Admin Panel"
          subtitle="Platform overview and management"
          badge="Admin"
          badgeVariant="amber"
        />

        {/* Stat cards */}
        {isLoading ? (
          <Spinner label="Loading stats..." />
        ) : stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Users"    value={stats.total_users}          icon={<Users size={18} />}      accent="violet"  />
            <StatCard label="Active Today"   value={stats.dau}                  icon={<Activity size={18} />}   accent="emerald" />
            <StatCard label="Total Courses"  value={stats.total_courses}        icon={<BookOpen size={18} />}   accent="blue"    />
            <StatCard label="Total Revenue"  value={`$${(stats.total_revenue ?? 0).toFixed(0)}`} icon={<DollarSign size={18} />} accent="amber" animate={false} />
          </div>
        )}

        {/* Top tools chart */}
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
                      <span className="text-xs font-bold text-slate-500">{tool.usage_count.toLocaleString()} uses</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.3 + i * 0.1, duration: 0.7, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        )}

        {/* Nav cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {NAV_CARDS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
              >
                <Link to={item.to} className="block group">
                  <GlassCard accent={item.accent} hover onClick={undefined} className="group-hover:border-violet-200/80">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                        <Icon size={20} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 group-hover:text-violet-700 transition-colors">{item.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                      </div>
                      <ChevronRight size={16} className="text-slate-300 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PageWrapper>
  );
}
