/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    // ─── Typography scale ────────────────────────────────────────────────
    fontSize: {
      '2xs':  ['0.625rem', { lineHeight: '0.875rem', letterSpacing: '0.01em' }],
      xs:     ['0.75rem',  { lineHeight: '1rem',     letterSpacing: '0.01em' }],
      sm:     ['0.8125rem',{ lineHeight: '1.25rem',  letterSpacing: '0' }],
      base:   ['0.875rem', { lineHeight: '1.5rem',   letterSpacing: '0' }],
      md:     ['1rem',     { lineHeight: '1.5rem',   letterSpacing: '-0.01em' }],
      lg:     ['1.125rem', { lineHeight: '1.75rem',  letterSpacing: '-0.01em' }],
      xl:     ['1.25rem',  { lineHeight: '1.75rem',  letterSpacing: '-0.015em' }],
      '2xl':  ['1.5rem',   { lineHeight: '2rem',     letterSpacing: '-0.02em' }],
      '3xl':  ['1.875rem', { lineHeight: '2.25rem',  letterSpacing: '-0.02em' }],
      '4xl':  ['2.25rem',  { lineHeight: '2.5rem',   letterSpacing: '-0.025em' }],
      '5xl':  ['3rem',     { lineHeight: '1.15',     letterSpacing: '-0.03em' }],
      '6xl':  ['3.75rem',  { lineHeight: '1.1',      letterSpacing: '-0.035em' }],
      '7xl':  ['4.5rem',   { lineHeight: '1.05',     letterSpacing: '-0.04em' }],
    },

    extend: {
      // ─── Color palette ───────────────────────────────────────────────
      colors: {
        // Primary brand — violet
        primary: {
          50:  '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        // Accent — pink
        accent: {
          50:  '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
        },
        // Semantic — success
        success: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        // Semantic — warning
        warning: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        // Semantic — error
        error: {
          50:  '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
        // Semantic — info
        info: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        // Surface — page backgrounds, dividers
        surface: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
        },
        // AI education module colours
        ai: {
          chat:     '#7c3aed',  // violet  — AI Chat
          learn:    '#2563eb',  // blue    — Learn
          teach:    '#4f46e5',  // indigo  — Teach
          tools:    '#059669',  // emerald — Tools
          automate: '#d97706',  // amber   — Automations
          admin:    '#dc2626',  // red     — Admin
        },
      },

      // ─── Font family ─────────────────────────────────────────────────
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'monospace'],
      },

      // ─── Spacing (extend standard scale) ─────────────────────────────
      spacing: {
        4.5:  '1.125rem',
        13:   '3.25rem',
        15:   '3.75rem',
        18:   '4.5rem',
        22:   '5.5rem',
        26:   '6.5rem',
        30:   '7.5rem',
        sidebar: '16rem',          // 256px  sidebar width
        navbar:  '4rem',           // 64px   navbar height
      },

      // ─── Shadows ─────────────────────────────────────────────────────
      boxShadow: {
        'xs':          '0 1px 2px rgba(0,0,0,0.04)',
        'card':        '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px -1px rgba(0,0,0,0.04)',
        'card-hover':  '0 10px 30px -5px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.05)',
        'card-lg':     '0 20px 40px -10px rgba(0,0,0,0.1), 0 8px 16px -8px rgba(0,0,0,0.06)',
        'primary':     '0 4px 14px rgba(124,58,237,0.25)',
        'primary-lg':  '0 8px 25px rgba(124,58,237,0.35)',
        'primary-xl':  '0 16px 40px rgba(124,58,237,0.4)',
        'glass':       '0 8px 32px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
        'inner-light': 'inset 0 1px 0 rgba(255,255,255,0.6)',
        'sidebar':     '4px 0 24px rgba(0,0,0,0.08)',
        'dropdown':    '0 8px 24px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)',
        'modal':       '0 24px 64px rgba(0,0,0,0.15), 0 8px 24px rgba(0,0,0,0.08)',
      },

      // ─── Border radius ───────────────────────────────────────────────
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },

      // ─── Background images ────────────────────────────────────────────
      backgroundImage: {
        'gradient-radial':    'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':     'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-ai':        'linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #ec4899 100%)',
        'gradient-card':      'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 100%)',
        'gradient-sidebar':   'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
        'mesh-subtle':        'radial-gradient(at 40% 20%, hsla(265,100%,92%,0.3) 0, transparent 50%), radial-gradient(at 80% 0%, hsla(330,100%,92%,0.2) 0, transparent 40%)',
        'dot-grid':           "radial-gradient(circle, #6d28d9 1px, transparent 1px)",
      },

      // ─── Animations ──────────────────────────────────────────────────
      animation: {
        'pulse-slow':    'pulse 5s cubic-bezier(0.4,0,0.6,1) infinite',
        'float':         'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'shimmer':       'shimmer 2s linear infinite',
        'fade-in':       'fadeIn 0.35s ease-out',
        'slide-up':      'slideUp 0.35s ease-out',
        'slide-down':    'slideDown 0.35s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'scale-in':      'scaleIn 0.2s ease-out',
        'spin-slow':     'spin 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          from: { opacity: '0', transform: 'translateX(-12px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
      },

      // ─── Transitions ─────────────────────────────────────────────────
      transitionTimingFunction: {
        'spring':      'cubic-bezier(0.175,0.885,0.32,1.275)',
        'ease-in-expo':'cubic-bezier(0.95,0.05,0.795,0.035)',
        'ease-out-expo':'cubic-bezier(0.19,1,0.22,1)',
      },
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
        '400': '400ms',
      },

      // ─── Misc ─────────────────────────────────────────────────────────
      backdropBlur: { xs: '2px' },
      maxWidth: {
        'content': '1280px',
        'prose':   '72ch',
        'form':    '480px',
      },
      zIndex: {
        dropdown: '20',
        navbar:   '30',
        sidebar:  '40',
        modal:    '50',
        toast:    '60',
      },
    },
  },
  plugins: [],
};
