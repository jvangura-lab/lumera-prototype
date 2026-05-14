/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Lumera palette — warm spa-luxe (champagne gold accent)
        bone:            '#FBF8F2',
        'taupe-cream':   '#E7DDCC',
        'accent-soft':   '#EBDCBF',
        accent:          '#B89968',
        'accent-strong': '#8E7244',

        // Backward-compatible scales (legacy class names used by funnel screens).
        // Values remapped to the new Lumera palette; full rename happens in Phase 4.
        cream: {
          50:  '#FBF8F2',  // bone (background)
          100: '#F3ECE0',  // cream (surface)
          200: '#E7DDCC',  // taupe-cream (surface-strong)
          300: '#E2D6C3',  // border
        },
        blush: {
          100: '#F3ECE0',
          200: '#E7DDCC',
          300: '#B8AC9D',
          400: '#847466',
          500: '#4A3D33',
        },
        gold: {
          300: '#EBDCBF',  // accent-soft
          400: '#B89968',  // accent
          500: '#B89968',  // accent
          600: '#8E7244',  // accent-strong
        },
        espresso: {
          700: '#4A3D33',  // ink-700
          800: '#2A201A',  // ink-900
          900: '#2A201A',  // ink-900
        },
        ink: {
          900: '#2A201A',
          700: '#4A3D33',
          500: '#847466',
          400: '#B8AC9D',
          300: '#B8AC9D',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 12px -4px rgba(42, 32, 26, 0.10)',
        card: '0 12px 40px -16px rgba(42, 32, 26, 0.22)',
      },
      maxWidth: {
        site: '1200px',
        prose: '720px',
      },
      letterSpacing: {
        eyebrow: '0.18em',
      },
    },
  },
  plugins: [],
};
