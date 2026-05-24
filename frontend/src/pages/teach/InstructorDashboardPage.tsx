import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { GlassCard } from '../../components/ui/GlassCard';
import { GradientButton } from '../../components/ui/GradientButton';
import { AnimatedList } from '../../components/ui/AnimatedList';
import api from '../../services/api';
import { Course } from '../../types';

export default function InstructorDashboardPage() {
  const { data: courses = [], isLoading } = useQuery<Course[]>({
    queryKey: ['my-courses'],
    queryFn: () => api.get('/api/courses/my').then((r) => r.data),
  });

  const published = courses.filter((c) => c.is_published);
  const drafts = courses.filter((c) => !c.is_published);
  const totalEnrollments = courses.reduce((sum, c) => sum + (c.enrollment_count ?? 0), 0);

  const stats = [
    { label: 'Total Courses', value: courses.length, icon: '📚' },
    { label: 'Published', value: published.length, icon: '✅' },
    { label: 'Drafts', value: drafts.length, icon: '📝' },
    { label: 'Total Enrollments', value: totalEnrollments, icon: '👥' },
  ];

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Instructor Dashboard</h1>
          <Link to="/teach/create">
            <GradientButton>+ Create Course</GradientButton>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <GlassCard className="text-center">
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                <div className="text-sm text-gray-500">{s.label}</div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">My Courses</h2>
        {isLoading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : courses.length === 0 ? (
          <GlassCard className="text-center py-16">
            <div className="text-5xl mb-4">🎓</div>
            <h3 className="font-semibold text-gray-800 mb-2">No courses yet</h3>
            <p className="text-gray-500 mb-6">Create your first course and start teaching</p>
            <Link to="/teach/create"><GradientButton>Create Course</GradientButton></Link>
          </GlassCard>
        ) : (
          <AnimatedList className="space-y-4">
            {courses.map((course) => (
              <GlassCard key={course.id}>
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">{course.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${course.is_published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {course.is_published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{course.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span>{course.enrollment_count ?? 0} enrolled</span>
                      <span className="capitalize">{course.difficulty}</span>
                      <span>{course.category}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4 shrink-0">
                    <Link to={`/teach/edit/${course.id}`}>
                      <GradientButton variant="outline" size="sm">Edit</GradientButton>
                    </Link>
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
