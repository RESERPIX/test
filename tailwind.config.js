/** @type {import('tailwindcss').Config} */
export default {
  future: {
    hoverOnlyWhenSupported: true,
  },
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          0: 'rgb(var(--color-surface-0) / <alpha-value>)',
          1: 'rgb(var(--color-surface-1) / <alpha-value>)',
          2: 'rgb(var(--color-surface-2) / <alpha-value>)',
          3: 'rgb(var(--color-surface-3) / <alpha-value>)',
          4: 'rgb(var(--color-surface-4) / <alpha-value>)',
          disabled: 'rgb(var(--color-surface-disabled) / <alpha-value>)',
        },
        borderDef: 'rgb(var(--color-border-def) / <alpha-value>)',
        borderStrong: 'rgb(var(--color-border-strong) / <alpha-value>)',
        accent: {
          DEFAULT: 'rgb(var(--color-accent) / <alpha-value>)',
          hover: 'rgb(var(--color-accent-hover) / <alpha-value>)',
          muted: 'rgb(var(--color-accent-muted) / <alpha-value>)',
          glow: 'rgb(var(--color-accent-glow) / <alpha-value>)',
          gradientStart: 'rgb(var(--color-accent) / <alpha-value>)',
          gradientEnd: 'rgb(var(--color-reaction) / <alpha-value>)'
        },
        textPrimary: 'rgb(var(--color-text-primary) / <alpha-value>)',
        textSecondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
        textTertiary: 'rgb(var(--color-text-tertiary) / <alpha-value>)',
        textDisabled: 'rgb(var(--color-text-disabled) / <alpha-value>)',
        success: 'rgb(var(--color-success) / <alpha-value>)',
        danger: 'rgb(var(--color-danger) / <alpha-value>)',
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
        info: 'rgb(var(--color-info) / <alpha-value>)',
        celebratory: 'rgb(var(--color-celebratory) / <alpha-value>)',
        reaction: 'rgb(var(--color-reaction) / <alpha-value>)',
        'reaction-hover': 'rgb(var(--color-reaction-hover) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      spacing: {
        'inline': '0.75rem',    // 12px
        'stack': '1rem',        // 16px
        'card': '1.5rem',       // 24px
        'section': '3rem',      // 48px
        'section-lg': '4rem',   // 64px
      },
      fontSize: {
        'display': ['2.5rem', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '700' }],
        'heading-1': ['2rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '700' }],
        'heading-2': ['1.5rem', { lineHeight: '1.4', letterSpacing: '-0.01em', fontWeight: '600' }],
        'heading-3': ['1.25rem', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7', letterSpacing: '0', fontWeight: '400' }],
        'body': ['1rem', { lineHeight: '1.65', letterSpacing: '0', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.6', letterSpacing: '0', fontWeight: '400' }],
        'caption': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.01em', fontWeight: '400' }],
        'overline': ['0.6875rem', { lineHeight: '1.6', letterSpacing: '0.1em', fontWeight: '600' }],
      },
      boxShadow: {
        'elevation-base': 'var(--shadow-elevation-base)',
        'elevation-raised': 'var(--shadow-elevation-raised)',
        'elevation-overlay': 'var(--shadow-elevation-overlay)',
      },
      borderRadius: {
        'control': '0.375rem',  // 6px
        'card': '0.75rem',      // 12px
        'modal': '1rem',        // 16px
      },
      transitionDuration: {
        'fast': '150ms',
        'base': '200ms',
        'slow': '300ms',
        'expand': '400ms',
      },
      transitionTimingFunction: {
        'ease-out-quad': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'ease-out-cubic': 'cubic-bezier(0.215, 0.61, 0.355, 1)',
      },
      zIndex: {
        devtools: '9999',
        'sticky': '20',
        'header': '40',
        'dropdown': '50',
        'backdrop': '60',
        'drawer': '70',
        'modal': '80',
        'toast': '90',
        'tooltip': '100',
      },
      keyframes: {
        slideUpBottom: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        slideUpBottom: 'slideUpBottom 240ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        slideInRight: 'slideInRight 250ms cubic-bezier(0, 0, 0.2, 1) forwards',
        fadeIn: 'fadeIn 150ms cubic-bezier(0, 0, 0.2, 1) forwards',
      },
    },
  },
  plugins: [],
}
