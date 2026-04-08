import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#3b82f6',
        ink: '#0f172a',
      },
    },
  },
  plugins: [],
} satisfies Config;
