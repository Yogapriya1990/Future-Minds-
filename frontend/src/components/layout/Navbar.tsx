import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'AI Chat', href: '/chat' },
  { label: 'Learn', href: '/learn' },
  { label: 'Tools', href: '/tools' },
  { label: 'Automations', href: '/automations' },
];

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-white/40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Future Minds AI
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors ${
                  location.pathname.startsWith(link.href)
                    ? 'text-purple-600'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-sm font-medium text-red-500 hover:text-red-600">
                Admin
              </Link>
            )}
          </div>

          {user && (
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                {user.avatar_url ? (
                  <img src={user.avatar_url} className="w-8 h-8 rounded-full" alt="avatar" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                    {user.email[0].toUpperCase()}
                  </div>
                )}
                <span className="hidden sm:block">{user.full_name ?? user.email}</span>
              </motion.button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
                  >
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50" onClick={() => setDropdownOpen(false)}>
                      Profile
                    </Link>
                    <Link to="/billing" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50" onClick={() => setDropdownOpen(false)}>
                      Billing
                    </Link>
                    <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50" onClick={() => setDropdownOpen(false)}>
                      Settings
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50">
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
