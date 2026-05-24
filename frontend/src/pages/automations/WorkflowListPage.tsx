import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Play, Pause, Clock, Webhook, Hand, BarChart2, Plus } from 'lucide-react';
import { PageWrapper } from '../../components/layout/PageWrapper';
import {
  GlassCard, GradientButton, AnimatedList, PageHeader,
  StatusBadge, EmptyState, Spinner,
} from '../../components/ui';
import api from '../../services/api';
import { Workflow } from '../../types';

const TRIGGER_CONFIG: Record<string, { icon: React.ComponentType<{ size?: number | string; className?: string }>; label: string }> = {
  manual:    { icon: Hand,    label: 'Manual'    },
  scheduled: { icon: Clock,   label: 'Scheduled' },
  webhook:   { icon: Webhook, label: 'Webhook'   },
};

function WorkflowCard({
  wf,
  onToggle,
  onRun,
  isRunning,
  isToggling,
}: {
  wf: Workflow;
  onToggle: () => void;
  onRun: () => void;
  isRunning: boolean;
  isToggling: boolean;
}) {
  const TriggerIcon = TRIGGER_CONFIG[wf.trigger_type]?.icon ?? Hand;
  const triggerLabel = TRIGGER_CONFIG[wf.trigger_type]?.label ?? wf.trigger_type;

  return (
    <GlassCard accent={wf.is_active ? 'emerald' : 'none'} hover className="group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5 min-w-0">
          {/* Status icon */}
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
            wf.is_active
              ? 'bg-emerald-50 border border-emerald-100'
              : 'bg-slate-50 border border-slate-100'
          }`}>
            <Zap size={18} className={wf.is_active ? 'text-emerald-600' : 'text-slate-400'} />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="text-sm font-bold text-slate-900 truncate">{wf.name}</h3>
              <StatusBadge variant={wf.is_active ? 'active' : 'inactive'} dot />
            </div>
            <p className="text-xs text-slate-500 mb-2 line-clamp-1">{wf.description}</p>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <TriggerIcon size={11} />
                {triggerLabel}
              </span>
              <span className="text-xs text-slate-400">
                {wf.steps?.length ?? 0} step{(wf.steps?.length ?? 0) !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            to={`/automations/${wf.id}/runs`}
            className="p-2 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-colors"
            title="View logs"
          >
            <BarChart2 size={15} />
          </Link>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onRun}
            disabled={isRunning}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-violet-50 text-violet-700 hover:bg-violet-100 transition-colors disabled:opacity-50"
          >
            <Play size={12} className="fill-current" />
            {isRunning ? 'Running…' : 'Run'}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onToggle}
            disabled={isToggling}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 ${
              wf.is_active
                ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            {wf.is_active ? <Pause size={12} /> : <Play size={12} />}
            {wf.is_active ? 'Pause' : 'Activate'}
          </motion.button>
        </div>
      </div>
    </GlassCard>
  );
}

export default function WorkflowListPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: workflows = [], isLoading } = useQuery<Workflow[]>({
    queryKey: ['workflows'],
    queryFn: () => api.get('/api/workflows').then((r) => r.data),
  });

  const toggleMutation = useMutation({
    mutationFn: (id: number) => api.post(`/api/workflows/${id}/toggle`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['workflows'] }),
  });

  const runMutation = useMutation({
    mutationFn: (id: number) => api.post(`/api/workflows/${id}/run`, {}),
  });

  const activeCount = workflows.filter((w) => w.is_active).length;

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <PageHeader
          title="Automations"
          subtitle="Build and manage your AI workflows"
          badge={activeCount > 0 ? `${activeCount} active` : undefined}
          badgeVariant="emerald"
          actions={
            <GradientButton onClick={() => navigate('/automations/new')} leftIcon={<Plus size={15} />}>
              New Workflow
            </GradientButton>
          }
        />

        {isLoading ? (
          <Spinner label="Loading workflows..." />
        ) : workflows.length === 0 ? (
          <EmptyState
            icon={<Zap size={28} />}
            title="No workflows yet"
            description="Automate repetitive tasks with AI-powered workflows. Build your first one in minutes."
            action={
              <GradientButton onClick={() => navigate('/automations/new')} leftIcon={<Plus size={15} />}>
                Create Workflow
              </GradientButton>
            }
          />
        ) : (
          <AnimatedList className="space-y-3">
            {workflows.map((wf, i) => (
              <motion.div
                key={wf.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.3 }}
              >
                <WorkflowCard
                  wf={wf}
                  onToggle={() => toggleMutation.mutate(wf.id)}
                  onRun={() => runMutation.mutate(wf.id)}
                  isRunning={runMutation.isPending && runMutation.variables === wf.id}
                  isToggling={toggleMutation.isPending && toggleMutation.variables === wf.id}
                />
              </motion.div>
            ))}
          </AnimatedList>
        )}
      </div>
    </PageWrapper>
  );
}
