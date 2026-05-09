import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { MeshBackground } from '../../components/layout/MeshBackground';
import { GlassCard } from '../../components/ui/GlassCard';
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
      setError(msg || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <MeshBackground />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Join Future Minds
          </h1>
          <p className="text-gray-500 mt-2">Create your free account</p>
        </div>
        <GlassCard>
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatedInput label="Full Name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
            <AnimatedInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            <AnimatedInput label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 8 characters" required />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <GradientButton type="submit" isLoading={loading} className="w-full">Create Account</GradientButton>
          </form>
          <p className="text-center text-gray-500 text-sm mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-600 font-medium hover:underline">Sign in</Link>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
