import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, FileText, Sliders, Eye, Download, CheckCircle2,
  X, RefreshCw, Printer, Sparkles, BookOpen,
  FileCheck, Minus, Plus, ToggleLeft, AlignLeft, List, HelpCircle,
  Pencil, ArrowRight, ClipboardList, Copy, ExternalLink,
  LayoutTemplate, KeyRound,
} from 'lucide-react';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { GradientButton } from '../../components/ui/GradientButton';
import { EmptyStateUploads } from '../../components/ui/EmptyStates';
import { cn } from '../../lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = 'upload' | 'extracting' | 'configure' | 'generating' | 'preview';
type Difficulty = 'beginner' | 'intermediate' | 'advanced';
type QuestionType = 'mcq' | 'truefalse' | 'shortanswer' | 'fillinblank' | 'essay';
type PreviewTab = 'worksheet' | 'answerkey';

interface MCQQuestion {
  id: number;
  type: 'mcq';
  question: string;
  options: [string, string, string, string];
  answer: 0 | 1 | 2 | 3;
  points: number;
}
interface TFQuestion   { id: number; type: 'truefalse';   question: string; answer: boolean; points: number }
interface SAQuestion   { id: number; type: 'shortanswer'; question: string; answer: string;  points: number }
interface FIBQuestion  { id: number; type: 'fillinblank'; question: string; answer: string;  points: number }
interface EssayQuestion{ id: number; type: 'essay';       question: string; answer: string;  points: number }
type Question = MCQQuestion | TFQuestion | SAQuestion | FIBQuestion | EssayQuestion;

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_OCR = `The Water Cycle (Hydrological Cycle)

The water cycle describes the continuous movement of water within Earth and its atmosphere. It is a complex system that includes many different processes.

Key Processes:
1. Evaporation – Water from oceans, lakes, and rivers is converted to vapor by solar energy. About 86% of global evaporation occurs over the ocean.

2. Transpiration – Plants release water vapor through their leaves. Combined with evaporation, this is called evapotranspiration.

3. Condensation – As water vapor rises, it cools and condenses into tiny water droplets, forming clouds and fog.

4. Precipitation – Water falls from clouds as rain, sleet, snow, or hail depending on temperature conditions.

5. Collection – Water collects in oceans, rivers, lakes, and underground aquifers. The cycle then begins again.

Importance:
• Distributes fresh water across Earth's surface
• Regulates global climate and temperature
• Supports all living ecosystems
• Drives weather patterns

Human activity has impacted the water cycle through deforestation, urbanization, and climate change, altering precipitation patterns globally.`;

const MOCK_QUESTIONS: Question[] = [
  {
    id: 1, type: 'mcq', points: 2,
    question: 'Which process describes the conversion of liquid water to water vapor through solar energy?',
    options: ['Condensation', 'Evaporation', 'Precipitation', 'Transpiration'],
    answer: 1,
  },
  {
    id: 2, type: 'mcq', points: 2,
    question: 'Approximately what percentage of global evaporation occurs over the ocean?',
    options: ['50%', '70%', '86%', '95%'],
    answer: 2,
  },
  {
    id: 3, type: 'truefalse', points: 1,
    question: 'Transpiration is the process by which plants release water vapor through their leaves.',
    answer: true,
  },
  {
    id: 4, type: 'truefalse', points: 1,
    question: 'Hail can only form when the temperature at ground level is below freezing.',
    answer: false,
  },
  {
    id: 5, type: 'fillinblank', points: 2,
    question: 'The combination of evaporation and transpiration is called _______________.',
    answer: 'evapotranspiration',
  },
  {
    id: 6, type: 'fillinblank', points: 2,
    question: 'Water that falls from clouds as rain, sleet, snow, or hail is called _______________.',
    answer: 'precipitation',
  },
  {
    id: 7, type: 'shortanswer', points: 4,
    question: 'Describe two ways in which human activity has impacted the water cycle.',
    answer: 'Deforestation reduces transpiration and increases surface runoff. Urbanization creates impermeable surfaces that reduce groundwater recharge. Climate change alters precipitation patterns and increases evaporation rates.',
  },
  {
    id: 8, type: 'shortanswer', points: 3,
    question: 'Explain why the water cycle is essential for supporting living ecosystems.',
    answer: 'The water cycle distributes fresh water across Earth\'s surface, regulates climate and temperature, and provides the water necessary for all biological processes. Without it, ecosystems could not sustain life.',
  },
  {
    id: 9, type: 'essay', points: 10,
    question: 'Using your knowledge of the water cycle, explain how deforestation in tropical rainforests could affect precipitation patterns in distant regions. Include at least three processes of the water cycle in your response.',
    answer: 'A complete response should include: (1) Reduced transpiration from fewer trees decreasing water vapor in the atmosphere locally. (2) Less condensation and cloud formation over deforested areas leading to reduced precipitation. (3) Altered atmospheric circulation patterns that can reduce rainfall in regions thousands of miles away. (4) Increased surface runoff and reduced groundwater recharge due to loss of forest cover. Students should demonstrate understanding of interconnected water cycle processes and teleconnections in the global climate system.',
  },
];

