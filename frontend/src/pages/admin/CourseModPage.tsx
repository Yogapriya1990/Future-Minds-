import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BookOpen, Star, Trash2 } from 'lucide-react';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { GlassCard, GradientButton, AnimatedList, PageHeader, StatusBadge, Spinner, EmptyState } from '../../components/ui';
import api from '../../services/api';
import { Course } from '../../types';

const DIFF_VARIANT: Record<string, 'beginner' | 'intermediate' | 'advanced'> = {
  beginner: 'beginner', intermediate: 'intermediate', advanced: 'advanced',
};

export default function CourseModPage() {
  const qc = useQueryClient();

  const { data: courses = [], isLoading } = useQuery<Course[]>({
    queryKey: ['admin-courses'],
    queryFn: () => api.get('/api/admin/courses').then((r) => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/api/admin/courses/${id}`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-courses'] }),
  });

  const featureMutation = useMutation({
    mutationFn: (id: number) => api.post(`/api/admin/courses/${id}/feature`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-courses'] }),
  });

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <PageHeader
          title="Course Moderation"
          subtitle="Review, feature, and manage all courses"
          badge={`${courses.length} courses`}
        />

        {isLoading ? (
          <Spinner label="Loading courses..." />
        ) : courses.length === 0 ? (
          <EmptyState
            icon={<BookOpen size={28} />}
            title="No courses yet"
            description="No courses have been created on the platform yet."
          />
        ) : (
          <AnimatedList className="space-y-3">
            {courses.map((course) => (
              <GlassCard
                key={course.id}
                accent={course.is_published ? 'violet' : 'amber'}
                hover
                className="group"
              >
                <div className="flex items-start gap-4">
                  {/* Thumbnail */}
                  {course.thumbnail_url ? (
                    <img
                      src={course.thumbnail_url}
                      alt={course.title}
                      className="w-16 h-14 rounded-xl object-cover flex-shrink-0 shadow-sm"
                    />
                  ) : (
                    <div className="w-16 h-14 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                      <BookOpen size={20} className="text-violet-400" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="text-sm font-bold text-slate-900 truncate">{course.title}</h3>
                      <StatusBadge variant={course.is_published ? 'published' : 'draft'} dot />
                      <StatusBadge variant={DIFF_VARIANT[course.difficulty] ?? 'beginner'} />
                    </div>
                    <p className="text-xs text-slate-500 truncate mb-2">{course.description}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span>{course.enrollment_count ?? 0} enrolled</span>
                      <span className="capitalize">{course.category}</span>
                      <span>{course.total_lessons} lessons</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                    <GradientButton
                      size="sm"
                      variant="outline"
                      leftIcon={<Star size={13} />}
                      onClick={() => featureMutation.mutate(course.id)}
                    >
                      Feature
                    </GradientButton>
                    <GradientButton
                      size="sm"
                      variant="danger"
                      leftIcon={<Trash2 size={13} />}
                      onClick={() => {
                        if (confirm(`Delete "${course.title}"? This cannot be undone.`)) {
                          deleteMutation.mutate(course.id);
                        }
                      }}
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
