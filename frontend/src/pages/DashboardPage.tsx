import { useQuery } from '@tanstack/react-query';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell,
} from 'recharts';
import {
  Zap, GraduationCap, Wrench, Flame, MessageSquare, BookOpen,
  ArrowUpRight, TrendingUp, CheckCircle2, Clock, Play, Star,
  Target, Award, ChevronRight, Sparkles, BarChart2, Users,
  FileText, Bot, Cpu, Code2, Calculator, PenLine, Calendar,
  CircleDot, Trophy,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AppLayout } from '../components/layout/AppLayout';
import { GlassCard } from '../components/ui/GlassCard';
import { GradientButton } from '../components/ui/GradientButton';
import api from '../services/api';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Stats {
  tokens_used_total: number;
  courses_enrolled: number;
  courses_completed: number;
  tools_run: number;
  workflow_runs: number;
}

// ─── Dummy educational data ───────────────────────────────────────────────────
const AI_USAGE_DATA = [
  { day: 'Mon', tokens: 1240, sessions: 4, tools: 2 },
  { day: 'Tue', tokens: 3100, sessions: 9, tools: 5 },
  { day: 'Wed', tokens: 2200, sessions: 6, tools: 3 },
  { day: 'Thu', tokens: 4800, sessions: 14, tools: 8 },
  { day: 'Fri', tokens: 3600, sessions: 10, tools: 6 },
  { day: 'Sat', tokens: 1900, sessions: 5, tools: 3 },
  { day: 'Sun', tokens: 2750, sessions: 7, tools: 4 },
];

const WEEKLY_TOOLS = [
  { name: 'Essay Gen', count: 24, color: '#7c3aed' },
  { name: 'Code Help', count: 18, color: '#2563eb' },
  { name: 'Math AI', count: 15, color: '#059669' },
  { name: 'Quiz Maker', count: 12, color: '#d97706' },
  { name: 'Summarizer', count: 9, color: '#ec4899' },
];

const COURSES = [
  { id: 1, title: 'Prompt Engineering Mastery', progress: 92, lessons: 24, total: 26, color: 'bg-violet-500', badge: 'Almost done!' },
  { id: 2, title: 'Machine Learning Fundamentals', progress: 68, lessons: 17, total: 25, color: 'bg-blue-500', badge: 'In progress' },
  { id: 3, title: 'Python for AI Builders', progress: 45, lessons: 11, total: 24, color: 'bg-emerald-500', badge: 'Keep going' },
  { id: 4, title: 'Data Visualization with AI', progress: 20, lessons: 4, total: 18, color: 'bg-orange-500', badge: 'Just started' },
];

const ACTIVITIES = [
  { id: 1, icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-50', title: 'Completed "Attention Mechanisms" lesson', time: '12 min ago', type: 'lesson' },
  { id: 2, icon: Bot,          color: 'text-violet-500 bg-violet-50',   title: 'Used Essay Generator — 3 outputs', time: '1 hr ago',   type: 'tool' },
  { id: 3, icon: MessageSquare,color: 'text-blue-500 bg-blue-50',       title: 'AI Chat session — 45 messages', time: '2 hrs ago',  type: 'chat' },
  { id: 4, icon: Zap,          color: 'text-orange-500 bg-orange-50',   title: 'Workflow "Weekly Report" ran successfully', time: '5 hrs ago',  type: 'workflow' },
  { id: 5, icon: Star,         color: 'text-amber-500 bg-amber-50',     title: 'Earned "Prompt Master" badge', time: 'Yesterday', type: 'badge' },
  { id: 6, icon: BookOpen,     color: 'text-indigo-500 bg-indigo-50',   title: 'Enrolled in "Data Viz with AI"', time: 'Yesterday', type: 'enroll' },
];

const TOOLS = [
  { slug: 'essay-writer',  icon: PenLine,    label: 'Essay Writer',   desc: 'AI-powered essay generation',  color: 'module-icon-chat',     uses: '2.4k' },
  { slug: 'code-helper',   icon: Code2,      label: 'Code Helper',    desc: 'Debug and explain code',        color: 'module-icon-tools',    uses: '1.8k' },
  { slug: 'math-solver',   icon: Calculator, label: 'Math Solver',    desc: 'Step-by-step solutions',        color: 'module-icon-learn',    uses: '1.2k' },
  { slug: 'quiz-maker',    icon: FileText,   label: 'Quiz Maker',     desc: 'Generate quizzes instantly',    color: 'module-icon-teach',    uses: '980' },
];

const WORKSHEETS = [
  { id: 1, title: 'Neural Networks — Exercise Set 3', course: 'ML Fundamentals', due: 'Tomorrow', status: 'pending', score: null },
  { id: 2, title: 'Prompt Patterns — Practical Lab', course: 'Prompt Engineering', due: 'Completed', status: 'done', score: 96 },
  { id: 3, title: 'Python Lists & Functions Quiz', course: 'Python for AI', due: 'Dec 28', status: 'pending', score: null },
  { id: 4, title: 'Transformer Architecture Deep-Dive', course: 'ML Fundamentals', due: 'Completed', status: 'done', score: 88 },
];

const STREAK_DAYS = [true, true, false, true, true, true, false, true, true, true, true, false, true, true, true, true, true, false, false, true, true];

const QUICK_ACTIONS = [
  { label: 'Continue Learning', href: '/learn',       icon: Play,         color: 'bg-violet-500', desc: 'Resume ML Fundamentals' },
  { label: 'Start AI Chat',     href: '/chat',        icon: MessageSquare, color: 'bg-blue-500',   desc: 'Ask anything instantly' },
  { label: 'Run a Tool',        href: '/tools',       icon: Cpu,          color: 'bg-emerald-500', desc: 'Boost productivity' },
  { label: 'Build Workflow',    href: '/automations', icon: Zap,          color: 'bg-orange-500',  desc: 'Automate your tasks' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function AnimatedCounter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) =>
    v >= 1000 ? `${(v / 1000).toFixed(1)}k` : Math.round(v).toLocaleString()
  );

  useEffect(() => {
    const controls = animate(count, to, { duration: 1.4, ease: 'easeOut' });
    return controls.stop;
  }, [to, count]);

  return (
    <motion.span>
      {rounded}
      {suffix}
    </motion.span>
  );
}

