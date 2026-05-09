import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/layout/Navbar';
import { PageWrapper } from '../components/layout/PageWrapper';
import { GlassCard } from '../components/ui/GlassCard';
import { GradientButton } from '../components/ui/GradientButton';
import { AnimatedList } from '../components/ui/AnimatedList';
import api from '../services/api';

interface Stats {
  tokens_used_total: number;
  courses_enrolled: number;
  courses_completed: number;
  tools_run: number;
  workflow_runs: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: stats } = useQuery<Stats>({
    queryKey: ['my-stats'],
    queryFn: () => api.get('/api/analytics/me').then((r) => r.data),
  });

  const statCards = [
    { label: 'AI Credits Used', value: stats?.tokens_used_total?.toLocaleString() ?? '0', icon: '⚡', color: 'from-purple-500 to-indigo-500' },
    { label: 'Courses Enrolled', value: stats?.courses_enrolled ?? 0, icon: '🎓', color: 'from-blue-500 to-cyan-500' },
    { label: 'Tools Run', value: stats?.tools_run ?? 0, icon: '🛠️', color: 'from-pink-500 to-rose-500' },
    { label: 'Workflow Runs', value: stats?.workflow_runs ?? 0, icon: '⚡', color: 'from-amber-500 to-orange-500' },
  ];

  const quickLinks = [
    { label: 'Start AI Chat', href: '/chat', icon: '💬', desc: 'Chat with GPT-4o or Claude' },
    { label: 'Browse Courses', href: '/learn', icon: '📚', desc: 'Learn new skills' },
    { label: 'AI Tools', href: '/tools', icon: '🛠️', desc: 'Explore AI tools' },
    { label: 'Automations', href: '/automations', icon: '⚡', desc: 'Build workflows' },
  ];

  return (
    <PageWrapper>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">{user?.full_name ?? user?.email}</span>
          </h1>
          <p className="text-gray-500 mt-1">
            Tier: <span className="capitalize font-medium text-purple-600">{user?.subscription_tier}</span>
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((card) => (
            <GlassCard key={card.label} className="text-center">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${card.color} text-white text-2xl mb-3`}>
                {card.icon}
              </div>
              <div className="text-2xl font-bold text-gray-900">{card.value}</div>
              <div className="text-sm text-gray-500 mt-1">{card.label}</div>
            </GlassCard>
          ))}
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Access</h2>
        <AnimatedList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link) => (
            <Link key={link.href} to={link.href}>
              <GlassCard className="h-full">
                <div className="text-3xl mb-3">{link.icon}</div>
                <h3 className="font-semibold text-gray-900">{link.label}</h3>
                <p className="text-sm text-gray-500 mt-1">{link.desc}</p>
              </GlassCard>
            </Link>
          ))}
        </AnimatedList>

        {user?.subscription_tier === 'free' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">Upgrade to Pro</h3>
              <p className="text-purple-100 text-sm mt-1">Get unlimited AI credits, all tools, and workflow automation</p>
            </div>
            <Link to="/pricing">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-white text-purple-600 font-semibold px-6 py-2 rounded-full">
                Upgrade →
              </motion.button>
            </Link>
          </motion.div>
        )}
      </div>
    </PageWrapper>
  );
}
