export default {content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: { DEFAULT: '#0F1D1A', soft: '#3A4A46', muted: '#66756F' },
        canvas: '#F5F4EF',
        surface: '#FFFFFF',
        line: { DEFAULT: '#E4E2DA', strong: '#D0CDC2' },
        brand: {
          50: '#EAF5F1',
          100: '#CFE8DF',
          200: '#9FD1BF',
          300: '#6BB79D',
          400: '#3C9B7E',
          500: '#1F7F64',
          600: '#166A53',
          700: '#115543',
          800: '#0D4034',
          900: '#0A3129',
        },
        accent: { 50: '#FDF4E3', 100: '#FAE6BF', 500: '#D9912B', 600: '#B87618', 700: '#8F5A12' },
        danger: { 50: '#FCEDEB', 100: '#F6D3CD', 500: '#C4452F', 700: '#8E2F1F' },
        warn: { 50: '#FDF6E0', 100: '#F8E7AE', 500: '#C99A06', 700: '#7A5E03' },
      },
      boxShadow: {
        card: '0 1px 2px rgba(15,29,26,0.04), 0 1px 3px rgba(15,29,26,0.06)',
        lift: '0 8px 24px -8px rgba(15,29,26,0.18)',
      },
    },
  },
};
