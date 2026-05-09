import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Navbar } from '../../components/layout/Navbar';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { GlassCard } from '../../components/ui/GlassCard';
import { GradientButton } from '../../components/ui/GradientButton';
import { AnimatedInput } from '../../components/ui/AnimatedInput';
import { AnimatedList } from '../../components/ui/AnimatedList';
import api from '../../services/api';
import { Tool } from '../../types';

const BLANK = { name: '', slug: '', description: '', category: '', system_prompt: '', model: 'gpt-4o-mini', is_premium: false };

export default function ToolManagementPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...BLANK });

  const { data: tools = [], isLoading } = useQuery<Tool[]>({
    queryKey: ['admin-tools'],
    queryFn: () => api.get('/api/tools').then((r) => r.data),
  });

  const createMutation = useMutation({
    mutationFn: () => api.post('/api/admin/tools', form).then((r) => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-tools'] }); setShowForm(false); setForm({ ...BLANK }); },
  });

  const deleteMutation = useMutation({
    mutationFn: (toolId: number) => api.delete(`/api/admin/tools/${toolId}`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-tools'] }),
  });

  const set = (key: string, value: string | boolean) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <PageWrapper>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Tool Management</h1>
          <GradientButton onClick={() => setShowForm(true)}>+ Add Tool</GradientButton>
        </div>

        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <GlassCard className="mb-6">
              <h2 className="font-semibold text-gray-800 mb-4">New Tool</h2>
              <div className="grid grid-cols-2 gap-4">
                <AnimatedInput label="Name" value={form.name} onChange={(e) => set('name', e.target.value)} />
                <AnimatedInput label="Slug (e.g. text-summarizer)" value={form.slug} onChange={(e) => set('slug', e.target.value)} />
                <AnimatedInput label="Category" value={form.category} onChange={(e) => set('category', e.target.value)} />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                  <select value={form.model} onChange={(e) => set('model', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm">
                    <option value="gpt-4o-mini">GPT-4o Mini</option>
                    <option value="gpt-4o">GPT-4o</option>
                    <option value="claude-sonnet">Claude Sonnet</option>
                    <option value="claude-haiku">Claude Haiku</option>
                  </select>
                </div>
              </div>
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm resize-none" />
              </div>
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">System Prompt</label>
                <textarea value={form.system_prompt} onChange={(e) => set('system_prompt', e.target.value)} rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm resize-none" />
              </div>
              <div className="flex items-center gap-3 mt-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_premium} onChange={(e) => set('is_premium', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-purple-500 focus:ring-purple-400" />
                  <span className="text-sm font-medium text-gray-700">Premium Only</span>
                </label>
              </div>
              <div className="flex gap-3 mt-4">
                <GradientButton onClick={() => createMutation.mutate()} isLoading={createMutation.isPending}>Create Tool</GradientButton>
                <GradientButton variant="outline" onClick={() => { setShowForm(false); setForm({ ...BLANK }); }}>Cancel</GradientButton>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <AnimatedList className="space-y-3">
            {tools.map((tool) => (
              <GlassCard key={tool.id}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{tool.name}</h3>
                      {tool.is_premium && <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">Pro</span>}
                    </div>
                    <p className="text-sm text-gray-500 truncate">{tool.description}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                      <span>{tool.slug}</span>
                      <span>{tool.category}</span>
                      <span>{tool.model}</span>
                    </div>
                  </div>
                  <GradientButton
                    size="sm"
                    variant="outline"
                    onClick={() => { if (confirm(`Delete "${tool.name}"?`)) deleteMutation.mutate(tool.id); }}
                    className="border-red-200 text-red-600 hover:bg-red-50 shrink-0"
                  >
                    Delete
                  </GradientButton>
                </div>
              </GlassCard>
            ))}
          </AnimatedList>
        )}
      </div>
    </PageWrapper>
  );
}
