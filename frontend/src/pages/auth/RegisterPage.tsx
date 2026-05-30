import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { MeshBackground } from '../../components/layout/MeshBackground';
import { GradientButton } from '../../components/ui/GradientButton';
import { AnimatedInput } from '../../components/ui/AnimatedInput';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      await register(email, password, name);
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(msg || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <MeshBackground />

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-5/12 bg-slate-900 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/50 via-slate-900 to-slate-900" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

        <div className="relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center shadow-lg">
              <Sparkles size={17} className="text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">Future Minds AI</span>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl font-bold text-white leading-tight">
            Start learning<br />with AI today
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Join thousands of learners unlocking their potential with cutting-edge AI tools and courses.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: '10k+', label: 'Active learners' },
              { value: '500+', label: 'AI-powered courses' },
              { value: '99%', label: 'Satisfaction rate' },
              { value: '24/7', label: 'AI assistance' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-xl font-bold text-white">{stat.value}</p>
                <p className="text-slate-400 text-xs mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-slate-600 text-xs">© 2025 Future Minds AI. All rights reserved.</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Sparkles size={15} className="text-white" />
            </div>
            <span className="text-base font-bold text-slate-900">Future Minds AI</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
            <p className="text-slate-500 mt-1.5 text-sm">Free forever. No credit card required.</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-7 space-y-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatedInput
                label="Full name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                leftIcon={<User size={16} />}
                autoComplete="name"
              />
              <AnimatedInput
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                leftIcon={<Mail size={16} />}
                autoComplete="email"
                required
              />
              <AnimatedInput
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 characters"
                leftIcon={<Lock size={16} />}
                hint="At least 8 characters"
                autoComplete="new-password"
                required
              />

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600"
                >
                  {error}
                </motion.div>
              )}

              <GradientButton
                type="submit"
                isLoading={loading}
                className="w-full"
                size="lg"
                rightIcon={<ArrowRight size={16} />}
              >
                Create Account
              </GradientButton>
            </form>

            <p className="text-xs text-slate-400 text-center">
              By signing up, you agree to our{' '}
              <span className="text-violet-600 cursor-pointer hover:underline">Terms of Service</span>
              {' '}and{' '}
              <span className="text-violet-600 cursor-pointer hover:underline">Privacy Policy</span>.
            </p>
          </div>

          <p className="text-center text-slate-500 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-violet-600 font-semibold hover:text-violet-700 transition-colors">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
