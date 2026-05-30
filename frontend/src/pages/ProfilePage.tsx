import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { PageWrapper } from '../components/layout/PageWrapper';
import { GlassCard } from '../components/ui/GlassCard';
import { GradientButton } from '../components/ui/GradientButton';
import { AnimatedInput } from '../components/ui/AnimatedInput';
import api from '../services/api';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.full_name ?? '');
  const [saved, setSaved] = useState(false);

  const updateMutation = useMutation({
    mutationFn: () => api.put('/auth/me', { full_name: name }),
    onSuccess: async () => { await refreshUser(); setSaved(true); setTimeout(() => setSaved(false), 2000); },
  });

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile</h1>
        <GlassCard>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
              {user?.email?.[0]?.toUpperCase()}
            </div>
            <div>
              <div className="font-semibold text-gray-900">{user?.full_name ?? user?.email}</div>
              <div className="text-sm text-gray-500">{user?.email}</div>
              <span className="text-xs capitalize bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">{user?.role}</span>
            </div>
          </div>
          <div className="space-y-4">
            <AnimatedInput label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
            <AnimatedInput label="Email" value={user?.email ?? ''} disabled />
          </div>
          <div className="mt-6">
            <GradientButton onClick={() => updateMutation.mutate()} isLoading={updateMutation.isPending} className="w-full">
              {saved ? '✓ Saved' : 'Save Changes'}
            </GradientButton>
          </div>
        </GlassCard>
      </div>
    </PageWrapper>
  );
}
