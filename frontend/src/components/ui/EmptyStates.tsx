import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen, GraduationCap, Sparkles, Search,
  Bot, MessageSquare, Clock, Play, Upload,
  ImageIcon, FileText, Wand2, Zap, ArrowRight, Star,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { GradientButton } from './GradientButton';

// ─── Shell ────────────────────────────────────────────────────────────────────

function Shell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn(
        'flex flex-col items-center justify-center text-center',
        'bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-card',
        'py-14 px-8',
        className
      )}
    >
      {children}
    </motion.div>
  );
}

// ─── Text block ───────────────────────────────────────────────────────────────

function TextBlock({
  title, description, badge,
}: {
  title: string;
  description: string;
  badge?: string;
}) {
  return (
    <div className="mb-7 max-w-xs">
      {badge && (
        <span className="inline-flex items-center gap-1.5 text-2xs font-semibold bg-violet-100 text-violet-700 px-2.5 py-1 rounded-full mb-3">
          <Sparkles size={10} />
          {badge}
        </span>
      )}
      <h3 className="text-lg font-bold text-slate-900 leading-snug mb-2">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 1. COURSES
// ═══════════════════════════════════════════════════════════════════════════════

function CoursesIllustration() {
  return (
    <div className="relative w-52 h-44 mb-2 select-none pointer-events-none" aria-hidden>
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 bg-violet-200/50 rounded-full blur-3xl" />

      {/* Back card — indigo tilt */}
      <motion.div
        animate={{ rotate: [-8, -6, -8], y: [0, -2, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-0 left-[calc(50%-26px)] w-32 h-20 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-xl shadow-lg"
      />

      {/* Middle card — purple tilt */}
      <motion.div
        animate={{ rotate: [-3, -1, -3], y: [0, -3, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        className="absolute bottom-1 left-[calc(50%-18px)] w-32 h-20 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl shadow-lg"
      />

      {/* Front card — white, floats */}
      <motion.div
        animate={{ y: [-3, 2, -3] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
        className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-20 bg-white rounded-xl shadow-xl border border-slate-200/80 p-3.5 flex flex-col justify-between"
      >
        <div className="flex items-center justify-between">
          <div className="h-2 w-10 bg-violet-200 rounded-full" />
          <BookOpen size={12} className="text-violet-400" />
        </div>
        <div className="space-y-1.5">
          <div className="h-1.5 w-full bg-slate-100 rounded-full" />
          <div className="h-1.5 w-4/5  bg-slate-100 rounded-full" />
          <div className="h-1.5 w-3/5  bg-slate-100 rounded-full" />
        </div>
      </motion.div>

      {/* Graduation cap badge */}
      <motion.div
        animate={{ y: [-5, 1, -5], rotate: [-5, 4, -5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
        className="absolute top-2 right-8 w-11 h-11 bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl flex items-center justify-center shadow-sm"
      >
        <GraduationCap size={20} className="text-amber-500" />
      </motion.div>

      {/* Sparkles */}
      <motion.div className="absolute top-4 left-4" animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.1, 0.8] }} transition={{ duration: 2.5, repeat: Infinity }}>
        <Sparkles size={14} className="text-violet-400" />
      </motion.div>
      <motion.div className="absolute top-12 right-4" animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.1, 0.8] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.9 }}>
        <Star size={10} className="text-pink-400" fill="currentColor" />
      </motion.div>
      <motion.div className="absolute bottom-16 left-6" animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.1, 0.8] }} transition={{ duration: 2.5, repeat: Infinity, delay: 1.7 }}>
        <Star size={9} className="text-amber-400" fill="currentColor" />
      </motion.div>
    </div>
  );
}

interface EmptyStateCoursesProps {
  variant?: 'empty' | 'filtered';
  onClearFilters?: () => void;
  className?: string;
}

export function EmptyStateCourses({
  variant = 'empty',
  onClearFilters,
  className,
}: EmptyStateCoursesProps) {
  const isFiltered = variant === 'filtered';
  return (
    <Shell className={className}>
      <CoursesIllustration />
      <TextBlock
        badge={isFiltered ? undefined : 'AI-Powered Learning'}
        title={isFiltered ? 'No courses match your filters' : 'No courses yet'}
        description={
          isFiltered
            ? 'Try adjusting your category or difficulty, or clear all filters to see the full catalog.'
            : 'Explore our growing library of AI and technology courses crafted by expert educators.'
        }
      />
      <div className="flex flex-wrap items-center justify-center gap-3">
        {isFiltered && onClearFilters ? (
          <>
            <button
              onClick={onClearFilters}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <Search size={14} />
              Clear Filters
            </button>
            <Link to="/learn">
              <GradientButton size="sm" rightIcon={<ArrowRight size={14} />}>
                Browse All
              </GradientButton>
            </Link>
          </>
        ) : (
          <Link to="/learn">
            <GradientButton size="sm" leftIcon={<BookOpen size={14} />} rightIcon={<ArrowRight size={14} />}>
              Browse Courses
            </GradientButton>
          </Link>
        )}
      </div>
    </Shell>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. WORKSHEETS
// ═══════════════════════════════════════════════════════════════════════════════

function WorksheetsIllustration() {
  return (
    <div className="relative w-48 h-44 mb-2 select-none pointer-events-none" aria-hidden>
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-200/50 rounded-full blur-3xl" />

      {/* Clipboard body */}
      <motion.div
        animate={{ y: [-3, 2, -3] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-36 h-40 bg-white rounded-2xl shadow-xl border border-slate-200/80 flex flex-col"
      >
        {/* Clip */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-6 bg-slate-200 rounded-full border-2 border-white shadow-sm" />

        {/* Header strip */}
        <div className="h-8 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-t-2xl mt-3 mx-3 flex items-center px-2 gap-1.5">
          <div className="w-2 h-2 rounded-full bg-white/40" />
          <div className="h-1.5 w-14 bg-white/30 rounded-full" />
        </div>

        {/* Lines */}
        <div className="flex-1 p-3 space-y-2 mt-1">
          {[100, 80, 92, 70, 85, 60].map((w, i) => (
            <motion.div
              key={i}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4 + i * 0.08, duration: 0.4, ease: 'easeOut' }}
              style={{ width: `${w}%` }}
              className="h-1.5 bg-slate-100 rounded-full origin-left"
            />
          ))}
        </div>

        {/* AI badge bottom-right */}
        <div className="absolute bottom-3 right-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-2xs font-bold px-1.5 py-0.5 rounded-md shadow-sm">
          AI
        </div>
      </motion.div>

      {/* Wand badge — floating */}
      <motion.div
        animate={{ y: [-6, 1, -6], rotate: [-12, 0, -12] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute top-0 right-4 w-11 h-11 bg-gradient-to-br from-violet-50 to-purple-100 border border-violet-200 rounded-xl flex items-center justify-center shadow-sm"
      >
        <Wand2 size={20} className="text-violet-500" />
      </motion.div>

      {/* Sparkles */}
      <motion.div className="absolute top-4 left-4" animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.1, 0.8] }} transition={{ duration: 2.5, repeat: Infinity }}>
        <Sparkles size={14} className="text-indigo-400" />
      </motion.div>
      <motion.div className="absolute top-14 right-16" animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.1, 0.8] }} transition={{ duration: 2.5, repeat: Infinity, delay: 1.1 }}>
        <Star size={9} className="text-violet-400" fill="currentColor" />
      </motion.div>
      <motion.div className="absolute bottom-14 left-4" animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.1, 0.8] }} transition={{ duration: 2.5, repeat: Infinity, delay: 1.8 }}>
        <Star size={10} className="text-pink-400" fill="currentColor" />
      </motion.div>
    </div>
  );
}

