import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Navbar } from '../../components/layout/Navbar';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { GlassCard } from '../../components/ui/GlassCard';
import { GradientButton } from '../../components/ui/GradientButton';
import { AnimatedInput } from '../../components/ui/AnimatedInput';
import api from '../../services/api';

const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];
const CATEGORIES = ['Programming', 'Design', 'Business', 'Marketing', 'AI & ML', 'Data Science', 'Other'];

export default function CreateCoursePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', category: 'Programming', difficulty: 'beginner', thumbnail_url: '', price: '0' });

  const createMutation = useMutation({
    mutationFn: () => api.post('/api/courses', { ...form, price: parseFloat(form.price) || 0 }).then((r) => r.data),
    onSuccess: (data) => navigate(`/teach/edit/${data.id}`),
  });

  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <PageWrapper>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Create Course</h1>
        <GlassCard>
          <div className="space-y-4">
            <AnimatedInput label="Course Title" value={form.title} onChange={(e) => set('title', e.target.value)} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm resize-none"
                placeholder="What will students learn?"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => set('category', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                >
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                <select
                  value={form.difficulty}
                  onChange={(e) => set('difficulty', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                >
                  {DIFFICULTIES.map((d) => <option key={d} className="capitalize">{d}</option>)}
                </select>
              </div>
            </div>
            <AnimatedInput label="Thumbnail URL (optional)" value={form.thumbnail_url} onChange={(e) => set('thumbnail_url', e.target.value)} />
            <AnimatedInput label="Price ($)" value={form.price} onChange={(e) => set('price', e.target.value)} type="number" />
            <div className="flex gap-3 pt-2">
              <GradientButton onClick={() => createMutation.mutate()} isLoading={createMutation.isPending} className="flex-1">
                Create & Add Lessons
              </GradientButton>
              <GradientButton variant="outline" onClick={() => navigate('/teach')} className="flex-1">
                Cancel
              </GradientButton>
            </div>
          </div>
        </GlassCard>
      </div>
    </PageWrapper>
  );
}
