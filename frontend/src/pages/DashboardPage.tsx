import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, GraduationCap, Wrench, Activity, MessageSquare, BookOpen, ArrowUpRight, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AppLayout } from '../components/layout/AppLayout';
import { PageWrapper } from '../components/layout/PageWrapper';
import { GlassCard } from '../components/ui/GlassCard';
import { GradientButton } from '../components/ui/GradientButton';
import api from '../services/api';

interface Stats {
  tokens_used_total: number;
  courses_enrolled: number;
  courses_completed: number;
  tools_run: number;
  workflow_runs: number;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: stats } = useQuery<Stats>({
    queryKey: ['my-stats'],
    queryFn: () => api.get('/api/analytics/me').then((r) => r.data),
  });

  const statCards = [
    {
      label: 'AI Credits Used',
      value: stats?.tokens_used_total?.toLocaleString() ?? '0',
      icon: Zap,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
      border: 'border-violet-100',
      trend: '+12%',
    },
    {
      label: 'Courses Enrolled',
      value: stats?.courses_enrolled ?? 0,
      icon: GraduationCap,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      trend: `${stats?.courses_completed ?? 0} completed`,
    },
    {
      label: 'Tools Run',
      value: stats?.tools_run ?? 0,
      icon: Wrench,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      trend: 'All time',
    },
    {
      label: 'Workflow Runs',
      value: stats?.workflow_runs ?? 0,
      icon: Activity,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      border: 'border-orange-100',
      trend: 'All time',
    },
  ];

  const quickLinks = [
    {
      label: 'Start AI Chat',
      href: '/chat',
      icon: MessageSquare,
      desc: 'Chat with GPT-4o or Claude Sonnet',
      color: 'from-violet-500 to-purple-600',
      lightColor: 'bg-violet-50',
      iconColor: 'text-violet-600',
    },
    {
      label: 'Browse Courses',
      href: '/learn',
      icon: BookOpen,
      desc: 'Explore AI-powered learning paths',
      color: 'from-blue-500 to-cyan-500',
      lightColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      label: 'AI Tools',
      href: '/tools',
      icon: Wrench,
      desc: 'Run pre-built AI tools instantly',
      color: 'from-emerald-500 to-teal-500',
      lightColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      label: 'Automations',
      href: '/automations',
      icon: Zap,
      desc: 'Build no-code AI workflows',
      color: 'from-orange-500 to-amber-500',
      lightColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
  ];

  const firstName = user?.full_name?.split(' ')[0] ?? user?.email?.split('@')[0] ?? 'there';

  return (
    <AppLayout>
      <PageWrapper>
        <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-start justify-between gap-4 flex-wrap"
          >
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'},{' '}
                <span className="gradient-text">{firstName}</span> 👋
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Here's what's happening with your account today.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge bg-violet-50 text-violet-700 border border-violet-200 capitalize">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
                {user?.subscription_tier} plan
              </span>
            </div>
          </motion.div>

          {/* Upgrade banner */}
          {user?.subscription_tier === 'free' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 p-5 flex items-center justify-between gap-4 shadow-primary-lg"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.08),transparent)]" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp size={16} className="text-violet-200" />
                  <span className="text-xs font-semibold text-violet-200 uppercase tracking-wide">Pro Plan</span>
                </div>
                <h3 className="text-white font-bold text-lg">Unlock your full potential</h3>
                <p className="text-violet-100/80 text-sm mt-0.5">
                  Get unlimited AI credits, all tools, and workflow automation
                </p>
              </div>
              <Link to="/pricing" className="flex-shrink-0">
                <GradientButton
                  variant="outline"
                  size="sm"
                  className="!bg-white !text-violet-700 !border-white hover:!bg-violet-50 whitespace-nowrap"
                  rightIcon={<ArrowUpRight size={14} />}
                >
                  Upgrade Now
                </GradientButton>
              </Link>
            </motion.div>
          )}

          {/* Stats */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 xl:grid-cols-4 gap-4"
          >
            {statCards.map((card) => (
              <motion.div key={card.label} variants={itemVariants}>
                <GlassCard className="h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl ${card.bg} border ${card.border} flex items-center justify-center flex-shrink-0`}>
                      <card.icon size={18} className={card.color} />
                    </div>
                    <span className="text-xs text-slate-400 font-medium">{card.trend}</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 leading-none">{card.value}</p>
                  <p className="text-sm text-slate-500 mt-1.5">{card.label}</p>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick access */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-900">Quick Access</h2>
              <span className="text-xs text-slate-400">Your most-used features</span>
            </div>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {quickLinks.map((link) => (
                <motion.div key={link.href} variants={itemVariants}>
                  <Link to={link.href}>
                    <GlassCard className="h-full group">
                      <div className={`w-11 h-11 rounded-xl ${link.lightColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                        <link.icon size={20} className={link.iconColor} />
                      </div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-slate-900 text-sm">{link.label}</h3>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">{link.desc}</p>
                        </div>
                        <ArrowUpRight size={15} className="text-slate-300 group-hover:text-slate-500 flex-shrink-0 transition-colors mt-0.5" />
                      </div>
                    </GlassCard>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>

        </div>
      </PageWrapper>
    </AppLayout>
  );
}
