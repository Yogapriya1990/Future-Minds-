import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, MessageSquare, BookOpen, GraduationCap,
  Wrench, Zap, CreditCard, X, Sparkles,
} from 'lucide-react';

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string;
}

const mainItems: SidebarItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'AI Chat', href: '/chat', icon: MessageSquare },
  { label: 'Learn', href: '/learn', icon: BookOpen },
  { label: 'Teach', href: '/teach', icon: GraduationCap },
  { label: 'AI Tools', href: '/tools', icon: Wrench },
  { label: 'Automations', href: '/automations', icon: Zap },
];

const bottomItems: SidebarItem[] = [
  { label: 'Pricing', href: '/pricing', icon: CreditCard },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function SidebarContent() {
  const location = useLocation();

  const isActive = (href: string) =>
    href === '/dashboard'
      ? location.pathname === href
      : location.pathname.startsWith(href);

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/8">
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-900/30 group-hover:scale-105 transition-transform">
            <Sparkles size={15} className="text-white" />
          </div>
          <div>
            <span className="text-sm font-bold text-white tracking-tight leading-none block">Future Minds</span>
            <span className="text-2xs text-slate-500 font-medium">AI Platform</span>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto no-scrollbar">
        <p className="section-header mt-1 mb-3">Menu</p>
        {mainItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link key={item.href} to={item.href}>
              <motion.div
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                className={`sidebar-item ${active ? 'sidebar-item-active' : 'sidebar-item-inactive'}`}
              >
                <item.icon size={17} className={active ? 'text-white' : 'text-slate-500'} />
                <span>{item.label}</span>
                {active && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 border-t border-white/8 pt-3 space-y-1">
        {bottomItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link key={item.href} to={item.href}>
              <motion.div
                whileHover={{ x: 2 }}
                className={`sidebar-item ${active ? 'sidebar-item-active' : 'sidebar-item-inactive'}`}
              >
                <item.icon size={17} className={active ? 'text-white' : 'text-slate-500'} />
                <span>{item.label}</span>
              </motion.div>
            </Link>
          );
        })}

        {/* Upgrade CTA */}
        <div className="mt-3 mx-1 p-3.5 rounded-xl bg-gradient-to-br from-violet-600/20 to-purple-600/10 border border-violet-500/20">
          <p className="text-xs font-semibold text-white mb-0.5">Upgrade to Pro</p>
          <p className="text-2xs text-slate-400 mb-2.5">Unlock unlimited AI credits</p>
          <Link to="/pricing">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-1.5 px-3 rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs font-semibold text-center cursor-pointer shadow-lg shadow-purple-900/30"
            >
              Upgrade Now →
            </motion.div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function Sidebar({ open = false, onClose }: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 border-r border-slate-800/60 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800/60 lg:hidden flex flex-col"
            >
              <button
                onClick={onClose}
                aria-label="Close sidebar"
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={18} />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
