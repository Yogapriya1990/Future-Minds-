import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Zap, Bot, Star, CheckCircle2, Lightbulb, ChevronDown,
} from 'lucide-react';

// ─── Data ─────────────────────────────────────────────────────────────────────


const LOCAL_TRUST_BADGES = [
  { emoji: '🎓', number: '50+',       label: 'Students Trained' },
  { emoji: '📅', number: 'Sat & Sun', label: 'Live Weekend Classes' },
  { emoji: '⏱', number: '5 Days',    label: 'Doubt Clearing / Week' },
  { emoji: '📍', number: 'In-Person', label: 'Gudiyattam, Tamil Nadu' },
];

const GALLERY = [
  { src: '/images/photo1.jpg', caption: 'Getting started with AI basics' },
  { src: '/images/photo4.jpg', caption: 'Certificate day — our proud graduates!' },
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
    q: 'Is this in-person or online?',
    a: 'Classes are held in-person at Rajaganapathy Nagar, Gudiyattam. If you are unable to attend in person on a particular day, we accommodate you online via a live video session so you never miss a class.',
  },
  {
    q: 'What age group is this suitable for?',
    a: 'Kids from age 9 to 16 are welcome in the Kids Track. Adults of any age — whether you are a working professional, homemaker, or entrepreneur — can join the Adult Track. We also have a Family Pack so you and your child can learn together.',
  },
  {
    q: 'Does my child need a laptop or coding knowledge?',
    a: 'No coding knowledge is needed at all — we start from absolute zero. A laptop or tablet is helpful but not mandatory for the first few sessions. We will guide you on what to arrange before the batch begins.',
  },
  {
    q: 'What will kids and adults actually learn?',
    a: 'Kids learn what AI is, how tools like ChatGPT work, how to use AI for school projects, and basic automation. Adults learn practical AI tools (ChatGPT, Claude, n8n, Canva AI), workflow automation, and how to apply AI in their profession or business.',
  },
  {
    q: 'How many students are in each batch?',
    a: 'We keep batches small — a maximum of 15 students — so every student gets personal attention and doubt clearing time. Once a batch is full, registrations move to the next batch.',
  },
  {
    q: 'Do I get a certificate after completing the course?',
    a: 'Yes. Every student who completes all 12 sessions receives a completion certificate from Future Minds AI Academy. This is a great addition to your child\'s portfolio or your own professional profile.',
  },
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
        <span>📍 Rajaganapathy Nagar, Gudiyattam</span>
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

        <div className="flex items-center gap-2">
          <a
            href="https://wa.me/918754548081"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-sm font-semibold text-green-600 border border-green-200 bg-green-50 px-3 py-2 rounded-xl hover:bg-green-100 transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </a>
          <button
            onClick={scrollToForm}
            className="text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2 rounded-xl shadow-primary hover:shadow-primary-lg transition-all hover:-translate-y-0.5"
          >
            Register →
          </button>
        </div>
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
              <p className="text-lg font-semibold text-slate-900 mb-2">You're registered!</p>
              <p className="text-slate-600 text-sm leading-relaxed">
                Yogapriya will WhatsApp you within 2 hours with batch dates, venue details, and fee confirmation.
              </p>
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
                  pattern="[6-9][0-9]{9}"
                  title="Enter a valid 10-digit Indian mobile number"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="10-digit WhatsApp number (e.g. 9876543210)"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Who is this for?</label>
                <div className="relative">
                  <select
                    required
                    value={age}
                    onChange={e => setAge(e.target.value)}
                    className="w-full px-4 py-3 pr-10 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition bg-white appearance-none"
                  >
                    {AGE_OPTIONS.map(o => (
                      <option key={o.value} value={o.value} disabled={o.value === ''}>{o.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
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
    <>
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
                  <motion.h1 variants={fadeUp} className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight">
                    Learn AI This Weekend For Kids and Adults{' '}
                    <span className="relative">
                      <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                        Beyond the Metros
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

                  <motion.p variants={fadeUp} className="text-base text-slate-300 font-normal -mt-2">
                    Taught by Yogapriya · Next batch forming now — limited seats
                  </motion.p>

                  <motion.p variants={fadeUp} className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-xl">
                    Weekend live classes every Saturday &amp; Sunday + 1-hour daily doubt clearing on weekdays.
                    In-person at Rajaganapathy Nagar, Gudiyattam. Beginner-friendly. No coding needed.
                    For kids aged 9–16 and working adults.
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

      </section>

      {/* ── Local trust bar ───────────────────────────────────────────────── */}
      <section className="bg-slate-50 border-y border-slate-100">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-slate-200">
            {LOCAL_TRUST_BADGES.map(({ emoji, number, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-white flex flex-col items-center text-center gap-2 py-8 px-4"
              >
                <div className="w-11 h-11 rounded-full bg-violet-50 border border-violet-100 flex items-center justify-center text-2xl mb-1">
                  {emoji}
                </div>
                <span className="text-2xl font-extrabold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                  {number}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-500 leading-snug max-w-[100px]">{label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Photo gallery ─────────────────────────────────────────────────── */}
      <section className="py-16 bg-violet-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 text-violet-600 text-xs font-semibold uppercase tracking-wider bg-violet-100 px-3 py-1.5 rounded-full mb-4">
              📸 Classroom Moments
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              Real Kids. Real Learning.
            </h2>
            <p className="text-slate-500 text-base max-w-lg mx-auto">
              From our recent batches in Gudiyattam — this is what AI learning looks like here.
            </p>
          </motion.div>

          <div className="flex flex-col gap-4">
            {GALLERY.map((item, i) => (
              <motion.div
                key={item.caption}
                className="group relative rounded-2xl overflow-hidden shadow-card bg-slate-200 aspect-[16/7]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <img
                  src={item.src}
                  alt={item.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-5 translate-y-1 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <p className="text-white text-sm font-semibold">{item.caption}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Parent testimonials ───────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              What Parents Are Saying ❤️
            </h2>
            <p className="text-slate-500 text-base max-w-xl mx-auto">
              Real feedback from parents in Gudiyattam whose children have already started learning.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {PARENT_TESTIMONIALS.map((t, i) => {
              const featured = i === 1;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`rounded-2xl p-6 flex flex-col gap-4 ${
                    featured
                      ? 'bg-gradient-to-br from-violet-600 to-purple-700 shadow-primary ring-2 ring-violet-400/30'
                      : 'bg-white border border-slate-200 shadow-sm'
                  }`}
                >
                  {/* Stars */}
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, s) => (
                      <svg key={s} className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {/* Quote */}
                  <p className={`text-sm leading-relaxed flex-1 ${featured ? 'text-white' : 'text-slate-700'}`}>
                    "{t.quote}"
                  </p>

                  {/* Author */}
                  <div className={`flex items-center gap-3 pt-3 border-t ${featured ? 'border-white/20' : 'border-slate-100'}`}>
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      featured ? 'bg-white/20 text-white' : 'bg-violet-100 text-violet-700'
                    }`}>
                      {t.initials}
                    </div>
                    <div>
                      <p className={`text-sm font-bold leading-tight ${featured ? 'text-white' : 'text-slate-900'}`}>{t.name}</p>
                      <p className={`text-xs ${featured ? 'text-violet-200' : 'text-slate-500'}`}>{t.location}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── About instructor ──────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 relative overflow-hidden">
        <FloatingOrb className="w-96 h-96 bg-violet-600/20 -top-20 right-0" />
        <FloatingOrb className="w-64 h-64 bg-pink-500/10 bottom-0 left-10" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 text-violet-300 text-xs font-semibold uppercase tracking-wider bg-violet-800/50 border border-violet-700/50 px-3 py-1.5 rounded-full">
              Meet Your Instructor
            </span>
          </motion.div>

          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* Photo with glow */}
            <motion.div
              className="flex-shrink-0"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-violet-500/40 blur-2xl scale-125 pointer-events-none" />
                <div className="relative w-52 h-52 rounded-full overflow-hidden border-4 border-violet-400/50 shadow-2xl bg-violet-900">
                  <img
                    src="/images/priya.png"
                    alt="Yogapriya Sambathkumar"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>

            {/* Text content */}
            <div className="flex-1 text-center lg:text-left">
              <motion.h2
                className="text-3xl sm:text-4xl font-extrabold text-white mb-1"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Hi, I'm Yogapriya 👋
              </motion.h2>

              <motion.p
                className="text-violet-300 font-semibold text-base mb-6"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                Program Manager · AI & Automation Practitioner · Gudiyattam
              </motion.p>

              <motion.p
                className="text-slate-300 text-base leading-relaxed mb-6"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                13+ years in global tech delivery. I work daily with AI tools, automation, and systems design — and I built Future Minds AI Academy because every child and adult in Gudiyattam deserves access to these skills, not just people in big cities.
              </motion.p>

              <motion.blockquote
                className="border-l-2 border-violet-400 pl-4 mb-8 text-violet-200 text-base italic"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.25 }}
              >
                "I teach practically, in plain language, with zero jargon."
              </motion.blockquote>

              {/* Credential stats */}
              <motion.div
                className="grid grid-cols-2 sm:grid-cols-4 gap-3"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {[
                  { value: '13+', label: 'Years in Tech' },
                  { value: 'PMP', label: 'Certified' },
                  { value: '50+', label: 'Students Trained' },
                  { value: 'AI', label: 'Daily Practitioner' },
                ].map(s => (
                  <div key={s.label} className="bg-white/10 backdrop-blur border border-white/10 rounded-xl p-3 text-center">
                    <p className="text-xl font-extrabold text-white">{s.value}</p>
                    <p className="text-xs text-violet-300 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing cards ─────────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-1.5 text-violet-600 text-xs font-semibold uppercase tracking-wider bg-violet-100 px-3 py-1.5 rounded-full mb-4">
              Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">Simple, transparent fees</h2>
            <p className="text-slate-500 text-base max-w-md mx-auto">
              One-time course fee · No subscriptions · Limited seats per batch
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:items-start">

            {/* Card 1 — Kids Track */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0 }}
              className="bg-white border-2 border-slate-200 rounded-2xl p-6 flex flex-col shadow-sm hover:border-violet-300 hover:shadow-md transition-all"
            >
              <span className="inline-block self-start bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full mb-5">
                Early Bird — First 10 seats
              </span>
              <div className="text-3xl mb-2">👦</div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-1">Kids Track</h3>
              <p className="text-sm text-slate-500 mb-5">Designed for ages 9–16</p>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl font-extrabold text-violet-600">₹2,999</span>
              </div>
              <p className="text-xs text-slate-400 line-through mb-6">Regular price ₹3,499</p>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  '12 weekend live sessions',
                  'Mon–Fri 1hr doubt clearing',
                  'Age-appropriate curriculum',
                  'Certificate on completion',
                  'In-person · Gudiyattam',
                ].map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <CheckCircle2 size={16} className="text-violet-500 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full py-3 px-6 rounded-xl border-2 border-violet-600 text-violet-600 font-semibold text-sm hover:bg-violet-600 hover:text-white transition-all"
              >
                Register Child →
              </button>
            </motion.div>

            {/* Card 2 — Adult Track (Featured, elevated) */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-7 flex flex-col shadow-primary relative md:-translate-y-4"
            >
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-extrabold px-5 py-1.5 rounded-full tracking-wide shadow-md">
                ⭐ MOST POPULAR
              </span>
              <span className="inline-block self-start bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-5 mt-2">
                Early Bird — First 10 seats
              </span>
              <div className="text-3xl mb-2">👩‍💻</div>
              <h3 className="text-xl font-extrabold text-white mb-1">Adult Track</h3>
              <p className="text-sm text-violet-200 mb-5">Working professionals & homemakers</p>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl font-extrabold text-amber-300">₹4,499</span>
              </div>
              <p className="text-xs text-violet-300 line-through mb-6">Regular price ₹5,499</p>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  '12 weekend live sessions',
                  'Mon–Fri 1hr doubt clearing',
                  'ChatGPT, Claude & n8n automation',
                  'Apply AI to your job immediately',
                  'Certificate on completion',
                  'In-person · Gudiyattam',
                ].map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-violet-100">
                    <CheckCircle2 size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full py-3.5 px-6 rounded-xl bg-white text-violet-700 font-bold text-sm hover:bg-amber-50 transition-all shadow-md"
              >
                Register Myself →
              </button>
            </motion.div>

            {/* Card 3 — Family Pack */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white border-2 border-slate-200 rounded-2xl p-6 flex flex-col shadow-sm hover:border-violet-300 hover:shadow-md transition-all"
            >
              <span className="inline-block self-start bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full mb-5">
                Best Value — Save ₹1,499
              </span>
              <div className="text-3xl mb-2">👨‍👧</div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-1">Family Pack</h3>
              <p className="text-sm text-slate-500 mb-5">You + your child, learning together</p>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl font-extrabold text-amber-500">₹7,499</span>
              </div>
              <p className="text-xs text-slate-400 line-through mb-6">Regular price ₹8,998</p>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  'Kids Track + Adult Track included',
                  'Both learn AI together',
                  'All sessions + doubt clearing',
                  '2 completion certificates',
                  'Priority batch enrollment',
                ].map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <CheckCircle2 size={16} className="text-violet-500 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full py-3 px-6 rounded-xl border-2 border-violet-600 text-violet-600 font-semibold text-sm hover:bg-violet-600 hover:text-white transition-all"
              >
                Register Family →
              </button>
            </motion.div>

          </div>

          {/* Reassurance row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-slate-500"
          >
            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-green-500" /> No payment now — confirm your seat first</span>
            <span className="hidden sm:block text-slate-300">·</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-green-500" /> Fee paid only after WhatsApp confirmation</span>
            <span className="hidden sm:block text-slate-300">·</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-green-500" /> 50+ students already enrolled</span>
          </motion.div>

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
              { icon: '📍', label: 'Rajaganapathy Nagar, Gudiyattam', sub: 'In-person venue · Get directions ↗', href: 'https://maps.google.com/?q=Rajaganapathy+Nagar,+Gudiyattam,+Tamil+Nadu' },
            ].map(({ icon, label, sub, href }) => (
              <div key={label} className="flex items-start gap-3 bg-white border border-violet-100 rounded-xl px-4 py-3 flex-1">
                <span className="text-xl leading-none mt-0.5">{icon}</span>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{label}</p>
                  {href ? (
                    <a href={href} target="_blank" rel="noreferrer" className="text-xs text-violet-500 hover:underline">{sub}</a>
                  ) : (
                    <p className="text-xs text-slate-500">{sub}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-slate-50">
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
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
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

      {/* ── Registration form ─────────────────────────────────────────────── */}
      <RegistrationForm />

    </div>

    {/* ── Footer ────────────────────────────────────────────────────────── */}
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo-wordmark.svg" alt="Future Minds AI Academy" className="h-6 object-contain" />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs text-slate-500">
            <span>📍 Rajaganapathy Nagar, Gudiyattam, Tamil Nadu</span>
            <a href="https://wa.me/918754548081" target="_blank" rel="noreferrer" className="hover:text-green-400 transition-colors">
              📞 +91 87545 48081
            </a>
            <a href="mailto:spriyasambath@gmail.com" className="hover:text-violet-400 transition-colors">
              ✉ spriyasambath@gmail.com
            </a>
          </div>
          <p className="text-xs text-slate-600">© 2026 Future Minds AI Academy</p>
        </div>
      </div>
    </footer>

    {/* ── Floating WhatsApp button — outside overflow-x-hidden to stay visible ── */}
    <a
      href="https://wa.me/918754548081"
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] hover:bg-[#20b858] text-white font-semibold text-sm px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
    >
      <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
      <span>Chat with us</span>
    </a>
    </>
  );
}
