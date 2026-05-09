import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Navbar } from '../../components/layout/Navbar';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { GlassCard } from '../../components/ui/GlassCard';
import { GradientButton } from '../../components/ui/GradientButton';
import { AnimatedList } from '../../components/ui/AnimatedList';
import api from '../../services/api';
import { Course } from '../../types';

export default function CourseModPage() {
  const qc = useQueryClient();

  const { data: courses = [], isLoading } = useQuery<Course[]>({
    queryKey: ['admin-courses'],
    queryFn: () => api.get('/api/admin/courses').then((r) => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (courseId: number) => api.delete(`/api/admin/courses/${courseId}`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-courses'] }),
  });

  const featureMutation = useMutation({
    mutationFn: (courseId: number) => api.post(`/api/admin/courses/${courseId}/feature`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-courses'] }),
  });

  return (
    <PageWrapper>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Course Moderation</h1>

        {isLoading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : courses.length === 0 ? (
          <GlassCard className="text-center py-16 text-gray-400">No courses on platform yet</GlassCard>
        ) : (
          <AnimatedList className="space-y-3">
            {courses.map((course) => (
              <GlassCard key={course.id}>
                <div className="flex items-start gap-4">
                  {course.thumbnail_url && (
                    <img src={course.thumbnail_url} alt={course.title} className="w-16 h-12 rounded-lg object-cover shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">{course.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${course.is_published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {course.is_published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{course.description}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                      <span>{course.enrollment_count ?? 0} enrolled</span>
                      <span className="capitalize">{course.difficulty}</span>
                      <span>{course.category}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <GradientButton size="sm" variant="outline" onClick={() => featureMutation.mutate(course.id)}>
                      Feature
                    </GradientButton>
                    <GradientButton
                      size="sm"
                      variant="outline"
                      onClick={() => { if (confirm(`Delete "${course.title}"?`)) deleteMutation.mutate(course.id); }}
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </GradientButton>
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
