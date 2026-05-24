import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Wrench, PenLine, Code2, Palette, Briefcase, Bot, Zap, BarChart2,
  History, Sparkles, ChevronRight,
} from 'lucide-react';
import { PageWrapper } from '../../components/layout/PageWrapper';
import {
  GlassCard, PageHeader, StatusBadge, EmptyState, Spinner, FilterBar, AnimatedList, GradientButton,
} from '../../components/ui';
import api from '../../services/api';
import { Tool } from '../../types';

const CATEGORIES = ['All', 'Writing', 'Development', 'Creative', 'Business'];

const CATEGORY_CONFIG: Record<string, { icon: React.ComponentType<{ size?: number | string; className?: string }>; gradient: string; accent: string }> = {
  Writing:     { icon: PenLine,   gradient: 'from-blue-500 to-cyan-500',     accent: 'text-blue-600'    },
  Development: { icon: Code2,     gradient: 'from-violet-500 to-purple-600', accent: 'text-violet-600'  },
  Creative:    { icon: Palette,   gradient: 'from-pink-500 to-rose-500',     accent: 'text-pink-600'    },
  Business:    { icon: Briefcase, gradient: 'from-amber-500 to-orange-500',  accent: 'text-amber-600'   },
  default:     { icon: Wrench,    gradient: 'from-slate-500 to-slate-600',   accent: 'text-slate-600'   },
};

const MODEL_LABELS: Record<string, string> = {
  'gpt-4o':       'GPT-4o',
  'claude-sonnet': 'Claude 3.5',
};

function ToolCard({ tool }: { tool: Tool }) {
  const config = CATEGORY_CONFIG[tool.category] ?? CATEGORY_CONFIG.default;
  const Icon = config.icon;

  return (
    <Link to={`/tools/${tool.slug}`} className="block group h-full">
      <GlassCard padding="none" className="h-full flex flex-col overflow-hidden group-hover:border-violet-200/80 relative">
        {/* Pro badge */}
        {tool.is_premium && (
          <div className="absolute top-3 right-3 z-10">
            <StatusBadge variant="premium" label="Pro" />
          </div>
        )}

        {/* Header gradient */}
        <div className={`bg-gradient-to-br ${config.gradient} p-5 relative overflow-hidden`}>
          <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-white/10" />
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Icon size={22} className="text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-5">
          <div className="mb-3">
            <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${config.accent}`}>
              {tool.category}
            </p>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-violet-700 transition-colors">
              {tool.name}
            </h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed flex-1 mb-4">
            {tool.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              <Bot size={12} className="text-slate-400" />
              <span className="text-xs text-slate-400 font-medium">
                {MODEL_LABELS[tool.model] ?? tool.model}
              </span>
            </div>
            <span className="flex items-center gap-0.5 text-xs font-semibold text-violet-600 opacity-0 group-hover:opacity-100 transition-opacity">
              Open <ChevronRight size={12} />
            </span>
          </div>
        </div>
      </GlassCard>
    </Link>
  );
}

export default function ToolMarketplacePage() {
  const [category, setCategory] = useState('All');

  const { data: tools = [], isLoading } = useQuery<Tool[]>({
    queryKey: ['tools', category],
    queryFn: () => {
      const params = category !== 'All' ? `?category=${category}` : '';
      return api.get(`/api/tools${params}`).then((r) => r.data);
    },
  });

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <PageHeader
          title="AI Tools"
          subtitle="Powerful AI tools to supercharge your workflow"
          badge={`${tools.length} Tools`}
          actions={
            <Link to="/tools/history">
              <GradientButton variant="outline" size="sm" leftIcon={<History size={14} />}>
                History
              </GradientButton>
            </Link>
          }
        />

        <div className="mb-8">
          <FilterBar options={CATEGORIES} value={category} onChange={setCategory} className="tools-filter" />
        </div>

        {isLoading ? (
          <Spinner label="Loading tools..." />
        ) : tools.length === 0 ? (
          <EmptyState
            icon={<Wrench size={28} />}
            title="No tools found"
            description="No AI tools match this category yet. Check back soon."
          />
        ) : (
          <AnimatedList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tools.map((tool, i) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.35 }}
              >
                <ToolCard tool={tool} />
              </motion.div>
            ))}
          </AnimatedList>
        )}
      </div>
    </PageWrapper>
  );
}
