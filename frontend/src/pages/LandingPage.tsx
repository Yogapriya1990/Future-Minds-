import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Brain, BookOpen, Zap, Users, GraduationCap, ArrowRight,
  Bot, BarChart3, Shield, Star, CheckCircle2, Play,
  Layers, Cpu, FlaskConical, Lightbulb, MessageSquare, ChevronRight,
  ChevronDown, Sparkles,
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

const AI_TOOLS = [
  'ChatGPT', 'Claude', 'Python', 'LangChain', 'Hugging Face',
  'n8n', 'Flowise', 'Stable Diffusion', 'Pinecone', 'Whisper',
  'Midjourney', 'AutoGen',
];


const FEATURES = [
  {
    icon: Brain,
    bg: 'bg-violet-50',
    iconColor: 'text-violet-600',
    title: 'Personalized AI Tutor',
    desc: 'Adaptive learning paths powered by GPT-4 that adjust in real-time to each student\'s pace, strengths, and learning style.',
  },
  {
    icon: BookOpen,
    bg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    title: '1,200+ AI Courses',
    desc: 'From prompt engineering to machine learning — structured curricula built by leading educators and industry experts.',
  },
  {
    icon: FlaskConical,
    bg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    title: 'Live AI Sandbox',
    desc: 'Experiment with AI models directly in the browser. No setup needed — run prompts, fine-tune parameters, see results instantly.',
  },
  {
    icon: BarChart3,
    bg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    title: 'Progress Analytics',
    desc: 'Granular insights for students and instructors — completion rates, skill gaps, engagement heatmaps, and XP tracking.',
  },
  {
    icon: Users,
    bg: 'bg-pink-50',
    iconColor: 'text-pink-600',
    title: 'Collaborative Classrooms',
    desc: 'Real-time peer collaboration, shared AI workspaces, group projects, and instructor-led live sessions built-in.',
  },
  {
    icon: Shield,
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

const LOCAL_TRUST_BADGES = [
  { emoji: '🎓', number: '50+',      label: 'Kids Trained' },
  { emoji: '📅', number: 'Sat & Sun', label: 'Weekend Classes' },
  { emoji: '⏱', number: '1 Hour',   label: 'Daily Doubt Clearing' },
  { emoji: '📍', number: 'Local', label: 'Based in Gudiyattam' },
];

const GALLERY = [
  { src: '/images/photo1.jpg',   caption: 'Getting started with AI basics' },
  { src: '/images/photo2.jpg',   caption: 'Weekend class in action' },
  { src: '/images/photo3.webp',  caption: 'Daily doubt clearing session' },
  { src: '/images/photo4.jpg',   caption: 'Our proud graduates!' },
];

const PARENT_TESTIMONIALS = [
  {
    quote: 'We are very happy to share our feedback about Thejo Pranav and Rupesh. Within just 5 days, we could clearly see a lot of positive improvements in them. They are very eager to attend the classes every day, highly curious to learn new things, and actively participate during the sessions. What makes us even happier is that they are implementing the learnings at home as well. We can see a noticeable change in their thinking, confidence, and enthusiasm towards learning. A heartfelt thanks to the mentor for creating such an engaging and inspiring learning environment for the children.',
    name: 'Kavya',
    location: 'Gudiyattam',
    initials: 'K',
  },
  {
    quote: 'Honestly I wasn\'t sure if a child in Class 6 could understand AI. But the way Yogapriya explains things — no jargon, no pressure, very hands-on — my daughter grasped it faster than I expected. She even taught her grandfather what ChatGPT is! Worth every rupee.',
    name: 'Nirmala',
    location: 'Parent of Moulesswaran (Age 12), Gudiyattam',
    initials: 'MW',
  },
  {
    quote: 'As a working parent I wanted something local, trustworthy and actually useful for my child\'s future. Future Minds AI Academy is exactly that. Weekend timing is perfect, and the 1-hour doubt session on weekdays means my son never misses anything. Highly recommend to every parent in Gudiyattam.',
    name: 'Revathi',
    location: 'Parent of Lathika (Age 9), Gudiyattam',
    initials: 'RL',
  },
];

const AGE_OPTIONS = [
  { value: '', label: 'Who is this for?' },
  { value: 'child-9-12', label: 'My child (Age 9–12)' },
  { value: 'child-13-16', label: 'My child (Age 13–16)' },
  { value: 'adult', label: 'Myself (Adult learner)' },
  { value: 'both', label: 'Both me and my child' },
];

const FAQS = [
  {
    q: 'Is it really free to start?',
    a: 'Yes — no credit card required. You get full access to the first module of every course, the AI chat, and the sandbox for free. Upgrade to Pro anytime for unlimited access.',
  },
  {
    q: 'What AI tools are included?',
    a: 'We cover ChatGPT, Claude, Python, LangChain, Hugging Face, n8n, Flowise, Stable Diffusion, Pinecone, and more. The curriculum is updated every quarter as new tools emerge.',
  },
  {
    q: 'Can I use it for my classroom or school?',
    a: 'Absolutely. We offer school plans with admin dashboards, student progress tracking, content filtering, and FERPA/COPPA compliance. Contact us for institutional pricing.',
  },
  {
    q: 'How is this different from YouTube tutorials?',
    a: 'YouTube is passive. Future Minds is hands-on — your AI tutor asks you questions, you run code in the live sandbox, and your progress is tracked so you never lose momentum.',
  },
  {
    q: 'Do I get a certificate when I finish?',
    a: 'Yes. Every completed course generates a shareable certificate with a unique verification link. Pro users also get a portfolio page to showcase their projects.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes, cancel with one click from your billing page — no forms, no calls, no questions. Your access continues until the end of your paid period.',
  },
];

const FOOTER_LINKS = {
  Platform: ['Features', 'Courses', 'Pricing', 'Schools'],
  Company: ['About', 'Blog', 'Careers', 'Contact'],
  Legal: ['Privacy', 'Terms', 'Cookies', 'Security'],
};

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
      <motion.div
        className="absolute inset-0 rounded-3xl border border-violet-200/60"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        style={{ borderRadius: '38% 62% 45% 55% / 55% 48% 52% 45%' }}
      />
      <motion.div
        className="relative bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-card-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
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

function AnnouncementBar() {
  return (
    <div className="fixed top-0 inset-x-0 z-[60] bg-gradient-to-r from-violet-700 to-purple-700 border-b border-violet-600/50 h-9 flex items-center justify-center px-4">
      <p className="text-xs font-medium text-violet-100 text-center">
        <span className="font-semibold text-white">Doubt Clearing</span>
        <span className="mx-2.5 text-violet-400">|</span>
        <span>📍 Gudiyattam, Gudiyattam</span>
      </p>
    </div>
  );
}

function NavBar() {
  const scrollToForm = () => {
    document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <img src="/logo-wordmark.svg" alt="Future Minds AI" className="h-8 object-contain" />
        </div>

        <button
          onClick={scrollToForm}
          className="text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2 rounded-xl shadow-primary hover:shadow-primary-lg transition-all hover:-translate-y-0.5"
        >
          Register Your Seat →
        </button>
      </div>
    </motion.nav>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-100">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4"
      >
        <span className="text-base font-semibold text-slate-900">{q}</span>
        <ChevronDown
          size={18}
          className={`text-slate-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <p className="text-sm text-slate-500 leading-relaxed pb-5">{a}</p>
      )}
    </div>
  );
}

function RegistrationForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const msg = encodeURIComponent(
      `Hi! I registered on Future Minds AI website.\nName: ${name}\nPhone: ${phone}\nFor: ${AGE_OPTIONS.find(o => o.value === age)?.label ?? age}\nPlease send me the course details.`
    );
    window.open(`https://wa.me/918754548081?text=${msg}`, '_blank');
  };

  return (
    <section id="register" className="py-20 bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Reserve Your Spot
          </h2>
          <p className="text-slate-500 text-base leading-relaxed max-w-lg mx-auto">
            Fill in your details and we'll WhatsApp you with batch dates and course fee details within 24 hours.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white border border-slate-200 rounded-2xl shadow-card p-8"
        >
          {submitted ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">✅</div>
              <p className="text-lg font-semibold text-slate-900 mb-2">Thank you!</p>
              <p className="text-slate-500 text-sm">Early bird pricing available — ask us on WhatsApp.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">WhatsApp Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="Your WhatsApp number"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Who is this for?</label>
                <select
                  required
                  value={age}
                  onChange={e => setAge(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition bg-white appearance-none"
                >
                  {AGE_OPTIONS.map(o => (
                    <option key={o.value} value={o.value} disabled={o.value === ''}>{o.label}</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold text-base shadow-primary-lg hover:shadow-primary-xl transition-all hover:-translate-y-0.5 mt-2"
              >
                WhatsApp Me the Details →
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
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
      <div style={{ display: 'none' }}><AnnouncementBar /></div>
      <NavBar />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-violet-950 to-slate-900" />
        <div className="absolute inset-0 opacity-40"
          style={{ backgroundImage: 'radial-gradient(at 20% 30%, hsla(265,100%,60%,0.4) 0, transparent 50%), radial-gradient(at 80% 10%, hsla(330,100%,60%,0.3) 0, transparent 40%), radial-gradient(at 60% 80%, hsla(220,100%,60%,0.3) 0, transparent 50%)' }}
        />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(139,92,246,0.8) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />

        <FloatingOrb className="w-96 h-96 bg-violet-600/30 -top-20 -left-20" />
        <FloatingOrb className="w-80 h-80 bg-pink-500/20 top-1/3 right-0" />
        <FloatingOrb className="w-64 h-64 bg-blue-500/20 bottom-10 left-1/4" />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="max-w-3xl">

              {/* Left: copy */}
              <div>
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="space-y-6"
                >
                  <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] tracking-tight">
                    Learn AI This Weekend 🚀{' '}
                    <span className="relative">
                      <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                        For Kids &amp; Adults in Gudiyattam
                      </span>
                      <motion.span
                        className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-violet-400 to-pink-400 rounded-full"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                        style={{ transformOrigin: 'left' }}
                      />
                    </span>
                  </motion.h1>

                  <motion.p variants={fadeUp} className="text-sm text-slate-400 font-normal -mt-2">
                    Taught by Yogapriya · ₹1,500/month · Next batch starts 1 July
                  </motion.p>

                  <motion.p variants={fadeUp} className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-xl">
                    Weekend live classes every Saturday &amp; Sunday + 1-hour daily doubt clearing on weekdays.
                    Taught in-person in Gudiyattam Rajaganapathy Nagar, Gudiyattam.
                    Beginner-friendly. No coding needed. For kids aged 9–16 and working adults.
                  </motion.p>

                  <motion.div variants={fadeUp} className="flex flex-wrap gap-3 pt-2">
                    <button
                      onClick={() => document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })}
                      className="group inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold px-6 py-3.5 rounded-xl shadow-primary-lg hover:shadow-primary-xl transition-all hover:-translate-y-0.5 text-base"
                    >
                      Register Your Seat →
                    </button>
                  </motion.div>

                  <motion.div variants={fadeUp}>
                    <p className="text-sm text-slate-400 font-normal">50+ students already learning</p>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

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

      {/* ── Local trust bar ───────────────────────────────────────────────── */}
      <section className="bg-violet-50 border-y border-violet-100 py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {LOCAL_TRUST_BADGES.map(({ emoji, number, label }) => (
              <div key={label} className="flex flex-col items-center text-center gap-1">
                <span className="text-2xl">{emoji}</span>
                <span className="text-lg font-extrabold text-violet-700 leading-tight">{number}</span>
                <span className="text-xs font-medium text-violet-500">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Photo gallery ─────────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Real Kids. Real Learning 📸
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {GALLERY.map(({ src, caption }) => (
              <div key={caption} className="flex flex-col gap-2">
                <div className="rounded-2xl overflow-hidden shadow-card border border-slate-100 bg-slate-100 aspect-video">
                  <img
                    src={src}
                    alt={caption}
                    className="w-full h-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
                <p className="text-sm text-slate-500 text-center font-medium">{caption}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Parent testimonials ───────────────────────────────────────────── */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              What Parents Are Saying ❤️
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {PARENT_TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-6 flex flex-col gap-4 shadow-primary"
              >
                <span className="text-5xl font-serif text-white/30 leading-none select-none">"</span>
                <p className="text-white text-sm leading-relaxed -mt-4">{t.quote}</p>
                <div className="flex items-center gap-3 mt-auto pt-2 border-t border-white/20">
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold leading-tight">{t.name}</p>
                    <p className="text-violet-200 text-xs">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── About instructor ──────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-500 mb-8 text-center">Who is teaching you?</p>
            <div className="flex flex-col md:flex-row items-center gap-10">
              {/* Circular photo */}
              <div className="flex-shrink-0">
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-violet-100 shadow-lg bg-violet-50">
                  <img
                    src="/images/priya.jpg"
                    alt="Yogapriya Sambathkumar"
                    className="w-full h-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
              </div>
              {/* Text */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">
                  Hi, I'm Yogapriya Sambathkumar 👋
                </h2>
                <p className="text-slate-600 text-base leading-relaxed mb-6">
                  I'm a Program Manager at a global tech company with 13+ years in software delivery. I work daily with AI tools, automation, and systems design — and I built Future Minds AI Academy because every child and adult in Gudiyattam deserves access to these skills, not just people in big cities.
                  <br /><br />
                  I teach practically, in plain language, with zero jargon.
                </p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  {['PMP Certified', '13+ Years in Tech', 'AI & Automation Expert'].map(badge => (
                    <span key={badge} className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-200">
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Pricing cards ─────────────────────────────────────────────────── */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-500 mb-2">Pricing</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Simple, transparent fees</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">

            {/* Card 1 — Kids Track */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0 }}
              className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col shadow-sm"
            >
              <span className="inline-block self-start bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full mb-4">
                Early Bird — First 10 seats
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mb-0.5">Kids Track 👦</h3>
              <p className="text-sm text-slate-500 mb-4">Age 9–16</p>
              <div className="flex items-baseline gap-2 mb-5">
                <span className="text-3xl font-extrabold text-violet-600">₹2,999</span>
                <span className="text-slate-400 line-through text-sm">₹3,499</span>
              </div>
              <ul className="space-y-2 mb-7 flex-1">
                {[
                  '12 weekend live sessions',
                  'Daily 1hr doubt clearing',
                  'Certificate on completion',
                  'Hybrid — online + in-person',
                ].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="text-violet-500 font-bold">✓</span> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full py-3 px-6 rounded-xl border-2 border-violet-600 text-violet-600 font-semibold text-sm hover:bg-violet-50 transition-all"
              >
                Register Child →
              </button>
            </motion.div>

            {/* Card 2 — Adult Track (Most Popular) */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-6 flex flex-col shadow-primary relative"
            >
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-extrabold px-4 py-1 rounded-full tracking-wide">
                MOST POPULAR
              </span>
              <span className="inline-block self-start bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 mt-2">
                Early Bird — First 10 seats
              </span>
              <h3 className="text-xl font-extrabold text-white mb-0.5">Adult Track 👩‍💻</h3>
              <p className="text-sm text-violet-200 mb-4">Working professionals</p>
              <div className="flex items-baseline gap-2 mb-5">
                <span className="text-3xl font-extrabold text-amber-400">₹4,499</span>
                <span className="text-violet-300 line-through text-sm">₹5,499</span>
              </div>
              <ul className="space-y-2 mb-7 flex-1">
                {[
                  '12 weekend live sessions',
                  'Daily 1hr doubt clearing',
                  'AI tools + automation focus',
                  'Hybrid — online + in-person',
                ].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-violet-100">
                    <span className="text-green-400 font-bold">✓</span> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full py-3 px-6 rounded-xl bg-white text-violet-700 font-semibold text-sm hover:bg-violet-50 transition-all"
              >
                Register Myself →
              </button>
            </motion.div>

            {/* Card 3 — Family Plan */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col shadow-sm"
            >
              <span className="inline-block self-start bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full mb-4">
                Save ₹1,499
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mb-0.5">Family Pack 🔥</h3>
              <p className="text-sm text-slate-500 mb-4">You + your child</p>
              <div className="flex items-baseline gap-2 mb-5">
                <span className="text-3xl font-extrabold text-amber-500">₹7,499</span>
                <span className="text-slate-400 line-through text-sm">₹8,998</span>
              </div>
              <ul className="space-y-2 mb-7 flex-1">
                {[
                  'Both tracks included',
                  'Learn AI together',
                  'All sessions + doubt clearing',
                  '2 certificates',
                ].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="text-violet-500 font-bold">✓</span> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full py-3 px-6 rounded-xl border-2 border-violet-600 text-violet-600 font-semibold text-sm hover:bg-violet-50 transition-all"
              >
                Register Family →
              </button>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── Class schedule strip ──────────────────────────────────────────── */}
      <section className="bg-violet-50 border-y border-violet-100 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-500 mb-5 text-center">Class Schedule</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {[
              { icon: '📅', label: 'Saturday & Sunday', sub: 'Live classes' },
              { icon: '⏱', label: 'Mon – Fri', sub: '1hr doubt clearing session' },
              { icon: '📍', label: 'Rajaganapathy Nagar, Gudiyattam', sub: 'Gudiyattam' },
            ].map(({ icon, label, sub }) => (
              <div key={label} className="flex items-start gap-3 bg-white border border-violet-100 rounded-xl px-4 py-3 flex-1">
                <span className="text-xl leading-none mt-0.5">{icon}</span>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{label}</p>
                  <p className="text-xs text-slate-500">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Registration form ─────────────────────────────────────────────── */}
      <RegistrationForm />

      <div style={{ display: 'none' }}>
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
      <section className="bg-slate-900 py-12 border-b border-slate-800/60">
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

      {/* ── AI Tools marquee ──────────────────────────────────────────────── */}
      <section className="bg-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold text-slate-500 uppercase tracking-widest mb-8">
            Tools you'll master
          </p>
          <div className="relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-900 to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-900 to-transparent z-10" />
            <motion.div
              className="flex gap-4 items-center"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            >
              {[...AI_TOOLS, ...AI_TOOLS].map((tool, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold px-4 py-2 rounded-full whitespace-nowrap hover:border-violet-500/50 hover:text-violet-300 transition-colors"
                >
                  {tool}
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

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 text-violet-600 text-xs font-semibold uppercase tracking-wider bg-violet-100 px-3 py-1.5 rounded-full mb-4">
              <Lightbulb size={12} /> FAQ
            </span>
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Common <span className="text-violet-600">questions</span>
            </h2>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl border border-slate-100 shadow-card px-6 divide-y divide-slate-100"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {FAQS.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
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
      <footer className="bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
          {/* 4-column grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <img src="/logo.png" alt="Future Minds" className="h-7 w-7 object-contain" />
                <span className="font-bold text-white text-base">Future Minds <span className="text-violet-400">AI</span></span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                The AI education platform for the next generation — students, teachers, and schools.
              </p>
            </div>

            {/* Link columns */}
            {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
              <div key={heading}>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">{heading}</p>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-600">© 2025 Future Minds AI. All rights reserved.</p>
            <div className="flex items-center gap-4">
              {/* X (Twitter) */}
              <a href="#" aria-label="X / Twitter" className="text-slate-600 hover:text-slate-300 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="#" aria-label="LinkedIn" className="text-slate-600 hover:text-slate-300 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              {/* YouTube */}
              <a href="#" aria-label="YouTube" className="text-slate-600 hover:text-slate-300 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}
