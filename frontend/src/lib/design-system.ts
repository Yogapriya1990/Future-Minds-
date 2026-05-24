/**
 * Future Minds AI — Design System Tokens
 *
 * Single source of truth for all design decisions in TypeScript.
 * Import from this file instead of hard-coding Tailwind classes.
 *
 * Usage:
 *   import { ds } from '@/lib/design-system';
 *   <div className={ds.card.md}>...</div>
 *   <span className={ds.badge.primary}>Pro</span>
 */

// ─── Typography ───────────────────────────────────────────────────────────────
export const typography = {
  display:   'type-display',
  h1:        'type-h1',
  h2:        'type-h2',
  h3:        'type-h3',
  h4:        'type-h4',
  bodyLg:    'type-body-lg',
  body:      'type-body',
  bodySm:    'type-body-sm',
  label:     'type-label',
  caption:   'type-caption',
  overline:  'type-overline',
  gradient:  'gradient-text',
  code:      'type-code',
} as const;

// ─── Colors (raw hex — use Tailwind classes in JSX) ───────────────────────────
export const colors = {
  primary:  { 50: '#f5f3ff', 100: '#ede9fe', 200: '#ddd6fe', 300: '#c4b5fd', 400: '#a78bfa', 500: '#8b5cf6', 600: '#7c3aed', 700: '#6d28d9', 800: '#5b21b6', 900: '#4c1d95', 950: '#2e1065' },
  accent:   { 400: '#f472b6', 500: '#ec4899', 600: '#db2777' },
  success:  { 50: '#f0fdf4', 500: '#22c55e', 600: '#16a34a', 700: '#15803d' },
  warning:  { 50: '#fffbeb', 500: '#f59e0b', 600: '#d97706', 700: '#b45309' },
  error:    { 50: '#fef2f2', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c' },
  info:     { 50: '#eff6ff', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8' },
  surface:  { 50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0' },
  sidebar:  '#0f172a',
} as const;

// ─── Cards ────────────────────────────────────────────────────────────────────
export const card = {
  /** Base card (no padding — add manually) */
  base:        'card',
  /** Card + small padding (p-4) */
  sm:          'card-sm',
  /** Card + medium padding (p-5) — most common */
  md:          'card-md',
  /** Card + large padding (p-6) */
  lg:          'card-lg',
  /** Clickable card with hover lift */
  interactive: 'card card-hover p-5',
  /** Featured / highlighted card with ring */
  featured:    'card-featured',
  /** Glassmorphism card for auth / overlay */
  glass:       'card-glass p-7',
  /** Stat / metric card */
  stat:        'card-stat',
  /** AI-themed purple gradient card */
  ai:          'card-ai',
} as const;

// ─── Badges ───────────────────────────────────────────────────────────────────
export const badge = {
  default:    'badge-default',
  primary:    'badge-primary',
  success:    'badge-success',
  warning:    'badge-warning',
  error:      'badge-error',
  info:       'badge-info',
  ai:         'badge-ai',
  // Semantic aliases
  published:  'badge-published',
  draft:      'badge-draft',
  pending:    'badge-pending',
  free:       'badge-free',
  pro:        'badge-pro',
  enterprise: 'badge-enterprise',
  active:     'badge-active',
  inactive:   'badge-inactive',
  banned:     'badge-banned',
} as const;

// ─── Status dots ──────────────────────────────────────────────────────────────
export const statusDot = {
  green:  'status-dot-green',
  yellow: 'status-dot-yellow',
  red:    'status-dot-red',
  grey:   'status-dot-grey',
  violet: 'status-dot-violet',
} as const;

// ─── Module icons (AI education theme) ───────────────────────────────────────
export const moduleIcon = {
  chat:     'module-icon-chat',
  learn:    'module-icon-learn',
  teach:    'module-icon-teach',
  tools:    'module-icon-tools',
  automate: 'module-icon-automate',
  admin:    'module-icon-admin',
} as const;

// ─── Module accent colors (icon + bg + border) ────────────────────────────────
export const moduleColor = {
  chat:     { icon: 'text-primary-600', bg: 'bg-primary-50',  border: 'border-primary-100'  },
  learn:    { icon: 'text-info-600',    bg: 'bg-info-50',     border: 'border-info-100'     },
  teach:    { icon: 'text-indigo-600',  bg: 'bg-indigo-50',   border: 'border-indigo-100'   },
  tools:    { icon: 'text-success-600', bg: 'bg-success-50',  border: 'border-success-100'  },
  automate: { icon: 'text-warning-600', bg: 'bg-warning-50',  border: 'border-warning-100'  },
  admin:    { icon: 'text-error-600',   bg: 'bg-error-50',    border: 'border-error-100'    },
} as const;

// ─── Layout helpers ───────────────────────────────────────────────────────────
export const layout = {
  /** Full page container with max-width and horizontal padding */
  page:          'page-container page-padding',
  pageInner:     'max-w-content mx-auto',
  /** Standard vertical section gap */
  sectionGap:    'section-gap',
  sectionGapLg:  'section-gap-lg',
  /** Grid layouts */
  gridStats:     'grid-stats',
  grid2:         'grid-cards-2',
  grid3:         'grid-cards-3',
  grid4:         'grid-cards-4',
  gridQuick:     'grid-quick-access',
  /** Sidebar + content shell */
  appShell:      'flex h-screen bg-surface-50 overflow-hidden',
  mainContent:   'flex-1 flex flex-col min-w-0 overflow-hidden',
  scrollable:    'flex-1 overflow-y-auto',
} as const;

// ─── Spacing scale ────────────────────────────────────────────────────────────
export const spacing = {
  pagePadding: { mobile: 'px-4 py-4', tablet: 'sm:px-6 sm:py-6', desktop: 'lg:px-8 lg:py-8' },
  cardGap:     'gap-4',
  cardGapLg:   'gap-6',
  sectionGap:  'mb-8',
  itemGap:     'gap-3',
} as const;

// ─── Responsive breakpoints ───────────────────────────────────────────────────
export const breakpoints = {
  sm:  640,
  md:  768,
  lg:  1024,
  xl:  1280,
  '2xl': 1536,
} as const;

// ─── Z-index scale ────────────────────────────────────────────────────────────
export const zIndex = {
  dropdown: 20,
  navbar:   30,
  sidebar:  40,
  modal:    50,
  toast:    60,
} as const;

// ─── Animation presets ────────────────────────────────────────────────────────
export const animation = {
  fadeIn:     { initial: { opacity: 0 },              animate: { opacity: 1 },              transition: { duration: 0.3, ease: 'easeOut' } },
  slideUp:    { initial: { opacity: 0, y: 12 },       animate: { opacity: 1, y: 0 },       transition: { duration: 0.3, ease: 'easeOut' } },
  slideDown:  { initial: { opacity: 0, y: -12 },      animate: { opacity: 1, y: 0 },       transition: { duration: 0.3, ease: 'easeOut' } },
  slideLeft:  { initial: { opacity: 0, x: -12 },      animate: { opacity: 1, x: 0 },       transition: { duration: 0.3, ease: 'easeOut' } },
  scaleIn:    { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 },   transition: { duration: 0.2, ease: 'easeOut' } },
  stagger:    { animate: { transition: { staggerChildren: 0.07 } } },
  staggerItem:{ hidden: { opacity: 0, y: 12 },        visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } } },
} as const;

// ─── Convenience re-export (single import) ────────────────────────────────────
export const ds = {
  typography,
  colors,
  card,
  badge,
  statusDot,
  moduleIcon,
  moduleColor,
  layout,
  spacing,
  breakpoints,
  zIndex,
  animation,
} as const;

export default ds;
