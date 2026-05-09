import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { GlassCard } from '../../components/ui/GlassCard';
import { AnimatedList } from '../../components/ui/AnimatedList';
import api from '../../services/api';
import { Course } from '../../types';

const CATEGORIES = ['All', 'Development', 'Design', 'Business', 'Marketing', 'AI & ML'];
const DIFFICULTIES = ['All', 'beginner', 'intermediate', 'advanced'];

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

  const DIFF_COLORS: Record<string, string> = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-yellow-100 text-yellow-700',
    advanced: 'bg-red-100 text-red-700',
  };

  return (
    <PageWrapper>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Catalog</h1>
        <p className="text-gray-500 mb-6">Learn from expert instructors</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCategory(c)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${category === c ? 'bg-purple-500 text-white' : 'bg-white text-gray-600 border hover:border-purple-400'}`}>{c}</button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mb-8">
          {DIFFICULTIES.map((d) => (
            <button key={d} onClick={() => setDifficulty(d)} className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${difficulty === d ? 'bg-pink-500 text-white' : 'bg-white text-gray-600 border hover:border-pink-400'}`}>{d}</button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No courses found</div>
        ) : (
          <AnimatedList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link key={course.id} to={`/learn/${course.id}`}>
                <GlassCard className="h-full">
                  {course.thumbnail_url && <img src={course.thumbnail_url} alt={course.title} className="w-full h-40 object-cover rounded-xl mb-4" />}
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${DIFF_COLORS[course.difficulty] ?? 'bg-gray-100 text-gray-600'}`}>{course.difficulty}</span>
                    <span className="text-xs text-gray-400">{course.category}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{course.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{course.description}</p>
                  <div className="text-xs text-gray-400 mt-3">{course.total_lessons} lessons</div>
                </GlassCard>
              </Link>
            ))}
          </AnimatedList>
        )}
      </div>
    </PageWrapper>
  );
}
