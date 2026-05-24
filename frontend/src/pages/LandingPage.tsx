import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Sparkles, Brain, BookOpen, Zap, Users, GraduationCap, ArrowRight,
  Bot, BarChart3, Shield, Star, CheckCircle2, Play,
  Layers, Cpu, FlaskConical, Lightbulb, MessageSquare, ChevronRight,
} from 'lucide-react';

// ─── Data ─────────────────────────────────────────────────────────────────────

const STATS = [
  { value: '50K+', label: 'Active Students' },
  { value: '1,200+', label: 'AI Lessons' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '120+', label: 'Partner Schools' },
];

const SCHOOLS = [
  'Harvard Extension', 'Stanford Online', 'MIT OpenCourseWare',
  'Oxford Digital', 'Cambridge AI Lab', 'Berkeley EECS',
];

const FEATURES = [
  {
    icon: Brain,
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
    iconColor: 'text-violet-600',
    title: 'Personalized AI Tutor',
    desc: 'Adaptive learning paths powered by GPT-4 that adjust in real-time to each student\'s pace, strengths, and learning style.',
  },
  {
    icon: BookOpen,
    color: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    title: '1,200+ AI Courses',
    desc: 'From prompt engineering to machine learning — structured curricula built by leading educators and industry experts.',
  },
  {
    icon: FlaskConical,
    color: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    title: 'Live AI Sandbox',
    desc: 'Experiment with AI models directly in the browser. No setup needed — run prompts, fine-tune parameters, see results instantly.',
  },
  {
    icon: BarChart3,
    color: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    title: 'Progress Analytics',
    desc: 'Granular insights for students and instructors — completion rates, skill gaps, engagement heatmaps, and XP tracking.',
  },
  {
    icon: Users,
    color: 'from-pink-500 to-rose-500',
    bg: 'bg-pink-50',
    iconColor: 'text-pink-600',
    title: 'Collaborative Classrooms',
    desc: 'Real-time peer collaboration, shared AI workspaces, group projects, and instructor-led live sessions built-in.',
  },
  {
    icon: Shield,
    color: 'from-indigo-500 to-violet-500',
    bg: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
    title: 'Safe for Schools',
    desc: 'COPPA & FERPA compliant. Content filtering, parental controls, and audit logs designed for K-12 and higher education.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Dr. Sarah Chen',
    role: 'CS Professor, Stanford',
    avatar: 'SC',
    rating: 5,
    text: 'Future Minds transformed how I teach AI to undergraduates. The adaptive paths mean every student gets exactly what they need — no one gets left behind.',
  },
  {
    name: 'Marcus Johnson',
    role: 'High School Teacher, NYC',
    avatar: 'MJ',
    rating: 5,
    text: 'My 10th graders went from zero AI knowledge to building their own chatbots in 6 weeks. The sandbox environment is absolutely magical.',
  },
  {
    name: 'Priya Patel',
    role: 'Student, Grade 11',
    avatar: 'PP',
    rating: 5,
    text: 'I got a 98 on my AI project because of the courses here. The AI tutor explained things 10x better than any YouTube video I found.',
  },
];

const HOW_IT_WORKS = [
  { step: '01', icon: GraduationCap, title: 'Create Your Profile', desc: 'Set your learning goals, skill level, and areas of interest in under 2 minutes.' },
  { step: '02', icon: Brain, title: 'AI Builds Your Path', desc: 'Our AI analyzes your goals and crafts a personalized curriculum just for you.' },
  { step: '03', icon: Zap, title: 'Learn by Doing', desc: 'Interactive lessons, live sandboxes, and real AI tools — not just videos.' },
  { step: '04', icon: BarChart3, title: 'Track & Level Up', desc: 'Earn XP, unlock badges, and watch your skills compound over time.' },
];

const PRICING_HIGHLIGHTS = [
  'Unlimited AI tutor messages',
  'Full course library access',
  'Live sandbox environment',
  'Progress certificates',
  'Priority support',
];

