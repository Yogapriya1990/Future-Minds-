import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { GlassCard } from '../../components/ui/GlassCard';
import { GradientButton } from '../../components/ui/GradientButton';
import { AnimatedInput } from '../../components/ui/AnimatedInput';
import api from '../../services/api';
import { WorkflowStep } from '../../types';

export default function WorkflowBuilderPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [triggerType, setTriggerType] = useState<'manual' | 'scheduled' | 'webhook'>('manual');
  const [steps, setSteps] = useState<WorkflowStep[]>([{ action: 'run_tool', tool_slug: '', input_template: '{input}' }]);

  const createMutation = useMutation({
    mutationFn: () => api.post('/api/workflows', { name, description, trigger_type: triggerType, steps }),
    onSuccess: () => navigate('/automations'),
  });

  const addStep = () => setSteps([...steps, { action: 'run_tool', tool_slug: '', input_template: '{input}' }]);
  const removeStep = (i: number) => setSteps(steps.filter((_, idx) => idx !== i));
  const updateStep = (i: number, key: keyof WorkflowStep, value: string) =>
    setSteps(steps.map((s, idx) => idx === i ? { ...s, [key]: value } : s));

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Build Workflow</h1>
        <div className="space-y-6">
          <GlassCard>
            <h2 className="font-semibold text-gray-800 mb-4">Workflow Details</h2>
            <div className="space-y-4">
              <AnimatedInput label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="My Automation" />
              <AnimatedInput label="Description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What does this workflow do?" />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trigger</label>
                <div className="flex gap-2">
                  {(['manual', 'scheduled', 'webhook'] as const).map((t) => (
                    <button key={t} onClick={() => setTriggerType(t)} className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize ${triggerType === t ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{t}</button>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800">Steps</h2>
              <button onClick={addStep} className="text-sm text-purple-600 hover:underline">+ Add Step</button>
            </div>
            <div className="space-y-4">
              {steps.map((step, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-600">Step {i + 1}</span>
                    {steps.length > 1 && <button onClick={() => removeStep(i)} className="text-red-400 text-sm hover:text-red-600">Remove</button>}
                  </div>
                  <div className="space-y-2">
                    <AnimatedInput label="Tool Slug" value={step.tool_slug} onChange={(e) => updateStep(i, 'tool_slug', e.target.value)} placeholder="e.g. text-summarizer" />
                    <AnimatedInput label="Input Template" value={step.input_template} onChange={(e) => updateStep(i, 'input_template', e.target.value)} placeholder="{input}" />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GradientButton onClick={() => createMutation.mutate()} isLoading={createMutation.isPending} disabled={!name} className="w-full" size="lg">
            Save Workflow
          </GradientButton>
        </div>
      </div>
    </PageWrapper>
  );
}
