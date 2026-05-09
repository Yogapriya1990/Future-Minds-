import { useQuery } from '@tanstack/react-query';
import { Navbar } from '../../components/layout/Navbar';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { GlassCard } from '../../components/ui/GlassCard';
import { AnimatedList } from '../../components/ui/AnimatedList';
import api from '../../services/api';
import { ToolUsage } from '../../types';

export default function ToolHistoryPage() {
  const { data: history = [], isLoading } = useQuery<ToolUsage[]>({
    queryKey: ['tool-history'],
    queryFn: () => api.get('/api/tools/history').then((r) => r.data),
  });

  return (
    <PageWrapper>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Tool Usage History</h1>
        {isLoading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : history.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No tool usage yet</div>
        ) : (
          <AnimatedList className="space-y-4">
            {history.map((item) => (
              <GlassCard key={item.id}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-purple-600 mb-1">Input</div>
                    <p className="text-gray-700 text-sm line-clamp-2">{item.input_text}</p>
                    <div className="text-sm font-medium text-gray-600 mt-3 mb-1">Output</div>
                    <p className="text-gray-500 text-sm line-clamp-3">{item.output_text}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs text-gray-400">{item.tokens_used} tokens</div>
                    <div className="text-xs text-gray-400 mt-1">{item.created_at ? new Date(item.created_at).toLocaleDateString() : ''}</div>
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