// ─── Animation variants ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' } }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function FloatingOrb({ className }: { className: string }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
      animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.7, 0.5] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

function AIIllustration() {
  return (
    <div className="relative w-full max-w-lg mx-auto select-none">
      {/* Outer ring */}
      <motion.div
        className="absolute inset-0 rounded-3xl border border-violet-200/60"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        style={{ borderRadius: '38% 62% 45% 55% / 55% 48% 52% 45%' }}
      />
      {/* Main card */}
      <motion.div
        className="relative bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-card-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {/* Chat UI mock */}
        <div className="space-y-3 mb-4">
          <div className="flex items-start gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-ai flex items-center justify-center flex-shrink-0">
              <Bot size={14} className="text-white" />
            </div>
            <div className="bg-violet-50 rounded-2xl rounded-tl-sm px-3 py-2 text-xs text-slate-700 max-w-[75%]">
              Hi! I'm your AI tutor. What would you like to learn today? 🎓
            </div>
          </div>
          <div className="flex items-start gap-2 justify-end">
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl rounded-tr-sm px-3 py-2 text-xs text-white max-w-[75%]">
              Explain neural networks like I'm 15
            </div>
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-400 to-orange-400 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
              S
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-ai flex items-center justify-center flex-shrink-0">
              <Bot size={14} className="text-white" />
            </div>
            <div className="bg-violet-50 rounded-2xl rounded-tl-sm px-3 py-2 text-xs text-slate-700 max-w-[80%]">
              Imagine your brain has millions of tiny switches...
              <motion.span
                className="inline-block w-1 h-3 ml-0.5 bg-violet-500 rounded-sm align-middle"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="border-t border-slate-100 pt-3">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-medium">Neural Networks — Lesson 3</span>
            <span className="text-violet-600 font-semibold">68%</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '68%' }}
              transition={{ duration: 1.2, delay: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
      </motion.div>

      {/* Floating stat badges */}
      <motion.div
        className="absolute -top-4 -right-4 bg-white rounded-xl px-3 py-2 shadow-card border border-slate-100 flex items-center gap-1.5"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.4 }}
      >
        <Star size={12} className="text-amber-400 fill-amber-400" />
        <span className="text-xs font-semibold text-slate-700">4.9/5 rating</span>
      </motion.div>

      <motion.div
        className="absolute -bottom-4 -left-4 bg-white rounded-xl px-3 py-2 shadow-card border border-slate-100 flex items-center gap-1.5"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.4 }}
      >
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs font-semibold text-slate-700">3,241 learning now</span>
      </motion.div>

      <motion.div
        className="absolute top-1/2 -left-6 -translate-y-1/2 bg-white rounded-xl px-2.5 py-2 shadow-card border border-slate-100"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.4, duration: 0.4 }}
        whileHover={{ x: 2 }}
      >
        <div className="flex items-center gap-1.5">
          <Zap size={12} className="text-amber-500" />
          <span className="text-xs font-semibold text-slate-700">+50 XP earned</span>
        </div>
      </motion.div>
    </div>
  );
}

