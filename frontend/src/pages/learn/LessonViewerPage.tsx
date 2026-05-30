import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { GradientButton } from '../../components/ui/GradientButton';
import api from '../../services/api';
import { Lesson, Course } from '../../types';

export default function LessonViewerPage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();

  const { data: course } = useQuery<Course & { lessons: Lesson[] }>({
    queryKey: ['course', courseId],
    queryFn: () => api.get(`/api/courses/${courseId}`).then((r) => r.data),
  });

  const completeMutation = useMutation({
    mutationFn: () => api.post(`/api/courses/lessons/${lessonId}/complete`),
    onSuccess: () => {
      const lessons = course?.lessons ?? [];
      const currentIdx = lessons.findIndex((l) => l.id === Number(lessonId));
      const next = lessons[currentIdx + 1];
      if (next) navigate(`/learn/${courseId}/lesson/${next.id}`);
      else navigate(`/learn/${courseId}`);
    },
  });

  const lesson = course?.lessons?.find((l) => l.id === Number(lessonId));

  if (!lesson) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>;

  const lessons = course?.lessons ?? [];
  const currentIdx = lessons.findIndex((l) => l.id === Number(lessonId));
  const progress = lessons.length > 0 ? ((currentIdx + 1) / lessons.length) * 100 : 0;

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">{course?.title}</span>
            <span className="text-sm text-gray-500">{currentIdx + 1} / {lessons.length}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <motion.div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">{lesson.title}</h1>
        {lesson.duration_minutes > 0 && <p className="text-gray-400 text-sm mb-6">{lesson.duration_minutes} min read</p>}

        {lesson.video_url && (
          <div className="aspect-video mb-6 rounded-2xl overflow-hidden bg-black">
            <video src={lesson.video_url} controls className="w-full h-full" />
          </div>
        )}

        <div className="prose prose-gray max-w-none mb-8 leading-relaxed text-gray-700">
          {lesson.content}
        </div>

        <div className="flex gap-4">
          {currentIdx > 0 && (
            <button onClick={() => navigate(`/learn/${courseId}/lesson/${lessons[currentIdx - 1].id}`)} className="px-6 py-3 rounded-full border-2 border-gray-200 text-gray-600 hover:border-purple-400">
              ← Previous
            </button>
          )}
          <GradientButton onClick={() => completeMutation.mutate()} isLoading={completeMutation.isPending} className="flex-1">
            {currentIdx < lessons.length - 1 ? 'Complete & Next →' : 'Complete Course 🎉'}
          </GradientButton>
        </div>
      </div>
    </PageWrapper>
  );
}