function ProgressBar({ value, color = 'bg-violet-500', animated = true }: { value: number; color?: string; animated?: boolean }) {
  return (
    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <motion.div
        className={`h-full rounded-full ${color}`}
        initial={animated ? { width: 0 } : { width: `${value}%` }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
      />
    </div>
  );
}

const ChartTooltip = ({ active, payload, label }: {active?: boolean; payload?: {value: number; name: string}[]; label?: string}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-100 rounded-xl shadow-dropdown p-3 text-xs">
      <p className="font-semibold text-slate-700 mb-2">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-slate-500">
          <span className="font-medium text-slate-700">{p.value.toLocaleString()}</span>{' '}
          {p.name === 'tokens' ? 'AI tokens' : p.name}
        </p>
      ))}
    </div>
  );
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden:  { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuth();
  const { data: stats } = useQuery<Stats>({
    queryKey: ['my-stats'],
    queryFn: () => api.get('/api/analytics/me').then((r) => r.data),
  });

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.full_name?.split(' ')[0] ?? user?.email?.split('@')[0] ?? 'there';
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const statCards = [
    {
      label: 'AI Credits Used',
      value: stats?.tokens_used_total ?? 18420,
      icon: Zap,
      iconClass: 'text-violet-600',
      bg: 'bg-violet-50',
      border: 'border-violet-100',
      change: '+12%',
      changeUp: true,
    },
    {
      label: 'Courses Enrolled',
      value: stats?.courses_enrolled ?? 4,
      icon: GraduationCap,
      iconClass: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      change: `${stats?.courses_completed ?? 1} completed`,
      changeUp: true,
    },
    {
      label: 'Tools Run',
      value: stats?.tools_run ?? 87,
      icon: Wrench,
      iconClass: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      change: '+8 this week',
      changeUp: true,
    },
    {
      label: 'Day Streak',
      value: 14,
      icon: Flame,
      iconClass: 'text-orange-600',
      bg: 'bg-orange-50',
      border: 'border-orange-100',
      change: 'Personal best!',
      changeUp: true,
    },
  ];

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-content mx-auto space-y-6 pb-12">

        {/* ── Welcome banner ──────────────────────────────────────────── */}
        <motion.div {...item} className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-violet-950 to-slate-900 p-6 sm:p-8">
          {/* Decorative dots */}
          <div className="absolute inset-0 ai-dot-grid opacity-[0.06]" />
          {/* Glow orbs */}
          <div className="absolute top-0 right-1/4 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-8 w-48 h-48 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="badge-pro flex items-center gap-1.5 text-2xs">
                  <span className="status-dot-violet" />
                  {user?.subscription_tier ?? 'free'} plan
                </span>
                <span className="type-caption text-slate-500">{today}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                {greeting},{' '}
                <span className="bg-gradient-to-r from-violet-300 to-pink-300 bg-clip-text text-transparent">
                  {firstName}
                </span>{' '}
                👋
              </h1>
              <p className="text-slate-400 text-sm max-w-md">
                You're on a <span className="text-orange-400 font-semibold">14-day streak</span>. Keep it up — you're in the top 8% of learners this week!
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link to="/learn">
                  <GradientButton size="sm" leftIcon={<Play size={14} />}>
                    Continue Learning
                  </GradientButton>
                </Link>
                <Link to="/chat">
                  <GradientButton size="sm" variant="ghost" className="!text-slate-300 hover:!text-white hover:!bg-white/10" leftIcon={<MessageSquare size={14} />}>
                    Start AI Chat
                  </GradientButton>
                </Link>
              </div>
            </div>

            {/* Streak widget in banner */}
            <div className="flex-shrink-0 hidden sm:block">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center min-w-[140px]">
                <div className="flex items-center justify-center gap-1.5 mb-2">
                  <Flame size={18} className="text-orange-400" />
                  <span className="text-3xl font-bold text-white">14</span>
                </div>
                <p className="text-slate-400 text-xs font-medium">Day Streak</p>
                <div className="flex gap-1 mt-3 justify-center flex-wrap max-w-[112px]">
                  {STREAK_DAYS.slice(-14).map((active, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-sm transition-colors ${active ? 'bg-orange-400' : 'bg-white/10'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Upgrade banner ───────────────────────────────────────────── */}
        {user?.subscription_tier === 'free' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 px-5 py-4 flex items-center justify-between gap-4 shadow-primary-lg"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.07),transparent)]" />
            <div className="relative flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <Trophy size={16} className="text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Unlock Pro — unlimited AI credits, all tools & automation</p>
                <p className="text-violet-100/70 text-xs mt-0.5">Join 2,400+ learners already on Pro</p>
              </div>
            </div>
            <Link to="/pricing" className="flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-white text-violet-700 font-semibold text-xs px-4 py-2 rounded-xl hover:bg-violet-50 transition-colors whitespace-nowrap flex items-center gap-1.5"
              >
                Upgrade <ArrowUpRight size={13} />
              </motion.button>
            </Link>
          </motion.div>
        )}

        {/* ── Stat cards ───────────────────────────────────────────────── */}
        <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {statCards.map((s) => (
            <motion.div key={s.label} variants={item}>
              <div className="card-md h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl ${s.bg} border ${s.border} flex items-center justify-center flex-shrink-0`}>
                    <s.icon size={18} className={s.iconClass} />
                  </div>
                  <span className={`text-2xs font-semibold px-2 py-0.5 rounded-full ${s.changeUp ? 'text-emerald-700 bg-emerald-50' : 'text-error-700 bg-error-50'}`}>
                    {s.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-slate-900 leading-none">
                  <AnimatedCounter to={s.value} />
                </p>
                <p className="type-body-sm mt-1.5">{s.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Main grid: Chart + Quick Actions ────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* AI Usage Chart */}
          <motion.div variants={item} initial="hidden" animate="visible" className="lg:col-span-2">
            <div className="card-lg h-full">
              <div className="section-title-row">
                <div>
                  <h2 className="section-title flex items-center gap-2">
                    <BarChart2 size={16} className="text-violet-500" />
                    AI Usage Analytics
                  </h2>
                  <p className="type-caption mt-0.5">Token usage over the last 7 days</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="badge-primary text-2xs">This week</span>
                  <span className="type-caption">
                    <span className="font-semibold text-slate-700">19.6k</span> total tokens
                  </span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={AI_USAGE_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="tokenGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#7c3aed" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="sessionGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#2563eb" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="tokens" stroke="#7c3aed" strokeWidth={2.5} fill="url(#tokenGrad)" dot={false} activeDot={{ r: 5, fill: '#7c3aed', strokeWidth: 0 }} />
                  <Area type="monotone" dataKey="sessions" stroke="#2563eb" strokeWidth={2} fill="url(#sessionGrad)" dot={false} activeDot={{ r: 4, fill: '#2563eb', strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
              {/* Legend */}
              <div className="flex items-center gap-5 mt-3 pt-3 border-t border-slate-50">
                {[{ color: '#7c3aed', label: 'AI Tokens' }, { color: '#2563eb', label: 'Chat Sessions' }].map((l) => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <div className="w-3 h-1.5 rounded-full" style={{ background: l.color }} />
                    <span className="type-caption">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={item} initial="hidden" animate="visible" className="lg:col-span-1">
            <div className="card-lg h-full">
              <h2 className="section-title flex items-center gap-2 mb-4">
                <Target size={16} className="text-violet-500" />
                Quick Actions
              </h2>
              <div className="space-y-2.5">
                {QUICK_ACTIONS.map((a) => (
                  <Link key={a.href} to={a.href}>
                    <motion.div
                      whileHover={{ x: 3 }}
                      className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer"
                    >
                      <div className={`w-9 h-9 rounded-xl ${a.color} flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform`}>
                        <a.icon size={16} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900">{a.label}</p>
                        <p className="type-caption truncate">{a.desc}</p>
                      </div>
                      <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500 flex-shrink-0 transition-colors" />
                    </motion.div>
                  </Link>
                ))}
              </div>

              {/* Today's goal */}
              <div className="mt-5 p-4 rounded-xl bg-violet-50 border border-violet-100">
                <div className="flex items-center gap-2 mb-2">
                  <Target size={14} className="text-violet-600" />
                  <p className="text-xs font-semibold text-violet-700">Today's Goal</p>
                </div>
                <p className="text-sm text-slate-700 font-medium mb-2">Complete 2 lessons</p>
                <ProgressBar value={50} color="bg-violet-500" />
                <p className="type-caption mt-1.5">1 of 2 completed</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Row: Learning progress + Activities + Tools ──────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Learning Progress */}
          <motion.div variants={item} initial="hidden" animate="visible" className="lg:col-span-1">
            <div className="card-lg h-full">
              <div className="section-title-row">
                <h2 className="section-title flex items-center gap-2">
                  <GraduationCap size={16} className="text-blue-500" />
                  Learning Progress
                </h2>
                <Link to="/learn" className="type-caption text-violet-600 hover:text-violet-700 font-semibold flex items-center gap-0.5">
                  All <ChevronRight size={12} />
                </Link>
              </div>
              <div className="space-y-4">
                {COURSES.map((c) => (
                  <motion.div key={c.id} whileHover={{ x: 2 }} className="group cursor-pointer">
                    <div className="flex items-start justify-between mb-1.5 gap-2">
                      <p className="text-sm font-medium text-slate-800 leading-tight group-hover:text-violet-700 transition-colors line-clamp-1">{c.title}</p>
                      <span className="text-2xs font-bold text-slate-500 flex-shrink-0">{c.progress}%</span>
                    </div>
                    <ProgressBar value={c.progress} color={c.color} />
                    <div className="flex items-center justify-between mt-1">
                      <span className="type-caption">{c.lessons}/{c.total} lessons</span>
                      <span className={`text-2xs font-semibold ${c.progress >= 80 ? 'text-emerald-600' : 'text-slate-400'}`}>{c.badge}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Weekly tools bar chart */}
              <div className="mt-5 pt-4 border-t border-slate-50">
                <p className="type-caption mb-3 flex items-center gap-1.5">
                  <BarChart2 size={12} /> Top tools this week
                </p>
                <ResponsiveContainer width="100%" height={90}>
                  <BarChart data={WEEKLY_TOOLS} margin={{ top: 0, right: 0, left: -32, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {WEEKLY_TOOLS.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div variants={item} initial="hidden" animate="visible" className="lg:col-span-1">
            <div className="card-lg h-full">
              <div className="section-title-row">
                <h2 className="section-title flex items-center gap-2">
                  <Clock size={16} className="text-emerald-500" />
                  Recent Activity
                </h2>
                <span className="badge-success text-2xs">Live</span>
              </div>
              <div className="space-y-1">
                {ACTIVITIES.map((a, idx) => (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group cursor-default"
                  >
                    <div className={`w-7 h-7 rounded-lg ${a.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <a.icon size={13} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-700 leading-snug">{a.title}</p>
                      <p className="type-caption mt-0.5">{a.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <Link to="/tools/history">
                <motion.div
                  whileHover={{ y: -1 }}
                  className="mt-3 pt-3 border-t border-slate-50 text-center"
                >
                  <span className="text-xs text-violet-600 font-semibold hover:text-violet-700">View full history →</span>
                </motion.div>
              </Link>
            </div>
          </motion.div>

          {/* Recommended AI Tools */}
          <motion.div variants={item} initial="hidden" animate="visible" className="lg:col-span-1">
            <div className="card-lg h-full">
              <div className="section-title-row">
                <h2 className="section-title flex items-center gap-2">
                  <Sparkles size={16} className="text-pink-500" />
                  Recommended Tools
                </h2>
                <Link to="/tools" className="type-caption text-violet-600 hover:text-violet-700 font-semibold flex items-center gap-0.5">
                  All <ChevronRight size={12} />
                </Link>
              </div>
              <div className="space-y-2.5">
                {TOOLS.map((t) => (
                  <Link key={t.slug} to={`/tools/${t.slug}`}>
                    <motion.div
                      whileHover={{ x: 2 }}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer"
                    >
                      <div className={`${t.color} w-9 h-9 flex-shrink-0`}>
                        <t.icon size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800">{t.label}</p>
                        <p className="type-caption truncate">{t.desc}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-2xs font-semibold text-slate-500">{t.uses}</p>
                        <p className="type-caption">uses</p>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>

              {/* Achievement card */}
              <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
                    <Award size={18} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-amber-800">New Badge Earned!</p>
                    <p className="text-2xs text-amber-600 mt-0.5">"Prompt Master" — top 5% user</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Bottom row: Worksheets + Student stats ───────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Recent Worksheets */}
          <motion.div variants={item} initial="hidden" animate="visible" className="lg:col-span-3">
            <div className="card-lg">
              <div className="section-title-row">
                <h2 className="section-title flex items-center gap-2">
                  <FileText size={16} className="text-indigo-500" />
                  Recent Worksheets
                </h2>
                <span className="badge-default text-2xs">{WORKSHEETS.length} items</span>
              </div>
              <div className="space-y-2">
                {WORKSHEETS.map((w, idx) => (
                  <motion.div
                    key={w.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06 }}
                    className="flex items-center gap-4 p-3.5 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer"
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${w.status === 'done' ? 'bg-emerald-50' : 'bg-slate-100'}`}>
                      {w.status === 'done'
                        ? <CheckCircle2 size={16} className="text-emerald-500" />
                        : <CircleDot size={16} className="text-slate-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 group-hover:text-violet-700 transition-colors truncate">{w.title}</p>
                      <p className="type-caption mt-0.5">{w.course}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {w.score !== null
                        ? <span className={`text-sm font-bold ${w.score >= 90 ? 'text-emerald-600' : w.score >= 70 ? 'text-blue-600' : 'text-orange-600'}`}>{w.score}%</span>
                        : <span className={`badge text-2xs ${w.due === 'Tomorrow' ? 'bg-orange-50 text-orange-700' : 'bg-slate-100 text-slate-600'}`}>{w.due}</span>
                      }
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Student Stats */}
          <motion.div variants={item} initial="hidden" animate="visible" className="lg:col-span-2">
            <div className="card-lg h-full flex flex-col gap-5">
              <h2 className="section-title flex items-center gap-2">
                <Users size={16} className="text-violet-500" />
                Your Stats
              </h2>

              {/* Streak calendar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="type-caption flex items-center gap-1.5">
                    <Calendar size={12} /> Activity — last 21 days
                  </p>
                  <div className="flex items-center gap-1">
                    <Flame size={13} className="text-orange-500" />
                    <span className="text-2xs font-bold text-orange-600">14 day streak</span>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {STREAK_DAYS.map((active, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className={`aspect-square rounded-md ${active ? 'bg-violet-400' : 'bg-slate-100'}`}
                    />
                  ))}
                </div>
              </div>

              {/* Level progress */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                      <Star size={14} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-violet-900">Level 12 — Explorer</p>
                      <p className="text-2xs text-violet-600">680 / 1000 XP to Level 13</p>
                    </div>
                  </div>
                </div>
                <ProgressBar value={68} color="bg-gradient-to-r from-violet-500 to-purple-500" />
              </div>

              {/* Mini leaderboard */}
              <div>
                <p className="type-caption mb-2 flex items-center gap-1.5">
                  <Trophy size={12} className="text-amber-500" /> Weekly leaderboard
                </p>
                {[
                  { rank: 1, name: 'Alex K.', xp: '2,840', you: false },
                  { rank: 2, name: 'Maria S.', xp: '2,610', you: false },
                  { rank: 3, name: 'You', xp: '2,240', you: true },
                ].map((u) => (
                  <div key={u.rank} className={`flex items-center gap-3 py-1.5 px-2 rounded-lg ${u.you ? 'bg-violet-50' : ''}`}>
                    <span className={`text-2xs font-bold w-4 text-center ${u.rank === 1 ? 'text-amber-500' : 'text-slate-400'}`}>{u.rank}</span>
                    <span className={`text-xs flex-1 font-medium ${u.you ? 'text-violet-700' : 'text-slate-600'}`}>{u.name}</span>
                    <span className="text-2xs font-semibold text-slate-500">{u.xp} XP</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </AppLayout>
  );
}
