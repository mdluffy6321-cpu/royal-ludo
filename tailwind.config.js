/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        royal: {
          dark: '#070B19',
          darker: '#040710',
          card: '#0E162E',
          cardHover: '#142042',
          border: '#23325D',
          borderGold: 'rgba(245, 158, 11, 0.4)',
          purple: '#1E0F38',
          purpleLight: '#3B1A73',
          gold: '#F59E0B',
          goldHover: '#D97706',
          goldLight: '#FDE68A',
        },
        ludo: {
          red: '#EF4444',
          redDark: '#B91C1C',
          redGlow: 'rgba(239, 68, 68, 0.4)',
          green: '#10B981',
          greenDark: '#047857',
          greenGlow: 'rgba(16, 185, 129, 0.4)',
          yellow: '#F59E0B',
          yellowDark: '#B45309',
          yellowGlow: 'rgba(245, 158, 11, 0.4)',
          blue: '#3B82F6',
          blueDark: '#1D4ED8',
          blueGlow: 'rgba(59, 130, 246, 0.4)',
        }
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(245, 158, 11, 0.45)',
        'purple-glow': '0 0 25px -5px rgba(124, 58, 237, 0.45)',
        'blue-glow': '0 0 25px -5px rgba(59, 130, 246, 0.45)',
        'card-glow': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-subtle': 'bounce 2s infinite',
      }
    },
  },
  plugins: [],
}

