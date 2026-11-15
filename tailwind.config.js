/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bone: '#f1efe9',
        paper: '#e7e4dc',
        ink: '#0d0d0d',
        coal: '#161616',
        ash: '#8a877f',
        volt: '#d4ff3a',
      },
      fontFamily: {
        display: ['Syne', 'system-ui', 'sans-serif'],
        sans: ['"Inter Tight"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        spin: { to: { transform: 'rotate(360deg)' } },
      },
      animation: { marquee: 'marquee 28s linear infinite', 'spin-slow': 'spin 14s linear infinite' },
    },
  },
  plugins: [],
}
