import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/layout/Navbar';
import { PageWrapper } from '../components/layout/PageWrapper';
import { GlassCard } from '../components/ui/GlassCard';
import { GradientButton } from '../components/ui/GradientButton';

export default function SettingsPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <PageWrapper>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>
        <GlassCard>
          <h2 className="font-semibold text-gray-800 mb-4">Account</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-red-50 border border-red-100">
              <h3 className="font-medium text-red-700 mb-1">Danger Zone</h3>
              <p className="text-sm text-red-500 mb-3">Sign out of your account</p>
              <GradientButton onClick={handleLogout} className="bg-red-500 from-red-500 to-red-600">Sign Out</GradientButton>
            </div>
          </div>
        </GlassCard>
      </div>
    </PageWrapper>
  );
}