// ─── Constants ────────────────────────────────────────────────────────────────

const STEPS: { id: Step; label: string; icon: React.ComponentType<{ size?: number | string; className?: string }> }[] = [
  { id: 'upload',     label: 'Upload',    icon: Upload      },
  { id: 'extracting', label: 'Extract',   icon: FileText    },
  { id: 'configure',  label: 'Configure', icon: Sliders     },
  { id: 'generating', label: 'Generate',  icon: Sparkles    },
  { id: 'preview',    label: 'Preview',   icon: Eye         },
];

const QUESTION_TYPES: { id: QuestionType; label: string; icon: React.ComponentType<{ size?: number | string; className?: string }>; desc: string }[] = [
  { id: 'mcq',          label: 'Multiple Choice',   icon: List,          desc: '4 options' },
  { id: 'truefalse',    label: 'True / False',      icon: ToggleLeft,    desc: 'Binary'    },
  { id: 'shortanswer',  label: 'Short Answer',      icon: AlignLeft,     desc: '2–4 lines' },
  { id: 'fillinblank',  label: 'Fill in the Blank', icon: Pencil,        desc: '1 word'    },
  { id: 'essay',        label: 'Essay',             icon: FileText,      desc: 'Extended'  },
];

const DIFFICULTY_CONFIG = {
  beginner:     { label: 'Beginner',     color: 'from-emerald-500 to-teal-500',   ring: 'ring-emerald-400',  text: 'text-emerald-700',  bg: 'bg-emerald-50' },
  intermediate: { label: 'Intermediate', color: 'from-amber-500 to-orange-500',   ring: 'ring-amber-400',    text: 'text-amber-700',    bg: 'bg-amber-50'   },
  advanced:     { label: 'Advanced',     color: 'from-red-500 to-rose-600',       ring: 'ring-red-400',      text: 'text-red-700',      bg: 'bg-red-50'     },
};

