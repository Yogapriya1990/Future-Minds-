import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { PageWrapper } from '../components/layout/PageWrapper';
import { GlassCard } from '../components/ui/GlassCard';
import { GradientButton } from '../components/ui/GradientButton';
import api from '../services/api';
import { Plan } from '../types';

export default function PricingPage() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');

  const { data: plans = [] } = useQuery<Plan[]>({
    queryKey: ['plans'],
    queryFn: () => api.get('/api/subscriptions/plans').then((r) => r.data),
  });

  const checkoutMutation = useMutation({
    mutationFn: (planId: number) => api.post('/api/subscriptions/checkout', { plan_id: planId, billing_cycle: billing }).then((r) => r.data),
    onSuccess: (data) => { window.location.href = data.checkout_url; },
  });

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Simple, Transparent Pricing</h1>
          <p className="text-gray-500 mb-6">Start free, upgrade when you're ready</p>
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full p-1 border border-gray-200">
            <button onClick={() => setBilling('monthly')} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${billing === 'monthly' ? 'bg-purple-500 text-white shadow' : 'text-gray-600'}`}>Monthly</button>
            <button onClick={() => setBilling('yearly')} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${billing === 'yearly' ? 'bg-purple-500 text-white shadow' : 'text-gray-600'}`}>Yearly <span className="text-green-500 text-xs">-17%</span></button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <motion.div key={plan.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <GlassCard className={`h-full flex flex-col ${plan.tier === 'pro' ? 'ring-2 ring-purple-500' : ''}`}>
                {plan.tier === 'pro' && <div className="text-center text-xs font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 -mx-6 -mt-6 py-2 rounded-t-2xl mb-4">Most Popular</div>}
                <h2 className="text-xl font-bold text-gray-900">{plan.name}</h2>
                <div className="mt-3 mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    ${billing === 'monthly' ? plan.price_monthly : (plan.price_yearly / 12).toFixed(2)}
                  </span>
                  <span className="text-gray-400">/mo</span>
                  {billing === 'yearly' && plan.price_yearly > 0 && <div className="text-sm text-gray-400">${plan.price_yearly}/yr billed annually</div>}
                </div>
                <ul className="space-y-2 mb-8 flex-1">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-green-500 mt-0.5">✓</span>{f}
                    </li>
                  ))}
                </ul>
                {plan.tier === 'free' ? (
                  <GradientButton variant="outline" className="w-full" onClick={() => {}}>Get Started Free</GradientButton>
                ) : (
                  <GradientButton onClick={() => checkoutMutation.mutate(plan.id)} isLoading={checkoutMutation.isPending} className="w-full">
                    Subscribe to {plan.name}
                  </GradientButton>
                )}
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
