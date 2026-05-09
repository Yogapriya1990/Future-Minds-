import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Navbar } from '../../components/layout/Navbar';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { GlassCard } from '../../components/ui/GlassCard';
import { GradientButton } from '../../components/ui/GradientButton';
import { AnimatedList } from '../../components/ui/AnimatedList';
import api from '../../services/api';
import { Conversation } from '../../types';

const MODELS = [
  { value: 'gpt-4o', label: 'GPT-4o', badge: 'OpenAI' },
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini', badge: 'OpenAI' },
  { value: 'claude-sonnet', label: 'Claude Sonnet', badge: 'Anthropic' },
  { value: 'claude-haiku', label: 'Claude Haiku', badge: 'Anthropic' },
];

export default function ChatPage() {
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { data: conversations } = useQuery<Conversation[]>({
    queryKey: ['conversations'],
    queryFn: () => api.get('/api/conversations').then((r) => r.data),
  });

  const startChat = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/api/conversations', { model: selectedModel });
      navigate(`/chat/${data.id}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Chat</h1>
        <p className="text-gray-500 mb-8">Choose a model and start a new conversation</p>

        <GlassCard className="mb-8">
          <h2 className="font-semibold text-gray-800 mb-4">Select Model</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {MODELS.map((m) => (
              <motion.button
                key={m.value}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedModel(m.value)}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  selectedModel === m.value
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="font-medium text-gray-800 text-sm">{m.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{m.badge}</div>
              </motion.button>
            ))}
          </div>
          <GradientButton onClick={startChat} isLoading={loading} size="lg" className="w-full">
            Start New Chat
          </GradientButton>
        </GlassCard>

        {conversations && conversations.length > 0 && (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Conversations</h2>
            <AnimatedList className="space-y-3">
              {conversations.slice(0, 10).map((conv) => (
                <GlassCard key={conv.id} onClick={() => navigate(`/chat/${conv.id}`)} className="cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-800">{conv.title}</div>
                      <div className="text-sm text-gray-500 mt-0.5">{conv.model} · {conv.total_tokens.toLocaleString()} tokens</div>
                    </div>
                    <span className="text-gray-400">→</span>
                  </div>
                </GlassCard>
              ))}
            </AnimatedList>
          </>
        )}
      </div>
    </PageWrapper>
  );
}
