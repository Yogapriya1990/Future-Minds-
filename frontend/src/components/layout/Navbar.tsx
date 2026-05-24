import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState, useCallback, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Bell, ChevronDown, LogOut, User, Settings, CreditCard, Shield,
  Sun, Moon, Sparkles, CheckCheck, BookOpen, MessageSquare,
  LayoutDashboard, Wrench, Zap, GraduationCap, X, AlignJustify,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// ─── Theme hook ───────────────────────────────────────────────────────────────

function useTheme() {
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    return (
      localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return { dark, toggle: () => setDark((d) => !d) };
}

// ─── Mock notifications ───────────────────────────────────────────────────────

interface Notification {
  id: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  iconBg: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  group: 'Today' | 'Earlier';
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 1, icon: Sparkles,       iconBg: 'bg-violet-100 text-violet-600', title: 'New AI feature',       body: 'GPT-4o is now available in AI Chat.',     time: '2m ago',  read: false, group: 'Today'   },
  { id: 2, icon: BookOpen,       iconBg: 'bg-blue-100 text-blue-600',     title: 'Course completed',     body: 'You finished "Prompt Engineering 101".',  time: '1h ago',  read: false, group: 'Today'   },
  { id: 3, icon: GraduationCap,  iconBg: 'bg-emerald-100 text-emerald-600', title: 'Achievement unlocked', body: 'You earned the "Fast Learner" badge!',   time: '3h ago',  read: false, group: 'Today'   },
  { id: 4, icon: CreditCard,     iconBg: 'bg-amber-100 text-amber-600',   title: 'Billing reminder',     body: 'Your Pro trial ends in 3 days.',          time: 'Yesterday',read: true, group: 'Earlier' },
  { id: 5, icon: MessageSquare,  iconBg: 'bg-pink-100 text-pink-600',     title: 'Instructor replied',   body: 'Dr. Chen left feedback on your project.', time: '2 days ago',read: true, group: 'Earlier' },
];

// ─── Quick nav links ──────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'AI Chat',   href: '/chat',       icon: MessageSquare   },
  { label: 'Learn',     href: '/learn',      icon: BookOpen        },
  { label: 'Tools',     href: '/tools',      icon: Wrench          },
  { label: 'Teach',     href: '/teach',      icon: GraduationCap   },
  { label: 'Automate',  href: '/automations',icon: Zap             },
];

// ─── Animated hamburger ───────────────────────────────────────────────────────

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <div className="w-5 h-4 flex flex-col justify-between">
      <motion.span
        className="block h-0.5 bg-current rounded-full origin-left"
        animate={open ? { rotate: 45, y: -1, width: '100%' } : { rotate: 0, y: 0, width: '100%' }}
        transition={{ duration: 0.2 }}
      />
      <motion.span
        className="block h-0.5 bg-current rounded-full"
        animate={open ? { opacity: 0, x: -6 } : { opacity: 1, x: 0 }}
        transition={{ duration: 0.15 }}
      />
      <motion.span
        className="block h-0.5 bg-current rounded-full origin-left"
        animate={open ? { rotate: -45, y: 1, width: '100%' } : { rotate: 0, y: 0, width: '100%' }}
        transition={{ duration: 0.2 }}
      />
    </div>
  );
}

// ─── Notification panel ───────────────────────────────────────────────────────