interface EmptyStateWorksheetsProps {
  className?: string;
}

export function EmptyStateWorksheets({ className }: EmptyStateWorksheetsProps) {
  return (
    <Shell className={className}>
      <WorksheetsIllustration />
      <TextBlock
        badge="AI Generator"
        title="No worksheets yet"
        description="Generate professional worksheets from any topic, textbook image, or PDF — complete with answer keys."
      />
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link to="/tools/worksheet">
          <GradientButton size="sm" leftIcon={<Wand2 size={14} />} rightIcon={<ArrowRight size={14} />}>
            Generate Worksheet
          </GradientButton>
        </Link>
        <Link to="/learn" className="text-sm font-semibold text-slate-500 hover:text-violet-700 transition-colors">
          Browse courses →
        </Link>
      </div>
    </Shell>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. AI HISTORY
// ═══════════════════════════════════════════════════════════════════════════════

function AIHistoryIllustration() {
  return (
    <div className="relative w-52 h-44 mb-2 select-none pointer-events-none" aria-hidden>
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 bg-purple-200/50 rounded-full blur-3xl" />

      {/* Bot avatar — center-top */}
      <motion.div
        animate={{ y: [-4, 2, -4] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"
      >
        <Bot size={30} className="text-white" />
        {/* Antenna dot */}
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white shadow-sm"
        />
      </motion.div>

      {/* Chat bubble — left (user) */}
      <motion.div
        animate={{ opacity: [0.7, 1, 0.7], x: [-1, 1, -1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
        className="absolute bottom-10 left-3 bg-slate-100 rounded-2xl rounded-bl-none px-3.5 py-2.5 shadow-sm max-w-[108px]"
      >
        <div className="space-y-1.5">
          <div className="h-1.5 w-16 bg-slate-300 rounded-full" />
          <div className="h-1.5 w-10 bg-slate-300 rounded-full" />
        </div>
      </motion.div>

      {/* Chat bubble — right (AI, with typing dots) */}
      <motion.div
        animate={{ opacity: [0.7, 1, 0.7], x: [1, -1, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.9 }}
        className="absolute bottom-2 right-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl rounded-br-none px-3.5 py-2.5 shadow-sm"
      >
        <div className="flex items-center gap-1">
          {[0, 0.18, 0.36].map((d, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 0.75, repeat: Infinity, delay: d }}
              className="w-1.5 h-1.5 bg-white rounded-full"
            />
          ))}
        </div>
      </motion.div>

      {/* Clock badge */}
      <motion.div
        animate={{ rotate: [0, 12, 0], scale: [0.92, 1, 0.92] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-6 right-4 w-9 h-9 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-sm"
      >
        <Clock size={15} className="text-slate-400" />
      </motion.div>

      {/* Sparkles */}
      <motion.div className="absolute top-4 left-4" animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.1, 0.8] }} transition={{ duration: 2.5, repeat: Infinity }}>
        <Sparkles size={13} className="text-purple-400" />
      </motion.div>
      <motion.div className="absolute bottom-16 right-16" animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.1, 0.8] }} transition={{ duration: 2.5, repeat: Infinity, delay: 1.2 }}>
        <Star size={9} className="text-violet-400" fill="currentColor" />
      </motion.div>
    </div>
  );
}

interface EmptyStateAIHistoryProps {
  className?: string;
}

export function EmptyStateAIHistory({ className }: EmptyStateAIHistoryProps) {
  return (
    <Shell className={className}>
      <AIHistoryIllustration />
      <TextBlock
        badge="AI Activity"
        title="No AI history yet"
        description="Your tool sessions, chat conversations, and workflow runs will all appear here once you get started."
      />
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link to="/tools">
          <GradientButton size="sm" leftIcon={<Zap size={14} />}>
            Run a Tool
          </GradientButton>
        </Link>
        <Link to="/chat">
          <GradientButton size="sm" variant="ghost" leftIcon={<MessageSquare size={14} />}>
            Start AI Chat
          </GradientButton>
        </Link>
      </div>

      {/* Tip */}
      <p className="mt-6 text-xs text-slate-400 flex items-center gap-1.5">
        <Play size={10} className="text-violet-400" />
        Pro tip: try the Essay Writer or Math Solver to get started fast
      </p>
    </Shell>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. UPLOADS
// ═══════════════════════════════════════════════════════════════════════════════

function UploadsIllustration() {
  return (
    <div className="relative w-52 h-44 mb-2 select-none pointer-events-none" aria-hidden>
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 bg-blue-200/50 rounded-full blur-3xl" />

      {/* Dashed ring */}
      <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 208 176">
        <ellipse cx="104" cy="88" rx="78" ry="72" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="6 5" />
      </svg>

      {/* Cloud body (layered divs) */}
      <motion.div
        animate={{ y: [-4, 2, -4] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-8 left-1/2 -translate-x-1/2"
      >
        <div className="relative w-20 h-14">
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-br from-blue-200 to-indigo-300 rounded-xl" />
          <div className="absolute bottom-4 left-1 w-9 h-9 bg-gradient-to-br from-blue-200 to-indigo-300 rounded-full" />
          <div className="absolute bottom-5 left-8 w-11 h-11 bg-gradient-to-br from-blue-200 to-indigo-300 rounded-full" />
          <div className="absolute bottom-4 right-0 w-7 h-7 bg-gradient-to-br from-blue-200 to-indigo-300 rounded-full" />
        </div>
      </motion.div>

      {/* Upload arrow — bouncing */}
      <motion.div
        animate={{ y: [-6, 0, -6] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[68px] left-1/2 -translate-x-1/2"
      >
        <Upload size={18} className="text-blue-600" strokeWidth={2.5} />
      </motion.div>

      {/* Floating IMG card */}
      <motion.div
        animate={{ y: [0, -7, 0], rotate: [-8, -4, -8] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        className="absolute bottom-6 left-3 w-12 h-14 bg-white rounded-xl border border-slate-200 shadow-md flex flex-col items-center justify-center gap-1 py-2"
      >
        <ImageIcon size={16} className="text-blue-400" />
        <span className="text-2xs text-slate-400 font-semibold">IMG</span>
      </motion.div>

      {/* Floating PDF card */}
      <motion.div
        animate={{ y: [0, -7, 0], rotate: [6, 3, 6] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
        className="absolute bottom-4 right-3 w-12 h-14 bg-white rounded-xl border border-slate-200 shadow-md flex flex-col items-center justify-center gap-1 py-2"
      >
        <FileText size={16} className="text-red-400" />
        <span className="text-2xs text-slate-400 font-semibold">PDF</span>
      </motion.div>

      {/* Sparkles */}
      <motion.div className="absolute top-4 left-4" animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.1, 0.8] }} transition={{ duration: 2.5, repeat: Infinity }}>
        <Sparkles size={13} className="text-blue-400" />
      </motion.div>
      <motion.div className="absolute top-8 right-4" animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.1, 0.8] }} transition={{ duration: 2.5, repeat: Infinity, delay: 1.1 }}>
        <Star size={9} className="text-indigo-400" fill="currentColor" />
      </motion.div>
    </div>
  );
}

interface EmptyStateUploadsProps {
  onBrowse?: () => void;
  onUseSample?: () => void;
  className?: string;
}

export function EmptyStateUploads({
  onBrowse,
  onUseSample,
  className,
}: EmptyStateUploadsProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-10 px-8',
        className
      )}
    >
      <UploadsIllustration />
      <div className="mb-6 max-w-xs">
        <h3 className="text-base font-bold text-slate-800 leading-snug mb-1.5">
          Drop files to get started
        </h3>
        <p className="text-sm text-slate-400 leading-relaxed">
          Upload a worksheet image or PDF and let AI extract the content, then auto-generate questions.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {onBrowse && (
          <GradientButton size="sm" onClick={onBrowse} leftIcon={<Upload size={14} />}>
            Browse Files
          </GradientButton>
        )}
        {onUseSample && (
          <button
            onClick={onUseSample}
            className="px-4 py-2 text-sm font-semibold text-violet-600 bg-violet-50 hover:bg-violet-100 rounded-xl transition-colors"
          >
            Try a sample
          </button>
        )}
      </div>
      <div className="mt-4 flex items-center gap-2">
        {['PNG', 'JPG', 'PDF'].map((fmt) => (
          <span key={fmt} className="text-2xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            {fmt}
          </span>
        ))}
        <span className="text-2xs text-slate-400">up to 10 MB</span>
      </div>
    </div>
  );
}
