import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { GlassCard } from '../../components/ui/GlassCard';
import { GradientButton } from '../../components/ui/GradientButton';
import { AnimatedInput } from '../../components/ui/AnimatedInput';
import api from '../../services/api';
import { Course, Lesson } from '../../types';

export default function EditCoursePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: course } = useQuery<Course>({
    queryKey: ['course', id],
    queryFn: () => api.get(`/api/courses/${id}`).then((r) => r.data),
    enabled: !!id,
  });

  const { data: lessons = [] } = useQuery<Lesson[]>({
    queryKey: ['course-lessons', id],
    queryFn: () => api.get(`/api/courses/${id}/lessons`).then((r) => r.data),
    enabled: !!id,
  });

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonContent, setLessonContent] = useState('');
  const [lessonDuration, setLessonDuration] = useState('10');

  useEffect(() => {
    if (course) { setTitle(course.title); setDescription(course.description); }
  }, [course]);

  const updateMutation = useMutation({
    mutationFn: () => api.put(`/api/courses/${id}`, { title, description }).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['course', id] }),
  });

  const publishMutation = useMutation({
    mutationFn: () => api.post(`/api/courses/${id}/publish`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['course', id] }),
  });

  const addLessonMutation = useMutation({
    mutationFn: () => api.post(`/api/courses/${id}/lessons`, {
      title: lessonTitle, content: lessonContent, duration_minutes: parseInt(lessonDuration) || 10,
    }).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['course-lessons', id] });
      setShowAddLesson(false);
      setLessonTitle(''); setLessonContent(''); setLessonDuration('10');
    },
  });

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Edit Course</h1>
          <div className="flex gap-3">
            {course && !course.is_published && (
              <GradientButton onClick={() => publishMutation.mutate()} isLoading={publishMutation.isPending} size="sm">
                Publish
              </GradientButton>
            )}
            {course?.is_published && (
              <span className="text-xs px-3 py-1.5 rounded-full bg-green-100 text-green-700 font-medium flex items-center">✅ Published</span>
            )}
          </div>
        </div>

        <GlassCard className="mb-6">
          <h2 className="font-semibold text-gray-800 mb-4">Course Details</h2>
          <div className="space-y-4">
            <AnimatedInput label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm resize-none"
              />
            </div>
            <GradientButton onClick={() => updateMutation.mutate()} isLoading={updateMutation.isPending}>Save Details</GradientButton>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Lessons ({lessons.length})</h2>
            <GradientButton size="sm" onClick={() => setShowAddLesson(true)}>+ Add Lesson</GradientButton>
          </div>

          {showAddLesson && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-4 p-4 rounded-xl bg-purple-50 border border-purple-100 space-y-3">
              <AnimatedInput label="Lesson Title" value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea value={lessonContent} onChange={(e) => setLessonContent(e.target.value)} rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm resize-none" />
              </div>
              <AnimatedInput label="Duration (minutes)" value={lessonDuration} onChange={(e) => setLessonDuration(e.target.value)} type="number" />
              <div className="flex gap-2">
                <GradientButton size="sm" onClick={() => addLessonMutation.mutate()} isLoading={addLessonMutation.isPending}>Add</GradientButton>
                <GradientButton size="sm" variant="outline" onClick={() => setShowAddLesson(false)}>Cancel</GradientButton>
              </div>
            </motion.div>
          )}

          {lessons.length === 0 ? (
            <p className="text-center text-gray-400 py-8">No lessons yet. Add your first lesson.</p>
          ) : (
            <div className="space-y-3">
              {lessons.map((lesson, i) => (
                <div key={lesson.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="w-7 h-7 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-800 truncate">{lesson.title}</div>
                    <div className="text-xs text-gray-400">{lesson.duration_minutes} min</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        <div className="mt-6">
          <GradientButton variant="outline" onClick={() => navigate('/teach')} className="w-full">← Back to Dashboard</GradientButton>
        </div>
      </div>
    </PageWrapper>
  );
}
