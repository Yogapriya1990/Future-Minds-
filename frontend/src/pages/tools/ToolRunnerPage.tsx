import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { GlassCard } from '../../components/ui/GlassCard';
import { GradientButton } from '../../components/ui/GradientButton';
import api from '../../services/api';
import { Tool } from '../../types';

export default function ToolRunnerPage() {
  const { slug } = useParams<{ slug: string }>();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [tokens, setTokens] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { data: tool } = useQuery<Tool>({
    queryKey: ['tool', slug],
    queryFn: () => api.get(`/api/tools/${slug}`).then((r) => r.data),
    enabled: !!slug,
  });

  const run = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post(`/api/tools/${slug}/run`, { input_text: input });
      setOutput(data.output_text);
      setTokens(data.tokens_used);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(msg || 'Failed to run tool');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {tool && (
          <div className="mb-6">
            <div className="text-4xl mb-2">{tool.icon_url ?? '🛠️'}</div>
            <h1 className="text-3xl font-bold text-gray-900">{tool.name}</h1>
            <p className="text-gray-500 mt-1">{tool.description}</p>
            {tool.is_premium && <span className="inline-block mt-2 text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full">Pro Tool</span>}
          </div>
        )}

        <GlassCard className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={6}
            placeholder="Enter your text here..."
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 outline-none resize-none"
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <div className="mt-4">
            <GradientButton onClick={run} isLoading={loading} disabled={!input.trim()} className="w-full">
              Run Tool
            </GradientButton>
          </div>
        </GlassCard>

        {output && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <GlassCard>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">Output</h3>
                <span className="text-xs text-gray-400">{tokens} tokens</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">{output}</div>
              <button onClick={() => navigator.clipboard.writeText(output)} className="mt-3 text-sm text-purple-600 hover:underline">Copy to clipboard</button>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </PageWrapper>
  );
}
