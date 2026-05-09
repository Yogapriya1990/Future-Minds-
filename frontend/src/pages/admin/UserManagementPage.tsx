import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Navbar } from '../../components/layout/Navbar';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { GlassCard } from '../../components/ui/GlassCard';
import { GradientButton } from '../../components/ui/GradientButton';
import { AnimatedList } from '../../components/ui/AnimatedList';
import api from '../../services/api';
import { User } from '../../types';

export default function UserManagementPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');

  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ['admin-users'],
    queryFn: () => api.get('/api/admin/users').then((r) => r.data),
  });

  const roleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: string }) =>
      api.put(`/api/admin/users/${userId}/role`, { role }).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  });

  const banMutation = useMutation({
    mutationFn: ({ userId, ban }: { userId: number; ban: boolean }) =>
      api.post(`/api/admin/users/${userId}/${ban ? 'ban' : 'unban'}`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  });

  const filtered = users.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.full_name ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const ROLE_COLORS: Record<string, string> = {
    admin: 'bg-red-100 text-red-700',
    creator: 'bg-purple-100 text-purple-700',
    student: 'bg-blue-100 text-blue-700',
  };

  return (
    <PageWrapper>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">User Management</h1>

        <GlassCard className="mb-6">
          <input
            type="text"
            placeholder="Search by email or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
          />
        </GlassCard>

        {isLoading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <AnimatedList className="space-y-3">
            {filtered.map((user) => (
              <GlassCard key={user.id}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shrink-0">
                    {user.email[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">{user.full_name ?? user.email}</div>
                    <div className="text-xs text-gray-500 truncate">{user.email}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${ROLE_COLORS[user.role] ?? ''}`}>{user.role}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${user.is_active ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                      {user.is_active ? 'Active' : 'Banned'}
                    </span>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <select
                      value={user.role}
                      onChange={(e) => roleMutation.mutate({ userId: user.id, role: e.target.value })}
                      className="text-xs px-2 py-1 rounded-lg border border-gray-200 bg-white/60 focus:outline-none focus:ring-1 focus:ring-purple-400"
                    >
                      <option value="student">Student</option>
                      <option value="creator">Creator</option>
                      <option value="admin">Admin</option>
                    </select>
                    <GradientButton
                      size="sm"
                      variant="outline"
                      onClick={() => banMutation.mutate({ userId: user.id, ban: user.is_active })}
                      className={user.is_active ? 'border-red-200 text-red-600 hover:bg-red-50' : ''}
                    >
                      {user.is_active ? 'Ban' : 'Unban'}
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
