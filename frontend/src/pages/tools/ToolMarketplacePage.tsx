import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { GlassCard } from '../../components/ui/GlassCard';
import { AnimatedList } from '../../components/ui/AnimatedList';
import api from '../../services/api';
import { Tool } from '../../types';

const CATEGORIES = ['All', 'Writing', 'Development', 'Creative', 'Business'];

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
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-gray-900">AI Tools</h1>
          <Link to="/tools/history" className="text-sm text-purple-600 hover:underline">View History →</Link>
        </div>
        <p className="text-gray-500 mb-6">Powerful AI tools at your fingertips</p>

        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCategory(c)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${category === c ? 'bg-purple-500 text-white' : 'bg-white text-gray-600 border hover:border-purple-400'}`}>{c}</button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <AnimatedList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <Link key={tool.id} to={`/tools/${tool.slug}`}>
                <GlassCard className="h-full relative">
                  {tool.is_premium && (
                    <span className="absolute top-4 right-4 text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-0.5 rounded-full">Pro</span>
                  )}
                  <div className="text-4xl mb-3">{tool.icon_url ?? '🛠️'}</div>
                  <div className="text-xs text-purple-500 font-medium mb-1">{tool.category}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{tool.name}</h3>
                  <p className="text-sm text-gray-500">{tool.description}</p>
                  <div className="text-xs text-gray-400 mt-3">{tool.model}</div>
                </GlassCard>
              </Link>
            ))}
          </AnimatedList>
        )}
      </div>
    </PageWrapper>
  );
}
