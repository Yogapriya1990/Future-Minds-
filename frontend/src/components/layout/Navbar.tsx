import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, Bell, ChevronDown, LogOut, User, Settings, CreditCard, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  onMenuClick?: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate('/login');
  };

  const getPageTitle = () => {
    const map: Record<string, string> = {
      '/dashboard': 'Dashboard',
      '/chat': 'AI Chat',
      '/learn': 'Learn',
      '/teach': 'Teach',
      '/tools': 'AI Tools',
      '/automations': 'Automations',
      '/pricing': 'Pricing',
      '/billing': 'Billing',
      '/profile': 'Profile',
      '/settings': 'Settings',
      '/admin': 'Admin',
    };
    const match = Object.keys(map).find((k) => location.pathname.startsWith(k));
    return match ? map[match] : 'Future Minds';
  };

  const initials = user?.full_name
    ? user.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? '?';

  return (
    <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center px-4 sm:px-6 gap-4 sticky top-0 z-30 flex-shrink-0">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        aria-label="Open menu"
        className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Page title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-semibold text-slate-900 truncate">{getPageTitle()}</h1>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <button
          aria-label="Notifications"
          className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-violet-500" />
        </button>

        {/* User menu */}
        {user && (
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl hover:bg-slate-100 transition-colors"
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  className="w-8 h-8 rounded-lg object-cover ring-2 ring-white shadow-sm"
                  alt="avatar"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm shadow-purple-200">
                  {initials}
                </div>
              )}
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-slate-900 leading-tight truncate max-w-[120px]">
                  {user.full_name ?? user.email}
                </p>
                <p className="text-2xs text-slate-400 capitalize font-medium">{user.subscription_tier} plan</p>
              </div>
              <ChevronDown
                size={14}
                className={`hidden sm:block text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
              />
            </motion.button>

            <AnimatePresence>
              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -8 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-20"
                  >
                    <div className="px-3 py-2.5 border-b border-slate-100 mb-1">
                      <p className="text-sm font-semibold text-slate-900 truncate">{user.full_name ?? 'User'}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>

                    {[
                      { icon: User, label: 'Profile', href: '/profile' },
                      { icon: CreditCard, label: 'Billing', href: '/billing' },
                      { icon: Settings, label: 'Settings', href: '/settings' },
                      ...(user.role === 'admin' ? [{ icon: Shield, label: 'Admin Panel', href: '/admin' }] : []),
                    ].map(({ icon: Icon, label, href }) => (
                      <Link
                        key={href}
                        to={href}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                      >
                        <Icon size={15} className="text-slate-400" />
                        {label}
                      </Link>
                    ))}

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <LogOut size={15} />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </header>
  );
}
