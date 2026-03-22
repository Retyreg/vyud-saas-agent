import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--vyud-font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--vyud-font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--vyud-font-mono)', 'monospace'],
      },
      colors: {
        vyud: {
          primary: {
            50: '#EEF6FF',
            100: '#DBEEFF',
            200: '#BADdff',
            300: '#7EC4FF',
            400: '#399FFF',
            500: '#0D7EFF', // BASE
            600: '#0062E0',
            700: '#004DB5',
            800: '#003D94',
            900: '#002F72',
          },
          neutral: {
            0: '#FFFFFF',
            50: '#F7F9FC',
            100: '#EEF2F7',
            200: '#DDE4EF',
            300: '#C4CFDF',
            400: '#9AAABF',
            500: '#6B809A',
            600: '#4A5F78',
            700: '#324159',
            800: '#1E2D40',
            900: '#0D1926',
            950: '#070E18',
          }
        },
        background: "var(--vyud-bg)",
        foreground: "var(--vyud-text-primary)",
      },
      borderRadius: {
        'vyud-sm': 'var(--vyud-radius-sm)',
        'vyud-md': 'var(--vyud-radius-md)',
        'vyud-lg': 'var(--vyud-radius-lg)',
        'vyud-xl': 'var(--vyud-radius-xl)',
      },
      animation: {
        'vyud-fade-up': 'vyud-fade-up var(--vyud-duration-slow) var(--vyud-ease-out) both',
        'vyud-shimmer': 'vyud-shimmer 1.4s ease infinite',
        'vyud-spin': 'vyud-spin 0.65s linear infinite',
      },
      keyframes: {
        'vyud-fade-up': {
          'from': { opacity: '0', transform: 'translateY(16px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        'vyud-shimmer': {
          'from': { backgroundPosition: '-200% center' },
          'to': { backgroundPosition: '200% center' },
        },
        'vyud-spin': {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        }
      },
    },
  },
  plugins: [],
} satisfies Config;
