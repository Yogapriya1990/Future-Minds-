import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { GradientButton } from '../../components/ui/GradientButton';
import api from '../../services/api';
import { Message } from '../../types';

export default function ConversationPage() {
  const { id } = useParams<{ id: string }>();
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [streamContent, setStreamContent] = useState('');
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: messages = [], refetch } = useQuery<Message[]>({
    queryKey: ['messages', id],
    queryFn: () => api.get(`/api/conversations/${id}/messages`).then((r) => r.data),
    enabled: !!id,
  });

  useEffect(() => {
    setLocalMessages(messages);
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [localMessages, streamContent]);

  const sendMessage = async () => {
    if (!input.trim() || streaming) return;
    const userMsg = input;
    setInput('');
    setLocalMessages((prev) => [...prev, { id: Date.now(), conversation_id: Number(id), role: 'user', content: userMsg, tokens_used: 0, created_at: new Date().toISOString() }]);
    setStreaming(true);
    setStreamContent('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/conversations/${id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('access_token')}` },
        body: JSON.stringify({ content: userMsg }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let full = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
              try {
                const parsed = JSON.parse(line.slice(6));
                full += parsed.content || '';
                setStreamContent(full);
              } catch {}
            }
          }
        }
      }
      setStreamContent('');
      await refetch();
    } finally {
      setStreaming(false);
    }
  };

  const allMessages = streamContent
    ? [...localMessages, { id: -1, conversation_id: Number(id), role: 'assistant' as const, content: streamContent, tokens_used: 0, created_at: '' }]
    : localMessages;

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto px-4 py-4 flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>
        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          {allMessages.map((msg) => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-white/80 backdrop-blur-sm border border-white/40 text-gray-800'
              }`}>
                {msg.content}
                {msg.id === -1 && <span className="inline-block w-2 h-4 bg-purple-500 animate-pulse ml-1 rounded" />}
              </div>
            </motion.div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-gray-100 pt-4 pb-2">
          <div className="flex gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Type a message... (Enter to send)"
              rows={1}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 outline-none resize-none bg-white/80 backdrop-blur-sm"
            />
            <GradientButton onClick={sendMessage} isLoading={streaming} disabled={!input.trim()}>
              Send
            </GradientButton>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
