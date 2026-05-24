import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { GlassCard } from '../../components/ui/GlassCard';
import { GradientButton } from '../../components/ui/GradientButton';
import api from '../../services/api';
import { Course, Lesson, Enrollment } from '../../types';

interface CourseDetail extends Course {
  lessons?: Lesson[];
}

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: course, isLoading } = useQuery<CourseDetail>({
    queryKey: ['course', id],
    queryFn: () => api.get(`/api/courses/${id}`).then((r) => r.data),
  });

  const enrollMutation = useMutation({
    mutationFn: () => api.post(`/api/courses/${id}/enroll`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['enrollment', id] });
      if (course?.lessons?.[0]) navigate(`/learn/${id}/lesson/${course.lessons[0].id}`);
    },
  });

  if (isLoading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!course) return null;

  const DIFF_COLORS: Record<string, string> = { beginner: 'bg-green-100 text-green-700', intermediate: 'bg-yellow-100 text-yellow-700', advanced: 'bg-red-100 text-red-700' };

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {course.thumbnail_url && <img src={course.thumbnail_url} alt={course.title} className="w-full h-64 object-cover rounded-2xl mb-6" />}
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-sm px-3 py-1 rounded-full font-medium ${DIFF_COLORS[course.difficulty] ?? ''}`}>{course.difficulty}</span>
            <span className="text-sm text-gray-400">{course.category}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{course.title}</h1>
          <p className="text-gray-600 mb-6">{course.description}</p>

          <GradientButton
            onClick={() => enrollMutation.mutate()}
            isLoading={enrollMutation.isPending}
            size="lg"
          >
            Enroll Now — {course.total_lessons} Lessons
          </GradientButton>

          {course.lessons && course.lessons.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Course Content</h2>
              <div className="space-y-2">
                {course.lessons.map((lesson, i) => (
                  <GlassCard key={lesson.id} className="flex items-center gap-4 p-4">
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-semibold text-sm">{i + 1}</div>
                    <div>
                      <div className="font-medium text-gray-800">{lesson.title}</div>
                      <div className="text-xs text-gray-400">{lesson.duration_minutes} min</div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </PageWrapper>
  );
}