function NavBar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-primary">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="font-bold text-slate-900 text-lg tracking-tight">Future Minds <span className="text-violet-600">AI</span></span>
        </div>

        <div className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          {['Features', 'Courses', 'Pricing', 'Schools'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-violet-600 transition-colors">{item}</a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link to="/login" className="hidden sm:block text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors">
            Sign in
          </Link>
          <Link
            to="/register"
            className="text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2 rounded-xl shadow-primary hover:shadow-primary-lg transition-all hover:-translate-y-0.5"
          >
            Get Started Free
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <div className="bg-white overflow-x-hidden">
      <NavBar />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-violet-950 to-slate-900" />
        <div className="absolute inset-0 opacity-40"
          style={{ backgroundImage: 'radial-gradient(at 20% 30%, hsla(265,100%,60%,0.4) 0, transparent 50%), radial-gradient(at 80% 10%, hsla(330,100%,60%,0.3) 0, transparent 40%), radial-gradient(at 60% 80%, hsla(220,100%,60%,0.3) 0, transparent 50%)' }}
        />

        {/* Dot grid overlay */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(139,92,246,0.8) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />

        {/* Floating orbs */}
        <FloatingOrb className="w-96 h-96 bg-violet-600/30 -top-20 -left-20" />
        <FloatingOrb className="w-80 h-80 bg-pink-500/20 top-1/3 right-0" />
        <FloatingOrb className="w-64 h-64 bg-blue-500/20 bottom-10 left-1/4" />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

              {/* Left: copy */}
              <div>
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="space-y-6"
                >
                  <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-violet-300 text-xs font-semibold px-3.5 py-1.5 rounded-full">
                    <Sparkles size={12} className="text-violet-400" />
                    Powered by GPT-4 & Claude 3
                    <span className="bg-violet-500/40 text-violet-200 text-xs px-1.5 py-0.5 rounded-full">NEW</span>
                  </motion.div>

                  <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] tracking-tight">
                    Learn AI.{' '}
                    <span className="relative">
                      <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                        Teach smarter.
                      </span>
                      <motion.span
                        className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-violet-400 to-pink-400 rounded-full"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                        style={{ transformOrigin: 'left' }}
                      />
                    </span>
                    {' '}Shape tomorrow.
                  </motion.h1>

                  <motion.p variants={fadeUp} className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-xl">
                    The world's most advanced AI education platform. Personalized curricula, live AI sandboxes, and real-time progress analytics — built for students and schools that want to lead, not follow.
                  </motion.p>

                  <motion.div variants={fadeUp} className="flex flex-wrap gap-3 pt-2">
                    <Link
                      to="/register"
                      className="group inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold px-6 py-3.5 rounded-xl shadow-primary-lg hover:shadow-primary-xl transition-all hover:-translate-y-0.5 text-base"
                    >
                      Start Learning Free
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <button className="group inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/20 text-white font-semibold px-6 py-3.5 rounded-xl transition-all hover:-translate-y-0.5 text-base">
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                        <Play size={10} className="text-white fill-white ml-0.5" />
                      </div>
                      Watch Demo
                    </button>
                  </motion.div>

                  <motion.div variants={fadeUp} className="flex items-center gap-4 pt-2">
                    <div className="flex -space-x-2">
                      {['SC', 'MJ', 'PP', 'AK', 'LR'].map((initials, i) => (
                        <div key={i} className={`w-8 h-8 rounded-full border-2 border-slate-900 flex items-center justify-center text-white text-xs font-bold ${
                          ['bg-violet-500','bg-pink-500','bg-blue-500','bg-emerald-500','bg-amber-500'][i]
                        }`}>
                          {initials}
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="flex items-center gap-1 mb-0.5">
                        {Array(5).fill(0).map((_, i) => (
                          <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                      <p className="text-xs text-slate-400"><span className="text-white font-semibold">50,000+</span> students already learning</p>
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              {/* Right: illustration */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <AIIllustration />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-9 rounded-full border-2 border-white/30 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-white/60" />
          </div>
        </motion.div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────────────────── */}
      <section className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            {STATS.map((stat, i) => (
              <motion.div key={stat.label} variants={fadeUp} custom={i} className="text-center">
                <p className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-400 mt-1 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Trusted by ────────────────────────────────────────────────────── */}
      <section className="bg-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold text-slate-500 uppercase tracking-widest mb-8">
            Trusted by educators at world-class institutions
          </p>
          <div className="relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-900 to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-900 to-transparent z-10" />
            <motion.div
              className="flex gap-12 items-center"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              {[...SCHOOLS, ...SCHOOLS].map((school, i) => (
                <div key={i} className="flex-shrink-0 flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors whitespace-nowrap">
                  <GraduationCap size={16} />
                  <span className="text-sm font-semibold">{school}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 text-violet-600 text-xs font-semibold uppercase tracking-wider bg-violet-50 px-3 py-1.5 rounded-full mb-4">
              <Layers size={12} /> Everything you need
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              AI education, <span className="text-violet-600">reimagined</span>
            </h2>
            <p className="text-lg text-slate-500 mt-4 max-w-2xl mx-auto">
              Not just videos. Real tools, real AI, real learning — all in one platform built for the next generation.
            </p>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                custom={i}
                className="group relative bg-white border border-slate-100 rounded-2xl p-6 hover:border-violet-200 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 cursor-default"
              >
                <div className={`w-11 h-11 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
                  <f.icon size={20} className={f.iconColor} />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-violet-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-b-2xl" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 text-violet-600 text-xs font-semibold uppercase tracking-wider bg-violet-50 px-3 py-1.5 rounded-full mb-4">
              <Cpu size={12} /> Simple process
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Up and learning in <span className="text-violet-600">minutes</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connector line */}
            <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-violet-200 to-transparent" />

            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="relative text-center"
              >
                <div className="relative inline-flex mb-4">
                  <div className="w-20 h-20 rounded-2xl bg-white border border-slate-100 shadow-card flex items-center justify-center mx-auto">
                    <step.icon size={28} className="text-violet-600" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br from-violet-600 to-purple-700 text-white text-xs font-bold flex items-center justify-center shadow-primary">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 text-violet-600 text-xs font-semibold uppercase tracking-wider bg-violet-50 px-3 py-1.5 rounded-full mb-4">
              <MessageSquare size={12} /> Testimonials
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Loved by students <span className="text-violet-600">&amp; teachers</span>
            </h2>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                variants={fadeUp}
                custom={i}
                className="bg-gradient-to-br from-slate-50 to-violet-50/30 border border-slate-100 rounded-2xl p-6 hover:shadow-card-hover transition-all hover:-translate-y-1"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array(t.rating).fill(0).map((_, j) => (
                    <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-primary">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Pricing CTA ───────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 bg-gradient-to-br from-slate-950 via-violet-950 to-slate-900 relative overflow-hidden">
        <FloatingOrb className="w-96 h-96 bg-violet-600/20 -top-20 -right-20" />
        <FloatingOrb className="w-64 h-64 bg-pink-500/15 bottom-0 left-0" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 text-violet-300 text-xs font-semibold uppercase tracking-wider bg-violet-500/20 border border-violet-500/30 px-3 py-1.5 rounded-full mb-6">
              <Lightbulb size={12} /> Pro Plan
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
              Everything for <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">$12/month</span>
            </h2>
            <p className="text-lg text-slate-300 mb-8 max-w-xl mx-auto">
              One affordable plan. Every feature unlocked. Cancel anytime.
            </p>

            <div className="grid sm:grid-cols-2 gap-3 max-w-md mx-auto mb-10 text-left">
              {PRICING_HIGHLIGHTS.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                  className="flex items-center gap-2 text-sm text-slate-300"
                >
                  <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0" />
                  {item}
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/register"
                className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold px-8 py-4 rounded-xl shadow-primary-xl hover:shadow-primary-xl transition-all hover:-translate-y-0.5 text-base"
              >
                Start Free — No Card Required
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold px-8 py-4 rounded-xl transition-all hover:-translate-y-0.5 text-base"
              >
                Compare plans <ChevronRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="bg-slate-950 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center">
                <Sparkles size={14} className="text-white" />
              </div>
              <span className="font-bold text-white text-base">Future Minds <span className="text-violet-400">AI</span></span>
            </div>

            <div className="flex items-center gap-6 text-xs text-slate-500">
              {['Privacy', 'Terms', 'Cookies', 'Contact'].map((item) => (
                <a key={item} href="#" className="hover:text-slate-300 transition-colors">{item}</a>
              ))}
            </div>

            <p className="text-xs text-slate-600">© 2025 Future Minds AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
