import { useQuery, useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { PageWrapper } from '../components/layout/PageWrapper';
import { GlassCard } from '../components/ui/GlassCard';
import { GradientButton } from '../components/ui/GradientButton';
import api from '../services/api';
import { Subscription } from '../types';

export default function BillingPage() {
  const { data: sub } = useQuery<Subscription>({
    queryKey: ['my-subscription'],
    queryFn: () => api.get('/api/subscriptions/me').then((r) => r.data),
  });

  const portalMutation = useMutation({
    mutationFn: () => api.post('/api/subscriptions/portal').then((r) => r.data),
    onSuccess: (data) => { window.location.href = data.portal_url; },
  });

  const STATUS_COLORS: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    canceled: 'bg-gray-100 text-gray-600',
    past_due: 'bg-red-100 text-red-700',
  };

  return (
    <PageWrapper>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Billing</h1>
        {sub ? (
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800">Current Subscription</h2>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[sub.status] ?? ''}`}>{sub.status}</span>
            </div>
            <div className="text-sm text-gray-500 space-y-2">
              <div>Billing: <span className="capitalize text-gray-800 font-medium">{sub.billing_cycle}</span></div>
              {sub.current_period_end && <div>Renews: <span className="text-gray-800">{new Date(sub.current_period_end).toLocaleDateString()}</span></div>}
            </div>
            <div className="mt-6">
              <GradientButton onClick={() => portalMutation.mutate()} isLoading={portalMutation.isPending} className="w-full">
                Manage Billing →
              </GradientButton>
            </div>
          </GlassCard>
        ) : (
          <GlassCard className="text-center py-12">
            <div className="text-4xl mb-4">💳</div>
            <h3 className="font-semibold text-gray-800 mb-2">No active subscription</h3>
            <p className="text-gray-500 mb-4">Upgrade to unlock all features</p>
            <Link to="/pricing"><GradientButton>View Plans</GradientButton></Link>
          </GlassCard>
        )}
      </div>
    </PageWrapper>
  );
}
