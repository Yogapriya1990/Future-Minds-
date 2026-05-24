import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Star, Users, Clock, ChevronRight } from 'lucide-react';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { GlassCard, PageHeader, StatusBadge, EmptyState, Spinner, FilterBar, AnimatedList } from '../../components/ui';
import api from '../../services/api';
import { Course } from '../../types';

const CATEGORIES = ['All', 'Development', 'Design', 'Business', 'Marketing', 'AI & ML'];
const DIFFICULTIES = ['All', 'beginner', 'intermediate', 'advanced'];

const DIFF_VARIANT: Record<string, 'beginner' | 'intermediate' | 'advanced'> = {
  beginner: 'beginner',
  intermediate: 'intermediate',
  advanced: 'advanced',
};

const CATEGORY_GRADIENT: Record<string, string> = {
  'AI & ML':     'from-violet-500 to-purple-600',
  Development:   'from-blue-500 to-cyan-500',
  Design:        'from-pink-500 to-rose-500',
  Business:      'from-amber-500 to-orange-500',
  Marketing:     'from-emerald-500 to-teal-500',
  default:       'from-slate-500 to-slate-600',
};

function CourseCard({ course }: { course: Course }) {
  const gradient = CATEGORY_GRADIENT[course.category] ?? CATEGORY_GRADIENT.default;

  return (
    <Link to={`/learn/${course.id}`} className="block h-full group">
      <GlassCard padding="none" className="h-full flex flex-col overflow-hidden group-hover:border-violet-200/80">
        {/* Thumbnail */}
        <div className="relative">
          {course.thumbnail_url ? (
            <img src={course.thumbnail_url} alt={course.title} className="w-full h-44 object-cover" />
          ) : (
            <div className={`w-full h-44 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
              <BookOpen size={36} className="text-white/70" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

          {/* Category tag */}
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
            {course.category}
          </span>

          {/* Difficulty badge */}
          <div className="absolute top-3 right-3">
            <StatusBadge variant={DIFF_VARIANT[course.difficulty] ?? 'beginner'} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-1.5 line-clamp-2 group-hover:text-violet-700 transition-colors">
            {course.title}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed flex-1">
            {course.description}
          </p>

          {/* Footer meta */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <BookOpen size={12} />
                {course.total_lessons} lessons
              </span>
              {course.enrollment_count !== undefined && (
                <span className="flex items-center gap-1">
                  <Users size={12} />
                  {course.enrollment_count.toLocaleString()}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              4.8
            </div>
          </div>
        </div>

        {/* Hover accent bar */}
        <div className={`h-0.5 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
      </GlassCard>
    </Link>
  );
}

export default function CourseCatalogPage() {
  const [category, setCategory] = useState('All');
  const [difficulty, setDifficulty] = useState('All');

  const { data: courses = [], isLoading } = useQuery<Course[]>({
    queryKey: ['courses', category, difficulty],
    queryFn: () => {
      const params = new URLSearchParams();
      if (category !== 'All') params.set('category', category);
      if (difficulty !== 'All') params.set('difficulty', difficulty);
      return api.get(`/api/courses?${params}`).then((r) => r.data);
    },
  });

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <PageHeader
          title="Course Catalog"
          subtitle="Learn AI from world-class instructors"
          badge={`${courses.length} Courses`}
        />

        {/* Filters */}
        <div className="space-y-3 mb-8">
          <FilterBar
            options={CATEGORIES}
            value={category}
            onChange={setCategory}
            className="categories"
          />
          <FilterBar
            options={DIFFICULTIES.map((d) => d.charAt(0).toUpperCase() + d.slice(1))}
            value={difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            onChange={(v) => setDifficulty(v.toLowerCase())}
            className="difficulties"
          />
        </div>

        {isLoading ? (
          <Spinner label="Loading courses..." />
        ) : courses.length === 0 ? (
          <EmptyState
            icon={<BookOpen size={28} />}
            title="No courses found"
            description="Try adjusting your filters or check back later for new content."
          />
        ) : (
          <AnimatedList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.35 }}
              >
                <CourseCard course={course} />
              </motion.div>
            ))}
          </AnimatedList>
        )}
      </div>
    </PageWrapper>
  );
}
