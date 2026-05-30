import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { GlassCard } from '../../components/ui/GlassCard';
import { AnimatedList } from '../../components/ui/AnimatedList';
import api from '../../services/api';
import { WorkflowRun } from '../../types';

const STATUS_COLORS: Record<string, string> = {
  completed: 'bg-green-100 text-green-700',
  running: 'bg-blue-100 text-blue-700',
  failed: 'bg-red-100 text-red-700',
};

export default function RunHistoryPage() {
  const { id } = useParams<{ id: string }>();
  const { data: runs = [], isLoading } = useQuery<WorkflowRun[]>({
    queryKey: ['workflow-runs', id],
    queryFn: () => api.get(`/api/workflows/${id}/runs`).then((r) => r.data),
    enabled: !!id,
  });

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Run History</h1>
        {isLoading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : runs.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No runs yet</div>
        ) : (
          <AnimatedList className="space-y-4">
            {runs.map((run) => (
              <GlassCard key={run.id}>
                <div className="flex items-start justify-between">
                  <div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[run.status] ?? 'bg-gray-100 text-gray-600'}`}>{run.status}</span>
                    <div className="text-sm text-gray-500 mt-2">Started: {run.started_at ? new Date(run.started_at).toLocaleString() : '—'}</div>
                    {run.error_message && <p className="text-red-500 text-sm mt-2">{run.error_message}</p>}
                    {run.output_data && (
                      <pre className="mt-3 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg overflow-auto max-h-32">{JSON.stringify(run.output_data, null, 2)}</pre>
                    )}
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