const GRADE_LEVELS = ['K-2', '3-5', '6-8', '9-10', '11-12', 'University'];

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepProgress({ current }: { current: Step }) {
  const currentIdx = STEPS.findIndex((s) => s.id === current);
  return (
    <div className="flex items-center gap-0 mb-8">
      {STEPS.map((step, i) => {
        const done   = i < currentIdx;
        const active = i === currentIdx;
        const Icon   = step.icon;
        return (
          <div key={step.id} className="flex items-center flex-1 min-w-0">
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <motion.div
                animate={{
                  background: done ? 'linear-gradient(135deg,#7c3aed,#ec4899)' : active ? 'linear-gradient(135deg,#7c3aed,#6d28d9)' : '#f1f5f9',
                  scale: active ? 1.1 : 1,
                }}
                transition={{ duration: 0.3 }}
                className={cn(
                  'w-9 h-9 rounded-xl flex items-center justify-center shadow-sm',
                  done && 'shadow-primary'
                )}
              >
                {done ? (
                  <CheckCircle2 size={16} className="text-white" />
                ) : (
                  <Icon size={16} className={active ? 'text-white' : 'text-slate-400'} />
                )}
              </motion.div>
              <span className={cn('text-xs font-semibold hidden sm:block', active ? 'text-violet-700' : done ? 'text-slate-500' : 'text-slate-300')}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <motion.div
                className="flex-1 h-0.5 mx-2 rounded-full"
                animate={{ background: done ? 'linear-gradient(90deg,#7c3aed,#ec4899)' : '#e2e8f0' }}
                transition={{ duration: 0.4 }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function DropZone({ onFile, onUseSample }: { onFile: (file: File, preview: string) => void; onUseSample?: () => void }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type.startsWith('image/') || file.type === 'application/pdf')) {
      const reader = new FileReader();
      reader.onload = (ev) => onFile(file, ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  }, [onFile]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => onFile(file, ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      animate={{
        borderColor: dragging ? '#7c3aed' : '#e2e8f0',
        backgroundColor: dragging ? 'rgba(124,58,237,0.04)' : 'rgba(255,255,255,0.8)',
        scale: dragging ? 1.01 : 1,
      }}
      transition={{ duration: 0.15 }}
      className="relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center gap-4 cursor-pointer min-h-56 group"
    >
      <input ref={inputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleInput} />

      <AnimatePresence mode="wait">
        {dragging ? (
          <motion.div key="dragging" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-primary">
              <Upload size={28} className="text-white" />
            </div>
          </motion.div>
        ) : (
          <motion.div key="idle" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}>
            <EmptyStateUploads
              onBrowse={() => inputRef.current?.click()}
              onUseSample={onUseSample}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ImagePreviewPanel({ src, fileName, onReset }: { src: string; fileName: string; onReset: () => void }) {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200/70 bg-slate-50 group">
      <img src={src} alt="Uploaded worksheet" className="w-full h-64 object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 inset-x-0 p-3 translate-y-2 group-hover:translate-y-0 transition-transform">
        <div className="flex items-center justify-between bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2">
          <div className="flex items-center gap-2 min-w-0">
            <FileText size={14} className="text-violet-600 flex-shrink-0" />
            <span className="text-xs font-semibold text-slate-700 truncate">{fileName}</span>
          </div>
          <button onClick={onReset} className="ml-2 p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0">
            <X size={14} />
          </button>
        </div>
      </div>
      {/* Scan overlay effect */}
      <motion.div
        className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-violet-400 to-transparent"
        initial={{ top: '0%', opacity: 0 }}
        animate={{ top: ['0%', '100%', '0%'], opacity: [0, 1, 0] }}
        transition={{ duration: 2.5, repeat: 2, ease: 'easeInOut', delay: 0.3 }}
      />
    </div>
  );
}

function OCRPanel({ text, onEdit }: { text: string; onEdit: (t: string) => void }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  return (
    <div className="bg-white/90 backdrop-blur-sm border border-slate-200/70 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/80">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <FileText size={12} className="text-white" />
          </div>
          <span className="text-xs font-bold text-slate-700">Extracted Text</span>
          <span className="text-2xs text-emerald-600 font-semibold bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            OCR Complete
          </span>
        </div>
        <button onClick={copy} className="flex items-center gap-1 text-xs text-slate-400 hover:text-violet-600 transition-colors">
          <Copy size={12} />
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <textarea
        value={text}
        onChange={(e) => onEdit(e.target.value)}
        className="w-full h-48 p-4 text-xs text-slate-600 leading-relaxed font-mono bg-transparent resize-none focus:outline-none"
        spellCheck={false}
      />
    </div>
  );
}

function NumberStepper({ value, min, max, onChange }: { value: number; min: number; max: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:border-violet-300 hover:text-violet-600 hover:bg-violet-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <Minus size={14} />
      </button>
      <div className="w-12 text-center">
        <span className="text-lg font-extrabold text-slate-900">{value}</span>
      </div>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:border-violet-300 hover:text-violet-600 hover:bg-violet-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <Plus size={14} />
      </button>
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
          animate={{ width: `${((value - min) / (max - min)) * 100}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      </div>
      <span className="text-xs text-slate-400 w-8 text-right">{max}</span>
    </div>
  );
}

interface WorksheetPreviewProps {
  questions: Question[];
  subject: string;
  gradeLevel: string;
  difficulty: Difficulty;
  tab: PreviewTab;
  onTabChange: (t: PreviewTab) => void;
  totalPoints: number;
}

function WorksheetPreview({ questions, subject, gradeLevel, difficulty, tab, onTabChange, totalPoints }: WorksheetPreviewProps) {
  const diffConfig = DIFFICULTY_CONFIG[difficulty];

  return (
    <div className="bg-white border border-slate-200/70 rounded-2xl overflow-hidden shadow-card-lg">
      {/* Header bar */}
      <div className="bg-gradient-to-r from-slate-900 via-violet-950 to-slate-900 px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center">
              <BookOpen size={13} className="text-white" />
            </div>
            <span className="text-xs font-bold text-white">Worksheet Preview</span>
          </div>
          <div className="flex bg-white/10 rounded-lg p-0.5 gap-0.5">
            {[
              { id: 'worksheet' as const, label: 'Worksheet', icon: LayoutTemplate },
              { id: 'answerkey' as const, label: 'Answer Key', icon: KeyRound },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className={cn(
                  'flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md transition-all',
                  tab === id ? 'bg-white text-violet-700 shadow-sm' : 'text-white/60 hover:text-white'
                )}
              >
                <Icon size={12} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Document area */}
      <div className="bg-slate-50/50 p-4 max-h-[680px] overflow-y-auto">
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-8 min-h-96">
          {/* Document header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">{subject || 'Science'} Worksheet</h2>
                <p className="text-xs text-slate-500 mt-0.5">The Water Cycle — Comprehension Assessment</p>
              </div>
              <div className="text-right">
                <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full', diffConfig.bg, diffConfig.text)}>{diffConfig.label}</span>
                <p className="text-xs text-slate-400 mt-1">Grade {gradeLevel}</p>
              </div>
            </div>
            {tab === 'worksheet' && (
              <div className="grid grid-cols-3 gap-4 mt-4 text-xs">
                <div>
                  <p className="text-slate-400 mb-1">Student Name</p>
                  <div className="border-b border-slate-300 h-5" />
                </div>
                <div>
                  <p className="text-slate-400 mb-1">Date</p>
                  <div className="border-b border-slate-300 h-5" />
                </div>
                <div className="text-right">
                  <p className="text-slate-400 mb-1">Score</p>
                  <p className="text-sm font-bold text-slate-900">___ / {totalPoints}</p>
                </div>
              </div>
            )}
            {tab === 'answerkey' && (
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                  <KeyRound size={11} />
                  ANSWER KEY — INSTRUCTOR COPY
                </div>
                <span className="text-xs text-slate-400">Total: {totalPoints} points</span>
              </div>
            )}
          </div>

          {/* Questions */}
          <div className="space-y-6">
            {questions.map((q, qi) => (
              <QuestionDisplay key={q.id} q={q} index={qi + 1} showAnswer={tab === 'answerkey'} />
            ))}
          </div>

          {/* Footer */}
          {tab === 'worksheet' && (
            <div className="mt-8 pt-4 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-300">Generated by Future Minds AI • futureminds.ai</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function QuestionDisplay({ q, index, showAnswer }: { q: Question; index: number; showAnswer: boolean }) {
  if (q.type === 'mcq') {
    return (
      <div>
        <p className="text-sm font-semibold text-slate-800 mb-3">
          <span className="text-violet-600 mr-1.5">{index}.</span>
          {q.question}
          <span className="ml-2 text-xs font-normal text-slate-400">({q.points} pts)</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {q.options.map((opt, oi) => (
            <div
              key={oi}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg border text-sm transition-colors',
                showAnswer && oi === q.answer
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-800 font-semibold'
                  : 'border-slate-100 text-slate-600'
              )}
            >
              <span className={cn(
                'w-5 h-5 rounded-full border text-xs font-bold flex items-center justify-center flex-shrink-0',
                showAnswer && oi === q.answer
                  ? 'border-emerald-500 bg-emerald-500 text-white'
                  : 'border-slate-300 text-slate-400'
              )}>
                {OPTION_LABELS[oi]}
              </span>
              {opt}
              {showAnswer && oi === q.answer && <CheckCircle2 size={13} className="ml-auto text-emerald-500" />}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (q.type === 'truefalse') {
    return (
      <div>
        <p className="text-sm font-semibold text-slate-800 mb-3">
          <span className="text-violet-600 mr-1.5">{index}.</span>
          {q.question}
          <span className="ml-2 text-xs font-normal text-slate-400">({q.points} pt)</span>
        </p>
        <div className="flex items-center gap-3">
          {['True', 'False'].map((label) => {
            const isCorrect = showAnswer && (label === 'True') === q.answer;
            return (
              <div key={label} className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium',
                isCorrect ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-slate-100 text-slate-500'
              )}>
                <div className={cn('w-4 h-4 rounded-full border-2 flex items-center justify-center', isCorrect ? 'border-emerald-500' : 'border-slate-300')}>
                  {isCorrect && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                </div>
                {label}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (q.type === 'fillinblank') {
    const parts = q.question.split('_______________');
    return (
      <div>
        <p className="text-sm font-semibold text-slate-800 mb-2 flex-wrap">
          <span className="text-violet-600 mr-1.5">{index}.</span>
          {parts[0]}
          {showAnswer ? (
            <span className="inline-block px-2 py-0.5 bg-emerald-50 border-b-2 border-emerald-500 text-emerald-700 font-bold mx-1 rounded-sm text-sm">{q.answer}</span>
          ) : (
            <span className="inline-block w-32 border-b-2 border-slate-400 mx-1 align-bottom" />
          )}
          {parts[1]}
          <span className="ml-2 text-xs font-normal text-slate-400">({q.points} pts)</span>
        </p>
      </div>
    );
  }

  if (q.type === 'shortanswer') {
    return (
      <div>
        <p className="text-sm font-semibold text-slate-800 mb-3">
          <span className="text-violet-600 mr-1.5">{index}.</span>
          {q.question}
          <span className="ml-2 text-xs font-normal text-slate-400">({q.points} pts)</span>
        </p>
        {showAnswer ? (
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-xs text-emerald-800 leading-relaxed">
            <p className="font-semibold text-emerald-700 mb-1 flex items-center gap-1"><CheckCircle2 size={12} /> Model Answer</p>
            {q.answer}
          </div>
        ) : (
          <div className="space-y-2">
            {Array(3).fill(0).map((_, i) => <div key={i} className="h-5 border-b border-slate-200" />)}
          </div>
        )}
      </div>
    );
  }

  if (q.type === 'essay') {
    return (
      <div>
        <p className="text-sm font-semibold text-slate-800 mb-1">
          <span className="text-violet-600 mr-1.5">{index}.</span>
          {q.question}
          <span className="ml-2 text-xs font-normal text-slate-400">({q.points} pts)</span>
        </p>
        {showAnswer ? (
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-xs text-emerald-800 leading-relaxed mt-3">
            <p className="font-semibold text-emerald-700 mb-1.5 flex items-center gap-1"><CheckCircle2 size={12} /> Scoring Rubric</p>
            {q.answer}
          </div>
        ) : (
          <div className="mt-3 border border-slate-100 rounded-xl bg-slate-50/50 h-28 p-3">
            <div className="space-y-2.5 pt-1">
              {Array(4).fill(0).map((_, i) => <div key={i} className="h-4 border-b border-slate-200" />)}
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function WorksheetGeneratorPage() {
  const [step, setStep]               = useState<Step>('upload');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileName, setFileName]       = useState('');
  const [ocrText, setOcrText]         = useState('');
  const [subject, setSubject]         = useState('Science');
  const [gradeLevel, setGradeLevel]   = useState('6-8');
  const [difficulty, setDifficulty]   = useState<Difficulty>('intermediate');
  const [selectedTypes, setSelectedTypes] = useState<Set<QuestionType>>(new Set(['mcq', 'truefalse', 'shortanswer']));
  const [numQuestions, setNumQuestions] = useState(8);
  const [questions, setQuestions]     = useState<Question[]>([]);
  const [previewTab, setPreviewTab]   = useState<PreviewTab>('worksheet');
  const [extractProgress, setExtractProgress] = useState(0);
  const [genProgress, setGenProgress] = useState(0);

  const toggleType = (t: QuestionType) => {
    setSelectedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(t) && next.size > 1) next.delete(t);
      else next.add(t);
      return next;
    });
  };

  const handleFile = (file: File, preview: string) => {
    setFileName(file.name);
    setImagePreview(preview);
    setStep('extracting');

    // Simulate OCR progress
    let prog = 0;
    const interval = setInterval(() => {
      prog += Math.random() * 18 + 5;
      setExtractProgress(Math.min(prog, 100));
      if (prog >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setOcrText(MOCK_OCR);
          setStep('configure');
        }, 400);
      }
    }, 180);
  };

  const handleGenerate = () => {
    setStep('generating');
    let prog = 0;
    const interval = setInterval(() => {
      prog += Math.random() * 12 + 4;
      setGenProgress(Math.min(prog, 100));
      if (prog >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          const filtered = MOCK_QUESTIONS.filter((q) => selectedTypes.has(q.type)).slice(0, numQuestions);
          setQuestions(filtered.length ? filtered : MOCK_QUESTIONS.slice(0, numQuestions));
          setStep('preview');
        }, 400);
      }
    }, 200);
  };

  const handleReset = () => {
    setStep('upload');
    setImagePreview(null);
    setFileName('');
    setOcrText('');
    setQuestions([]);
    setExtractProgress(0);
    setGenProgress(0);
  };

  const handleUseSample = () => {
    setFileName('water_cycle_textbook.png');
    setImagePreview('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgZmlsbD0iI2Y1ZjNmZiIvPjxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjM2MCIgaGVpZ2h0PSIyMCIgcng9IjQiIGZpbGw9IiM3YzNhZWQiIG9wYWNpdHk9IjAuMiIvPjxyZWN0IHg9IjIwIiB5PSI1MCIgd2lkdGg9IjI4MCIgaGVpZ2h0PSIxMiIgcng9IjMiIGZpbGw9IiM5NGEzYjgiIG9wYWNpdHk9IjAuNCIvPjxyZWN0IHg9IjIwIiB5PSI3MCIgd2lkdGg9IjMyMCIgaGVpZ2h0PSIxMiIgcng9IjMiIGZpbGw9IiM5NGEzYjgiIG9wYWNpdHk9IjAuMyIvPjxyZWN0IHg9IjIwIiB5PSI5MCIgd2lkdGg9IjI0MCIgaGVpZ2h0PSIxMiIgcng9IjMiIGZpbGw9IiM5NGEzYjgiIG9wYWNpdHk9IjAuMyIvPjxjaXJjbGUgY3g9IjI4MCIgY3k9IjE3MCIgcj0iNjAiIGZpbGw9IiMzYjgyZjYiIG9wYWNpdHk9IjAuMiIvPjxwYXRoIGQ9Ik0yMjAgMTYwIFEyNjAgMTIwIDMwMCAxNjAgUTI2MCAxNDAgMjIwIDE2MFoiIGZpbGw9IiM3YzNhZWQiIG9wYWNpdHk9IjAuMyIvPjxwYXRoIGQ9Ik0xODAgMjEwIFEyMjAgMTgwIDI2MCAyMTAiIHN0cm9rZT0iIzNiODJmNiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIiBvcGFjaXR5PSIwLjUiLz48dGV4dCB4PSIyMDAiIHk9IjIzMCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiM5NGEzYjgiIG9wYWNpdHk9IjAuNiI+V2F0ZXIgQ3ljbGUgRGlhZ3JhbTwvdGV4dD48L3N2Zz4=');
    setStep('extracting');
    let prog = 0;
    const interval = setInterval(() => {
      prog += Math.random() * 18 + 5;
      setExtractProgress(Math.min(prog, 100));
      if (prog >= 100) {
        clearInterval(interval);
        setTimeout(() => { setOcrText(MOCK_OCR); setStep('configure'); }, 400);
      }
    }, 150);
  };

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-primary">
                <ClipboardList size={18} className="text-white" />
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Worksheet Generator</h1>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-violet-50 border border-violet-100 text-violet-700">AI-Powered</span>
            </div>
            <p className="text-sm text-slate-500">Upload any educational material and generate a fully-formatted worksheet with answer key.</p>
          </div>
          {step !== 'upload' && (
            <button onClick={handleReset} className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-red-500 px-3 py-2 rounded-xl hover:bg-red-50 border border-transparent hover:border-red-100 transition-all">
              <RefreshCw size={13} />
              Start Over
            </button>
          )}
        </div>

        {/* Step progress */}
        <StepProgress current={step} />

        {/* Main layout */}
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-6 items-start">
          {/* ── Left panel ────────────────────────────────────────────── */}
          <div className="space-y-5">
            <AnimatePresence mode="wait">
              {/* UPLOAD */}
              {step === 'upload' && (
                <motion.div key="upload" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="space-y-4">
                  <div className="bg-white/90 backdrop-blur-sm border border-slate-200/70 rounded-2xl p-5 shadow-card">
                    <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Upload size={15} className="text-violet-600" /> Upload Material
                    </h2>
                    <DropZone onFile={handleFile} onUseSample={handleUseSample} />
                  </div>

                  {/* Tips */}
                  <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4">
                    <p className="text-xs font-bold text-blue-700 mb-2 flex items-center gap-1.5"><HelpCircle size={13} />Tips for best results</p>
                    <ul className="space-y-1.5 text-xs text-blue-600">
                      {['High-contrast images work best','Ensure text is clearly legible','PDF pages are processed individually','Handwritten text may require review'].map((tip) => (
                        <li key={tip} className="flex items-start gap-1.5"><CheckCircle2 size={11} className="mt-0.5 flex-shrink-0 text-blue-400" />{tip}</li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}

              {/* EXTRACTING */}
              {step === 'extracting' && (
                <motion.div key="extracting" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="space-y-4">
                  <div className="bg-white/90 backdrop-blur-sm border border-slate-200/70 rounded-2xl p-5 shadow-card">
                    <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <FileText size={15} className="text-violet-600" /> Extracting Text
                    </h2>
                    {imagePreview && <ImagePreviewPanel src={imagePreview} fileName={fileName} onReset={handleReset} />}
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500 font-medium">OCR Processing…</span>
                        <span className="text-violet-600 font-bold">{Math.round(extractProgress)}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
                          animate={{ width: `${extractProgress}%` }}
                          transition={{ duration: 0.15 }}
                        />
                      </div>
                      <div className="flex gap-2 flex-wrap mt-2">
                        {['Detecting layout','Recognising text','Parsing structure','Building AST'].map((s, i) => (
                          <span key={s} className={cn('text-2xs font-semibold px-2 py-0.5 rounded-full', extractProgress > i * 25 ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-400')}>
                            {extractProgress > i * 25 && <CheckCircle2 size={10} className="inline mr-0.5" />}{s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* CONFIGURE */}
              {(step === 'configure' || step === 'generating') && (
                <motion.div key="configure" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="space-y-4">
                  {/* Image + OCR */}
                  {imagePreview && <ImagePreviewPanel src={imagePreview} fileName={fileName} onReset={handleReset} />}
                  <OCRPanel text={ocrText} onEdit={setOcrText} />

                  {/* Config card */}
                  <div className="bg-white/90 backdrop-blur-sm border border-slate-200/70 rounded-2xl p-5 shadow-card space-y-5">
                    <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Sliders size={15} className="text-violet-600" /> Generation Settings
                    </h2>

                    {/* Subject + Grade */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Subject</label>
                        <input
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          placeholder="e.g. Science"
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-300 text-sm text-slate-900 transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Grade Level</label>
                        <select
                          value={gradeLevel}
                          onChange={(e) => setGradeLevel(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-400/40 text-sm text-slate-700 cursor-pointer transition-all"
                        >
                          {GRADE_LEVELS.map((g) => <option key={g} value={g}>{g}</option>)}
                        </select>
                      </div>
                    </div>

                    {/* Difficulty */}
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2.5">Difficulty</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(Object.entries(DIFFICULTY_CONFIG) as [Difficulty, typeof DIFFICULTY_CONFIG.beginner][]).map(([key, cfg]) => (
                          <button
                            key={key}
                            onClick={() => setDifficulty(key)}
                            className={cn(
                              'py-2.5 rounded-xl border-2 text-xs font-bold transition-all',
                              difficulty === key
                                ? `border-transparent bg-gradient-to-r ${cfg.color} text-white shadow-sm`
                                : 'border-slate-200 text-slate-500 hover:border-slate-300 bg-white'
                            )}
                          >
                            {cfg.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Question types */}
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2.5">Question Types</label>
                      <div className="space-y-2">
                        {QUESTION_TYPES.map(({ id, label, icon: Icon, desc }) => {
                          const active = selectedTypes.has(id);
                          return (
                            <button
                              key={id}
                              onClick={() => toggleType(id)}
                              className={cn(
                                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border-2 text-left transition-all',
                                active
                                  ? 'border-violet-300 bg-violet-50'
                                  : 'border-slate-100 bg-white hover:border-slate-200'
                              )}
                            >
                              <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0', active ? 'bg-violet-500 text-white' : 'bg-slate-100 text-slate-400')}>
                                <Icon size={14} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={cn('text-xs font-semibold', active ? 'text-violet-700' : 'text-slate-600')}>{label}</p>
                                <p className="text-2xs text-slate-400">{desc}</p>
                              </div>
                              <div className={cn('w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all', active ? 'border-violet-500 bg-violet-500' : 'border-slate-200')}>
                                {active && <CheckCircle2 size={10} className="text-white" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Number of questions */}
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2.5">Number of Questions</label>
                      <NumberStepper value={numQuestions} min={3} max={20} onChange={setNumQuestions} />
                    </div>

                    {/* Generate button */}
                    {step === 'configure' ? (
                      <GradientButton onClick={handleGenerate} className="w-full justify-center" size="lg" leftIcon={<Sparkles size={16} />}>
                        Generate Worksheet
                      </GradientButton>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500 font-medium flex items-center gap-1.5"><Sparkles size={12} className="text-violet-500" />AI is generating questions…</span>
                          <span className="text-violet-600 font-bold">{Math.round(genProgress)}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full" animate={{ width: `${genProgress}%` }} transition={{ duration: 0.15 }} />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* PREVIEW left panel */}
              {step === 'preview' && (
                <motion.div key="preview-left" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="space-y-4">
                  {imagePreview && <ImagePreviewPanel src={imagePreview} fileName={fileName} onReset={handleReset} />}

                  {/* Summary card */}
                  <div className="bg-white/90 backdrop-blur-sm border border-slate-200/70 rounded-2xl p-5 shadow-card">
                    <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <FileCheck size={15} className="text-violet-600" /> Worksheet Summary
                    </h2>
                    <div className="space-y-3">
                      {[
                        { label: 'Subject',    value: subject },
                        { label: 'Grade',      value: gradeLevel },
                        { label: 'Difficulty', value: DIFFICULTY_CONFIG[difficulty].label },
                        { label: 'Questions',  value: `${questions.length}` },
                        { label: 'Total Points', value: `${totalPoints} pts` },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                          <span className="text-xs text-slate-400 font-medium">{label}</span>
                          <span className="text-xs font-bold text-slate-700">{value}</span>
                        </div>
                      ))}
                      <div className="pt-1">
                        <p className="text-xs text-slate-400 font-medium mb-2">Question Types</p>
                        <div className="flex flex-wrap gap-1.5">
                          {[...new Set(questions.map((q) => q.type))].map((t) => (
                            <span key={t} className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-100 capitalize">
                              {QUESTION_TYPES.find((qt) => qt.id === t)?.label ?? t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Export */}
                  <div className="bg-white/90 backdrop-blur-sm border border-slate-200/70 rounded-2xl p-5 shadow-card">
                    <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <Download size={15} className="text-violet-600" /> Export
                    </h2>
                    <div className="space-y-2">
                      <GradientButton className="w-full justify-center" leftIcon={<Download size={15} />}>
                        Download PDF
                      </GradientButton>
                      <GradientButton variant="outline" className="w-full justify-center" leftIcon={<FileText size={15} />}>
                        Export as Word (.docx)
                      </GradientButton>
                      <GradientButton variant="outline" className="w-full justify-center" leftIcon={<ExternalLink size={15} />}>
                        Send to Google Classroom
                      </GradientButton>
                      <GradientButton variant="ghost" className="w-full justify-center" leftIcon={<Printer size={15} />}>
                        Print Worksheet
                      </GradientButton>
                    </div>
                  </div>

                  <button onClick={handleReset} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 text-sm font-semibold hover:border-violet-300 hover:text-violet-600 hover:bg-violet-50/50 transition-all">
                    <RefreshCw size={14} />
                    Generate New Worksheet
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Right panel: preview ───────────────────────────────────── */}
          <div className="lg:sticky lg:top-20">
            <AnimatePresence mode="wait">
              {(step === 'upload' || step === 'extracting') && (
                <motion.div
                  key="empty-preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white/60 backdrop-blur-sm border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center py-24 px-8 text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200 flex items-center justify-center mb-4">
                    <Eye size={24} className="text-slate-300" />
                  </div>
                  <p className="text-sm font-bold text-slate-400 mb-1">Worksheet Preview</p>
                  <p className="text-xs text-slate-300 max-w-xs">Your generated worksheet will appear here after configuration</p>
                </motion.div>
              )}

              {step === 'configure' && (
                <motion.div
                  key="configure-preview"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  className="bg-white/60 backdrop-blur-sm border-2 border-dashed border-violet-200 rounded-2xl flex flex-col items-center justify-center py-20 px-8 text-center"
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 border border-violet-200 flex items-center justify-center mb-4"
                  >
                    <Sparkles size={24} className="text-violet-400" />
                  </motion.div>
                  <p className="text-sm font-bold text-violet-700 mb-1">Ready to generate</p>
                  <p className="text-xs text-slate-400 max-w-xs">Configure your settings and click "Generate Worksheet" to create your custom worksheet</p>
                  <div className="flex items-center gap-2 mt-4 text-xs text-violet-400 font-medium">
                    <ArrowRight size={13} className="animate-bounce-x" />
                    Configure settings on the left
                  </div>
                </motion.div>
              )}

              {step === 'generating' && (
                <motion.div
                  key="generating-preview"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  className="bg-white/90 backdrop-blur-sm border border-slate-200/70 rounded-2xl overflow-hidden shadow-card-lg"
                >
                  <div className="bg-gradient-to-r from-slate-900 via-violet-950 to-slate-900 px-5 py-4">
                    <div className="flex items-center gap-2">
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
                        <Sparkles size={15} className="text-violet-400" />
                      </motion.div>
                      <span className="text-xs font-bold text-white">AI is writing your questions…</span>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    {Array(6).fill(0).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: genProgress > i * 16 ? 1 : 0.15, x: 0 }}
                        className="space-y-2"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center">
                            <span className="text-2xs font-bold text-violet-600">{i + 1}</span>
                          </div>
                          <div className={`h-3 rounded-full bg-slate-100 flex-1`} style={{ width: `${60 + (i % 3) * 15}%` }} />
                        </div>
                        {i % 2 === 0 && (
                          <div className="grid grid-cols-2 gap-2 pl-7">
                            {Array(4).fill(0).map((_, j) => (
                              <div key={j} className="h-2.5 rounded-full bg-slate-50 border border-slate-100" />
                            ))}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 'preview' && questions.length > 0 && (
                <motion.div key="full-preview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <WorksheetPreview
                    questions={questions}
                    subject={subject}
                    gradeLevel={gradeLevel}
                    difficulty={difficulty}
                    tab={previewTab}
                    onTabChange={setPreviewTab}
                    totalPoints={totalPoints}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
