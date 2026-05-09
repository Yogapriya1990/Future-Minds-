import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '../../components/layout/Navbar';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { GlassCard } from '../../components/ui/GlassCard';
import { GradientButton } from '../../components/ui/GradientButton';
import { AnimatedList } from '../../components/ui/AnimatedList';
import api from '../../services/api';
import { Workflow } from '../../types';

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

  return (
    <PageWrapper>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Automations</h1>
          <GradientButton onClick={() => navigate('/automations/new')}>+ New Workflow</GradientButton>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : workflows.length === 0 ? (
          <GlassCard className="text-center py-12">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="font-semibold text-gray-800 mb-2">No workflows yet</h3>
            <p className="text-gray-500 mb-4">Build your first automation workflow</p>
            <GradientButton onClick={() => navigate('/automations/new')}>Create Workflow</GradientButton>
          </GlassCard>
        ) : (
          <AnimatedList className="space-y-4">
            {workflows.map((wf) => (
              <GlassCard key={wf.id}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${wf.is_active ? 'bg-green-400' : 'bg-gray-300'}`} />
                      <h3 className="font-semibold text-gray-900">{wf.name}</h3>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{wf.description}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{wf.trigger_type}</span>
                      <span className="text-xs text-gray-400">{wf.steps?.length ?? 0} steps</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => runMutation.mutate(wf.id)} className="text-sm px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100">Run</motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => toggleMutation.mutate(wf.id)} className={`text-sm px-3 py-1.5 rounded-lg ${wf.is_active ? 'bg-gray-100 text-gray-600' : 'bg-green-50 text-green-600'}`}>{wf.is_active ? 'Pause' : 'Activate'}</motion.button>
                    <Link to={`/automations/${wf.id}/runs`} className="text-sm text-gray-400 hover:text-gray-600">Logs</Link>
                  </div>
                </div>
              </GlassCard>
            ))}
          </AnimatedList>
        )}
      </div>
    </PageWrapper>
  );
}
