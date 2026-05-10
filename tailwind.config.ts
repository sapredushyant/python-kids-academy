import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        space: {
          950: '#080812',
          900: '#0f0f1a',
          800: '#161628',
          700: '#1e1e38',
          600: '#252548',
        },
        brand: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4',
        },
        gold: {
          400: '#fbbf24',
          500: '#f59e0b',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'streak-fire': 'streakFire 1s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        streakFire: {
          '0%': { transform: 'scale(1) rotate(-5deg)' },
          '100%': { transform: 'scale(1.1) rotate(5deg)' },
        },
      },
      backgroundImage: {
        'cosmic': 'radial-gradient(ellipse at top, #1e1e38 0%, #080812 70%)',
        'card-glow': 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(6,182,212,0.05) 100%)',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