function NotificationPanel({
  items,
  onMarkAll,
  onClose,
}: {
  items: Notification[];
  onMarkAll: () => void;
  onClose: () => void;
}) {
  const groups = ['Today', 'Earlier'] as const;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -8 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-dropdown border border-slate-100 z-20 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-slate-900">Notifications</p>
          {items.filter((n) => !n.read).length > 0 && (
            <span className="bg-violet-100 text-violet-700 text-xs font-bold px-1.5 py-0.5 rounded-full">
              {items.filter((n) => !n.read).length}
            </span>
          )}
        </div>
        <button
          onClick={onMarkAll}
          className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-700 font-semibold transition-colors"
        >
          <CheckCheck size={13} />
          Mark all read
        </button>
      </div>

      {/* Items */}
      <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
        {groups.map((group) => {
          const groupItems = items.filter((n) => n.group === group);
          if (!groupItems.length) return null;
          return (
            <div key={group}>
              <p className="px-4 py-2 text-2xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-50/80">
                {group}
              </p>
              {groupItems.map((n) => (
                <motion.div
                  key={n.id}
                  whileHover={{ backgroundColor: 'rgba(248,250,252,1)' }}
                  className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors ${!n.read ? 'bg-violet-50/30' : ''}`}
                  onClick={onClose}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${n.iconBg}`}>
                    <n.icon size={15} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <p className="text-xs font-semibold text-slate-900 truncate">{n.title}</p>
                      {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-violet-500 flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-slate-500 leading-snug line-clamp-2">{n.body}</p>
                    <p className="text-2xs text-slate-400 mt-1">{n.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 px-4 py-2.5">
        <button className="w-full text-center text-xs text-violet-600 hover:text-violet-700 font-semibold transition-colors">
          View all notifications
        </button>
      </div>
    </motion.div>
  );
}

// ─── User dropdown ────────────────────────────────────────────────────────────

interface NavbarProps {
  onMenuClick?: () => void;
}

// ─── Main component ───────────────────────────────────────────────────────────

export function Navbar({ onMenuClick }: NavbarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { dark, toggle: toggleTheme } = useTheme();

  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  const notifRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 8));

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = useCallback(() => {
    setDropdownOpen(false);
    logout();
    navigate('/login');
  }, [logout, navigate]);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const isActive = useCallback(
    (href: string) =>
      href === '/dashboard'
        ? location.pathname === href
        : location.pathname.startsWith(href),
    [location.pathname]
  );

  // Close panels on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMobileMenuOpen(false), [location.pathname]);

  const initials = user?.full_name
    ? user.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? '?';

  const getPageTitle = () => {
    const map: Record<string, string> = {
      '/dashboard': 'Dashboard', '/chat': 'AI Chat', '/learn': 'Learn',
      '/teach': 'Teach', '/tools': 'AI Tools', '/automations': 'Automations',
      '/pricing': 'Pricing', '/billing': 'Billing', '/profile': 'Profile',
      '/settings': 'Settings', '/admin': 'Admin',
    };
    const match = Object.keys(map).find((k) => location.pathname.startsWith(k));
    return match ? map[match] : 'Future Minds';
  };

  const userMenuItems = [
    { icon: User,       label: 'Profile',    href: '/profile',  shortcut: '⌘P' },
    { icon: CreditCard, label: 'Billing',    href: '/billing',  shortcut: '⌘B' },
    { icon: Settings,   label: 'Settings',   href: '/settings', shortcut: '⌘,' },
    ...(user?.role === 'admin' ? [{ icon: Shield, label: 'Admin Panel', href: '/admin', shortcut: '' }] : []),
  ];

  return (
    <>
      {/* ── Main navbar ─────────────────────────────────────────────────── */}
      <motion.header
        className={`sticky top-0 z-30 flex-shrink-0 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-xs'
            : 'bg-white/70 backdrop-blur-md border-b border-slate-100/60'
        }`}
      >
        {/* ── Top row ────────────────────────────────────────────────────── */}
        <div className="flex items-center h-14 px-4 sm:px-5 gap-3">

          {/* Hamburger (mobile only) */}
          <button
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            className="lg:hidden p-2 -ml-1 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors flex-shrink-0"
          >
            <HamburgerIcon open={mobileMenuOpen} />
          </button>

          {/* Page title (mobile) / Breadcrumb hint (desktop) */}
          <div className="flex-1 min-w-0 lg:hidden">
            <p className="text-sm font-semibold text-slate-800 truncate">{getPageTitle()}</p>
          </div>

          {/* ── Desktop quick-nav ─────────────────────────────────────────── */}
          <nav className="hidden lg:flex items-center flex-1 gap-0.5">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link key={link.href} to={link.href} className="relative group px-3 py-2 rounded-lg">
                  <span
                    className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                      active ? 'text-violet-700' : 'text-slate-500 group-hover:text-slate-900'
                    }`}
                  >
                    <link.icon size={15} className={active ? 'text-violet-600' : 'text-slate-400 group-hover:text-slate-600'} />
                    {link.label}
                  </span>

                  {/* Hover underline */}
                  <motion.span
                    className="absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full bg-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"
                    layoutId={undefined}
                  />

                  {/* Active indicator */}
                  {active && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full bg-violet-600"
                      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ── Right actions ─────────────────────────────────────────────── */}
          <div className="flex items-center gap-1">

            {/* Theme toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors overflow-hidden"
            >
              <AnimatePresence mode="wait" initial={false}>
                {dark ? (
                  <motion.span
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="block"
                  >
                    <Sun size={17} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="block"
                  >
                    <Moon size={17} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <motion.button
                whileTap={{ scale: 0.93 }}
                onClick={() => { setNotifOpen((o) => !o); setDropdownOpen(false); }}
                aria-label="Notifications"
                className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <Bell size={17} />
                <AnimatePresence>
                  {unreadCount > 0 && (
                    <motion.span
                      key="badge"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute top-1 right-1 w-4 h-4 rounded-full bg-violet-600 text-white text-2xs font-bold flex items-center justify-center leading-none"
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              <AnimatePresence>
                {notifOpen && (
                  <NotificationPanel
                    items={notifications}
                    onMarkAll={markAllRead}
                    onClose={() => setNotifOpen(false)}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* User dropdown */}
            {user && (
              <div className="relative ml-1" ref={dropdownRef}>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setDropdownOpen((o) => !o); setNotifOpen(false); }}
                  className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  {user.avatar_url ? (
                    <img src={user.avatar_url} className="w-7 h-7 rounded-lg object-cover ring-2 ring-white shadow-sm" alt="avatar" />
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm shadow-purple-200 flex-shrink-0">
                      {initials}
                    </div>
                  )}
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-semibold text-slate-900 leading-tight truncate max-w-[110px]">
                      {user.full_name ?? user.email}
                    </p>
                    <p className="text-2xs text-slate-400 capitalize font-medium">{user.subscription_tier}</p>
                  </div>
                  <ChevronDown
                    size={13}
                    className={`hidden sm:block text-slate-400 flex-shrink-0 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                  />
                </motion.button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -8 }}
                      transition={{ duration: 0.16, ease: 'easeOut' }}
                      className="absolute right-0 top-full mt-2 w-60 bg-white rounded-2xl shadow-dropdown border border-slate-100 overflow-hidden z-20"
                    >
                      {/* User info */}
                      <div className="px-4 py-3.5 border-b border-slate-100 flex items-center gap-3">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} className="w-9 h-9 rounded-xl object-cover" alt="avatar" />
                        ) : (
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                            {initials}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">{user.full_name ?? 'User'}</p>
                          <p className="text-xs text-slate-400 truncate">{user.email}</p>
                          <span className={`inline-flex items-center mt-0.5 text-2xs font-semibold px-1.5 py-0.5 rounded-full ${
                            user.subscription_tier === 'pro' || user.subscription_tier === 'enterprise'
                              ? 'bg-violet-100 text-violet-700'
                              : 'bg-slate-100 text-slate-500'
                          }`}>
                            {user.subscription_tier?.toUpperCase() ?? 'FREE'}
                          </span>
                        </div>
                      </div>

                      {/* Menu items */}
                      <div className="py-1.5">
                        {userMenuItems.map(({ icon: Icon, label, href, shortcut }, i) => (
                          <motion.div
                            key={href}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.04 }}
                          >
                            <Link
                              to={href}
                              onClick={() => setDropdownOpen(false)}
                              className="group flex items-center justify-between px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                            >
                              <div className="flex items-center gap-2.5">
                                <Icon size={15} className="text-slate-400 group-hover:text-violet-500 transition-colors" />
                                {label}
                              </div>
                              {shortcut && (
                                <span className="text-2xs text-slate-300 font-mono">{shortcut}</span>
                              )}
                            </Link>
                          </motion.div>
                        ))}
                      </div>

                      {/* Upgrade CTA for free users */}
                      {(!user.subscription_tier || user.subscription_tier === 'free') && (
                        <div className="mx-3 mb-2 p-3 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100">
                          <p className="text-xs font-bold text-violet-900 mb-0.5">Upgrade to Pro</p>
                          <p className="text-2xs text-violet-600 mb-2">Unlock unlimited AI credits &amp; courses</p>
                          <Link
                            to="/pricing"
                            onClick={() => setDropdownOpen(false)}
                            className="block w-full text-center text-xs font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-600 py-1.5 rounded-lg hover:from-violet-500 hover:to-purple-500 transition-all"
                          >
                            Upgrade Now →
                          </Link>
                        </div>
                      )}

                      {/* Sign out */}
                      <div className="border-t border-slate-100 py-1.5">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <LogOut size={15} />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* ── Mobile quick-nav drawer ──────────────────────────────────────── */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="lg:hidden overflow-hidden border-t border-slate-100 bg-white/95 backdrop-blur-md"
            >
              <div className="grid grid-cols-3 gap-1 px-3 py-3">
                {NAV_LINKS.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl text-center transition-all ${
                        active
                          ? 'bg-violet-50 text-violet-700'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <link.icon size={18} className={active ? 'text-violet-600' : 'text-slate-400'} />
                      <span className={`text-xs font-medium ${active ? 'text-violet-700' : ''}`}>{link.label}</span>
                      {active && (
                        <motion.span
                          layoutId="mobile-nav-dot"
                          className="w-1 h-1 rounded-full bg-violet-600"
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
