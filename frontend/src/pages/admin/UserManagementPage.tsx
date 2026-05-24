import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, UserX, UserCheck } from 'lucide-react';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { GlassCard, GradientButton, AnimatedList, PageHeader, StatusBadge, Spinner, EmptyState } from '../../components/ui';
import api from '../../services/api';
import { User } from '../../types';

const ROLE_VARIANT: Record<string, 'admin' | 'creator' | 'student'> = {
  admin: 'admin', creator: 'creator', student: 'student',
};

function UserInitials({ user }: { user: User }) {
  const initials = user.full_name
    ? user.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : user.email[0].toUpperCase();

  const colors = ['from-violet-500 to-purple-600', 'from-blue-500 to-cyan-500', 'from-pink-500 to-rose-500', 'from-emerald-500 to-teal-500', 'from-amber-500 to-orange-500'];
  const color = colors[user.id % colors.length];

  return (
    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm`}>
      {user.avatar_url ? (
        <img src={user.avatar_url} alt={initials} className="w-full h-full rounded-xl object-cover" />
      ) : initials}
    </div>
  );
}

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

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <PageHeader
          title="User Management"
          subtitle="Manage accounts, roles, and access"
          badge={`${users.length} users`}
        />

        {/* Search */}
        <GlassCard padding="sm" className="mb-5">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-300 text-sm text-slate-900 placeholder:text-slate-400 transition-all"
            />
          </div>
        </GlassCard>

        {isLoading ? (
          <Spinner label="Loading users..." />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Search size={24} />}
            title="No users found"
            description={search ? `No users match "${search}"` : 'No users on this platform yet.'}
          />
        ) : (
          <AnimatedList className="space-y-2.5">
            {filtered.map((user) => (
              <GlassCard key={user.id} hover className="group">
                <div className="flex items-center gap-4">
                  <UserInitials user={user} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {user.full_name ?? user.email}
                      </p>
                      <StatusBadge variant={ROLE_VARIANT[user.role] ?? 'student'} />
                      <StatusBadge variant={user.is_active ? 'active' : 'banned'} dot />
                    </div>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-2 flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                    <select
                      value={user.role}
                      onChange={(e) => roleMutation.mutate({ userId: user.id, role: e.target.value })}
                      className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-violet-400 text-slate-700 cursor-pointer"
                    >
                      <option value="student">Student</option>
                      <option value="creator">Creator</option>
                      <option value="admin">Admin</option>
                    </select>

                    <GradientButton
                      size="sm"
                      variant={user.is_active ? 'danger' : 'outline'}
                      leftIcon={user.is_active ? <UserX size={13} /> : <UserCheck size={13} />}
                      onClick={() => banMutation.mutate({ userId: user.id, ban: user.is_active })}
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
