/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FBEAEE',
        card: '#FFFCFB',
        ink: '#3A2A33',
        'ink-soft': '#7A6169',
        coral: '#FF6B4A',
        'coral-dark': '#E2542F',
        mustard: '#FFC857',
        pine: '#2F6F5E',
        rust: '#C1502E',
        dusk: '#14202E',
        'dusk-card': '#1E2C3D',
        cream: '#F3EEE0',
        blush: '#F0A8B8',
        'blush-deep': '#D9748C',
        rose: '#F6D2DC',
        'rose-deep': '#E88CA3',
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        body: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        ticket: '22px',
      },
      boxShadow: {
        card: '0 2px 0 rgba(27,42,65,0.06), 0 10px 24px -12px rgba(27,42,65,0.25)',
        stamp: '0 0 0 3px rgba(27,42,65,0.08)',
      },
      keyframes: {
        popIn: {
          '0%': { transform: 'scale(0.85)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        stampDown: {
          '0%': { transform: 'scale(1.6) rotate(-14deg)', opacity: '0' },
          '60%': { transform: 'scale(0.95) rotate(-6deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(-6deg)', opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-6px)' },
          '75%': { transform: 'translateX(6px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        popIn: 'popIn 0.22s ease-out',
        stampDown: 'stampDown 0.4s cubic-bezier(.2,1.4,.4,1)',
        shake: 'shake 0.35s ease-in-out',
        floatSlow: '6s ease-in-out infinite floatSlow',
      },
    },
  },
  plugins: [],
}
