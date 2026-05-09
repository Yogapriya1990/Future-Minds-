import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

interface SidebarItem {
  label: string;
  href: string;
  icon: string;
}

const items: SidebarItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: '📊' },
  { label: 'AI Chat', href: '/chat', icon: '💬' },
  { label: 'Learn', href: '/learn', icon: '🎓' },
  { label: 'Teach', href: '/teach', icon: '📚' },
  { label: 'AI Tools', href: '/tools', icon: '🛠️' },
  { label: 'Automations', href: '/automations', icon: '⚡' },
  { label: 'Pricing', href: '/pricing', icon: '💳' },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 min-h-screen bg-white/80 backdrop-blur-lg border-r border-white/40 shadow-sm">
      <nav className="p-4 space-y-1">
        {items.map((item) => {
          const active = location.pathname.startsWith(item.href);
          return (
            <Link key={item.href} to={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </motion.div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
