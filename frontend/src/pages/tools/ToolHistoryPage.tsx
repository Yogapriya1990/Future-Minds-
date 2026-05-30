import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Bot, Clock, Zap, ChevronRight, Copy, Check,
  MessageSquare, FileText, Cpu,
} from 'lucide-react';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { GlassCard, PageHeader, Spinner, FilterBar, AnimatedList, EmptyStateAIHistory } from '../../components/ui';
import api from '../../services/api';
import { ToolUsage } from '../../types';
import { cn } from '../../lib/utils';

const FILTERS = ['All', 'Tools', 'Chat', 'Workflows'];

const TYPE_META: Record<string, { icon: typeof Bot; color: string; bg: string; label: string }> = {
  tool:     { icon: Cpu,          color: 'text-violet-600', bg: 'bg-violet-50',  label: 'Tool Run' },
  chat:     { icon: MessageSquare,color: 'text-blue-600',   bg: 'bg-blue-50',    label: 'Chat'     },
  workflow: { icon: Zap,          color: 'text-amber-600',  bg: 'bg-amber-50',   label: 'Workflow' },
  default:  { icon: Bot,          color: 'text-slate-500',  bg: 'bg-slate-100',  label: 'AI'       },
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <button
      onClick={copy}
      className="p-1.5 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-colors"
      title="Copy output"
    >
      {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
    </button>
  );
}

function HistoryCard({ item, index }: { item: ToolUsage; index: number }) {
  const meta = TYPE_META[(item as ToolUsage & { type?: string }).type ?? 'default'] ?? TYPE_META.default;
  const Icon = meta.icon;
  const date = item.created_at ? new Date(item.created_at) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
    >
      <GlassCard hover padding="none" className="overflow-hidden group">
        <div className="flex items-start gap-0">
          {/* Left accent strip */}
          <div className={cn('w-1 self-stretch rounded-l-2xl flex-shrink-0', meta.bg)} />

          <div className="flex-1 min-w-0 p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', meta.bg)}>
                  <Icon size={15} className={meta.color} />
                </div>
                <div>
                  <span className={cn('text-xs font-semibold', meta.color)}>{meta.label}</span>
                  {date && (
                    <p className="text-2xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock size={10} />
                      {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-2xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Zap size={9} className="text-violet-400" />
                  {item.tokens_used?.toLocaleString() ?? '—'} tokens
                </span>
                <CopyButton text={item.output_text ?? ''} />
              </div>
            </div>

            {/* Input */}
            <div className="mb-2.5">
              <p className="text-2xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Input</p>
              <p className="text-sm text-slate-700 line-clamp-2 leading-relaxed">{item.input_text}</p>
            </div>

            {/* Output */}
            <div>
              <p className="text-2xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Output</p>
              <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed">{item.output_text}</p>
            </div>

            {/* Expand chevron */}
            <div className="mt-3 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-2xs text-violet-600 font-semibold flex items-center gap-0.5">
                View full <ChevronRight size={11} />
              </span>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

export default function ToolHistoryPage() {
  const [filter, setFilter] = useState('All');

  const { data: history = [], isLoading } = useQuery<ToolUsage[]>({
    queryKey: ['tool-history'],
    queryFn: () => api.get('/api/tools/history').then((r) => r.data),
  });

  const filtered = filter === 'All' ? history : history.filter(
    (h) => (h as ToolUsage & { type?: string }).type === filter.toLowerCase()
  );

  const totalTokens = history.reduce((sum, h) => sum + (h.tokens_used ?? 0), 0);

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <PageHeader
          title="AI History"
          subtitle={`${history.length} sessions · ${totalTokens.toLocaleString()} tokens used`}
          badge="Activity Log"
          badgeVariant="violet"
          actions={
            history.length > 0 ? (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <FileText size={14} />
                <span className="font-semibold text-slate-700">{history.length}</span> runs
              </div>
            ) : undefined
          }
        />

        {history.length > 0 && (
          <div className="mb-6">
            <FilterBar
              options={FILTERS}
              value={filter}
              onChange={setFilter}
            />
          </div>
        )}

        {isLoading ? (
          <Spinner label="Loading history…" />
        ) : history.length === 0 ? (
          <EmptyStateAIHistory />
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm">
            No {filter.toLowerCase()} sessions yet.
          </div>
        ) : (
          <AnimatedList className="space-y-3">
            {filtered.map((item, i) => (
              <HistoryCard key={item.id} item={item} index={i} />
            ))}
          </AnimatedList>
        )}
      </div>
    </PageWrapper>
  );
}
