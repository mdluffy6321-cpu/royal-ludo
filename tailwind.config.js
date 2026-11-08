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
        // Royal Ludo dark game shell colours (used in authenticated app)
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
        // Cosmos design-system colours (used on Landing page)
        cosmos: {
          canvas:      '#F7F4ED',   // paper-white page background
          surface:     '#FFFFFF',   // white cards & ghost buttons
          surfaceDark: '#000000',   // dark app shell
          ink:         '#000000',   // headlines & body text
          mutedInk:    '#6E6962',   // captions & quiet copy
          onDark:      '#F7F4ED',   // text on dark stage
          border:      '#DDD6CB',   // hairline card edges
          imageBlue:   '#4A87D6',
          imageLilac:  '#D4A7D7',
          imageRose:   '#E3C0BD',
          imageOlive:  '#B7B39B',
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
      fontFamily: {
        royal: ["'Cinzel'", 'serif'],
        sans: ["'Outfit'", 'sans-serif'],
        mono: ["'JetBrains Mono'", 'SF Mono', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(245, 158, 11, 0.45)',
        'purple-glow': '0 0 25px -5px rgba(124, 58, 237, 0.45)',
        'blue-glow': '0 0 25px -5px rgba(59, 130, 246, 0.45)',
        'card-glow': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      letterSpacing: {
        tightest: '-0.05em',
        tighter:  '-0.04em',
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-subtle': 'bounce 2s infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'float-slow': 'float 8s ease-in-out 1s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%':       { transform: 'translateY(-12px) rotate(1deg)' },
          '66%':       { transform: 'translateY(-6px) rotate(-1deg)' },
        }
      }
    },
  },
  plugins: [],
}

